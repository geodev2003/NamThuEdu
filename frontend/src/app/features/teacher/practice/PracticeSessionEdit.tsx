import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle, FileText, ExternalLink } from "lucide-react";
import { api } from "@/services/api";

interface FormState {
  ps_title: string;
  ps_description: string;
  ps_duration_minutes: number;
  ps_difficulty: "easy" | "medium" | "hard" | "mixed";
  ps_topic: string;
  ps_is_active: boolean;
}

export function PracticeSessionEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    ps_title: "",
    ps_description: "",
    ps_duration_minutes: 30,
    ps_difficulty: "medium",
    ps_topic: "",
    ps_is_active: true,
  });
  const [examInfo, setExamInfo] = useState<{ eId: number; eSkill: string } | null>(null);
  const [skill, setSkill] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/teacher/practice-sessions/${id}`);
        if (res.data.status === "success") {
          const s = res.data.data;
          setForm({
            ps_title: s.ps_title || "",
            ps_description: s.ps_description || "",
            ps_duration_minutes: s.ps_duration_minutes || 30,
            ps_difficulty: s.ps_difficulty || "medium",
            ps_topic: s.ps_topic || "",
            ps_is_active: s.ps_is_active ?? true,
          });
          setSkill(s.ps_target_skill || "");
          if (s.exam) setExamInfo({ eId: s.exam.eId, eSkill: s.exam.eSkill || s.ps_target_skill || "" });
        } else throw new Error(res.data.message);
      } catch (e: any) {
        setError(e.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await api.put(`/teacher/practice-sessions/${id}`, form);
      if (res.data.status === "success") {
        setSuccess(true);
        setTimeout(() => navigate(`/giao-vien/luyen-tap/${id}`), 1200);
      } else throw new Error(res.data.message);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Lỗi khi lưu");
    } finally {
      setSaving(false);
    }
  };

  const getExamEditRoute = () => {
    if (!examInfo) return null;
    const s = examInfo.eSkill || skill;
    const base = `/giao-vien/de-thi/vstep`;
    if (s === "reading")   return `${base}/reading/sua/${examInfo.eId}`;
    if (s === "listening") return `${base}/listening/sua/${examInfo.eId}`;
    if (s === "writing")   return `${base}/writing/sua/${examInfo.eId}`;
    if (s === "speaking")  return `${base}/speaking/sua/${examInfo.eId}`;
    if (s === "mixed")     return `${base}/full/sua/${examInfo.eId}`;
    return `/giao-vien/de-thi/${examInfo.eId}/chinh-sua`;
  };

  const set = (field: keyof FormState, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Quay lại chi tiết
          </button>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài luyện tập</h1>
            <p className="text-gray-500 text-sm mt-1">Cập nhật thông tin cơ bản của bài ôn tập</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên bài luyện tập <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.ps_title}
              onChange={(e) => set("ps_title", e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="VD: VSTEP B2 - Reading Practice"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              value={form.ps_description}
              onChange={(e) => set("ps_description", e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
              placeholder="Mô tả nội dung bài luyện tập..."
            />
          </div>

          {/* Duration + Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Thời gian (phút)</label>
              <input
                type="number"
                min={5}
                max={300}
                value={form.ps_duration_minutes}
                onChange={(e) => set("ps_duration_minutes", parseInt(e.target.value) || 30)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Độ khó</label>
              <select
                value={form.ps_difficulty}
                onChange={(e) => set("ps_difficulty", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="easy">Dễ</option>
                <option value="medium">Trung bình</option>
                <option value="hard">Khó</option>
                <option value="mixed">Hỗn hợp</option>
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chủ đề</label>
            <input
              type="text"
              value={form.ps_topic}
              onChange={(e) => set("ps_topic", e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="VD: grammar, vocabulary, comprehension..."
            />
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-700">Trạng thái hoạt động</p>
              <p className="text-xs text-gray-500 mt-0.5">Cho phép học viên thực hành bài này</p>
            </div>
            <button
              type="button"
              onClick={() => set("ps_is_active", !form.ps_is_active)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.ps_is_active ? "bg-emerald-500" : "bg-gray-300"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.ps_is_active ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Error / Success */}
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" /> Lưu thành công! Đang chuyển trang...
            </div>
          )}

          {/* Edit Questions */}
          {examInfo && (
            <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-xl border border-blue-100">
              <div>
                <p className="text-sm font-semibold text-blue-800">Chỉnh sửa câu hỏi</p>
                <p className="text-xs text-blue-600 mt-0.5">Thêm, sửa, xóa câu hỏi trong đề thi liên kết</p>
              </div>
              <button
                type="button"
                onClick={() => { const r = getExamEditRoute(); if (r) navigate(r); }}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> Mở editor <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
