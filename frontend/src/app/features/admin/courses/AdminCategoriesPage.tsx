import { useEffect, useState } from "react";
import { adminApi, AdminCategory } from "@/services/adminApi";

const toId = (c: AdminCategory) => c.cId || c.caId || 0;
const toName = (c: AdminCategory) => c.cName || c.caName || "N/A";
const toDescription = (c: AdminCategory) => c.cDescription || c.caDescription || "";
const toType = (c: AdminCategory) => c.cType || c.caType || "GENERAL";

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"VSTEP" | "IELTS" | "GENERAL">("GENERAL");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminApi.getCategories();
      setCategories(data);
    } catch {
      setError("Không tải được danh mục.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createCategory = async () => {
    if (!name.trim()) return;
    try {
      setSaving(true);
      await adminApi.createCategory({
        cName: name.trim(),
        cDescription: description.trim() || undefined,
        cType: type,
      });
      setName("");
      setDescription("");
      setType("GENERAL");
      await load();
    } catch {
      setError("Tạo danh mục thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const removeCategory = async (id: number) => {
    if (!id) return;
    try {
      await adminApi.deleteCategory(id);
      await load();
    } catch {
      setError("Xóa danh mục thất bại.");
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Danh mục khóa học</h1>
        <p className="text-sm text-slate-500">Kết nối API admin/categories để quản lý danh mục</p>
      </div>

      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">Thêm danh mục</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên danh mục"
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả"
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "VSTEP" | "IELTS" | "GENERAL")}
            className="rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-blue-500"
          >
            <option value="GENERAL">GENERAL</option>
            <option value="IELTS">IELTS</option>
            <option value="VSTEP">VSTEP</option>
          </select>
          <button
            onClick={createCategory}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Đang lưu..." : "Tạo danh mục"}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tên</th>
                <th className="px-4 py-3">Mô tả</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={toId(c)} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-sm text-slate-700">{toId(c)}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{toName(c)}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{toDescription(c)}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{toType(c)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeCategory(toId(c))}
                      className="rounded-lg bg-rose-100 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

