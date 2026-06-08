/**
 * ExamComments — Khu vực bình luận / thảo luận đề thi (giống study4.vn).
 *
 * Tính năng:
 *   • Hiện danh sách bình luận (phân tầng top-level + replies)
 *   • Trả lời (reply) inline
 *   • Xóa bình luận của chính mình
 *   • Lazy load: ban đầu hiện 5 reply, bấm "Xem thêm" để load hết
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { MessageCircle, Send, Reply, Trash2, ChevronDown, Loader2 } from "lucide-react";
import { api } from "../../../../../../services/api";
import { getAuthUser } from "../../../../../../utils/authStorage";

// ─── Types ────────────────────────────────────────────────────────────────
interface CommentUser {
  id: number;
  name: string;
  avatar: string | null;
  role: "student" | "teacher" | string;
}

interface Comment {
  id: number;
  content: string;
  is_deleted: boolean;
  parent_id: number | null;
  created_at: string;
  user: CommentUser;
  replies: Comment[];
}

interface ExamCommentsProps {
  examId: number | string;
  currentUserId?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "vừa xong";
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

// Helper: build full avatar URL (giống Header.tsx)
function getAvatarUrl(avatar: string | null | undefined): string {
  if (!avatar) return "";
  if (avatar.startsWith("http://") || avatar.startsWith("https://")) return avatar;
  const baseUrl = (import.meta.env.VITE_API_URL ?? "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");
  if (!baseUrl) return "";
  return avatar.startsWith("/") ? `${baseUrl}${avatar}` : `${baseUrl}/${avatar}`;
}

// Helper: get initials từ name (e.g. "Nguyen Van A" → "NA")
function getInitials(name: string): string {
  return (name || "U")
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
}

function Avatar({ user, size = 8 }: { user: CommentUser; size?: number }) {
  const sizeCls = size === 7 ? "w-7 h-7" : "w-8 h-8";
  const baseCls = `${sizeCls} rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold overflow-hidden`;
  const avatarUrl = getAvatarUrl(user.avatar);
  const [imgFailed, setImgFailed] = useState(false);

  // Show img nếu có URL và chưa fail
  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={user.name || "User"}
        className={`${baseCls} object-cover border border-slate-200`}
        onError={() => setImgFailed(true)}
      />
    );
  }

  // Fallback: initials với gradient indigo (giống Header)
  return (
    <div
      className={`${baseCls} text-white shadow-sm`}
      style={{ background: "linear-gradient(135deg,#6366F1,#4338CA)" }}
    >
      {getInitials(user.name)}
    </div>
  );
}

// ─── CommentInput ─────────────────────────────────────────────────────────
function CommentInput({
  placeholder = "Viết bình luận...",
  onSubmit,
  autoFocus = false,
  compact = false,
  initialValue = "",
}: {
  placeholder?: string;
  onSubmit: (text: string) => Promise<void>;
  autoFocus?: boolean;
  compact?: boolean;
  /** Giá trị prefill (ví dụ "@Tên\n"). User có thể xóa nếu muốn. */
  initialValue?: string;
}) {
  const [text, setText] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && ref.current) {
      ref.current.focus();
      // Đặt cursor ở cuối (sau phần prefill)
      const len = ref.current.value.length;
      ref.current.setSelectionRange(len, len);
    }
  }, [autoFocus]);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit(trimmed);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`flex items-start gap-2.5 ${compact ? "" : "mt-1"}`}>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        rows={compact ? 2 : 3}
        className="flex-1 resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!text.trim() || submitting}
        className="mt-0.5 inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        {!compact && <span>Gửi</span>}
      </button>
    </div>
  );
}

// Zero-width space — invisible separator giữa @mention và nội dung.
// Đặt ngay sau tên trong content, parser dùng để tách chính xác kể cả khi
// tên người chứa khoảng trắng (vd "Học Viên Adults").
const MENTION_SEP = "\u200B";

// BroadcastChannel để các tab cùng origin biết có comment/reply mới
// → tab nhận được sẽ trigger invalidate notifications query (xem listener
// trong NotificationDropdown.tsx).
const COMMENT_CHANNEL_NAME = "exam-comments";

function notifyOtherTabsCommentChanged() {
  if (typeof BroadcastChannel === "undefined") return;
  try {
    const ch = new BroadcastChannel(COMMENT_CHANNEL_NAME);
    ch.postMessage({ type: "comment_changed", at: Date.now() });
    ch.close();
  } catch {
    // Older browsers — bỏ qua, polling vẫn cover
  }
}

// ─── CommentContent ───────────────────────────────────────────────────────
// Highlight @mention ở đầu nội dung. Format: "@Tên Người\u200B nội dung"
function CommentContent({ content }: { content: string }) {
  if (content.startsWith("@")) {
    const sepIdx = content.indexOf(MENTION_SEP);
    if (sepIdx > 0) {
      const mention = content.substring(0, sepIdx);
      const rest = content.substring(sepIdx + 1).replace(/^\s+/, "");
      return (
        <p className="leading-relaxed whitespace-pre-wrap break-words">
          <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
            {mention}
          </span>
          {rest ? <> {rest}</> : null}
        </p>
      );
    }
    // Fallback: legacy format "@Tên\n..." (data cũ)
    if (content.includes("\n")) {
      const idx = content.indexOf("\n");
      return (
        <p className="leading-relaxed whitespace-pre-wrap break-words">
          <span className="font-semibold text-blue-600 hover:underline cursor-pointer">
            {content.substring(0, idx)}
          </span>
          {"\n"}
          {content.substring(idx + 1)}
        </p>
      );
    }
  }
  return <p className="leading-relaxed whitespace-pre-wrap break-words">{content}</p>;
}

// ─── SingleComment ────────────────────────────────────────────────────────
function SingleComment({
  comment,
  currentUserId,
  onReply,
  onDelete,
  depth = 0,
  forceExpandedIds,
}: {
  comment: Comment;
  currentUserId?: number;
  onReply: (parentId: number, text: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  /** Độ sâu trong cây — 0 là top-level. Dùng để giới hạn indent. */
  depth?: number;
  /** Set id các comment cần force-expand (vì chứa target từ notification deeplink). */
  forceExpandedIds?: Set<number>;
}) {
  const [showReply, setShowReply] = useState(false);
  // Auto-expand nếu node này nằm trong forceExpandedIds (anc của target)
  const shouldForceExpand = forceExpandedIds?.has(comment.id) ?? false;
  const [expanded, setExpanded] = useState(shouldForceExpand);

  // Sync khi forceExpandedIds thay đổi (sau khi data load lại từ server)
  useEffect(() => {
    if (shouldForceExpand) setExpanded(true);
  }, [shouldForceExpand]);
  const REPLY_LIMIT = 3;

  // Giới hạn indent thị giác — sau 4 cấp thì không tăng nữa, tránh tràn ngang
  const MAX_VISUAL_DEPTH = 4;
  const visualDepth = Math.min(depth, MAX_VISUAL_DEPTH);
  const indentCls = visualDepth === 0 ? "" : "ml-10";

  const visibleReplies = expanded
    ? comment.replies
    : comment.replies.slice(0, REPLY_LIMIT);
  const hiddenCount = comment.replies.length - REPLY_LIMIT;

  const isOwner = currentUserId != null && currentUserId === comment.user.id;
  const isReply = depth > 0;

  const handleSubmitReply = async (text: string) => {
    await onReply(comment.id, text);
    setShowReply(false);
    setExpanded(true); // Auto-expand để user thấy reply mới
  };

  return (
    <div
      id={`comment-${comment.id}`}
      className={`${indentCls} ${depth === 0 ? "mt-4" : "mt-3"} scroll-mt-24 transition-shadow duration-300`}
    >
      <div className="flex gap-2.5">
        <Avatar user={comment.user} size={isReply ? 7 : 8} />
        <div className="flex-1 min-w-0">
          {/* Bubble */}
          <div className={`inline-block rounded-2xl px-3.5 py-2.5 text-sm max-w-full ${
            comment.is_deleted ? "bg-gray-50 text-gray-400 italic" : "bg-gray-100 text-gray-800"
          }`}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-[13px] text-gray-900">{comment.user.name}</span>
              {comment.user.role === "teacher" && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700">
                  GV
                </span>
              )}
            </div>
            <CommentContent content={comment.content} />
          </div>

          {/* Actions row */}
          {!comment.is_deleted && (
            <div className="flex items-center gap-3 mt-1 px-1">
              <span className="text-[11px] text-gray-400">{timeAgo(comment.created_at)}</span>
              <button
                type="button"
                onClick={() => setShowReply((v) => !v)}
                className="text-[11px] font-semibold text-gray-500 hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Reply className="w-3 h-3" />
                Trả lời
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => onDelete(comment.id)}
                  className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Xóa
                </button>
              )}
            </div>
          )}

          {/* Reply input */}
          {showReply && (
            <div className="mt-2">
              <CommentInput
                placeholder={`Trả lời ${comment.user.name}...`}
                autoFocus
                compact
                initialValue={depth > 0 ? `@${comment.user.name}${MENTION_SEP} ` : ""}
                onSubmit={handleSubmitReply}
              />
            </div>
          )}
        </div>
      </div>

      {/* Replies — render đệ quy với depth + 1 */}
      {visibleReplies.map((r) => (
        <SingleComment
          key={r.id}
          comment={r}
          currentUserId={currentUserId}
          onReply={onReply}
          onDelete={onDelete}
          depth={depth + 1}
          forceExpandedIds={forceExpandedIds}
        />
      ))}

      {/* Load more replies */}
      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="ml-10 mt-2 flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5" />
          Xem thêm {hiddenCount} trả lời
        </button>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function ExamComments({ examId, currentUserId }: ExamCommentsProps) {
  const location = useLocation();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Set id các comment cần auto-expand (= các tổ tiên của target từ deeplink)
  const [forceExpandedIds, setForceExpandedIds] = useState<Set<number>>(new Set());
  const [currentUser, setCurrentUser] = useState<CommentUser | null>(() => {
    // Initial value from localStorage để render ngay (avoid flash)
    try {
      const u = getAuthUser();
      if (!u) return null;
      return {
        id:     (u.id as number) ?? 0,
        name:   (u.name as string) ?? "Bạn",
        avatar: (u.avatar as string) || (u.avatar_url as string) || null,
        role:   (u.role as string) ?? "student",
      };
    } catch {
      return null;
    }
  });

  // Fetch user profile mới nhất từ server (để có avatar mới nếu user vừa upload)
  useEffect(() => {
    let cancelled = false;
    api.get("/user/profile")
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        if (!data) return;
        setCurrentUser({
          id:     data.uId ?? data.id ?? 0,
          name:   data.uName ?? data.name ?? "Bạn",
          avatar: data.avatar_url ?? data.avatar ?? null,
          role:   data.uRole ?? data.role ?? "student",
        });
      })
      .catch(() => {
        // Im lặng — đã có fallback từ localStorage
      });
    return () => { cancelled = true; };
  }, []);

  const fetchComments = () => {
    setLoading(true);
    api.get(`/student/exams/${examId}/comments`)
      .then((res) => setComments(res.data?.data ?? []))
      .catch((e) => setError(e?.response?.data?.message ?? "Không thể tải bình luận"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchComments(); }, [examId]);

  // ── Deeplink: URL hash #comment-X ─────────────────────────────────────
  // Sau khi comments load xong: tìm tổ tiên của target → expand → scroll +
  // highlight. Re-run khi location.hash đổi (user click 1 noti khác cùng trang).
  useEffect(() => {
    if (loading || comments.length === 0) return;

    // Ưu tiên hash từ react-router (location.hash) vì react-router-dom Link
    // không trigger 'hashchange' event nếu cùng pathname. Fallback window.location.hash.
    const hash = location.hash || window.location.hash;
    if (!hash || !hash.startsWith("#comment-")) return;

    const targetId = Number(hash.substring("#comment-".length));
    if (!Number.isFinite(targetId) || targetId <= 0) return;

    // Đệ quy tìm path từ root xuống target. Trả về list id tổ tiên (không
    // gồm chính target — chỉ cần expand các parent).
    const findPath = (list: Comment[], path: number[]): number[] | null => {
      for (const c of list) {
        if (c.id === targetId) return path;
        const sub = findPath(c.replies, [...path, c.id]);
        if (sub) return sub;
      }
      return null;
    };

    const path = findPath(comments, []);
    if (!path) return; // Comment không tồn tại trong tree (đã xóa?)

    // Force expand mọi tổ tiên — sẽ trigger re-render
    setForceExpandedIds(new Set(path));

    // Polling: chờ DOM render xong rồi mới scroll. Tối đa 30 attempts × 80ms
    // = 2.4s — đủ cho mọi cây sâu kể cả khi React batch chậm.
    let attempts = 0;
    const maxAttempts = 30;
    let cancelled = false;
    const tryScroll = () => {
      if (cancelled) return;
      const el = document.getElementById(`comment-${targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-blue-400", "ring-offset-2", "rounded-2xl");
        window.setTimeout(() => {
          el.classList.remove("ring-2", "ring-blue-400", "ring-offset-2", "rounded-2xl");
        }, 2500);
        return;
      }
      if (++attempts < maxAttempts) {
        window.setTimeout(tryScroll, 80);
      }
    };
    // Delay 1 frame để React batch + commit, rồi bắt đầu polling
    window.requestAnimationFrame(() => {
      window.setTimeout(tryScroll, 50);
    });

    return () => { cancelled = true; };
  }, [loading, comments, location.hash]);

  const handlePost = async (text: string) => {
    const res = await api.post(`/student/exams/${examId}/comments`, { content: text });
    const newComment: Comment = res.data?.data;
    setComments((prev) => [newComment, ...prev]);
    notifyOtherTabsCommentChanged();
  };

  const handleReply = async (parentId: number, text: string) => {
    const res = await api.post(`/student/exams/${examId}/comments`, {
      content: text,
      parent_id: parentId,
    });
    const newReply: Comment = res.data?.data;
    // Đệ quy tìm parent ở mọi cấp và thêm reply vào replies của nó
    const insertReply = (list: Comment[]): Comment[] =>
      list.map((c) =>
        c.id === parentId
          ? { ...c, replies: [...c.replies, newReply] }
          : { ...c, replies: insertReply(c.replies) }
      );
    setComments((prev) => insertReply(prev));
    notifyOtherTabsCommentChanged();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/student/exams/${examId}/comments/${id}`);
    // Mark as deleted locally
    const markDeleted = (list: Comment[]): Comment[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, is_deleted: true, content: "[Bình luận đã bị xóa]" }
          : { ...c, replies: markDeleted(c.replies) }
      );
    setComments((prev) => markDeleted(prev));
  };

  // Đếm tổng số bình luận (top-level + tất cả replies, không tính deleted)
  const totalComments = (() => {
    const countBranch = (list: Comment[]): number =>
      list.reduce(
        (sum, c) => sum + (c.is_deleted ? 0 : 1) + countBranch(c.replies),
        0
      );
    return countBranch(comments);
  })();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-800">
          Thảo luận
          {totalComments > 0 && (
            <span className="ml-1.5 text-xs font-normal text-gray-400">
              ({totalComments})
            </span>
          )}
        </h3>
      </div>

      {/* New comment input with current user avatar */}
      <div className="flex items-start gap-2.5">
        {currentUser ? (
          <Avatar user={currentUser} size={8} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
        )}
        <div className="flex-1">
          <CommentInput
            placeholder="Chia sẻ suy nghĩ hoặc hỏi đáp về đề thi này... (Ctrl+Enter để gửi)"
            onSubmit={handlePost}
          />
        </div>
      </div>

      {/* List */}
      {loading && (
        <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Đang tải bình luận...</span>
        </div>
      )}

      {!loading && error && (
        <p className="text-sm text-red-500 text-center py-4">{error}</p>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="flex flex-col items-center py-10 gap-3 text-gray-400">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-gray-600">Chưa có bình luận</p>
          <p className="text-xs text-gray-400">Hãy là người đầu tiên thảo luận về đề thi này!</p>
        </div>
      )}

      {!loading && comments.map((c) => (
        <SingleComment
          key={c.id}
          comment={c}
          currentUserId={currentUserId}
          onReply={handleReply}
          onDelete={handleDelete}
          forceExpandedIds={forceExpandedIds}
        />
      ))}
    </div>
  );
}
