import { useState } from "react";
import { useNavigate } from "react-router";
import { UserPlus, ArrowLeft } from "lucide-react";
import { adminApi } from "@/services/adminApi";

export function AdminTeacherCreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await adminApi.createUser({
        name: name.trim(),
        phone: phone.trim(),
        password,
        role: "teacher",
        status,
      });

      setSuccess("Tạo giáo viên thành công.");
      setName("");
      setPhone("");
      setPassword("");
      setStatus("active");
    } catch {
      setError("Tạo giáo viên thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Thêm giáo viên</h1>
          <p className="text-sm text-slate-500">Tạo mới tài khoản giáo viên và đồng bộ về hệ thống</p>
        </div>
        <button
          onClick={() => navigate("/admin/teachers")}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại danh sách
        </button>
      </div>

      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">Tên giáo viên *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Số điện thoại *</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0900000000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Mật khẩu *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Trạng thái</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
          </div>

          <div className="md:col-span-2">
            {error && <p className="mb-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            {success && <p className="mb-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? "Đang tạo..." : "Tạo giáo viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

