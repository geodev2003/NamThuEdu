import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Save, RotateCcw, FileText, Shield, ChevronDown, Loader2, Database, Globe, Check, AlertCircle } from "lucide-react";
import { adminApi } from "../../../../services/adminApi";
import legalDefaults from "./legal-defaults.json";

interface Section { title: string; body: string; }
interface LegalData { privacy: { sections: Section[] }; terms: { sections: Section[] } }

function buildDefault(t: (k: string, o?: any) => any, lang: string): LegalData {
  const localData = (legalDefaults as any)[lang] || (legalDefaults as any)["vi"];
  if (localData) {
    return structuredClone(localData);
  }
  const k = `landing.legal`;
  return {
    privacy: { sections: t(`${k}.privacy.sections`, { returnObjects: true, lng: lang }) as Section[] },
    terms:   { sections: t(`${k}.terms.sections`,   { returnObjects: true, lng: lang }) as Section[] },
  };
}

interface LegalContentTabProps {
  toast: { success: (msg: string) => void; error: (msg: string) => void };
}

export function LegalContentTab({ toast }: LegalContentTabProps) {
  const { t } = useTranslation();
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [docType, setDocType] = useState<"privacy" | "terms">("privacy");
  const [data, setData] = useState<LegalData>(() => buildDefault(t, "vi"));
  const [openIdx, setOpenIdx] = useState<number>(0);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dbLoaded, setDbLoaded] = useState(false);

  const loadFromDb = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getLegalContent();
      const dbData = result[`legal_${lang}` as "legal_vi" | "legal_en"] as LegalData | null;
      setData(dbData ?? buildDefault(t, lang));
      setDbLoaded(!!dbData);
    } catch {
      setData(buildDefault(t, lang));
      setDbLoaded(false);
    } finally {
      setLoading(false);
      setDirty(false);
      setOpenIdx(0);
    }
  }, [lang, t]);

  useEffect(() => {
    loadFromDb();
  }, [loadFromDb]);

  const sections = data[docType]?.sections || [];

  const updateBody = (idx: number, value: string) => {
    setData(prev => {
      const next = structuredClone(prev);
      next[docType].sections[idx].body = value;
      return next;
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updateLegalContent(lang, data);
      setDirty(false);
      setDbLoaded(true);
      toast.success("Đã lưu vào cơ sở dữ liệu!");
    } catch {
      toast.error("Lưu thất bại. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setSaving(true);
    try {
      const defaultData = buildDefault(t, lang);
      await adminApi.updateLegalContent(lang, defaultData);
      setData(defaultData);
      setDirty(false);
      setDbLoaded(false);
      toast.success("Đã khôi phục nội dung mặc định.");
    } catch {
      toast.error("Khôi phục thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const getWordCount = (text: string) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  return (
    <div className="space-y-6">
      {/* Header card with status indicator */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[#111827] font-bold text-lg" style={{ fontSize: "20px" }}>
              Quản lý nội dung pháp lý
            </h2>
            {dbLoaded ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ECFDF5] px-2.5 py-1 text-xs font-semibold text-[#10B981] border border-[#A7F3D0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Đang dùng từ Database
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs font-semibold text-[#4B5563] border border-[#E5E7EB]">
                Mặc định hệ thống
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-[#6B7280] leading-relaxed">
            Chỉnh sửa Chính sách bảo mật và Điều khoản sử dụng. Thay đổi được lưu vào cơ sở dữ liệu và có hiệu lực tức thì trên toàn hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {dirty && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] text-xs font-semibold">
              <AlertCircle className="w-3.5 h-3.5" />
              Chưa lưu thay đổi
            </span>
          )}
        </div>
      </div>

      {/* Selectors and Control Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Document Type Switcher */}
        <div className="flex p-1 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] w-fit">
          <button
            type="button"
            onClick={() => { setDocType("privacy"); setOpenIdx(0); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              docType === "privacy"
                ? "bg-white text-[#EA580C] shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            <Shield className="h-4 w-4" />
            Chính sách bảo mật
          </button>
          <button
            type="button"
            onClick={() => { setDocType("terms"); setOpenIdx(0); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              docType === "terms"
                ? "bg-white text-[#EA580C] shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            <FileText className="h-4 w-4" />
            Điều khoản sử dụng
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex p-1 bg-[#F3F4F6] rounded-xl border border-[#E5E7EB] w-fit">
          <button
            type="button"
            onClick={() => setLang("vi")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              lang === "vi"
                ? "bg-[#EA580C] text-white shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            VI
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
              lang === "en"
                ? "bg-[#EA580C] text-white shadow-sm"
                : "text-[#4B5563] hover:text-[#111827]"
            }`}
          >
            EN
          </button>
        </div>
      </div>

      {/* Accordion Editor */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm gap-3">
          <Loader2 className="h-8 w-8 text-[#EA580C] animate-spin" />
          <span className="text-sm text-[#6B7280]">Đang tải dữ liệu pháp lý...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                  isOpen ? "border-[#EA580C]/40 ring-4 ring-[#EA580C]/5" : "border-[#E5E7EB] hover:border-[#D1D5DB]"
                }`}
              >
                {/* Header Button */}
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4.5 text-left transition-colors cursor-pointer"
                  style={{ background: isOpen ? "#FFF7ED/30" : "transparent" }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isOpen ? "bg-[#FFF7ED] text-[#EA580C]" : "bg-[#F3F4F6] text-[#4B5563]"
                    }`}>
                      {idx + 1}
                    </div>
                    <span className="font-bold text-[#111827] text-sm md:text-base leading-snug">
                      {section.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#9CA3AF] font-medium hidden sm:inline">
                      {getWordCount(section.body)} từ
                    </span>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                      isOpen ? "border-[#EA580C] bg-[#FFF7ED] text-[#EA580C] rotate-180" : "border-[#E5E7EB] text-[#9CA3AF] hover:text-[#4B5563]"
                    }`}>
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                </button>

                {/* Content Editor Panel */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#F3F4F6] bg-[#FAFAFA]">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-[#4B5563] uppercase tracking-wider">
                        Nội dung chi tiết
                      </label>
                      <div className="text-xs text-[#9CA3AF]">
                        <span>{section.body?.length || 0} ký tự</span>
                        <span className="mx-2">•</span>
                        <span>{getWordCount(section.body)} từ</span>
                      </div>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-[#E5E7EB] bg-white focus-within:ring-2 focus-within:ring-[#EA580C]/20 focus-within:border-[#EA580C] transition-all shadow-inner">
                      <textarea
                        className="w-full px-4 py-3 text-sm leading-relaxed text-[#374151] bg-transparent outline-none resize-y"
                        rows={6}
                        value={section.body}
                        onChange={e => updateBody(idx, e.target.value)}
                        placeholder="Nhập nội dung điều khoản..."
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Actions */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving || loading}
          className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-[#E5E7EB] bg-white text-[#4B5563] text-sm font-semibold hover:border-red-200 hover:text-red-600 active:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Khôi phục mặc định
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!dirty || saving || loading}
          className="flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-[#EA580C] text-white text-sm font-semibold hover:bg-[#C2410C] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none transition-all duration-200 shadow-md shadow-[#EA580C]/10 cursor-pointer"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
