import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Plus,
  Tag,
  Trash2,
  Edit3,
  Loader2,
  FileText,
  XCircle,
} from "lucide-react";
import { categoryApi } from "../../../../services/blogApi";
import { useToast } from "../../../../hooks/useToast";

interface Category {
  caId: number;
  caName: string;
  caSlug?: string;
  caDescription?: string;
  posts_count?: number;
}

export function Categories() {
  const { success: showSuccess, error: showError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await categoryApi.getCategories();
        setCategories(response.data.data || response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Khong the tai danh muc");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      showSuccess("Da xoa danh muc thanh cong");
      setCategories(categories.filter((c) => c.caId !== id));
    } catch (err: any) {
      showError("Khong the xoa danh muc");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <Link
            to="/giao-vien/bai-viet"
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Bai viet
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-medium">Danh muc</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Danh muc bai viet
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quan ly danh muc phan loai bai viet
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm cursor-pointer">
            <Plus className="w-4 h-4" />
            Them danh muc
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-white rounded-xl border border-rose-200 p-8 text-center">
            <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-rose-800 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
            >
              Thu lai
            </button>
          </div>
        )}

        {/* Categories List */}
        {!loading && !error && categories.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center">
            <div className="w-14 h-14 mx-auto mb-3 bg-slate-100 rounded-xl flex items-center justify-center">
              <Tag className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 mb-1">
              Chua co danh muc nao
            </h3>
            <p className="text-sm text-slate-500">
              Tao danh muc de phan loai bai viet cua ban
            </p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <div
                  key={cat.caId}
                  className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {cat.caName}
                      </h3>
                      {cat.caDescription && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {cat.caDescription}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {cat.posts_count || 0} bai viet
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors cursor-pointer">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.caId)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
