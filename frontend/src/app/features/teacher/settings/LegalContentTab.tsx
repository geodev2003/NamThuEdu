import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Save, RotateCcw, FileText, Shield, ChevronDown, Loader2, Database } from "lucide-react";
import { adminApi } from "../../../../services/adminApi";

interface Section { title: string; body: string; }
interface LegalData { privacy: { sections: Section[] }; terms: { sections: Section[] } }

function buildDefault(t: (k: string, o?: any) => any, lang: string): LegalData {
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

  useEffect(() => { loadFromDb(); }, [loadFromDb]);

  const sections = data[docType].sections;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Nội dung pháp lý</h2>
          <p className="mt-1 text-sm text-slate-500">
            Chỉnh sửa Chính sách bảo mật và Điều khoản sử dụng. Thay đổi được lưu vào DB và có hiệu lực ngay với mọi người dùng.
          </p>
        </div>
        {dbLoaded && (
          <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
            <Database className="h-3 w-3" /> Đang dùng từ DB
          </span>
        )}
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm font-medium">
          {(["vi", "en"] as const).map(l => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-4 py-1.5 transition-colors ${lang === l ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
              {l === "vi" ? "🇻🇳 Tiếng Việt" : "🇬🇧 English"}
            </button>
          ))}
        </div>

        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm font-medium">
          <button onClick={() => { setDocType("privacy"); setOpenIdx(0); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 transition-colors ${docType === "privacy" ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            <Shield className="h-3.5 w-3.5" /> Chính sách bảo mật
          </button>
          <button onClick={() => { setDocType("terms"); setOpenIdx(0); }}
            className={`flex items-center gap-1.5 px-4 py-1.5 transition-colors ${docType === "terms" ? "bg-orange-500 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            <FileText className="h-3.5 w-3.5" /> Điều khoản sử dụng
          </button>
        </div>

        {dirty && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">Chưa lưu</span>
        )}
      </div>

      {/* Accordion editor */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Đang tải...
        </div>
      ) : (
        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
          {sections.map((section, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx}>
                <button type="button" onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="flex w-full items-center justify-between gap-3 bg-slate-50 px-5 py-3.5 text-left hover:bg-slate-100 transition-colors">
                  <span className="text-sm font-semibold text-slate-800">{section.title}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400 transition-transform duration-200"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
                </button>
                {isOpen && (
                  <div className="px-5 py-4">
                    <label className="mb-1.5 block text-xs font-medium text-slate-500">Nội dung</label>
                    <textarea
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-y"
                      rows={5} value={section.body}
                      onChange={e => updateBody(idx, e.target.value)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={!dirty || saving}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Lưu vào DB
        </button>
        <button onClick={handleReset} disabled={saving}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:text-red-600 disabled:opacity-40">
          <RotateCcw className="h-4 w-4" /> Khôi phục mặc định
        </button>
      </div>
    </div>
  );
}
