import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Lock, Bell, Camera, Save, Eye, EyeOff } from "lucide-react";
import { studentApi } from "../../../../services/studentApi";

const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#EDE9FE";

type Tab = "info" | "password" | "notifications";

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="flex-1 py-3 text-sm font-semibold rounded-xl transition-all"
      style={{
        background: active ? PURPLE : "transparent",
        color: active ? "#fff" : "#6B7280",
      }}>
      {children}
    </button>
  );
}

export function Profile() {
  const [tab, setTab] = useState<Tab>("info");
  const [showPass, setShowPass] = useState({ curr: false, new: false, confirm: false });
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [passForm, setPassForm] = useState({ current_password: "", new_password: "", new_password_confirmation: "" });
  const [saved, setSaved] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["student", "profile"],
    queryFn: () => studentApi.getProfile(),
    onSuccess: (res: any) => {
      const d = res.data?.data ?? res.data;
      if (d) setForm({ name: d.uName ?? "", email: d.uEmail ?? "", phone: d.uPhone ?? "" });
    },
  } as any);

  const updateMutation = useMutation({
    mutationFn: () => studentApi.updateProfile(form),
    onSuccess: () => { setSaved(true); setTimeout(() => setSaved(false), 2000); },
  });

  const changePassMutation = useMutation({
    mutationFn: () => studentApi.changePassword(passForm),
    onSuccess: () => { setPassForm({ current_password: "", new_password: "", new_password_confirmation: "" }); },
  });

  const profile = (profileData as any)?.data?.data ?? (profileData as any)?.data;
  const initials = (form.name || profile?.uName || "H").split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="py-6 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1F1344" }}>Hồ sơ của tôi</h1>
        <p style={{ fontSize: 13, color: "#9CA3AF" }}>Quản lý thông tin cá nhân</p>
      </div>

      {/* Avatar card */}
      <div className="rounded-3xl p-6 bg-white flex flex-col sm:flex-row items-center gap-5"
        style={{ border: "1.5px solid #F0EEFF", boxShadow: "0 4px 20px rgba(124,58,237,0.07)" }}>
        <div className="relative">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-black"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, #8B5CF6)` }}>
            {initials}
          </div>
          <button
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg"
            style={{ background: PURPLE }}>
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#1F1344" }}>
            {form.name || profile?.uName || "Học viên"}
          </p>
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>{form.email || profile?.uEmail || ""}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: PURPLE_LIGHT, color: PURPLE }}>Học viên</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: "#F3F4F6" }}>
        <TabBtn active={tab === "info"} onClick={() => setTab("info")}>
          <User className="w-4 h-4 inline mr-1" />Thông tin
        </TabBtn>
        <TabBtn active={tab === "password"} onClick={() => setTab("password")}>
          <Lock className="w-4 h-4 inline mr-1" />Mật khẩu
        </TabBtn>
        <TabBtn active={tab === "notifications"} onClick={() => setTab("notifications")}>
          <Bell className="w-4 h-4 inline mr-1" />Thông báo
        </TabBtn>
      </div>

      {/* Tab content */}
      {tab === "info" && (
        <div className="rounded-2xl p-5 bg-white space-y-4" style={{ border: "1.5px solid #F0EEFF" }}>
          {[
            { key: "name", label: "Họ và tên", placeholder: "Nhập họ và tên", type: "text" },
            { key: "email", label: "Email", placeholder: "Nhập email", type: "email" },
            { key: "phone", label: "Số điện thoại", placeholder: "Nhập số điện thoại", type: "tel" },
          ].map((field) => (
            <div key={field.key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all"
                style={{
                  border: `1.5px solid #E5E7EB`,
                  fontSize: 14, color: "#374151",
                }}
                onFocus={(e) => (e.target.style.borderColor = PURPLE)}
                onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
              />
            </div>
          ))}
          <button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
            style={{ background: saved ? "#10B981" : PURPLE }}>
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? "Đang lưu..." : saved ? "✓ Đã lưu!" : "Lưu thay đổi"}
          </button>
          {updateMutation.isError && (
            <p className="text-red-500 text-sm text-center">Lỗi khi lưu. Thử lại!</p>
          )}
        </div>
      )}

      {tab === "password" && (
        <div className="rounded-2xl p-5 bg-white space-y-4" style={{ border: "1.5px solid #F0EEFF" }}>
          {[
            { key: "current_password", label: "Mật khẩu hiện tại", show: showPass.curr, toggle: () => setShowPass((p) => ({ ...p, curr: !p.curr })) },
            { key: "new_password", label: "Mật khẩu mới", show: showPass.new, toggle: () => setShowPass((p) => ({ ...p, new: !p.new })) },
            { key: "new_password_confirmation", label: "Xác nhận mật khẩu mới", show: showPass.confirm, toggle: () => setShowPass((p) => ({ ...p, confirm: !p.confirm })) },
          ].map((field) => (
            <div key={field.key}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 6 }}>
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={field.show ? "text" : "password"}
                  placeholder="••••••••"
                  value={passForm[field.key as keyof typeof passForm]}
                  onChange={(e) => setPassForm((p) => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none transition-all pr-12"
                  style={{ border: "1.5px solid #E5E7EB", fontSize: 14, color: "#374151" }}
                  onFocus={(e) => (e.target.style.borderColor = PURPLE)}
                  onBlur={(e) => (e.target.style.borderColor = "#E5E7EB")}
                />
                <button onClick={field.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => changePassMutation.mutate()}
            disabled={changePassMutation.isPending || !passForm.current_password || !passForm.new_password}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: PURPLE }}>
            <Lock className="w-4 h-4" />
            {changePassMutation.isPending ? "Đang đổi..." : "Đổi mật khẩu"}
          </button>
          {changePassMutation.isSuccess && (
            <p className="text-green-500 text-sm text-center">✓ Đổi mật khẩu thành công!</p>
          )}
          {changePassMutation.isError && (
            <p className="text-red-500 text-sm text-center">Sai mật khẩu hiện tại. Thử lại!</p>
          )}
        </div>
      )}

      {tab === "notifications" && (
        <div className="rounded-2xl p-5 bg-white space-y-4" style={{ border: "1.5px solid #F0EEFF" }}>
          {[
            { label: "Thông báo bài tập mới", desc: "Khi giáo viên giao bài mới" },
            { label: "Nhắc nhở deadline", desc: "Trước 24 giờ khi bài tập sắp hết hạn" },
            { label: "Kết quả chấm điểm", desc: "Khi giáo viên chấm xong bài" },
          ].map((item, i) => {
            const [enabled, setEnabled] = useState(true);
            return (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#1F1344" }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: "#9CA3AF" }}>{item.desc}</p>
                </div>
                <button
                  onClick={() => setEnabled((e) => !e)}
                  className="w-12 h-6 rounded-full relative transition-colors duration-200"
                  style={{ background: enabled ? PURPLE : "#E5E7EB" }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
                    style={{ left: enabled ? "calc(100% - 22px)" : "2px" }} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
