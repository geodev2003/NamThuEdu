/**
 * IeltsImportModal — Smart hybrid PDF importer.
 *
 * Flow:
 *   1. Upload PDF → extract text bằng pdfjs.
 *   2. Detect:
 *      - Text < 150 chars → PDF scan → đi thẳng Gemini AI (vision OCR).
 *      - Text ≥ 150 chars → thử local lib (regex) trước.
 *   3. Đánh giá quality score của lib output:
 *      - Đạt ≥ 60/100 → dùng kết quả lib (nhanh, miễn phí).
 *      - < 60/100 → tự động fallback Gemini AI để cải thiện.
 *   4. Nếu cả 2 đều fail → cho user paste text thủ công.
 */
import { useState, useRef } from "react";
import {
  X, Upload, Download, FileJson, FileText, CheckCircle2, Loader2, AlertCircle,
  Code2, Copy, Check, Wand2, Sparkles,
  Headphones, BookOpen, PenLine, Mic,
} from "lucide-react";
import {
  type IeltsImportSkill,
  type IeltsImportTestType,
  type IeltsSkillImport,
} from "../../../../../../services/groqApi";
import { parseIeltsSkillSmart, scoreParsedQuality, type QualityResult } from "../ieltsParser";
import { API_BASE_URL } from "../../../../../../utils/apiConfig";

interface Props {
  open: boolean;
  skill: IeltsImportSkill;
  testType: IeltsImportTestType;
  onClose: () => void;
  /** Khi import xong, parent nhận skillData + thay state */
  onImported: (skillData: IeltsSkillImport) => void;
}

type Stage = "idle" | "extract" | "scanned" | "parse" | "ready";
type ParseMethod = "lib" | "ai-fallback" | "ai-direct" | "manual" | "json";

const SKILL_META: Record<IeltsImportSkill, { label: string; icon: any; gradient: [string, string]; bg: string; text: string }> = {
  listening: { label: "Listening", icon: Headphones, gradient: ["#2563EB", "#0EA5E9"], bg: "bg-blue-50", text: "text-blue-700" },
  reading:   { label: "Reading",   icon: BookOpen,   gradient: ["#10B981", "#059669"], bg: "bg-emerald-50", text: "text-emerald-700" },
  writing:   { label: "Writing",   icon: PenLine,    gradient: ["#F97316", "#EA580C"], bg: "bg-orange-50", text: "text-orange-700" },
  speaking:  { label: "Speaking",  icon: Mic,        gradient: ["#A855F7", "#7C3AED"], bg: "bg-purple-50", text: "text-purple-700" },
};

const SAMPLE_BY_SKILL: Record<IeltsImportSkill, any> = {
  listening: {
    sections: [
      {
        sectionNumber: 1,
        transcript: "Sample transcript",
        questions: [
          { questionNumber: 1, questionType: "form-completion", questionText: "Full name: Sarah ___1___", correctAnswer: "Thompson" },
        ],
      },
    ],
  },
  reading: {
    passages: [
      {
        passageNumber: 1,
        title: "The History of Coffee",
        body: "Coffee has a long history...",
        wordCount: 850,
        questions: [
          { questionNumber: 1, questionType: "true-false-not-given", questionText: "Coffee originated in Ethiopia.", correctAnswer: "TRUE" },
        ],
      },
    ],
  },
  writing: {
    tasks: [
      { taskNumber: 1, prompt: "Describe the chart...", chartType: "bar" },
      { taskNumber: 2, prompt: "Some people believe...", essayType: "opinion" },
    ],
  },
  speaking: {
    parts: [
      { partNumber: 1, questions: [{ topic: "Hometown", text: "Where are you from?" }] },
      { partNumber: 2, cueCard: { topic: "Describe a memorable journey", bullets: ["Where", "When", "Who", "Why"], followUp: "Will you go again?" } },
      { partNumber: 3, questions: [{ text: "How has travel changed?" }] },
    ],
  },
};

export function IeltsImportModal({ open, skill, testType, onClose, onImported }: Props) {
  const [stage, setStage] = useState<Stage>("idle");
  const [fileName, setFileName] = useState("");
  const [pdfProgress, setPdfProgress] = useState({ done: 0, total: 0 });
  const [scannedText, setScannedText] = useState("");
  const [manualText, setManualText] = useState("");
  const [payload, setPayload] = useState<IeltsSkillImport | null>(null);
  const [error, setError] = useState("");
  const [showJson, setShowJson] = useState(false);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [isScannedPdf, setIsScannedPdf] = useState(false);
  const [parseMethod, setParseMethod] = useState<ParseMethod>("lib");
  const [parseStatus, setParseStatus] = useState<string>("");
  const [quality, setQuality] = useState<QualityResult | null>(null);
  const originalFileRef = useRef<File | null>(null);

  const meta = SKILL_META[skill];
  const SkillIcon = meta.icon;

  if (!open) return null;

  const reset = () => {
    setStage("idle");
    setFileName("");
    setScannedText("");
    setManualText("");
    setPayload(null);
    setError("");
    setShowJson(false);
    setIsScannedPdf(false);
    setParseStatus("");
    setQuality(null);
    originalFileRef.current = null;
  };

  const handleFile = async (f: File) => {
    setError("");
    setPayload(null);
    setFileName(f.name);

    const isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    const isJson = f.type === "application/json" || /\.json$/i.test(f.name);

    if (isPdf) {
      try {
        setStage("extract");
        setPdfProgress({ done: 0, total: 0 });
        originalFileRef.current = f; // Lưu file gốc cho mọi trường hợp

        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc =
          `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        const buf = await f.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: buf }).promise;
        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          setPdfProgress({ done: i, total: pdf.numPages });
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          let lastY: number | null = null;
          let pageText = "";
          for (const item of content.items as any[]) {
            if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) pageText += "\n";
            pageText += item.str;
            lastY = item.transform[5];
          }
          fullText += `\n=== Page ${i} ===\n${pageText.trim()}\n`;
        }

        // Detect PDF scan: text rất ít = ảnh scan
        const meaningfulText = fullText.replace(/=== Page \d+ ===/g, '').trim();
        const isScan = meaningfulText.length < 150;

        if (isScan) {
          // PDF scan → đi thẳng Gemini AI (lib không đọc được)
          setIsScannedPdf(true);
          setScannedText("");
          setStage("parse");
          setParseStatus("PDF dạng ảnh scan — đang dùng Gemini AI để OCR + phân tích…");
          try {
            const aiResult = await callGeminiApi(f);
            validatePayloadForSkill(aiResult, skill);
            setPayload(aiResult);
            setParseMethod("ai-direct");
            setParseStatus("Hoàn tất phân tích bằng Gemini AI (PDF scan)");
            setStage("ready");
          } catch (e: any) {
            setError(`PDF scan và Gemini AI cũng thất bại: ${e.message}. Bạn có thể nhập nội dung thủ công bên dưới.`);
            setStage("scanned");
          }
        } else {
          // PDF có text → chạy pipeline lib → fallback AI
          setIsScannedPdf(false);
          setScannedText(fullText);
          try {
            await runSmartPipeline(fullText, f);
          } catch (e: any) {
            setError(e.message);
            setStage("scanned");
          }
        }
      } catch (e: any) {
        setError(e.message || "Lỗi đọc PDF");
        setStage("idle");
      }
      return;
    }

    if (isJson) {
      try {
        const text = await f.text();
        const parsed = JSON.parse(text) as IeltsSkillImport;
        validatePayloadForSkill(parsed, skill);
        setPayload(parsed);
        setParseMethod("json");
        setParseStatus("Đã import từ file JSON");
        setStage("ready");
      } catch (e: any) {
        setError(e.message || "JSON không hợp lệ");
      }
      return;
    }

    setError("Chỉ hỗ trợ file .pdf hoặc .json");
  };

  /** Khi user paste text thủ công và bấm "Phân tích" */
  const handleManualParse = async () => {
    if (!manualText.trim()) {
      setError("Vui lòng nhập nội dung đề thi vào ô bên dưới.");
      return;
    }
    try {
      // Manual paste không có file PDF gốc → không thể fallback AI từ file
      // Nhưng nếu PDF gốc vẫn còn (ví dụ scan failed) thì có thể dùng
      await runSmartPipeline(manualText, originalFileRef.current);
    } catch (e: any) {
      setError(e.message || "Lỗi phân tích");
      setStage("scanned");
    }
  };

  /**
   * Pipeline tự động: lib → AI fallback nếu fail
   */
  const runSmartPipeline = async (text: string, file: File | null) => {
    setStage("parse");
    setError("");
    setParseStatus("Đang phân tích bằng thư viện local…");

    // Bước 1: thử lib regex trước
    let libResult: IeltsSkillImport | null = null;
    try {
      libResult = parseIeltsSkillSmart(text, skill, testType);
    } catch {
      libResult = null;
    }

    // Đánh giá chất lượng
    const q = scoreParsedQuality(libResult, skill);
    setQuality(q);

    if (libResult && q.passed) {
      // ✅ Lib đủ tốt → dùng luôn
      try {
        validatePayloadForSkill(libResult, skill);
        setPayload(libResult);
        setParseMethod("lib");
        setParseStatus(`Hoàn tất với thư viện local (chất lượng ${q.score}/100)`);
        setStage("ready");
        return;
      } catch {
        // structure invalid → cũng fallback
      }
    }

    // Bước 2: lib không đủ tốt → fallback AI (nếu có file)
    if (!file) {
      // Không có file gốc (ví dụ paste text thủ công), không thể dùng AI
      if (libResult) {
        // Vẫn show kết quả lib dù chất lượng thấp
        setPayload(libResult);
        setParseMethod("manual");
        setParseStatus(
          `Phân tích xong (chất lượng ${q.score}/100). Có thể chưa đầy đủ — kiểm tra lại trước khi áp dụng.`
        );
        setStage("ready");
        return;
      }
      throw new Error(
        `Không nhận dạng được cấu trúc ${meta.label}. Hãy kiểm tra nội dung có header PART/SECTION không.`
      );
    }

    setParseStatus(
      `Chất lượng ${q.score}/100 chưa đạt — đang dùng Gemini AI để cải thiện…`
    );

    try {
      const aiResult = await callGeminiApi(file);
      validatePayloadForSkill(aiResult, skill);
      setPayload(aiResult);
      setParseMethod(libResult ? "ai-fallback" : "ai-direct");
      setParseStatus(
        libResult
          ? `Đã dùng Gemini AI cải thiện kết quả (lib quality ${q.score}/100)`
          : "Hoàn tất với Gemini AI"
      );
      setStage("ready");
    } catch (e: any) {
      // AI cũng fail
      if (libResult) {
        // Fallback: dùng kết quả lib dù chất lượng thấp
        setPayload(libResult);
        setParseMethod("lib");
        setParseStatus(
          `AI không khả dụng — dùng kết quả thư viện (chất lượng ${q.score}/100). Kiểm tra kỹ trước khi áp dụng.`
        );
        setStage("ready");
      } else {
        throw new Error(`Cả lib và AI đều thất bại: ${e.message}`);
      }
    }
  };

  const callGeminiApi = async (file: File): Promise<IeltsSkillImport> => {
    const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("skill", skill);
    formData.append("test_type", testType);

    const res = await fetch(`${API_BASE_URL}/teacher/ielts/parse-pdf`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || `Lỗi server: ${res.status}`);
    }
    return json.data as IeltsSkillImport;
  };

  const handleConfirm = () => {
    if (!payload) return;
    onImported(payload);
    reset();
    onClose();
  };

  const downloadSample = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_BY_SKILL[skill], null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ielts-${skill}-template.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const summary = payload ? buildSummary(payload, skill) : null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => onClose()}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col z-10"
        style={{ animation: "ieltsImportIn .2s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`@keyframes ieltsImportIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}`}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})` }}
            >
              <SkillIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Import IELTS {meta.label}</h2>
              <p className="text-xs text-gray-500">
                IELTS {testType} · Tự động: lib trước, AI fallback nếu cần
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Sample download */}
          <div className={`${meta.bg} border border-current/20 rounded-xl p-4 flex items-center justify-between gap-3`}>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${meta.text}`}>Cần file mẫu?</p>
              <p className="text-xs text-gray-600 mt-0.5">
                Tải JSON template với cấu trúc đúng cho {meta.label}.
              </p>
            </div>
            <button
              onClick={downloadSample}
              className={`flex items-center gap-1.5 h-9 px-3 bg-white border border-current/30 ${meta.text} rounded-lg text-sm font-semibold hover:bg-white transition-colors flex-shrink-0`}
            >
              <Download className="w-4 h-4" /> Tải mẫu
            </button>
          </div>

          {/* Upload zone */}
          {stage === "idle" && (
            <label className="block border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-8 cursor-pointer transition-all">
              <input
                type="file"
                accept=".pdf,application/pdf,.json,application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                  e.target.value = "";
                }}
              />
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Upload className="w-7 h-7 text-gray-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Click hoặc kéo thả file</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Hỗ trợ <span className="font-bold text-gray-800">.pdf</span> (tự động lib + AI) hoặc <span className="font-bold text-gray-800">.json</span>
                  </p>
                </div>
              </div>
            </label>
          )}

          {/* Extract progress */}
          {stage === "extract" && (
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 bg-gray-50">
              <FileText className="w-10 h-10 text-gray-400" />
              <p className="font-semibold text-gray-700">Đang đọc PDF…</p>
              <p className="text-xs text-gray-500">
                {pdfProgress.total ? `Trang ${pdfProgress.done}/${pdfProgress.total}` : "Khởi tạo…"}
              </p>
              {pdfProgress.total > 0 && (
                <div className="w-64 h-2 bg-white rounded-full overflow-hidden border border-gray-200">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${(pdfProgress.done / pdfProgress.total) * 100}%`,
                      background: `linear-gradient(90deg, ${meta.gradient[0]}, ${meta.gradient[1]})`,
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Scanned (text PDF) → fallback manual paste khi cần */}
          {stage === "scanned" && !isScannedPdf && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">Cần kiểm tra lại nội dung</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Bạn có thể chỉnh sửa text bên dưới rồi bấm "Phân tích lại".
                  </p>
                </div>
                <button onClick={reset} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-500 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Text từ PDF — có thể chỉnh sửa
                  </span>
                </div>
                <textarea
                  value={manualText || scannedText}
                  onChange={(e) => setManualText(e.target.value)}
                  className="w-full text-xs text-gray-700 leading-relaxed p-4 resize-none outline-none font-mono"
                  style={{ minHeight: "240px", maxHeight: "320px" }}
                />
              </div>
            </div>
          )}

          {/* Scanned PDF (ảnh) — chỉ hiện khi AI cũng fail, fallback manual */}
          {stage === "scanned" && isScannedPdf && (
            <div className="space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">Cần nhập thủ công</p>
                  <p className="text-xs text-amber-700 mt-1">
                    File <span className="font-semibold">{fileName}</span> là PDF scan và Gemini AI không khả dụng.
                    Hãy copy-paste nội dung đề thi vào ô bên dưới.
                  </p>
                </div>
                <button onClick={reset} className="p-1.5 rounded-lg hover:bg-amber-100 text-amber-500 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Nhập nội dung đề thi {meta.label}
                  </span>
                </div>
                <textarea
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder={`Paste nội dung đề thi ${meta.label} vào đây...\n\nVí dụ:\nPART 1   Questions 1-10\n11. Heather says pottery differs from other art forms because\nA  it lasts longer in the ground.\nB  it is practised by more people.\nC  it can be repaired more easily.`}
                  className="w-full text-xs text-gray-700 leading-relaxed p-4 resize-none outline-none font-mono"
                  style={{ minHeight: "200px", maxHeight: "300px" }}
                />
              </div>
              {manualText.length > 0 && (
                <p className="text-xs text-gray-400 text-right">{manualText.length.toLocaleString()} ký tự</p>
              )}
            </div>
          )}

          {/* Parsing in progress (lib + AI pipeline) */}
          {stage === "parse" && (
            <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center gap-3 bg-gray-50">
              <Loader2 className={`w-10 h-10 ${meta.text} animate-spin`} />
              <p className="font-semibold text-gray-700">Đang phân tích {meta.label}…</p>
              <p className="text-xs text-gray-500 text-center max-w-md">{parseStatus || "Đang xử lý"}</p>
            </div>
          )}

          {/* Ready: payload preview */}
          {stage === "ready" && payload && summary && (
            <div className={`${meta.bg} border border-current/20 rounded-xl p-4`}>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className={`w-5 h-5 ${meta.text}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold ${meta.text} truncate`}>{fileName || "Đã sẵn sàng"}</p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <p className="text-xs text-gray-600">{summary}</p>
                    {/* Method badge */}
                    {parseMethod === "lib" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                        ⚡ Local lib
                      </span>
                    )}
                    {parseMethod === "ai-fallback" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
                        🤖 Gemini AI (cải thiện từ lib)
                      </span>
                    )}
                    {parseMethod === "ai-direct" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                        🤖 Gemini AI (PDF scan)
                      </span>
                    )}
                    {parseMethod === "json" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        JSON file
                      </span>
                    )}
                    {parseMethod === "manual" && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                        ✋ Manual paste
                      </span>
                    )}
                    {quality && parseMethod === "lib" && (
                      <span className="text-[10px] font-medium text-gray-500">
                        Chất lượng {quality.score}/100
                      </span>
                    )}
                  </div>
                  {parseStatus && (
                    <p className="text-[11px] text-gray-500 mt-1 italic">{parseStatus}</p>
                  )}
                </div>
                <button
                  onClick={() => setShowJson((s) => !s)}
                  className={`flex items-center gap-1.5 h-8 px-3 bg-white border border-current/30 ${meta.text} rounded-lg text-xs font-semibold hover:bg-white transition-colors flex-shrink-0`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  {showJson ? "Ẩn JSON" : "Xem JSON"}
                </button>
                <button onClick={reset} className="p-1.5 rounded-lg hover:bg-white text-gray-500 flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
              {showJson && (
                <div className="mt-2 bg-gray-900 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">JSON</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                          setJsonCopied(true);
                          setTimeout(() => setJsonCopied(false), 1500);
                        }}
                        className="flex items-center gap-1.5 h-7 px-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-xs font-medium transition-colors cursor-pointer"
                      >
                        {jsonCopied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Đã copy</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                      <button
                        onClick={() => setShowJson(false)}
                        className="flex items-center gap-1.5 h-7 px-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-xs font-medium transition-colors cursor-pointer"
                        title="Ẩn JSON"
                      >
                        <X className="w-3.5 h-3.5" /> Ẩn
                      </button>
                    </div>
                  </div>
                  <pre
                    className="text-xs text-emerald-300 p-4 overflow-auto leading-relaxed"
                    style={{ maxHeight: "360px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}
                  >
                    {JSON.stringify(payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900">Lỗi</p>
                <p className="text-xs text-red-700 mt-0.5 break-all">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Hủy
          </button>
          {stage === "scanned" ? (
            <button
              onClick={handleManualParse}
              disabled={!manualText.trim() && !scannedText.trim()}
              className="h-10 px-6 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm cursor-pointer hover:opacity-95 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})` }}
            >
              <Wand2 className="w-4 h-4" /> Phân tích lại
            </button>
          ) : stage === "parse" ? (
            <button
              disabled
              className="h-10 px-6 bg-gray-300 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" /> Đang phân tích…
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={!payload}
              className="h-10 px-6 text-white rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition-opacity"
              style={{ background: `linear-gradient(135deg, ${meta.gradient[0]}, ${meta.gradient[1]})` }}
            >
              <Upload className="w-4 h-4" /> Áp dụng vào đề
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function validatePayloadForSkill(payload: any, skill: IeltsImportSkill) {
  const errs: string[] = [];
  if (!payload || typeof payload !== "object") errs.push("Payload không phải object");
  if (skill === "listening" && !Array.isArray(payload?.sections)) errs.push("Thiếu mảng `sections`");
  if (skill === "reading" && !Array.isArray(payload?.passages)) errs.push("Thiếu mảng `passages`");
  if (skill === "writing" && !Array.isArray(payload?.tasks)) errs.push("Thiếu mảng `tasks`");
  if (skill === "speaking" && !Array.isArray(payload?.parts)) errs.push("Thiếu mảng `parts`");
  if (errs.length) throw new Error(errs.join(" · "));
}

function buildSummary(payload: any, skill: IeltsImportSkill): string {
  if (skill === "listening") {
    const total = payload.sections.reduce((s: number, sec: any) => s + (sec.questions?.length || 0), 0);
    return `${payload.sections.length} sections · ${total} câu hỏi`;
  }
  if (skill === "reading") {
    const total = payload.passages.reduce((s: number, p: any) => s + (p.questions?.length || 0), 0);
    return `${payload.passages.length} passages · ${total} câu hỏi`;
  }
  if (skill === "writing") {
    return `${payload.tasks.length} tasks`;
  }
  if (skill === "speaking") {
    return `${payload.parts.length} parts`;
  }
  return "";
}
