import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Search, Trash2, XCircle } from "lucide-react";
import { adminApi, AdminPost } from "@/services/adminApi";

function postId(post: AdminPost) {
  return post.pId || post.id || 0;
}
function postTitle(post: AdminPost) {
  return post.pTitle || post.title || "Không có tiêu đề";
}
function postStatus(post: AdminPost) {
  return post.pStatus || post.status || "draft";
}
function authorName(post: AdminPost) {
  return post.author?.uName || post.author?.name || "N/A";
}

export function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const [allPosts, pendingPosts] = await Promise.all([adminApi.getPosts(), adminApi.getPendingPosts()]);
      const mergedMap = new Map<number, AdminPost>();
      allPosts.forEach((p) => mergedMap.set(postId(p), p));
      pendingPosts.forEach((p) => mergedMap.set(postId(p), p));
      setPosts(Array.from(mergedMap.values()));
    } catch {
      setError("Không tải được danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter(
      (p) =>
        !q ||
        postTitle(p).toLowerCase().includes(q) ||
        authorName(p).toLowerCase().includes(q) ||
        (p.pType || "").toLowerCase().includes(q)
    );
  }, [posts, search]);

  const stats = useMemo(() => {
    const total = posts.length;
    const pending = posts.filter((p) => postStatus(p) === "pending" || postStatus(p) === "draft").length;
    const approved = posts.filter((p) => postStatus(p) === "active").length;
    const rejected = posts.filter((p) => postStatus(p) === "inactive").length;
    return { total, pending, approved, rejected };
  }, [posts]);

  const handleApprove = async (id: number) => {
    try {
      setBusyId(id);
      await adminApi.approvePost(id);
      await loadPosts();
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = "Nội dung chưa đạt tiêu chuẩn xuất bản.";
    try {
      setBusyId(id);
      await adminApi.rejectPost(id, reason);
      await loadPosts();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setBusyId(id);
      await adminApi.deletePost(id);
      await loadPosts();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#F8FAFC" }}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kiểm duyệt bài viết</h1>
          <p className="text-sm text-slate-500">Duyệt, từ chối hoặc xóa bài viết giáo viên gửi lên</p>
        </div>
        <button
          onClick={loadPosts}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Tải lại
        </button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Tổng bài viết</p>
          <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-700">Chờ duyệt</p>
          <p className="text-2xl font-bold text-amber-700">{stats.pending}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs text-emerald-700">Đã duyệt</p>
          <p className="text-2xl font-bold text-emerald-700">{stats.approved}</p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <p className="text-xs text-rose-700">Từ chối</p>
          <p className="text-2xl font-bold text-rose-700">{stats.rejected}</p>
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tiêu đề, tác giả, loại bài..."
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <table className="w-full min-w-[980px]">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tiêu đề</th>
                <th className="px-4 py-3">Tác giả</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const id = postId(p);
                const status = postStatus(p);
                return (
                  <tr key={id} className="border-t border-slate-100">
                    <td className="px-4 py-3 text-sm text-slate-700">{id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{postTitle(p)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{authorName(p)}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{p.pType || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          status === "active"
                            ? "bg-emerald-100 text-emerald-700"
                            : status === "inactive"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(id)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Duyệt
                        </button>
                        <button
                          onClick={() => handleReject(id)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-2.5 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-200 disabled:opacity-60"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Từ chối
                        </button>
                        <button
                          onClick={() => handleDelete(id)}
                          disabled={busyId === id}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-100 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-200 disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

