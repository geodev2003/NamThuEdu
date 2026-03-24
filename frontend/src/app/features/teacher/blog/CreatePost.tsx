import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Save,
  Eye,
  Upload,
  X,
  Bold,
  Italic,
  Underline,
  List as ListIcon,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
  Type,
  AlignLeft,
  ChevronDown,
} from "lucide-react";

export function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [postType, setPostType] = useState("grammar");
  const [category, setCategory] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
  const charCount = content.length;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Auto-generate slug
    const newSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(newSlug);
  };

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDraft = () => {
    setLastSaved(new Date());
    // TODO: Save to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link to="/giao-vien/bai-viet" className="text-blue-600 hover:text-blue-700 font-semibold">
            Bài viết
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-900 font-semibold">Tạo mới</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Tạo bài viết mới ✍️</h1>
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Đã lưu {Math.floor((Date.now() - lastSaved.getTime()) / 1000 / 60)} phút trước
            </span>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Main Content (70%) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title Input */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <input
              type="text"
              placeholder="Tiêu đề bài viết..."
              value={title}
              onChange={handleTitleChange}
              className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Text Style */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Bold">
                    <Bold className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Italic">
                    <Italic className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Underline">
                    <Underline className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Headings */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button className="px-3 py-2 hover:bg-gray-200 rounded-lg transition-all text-sm font-semibold text-gray-700">
                    H1
                  </button>
                  <button className="px-3 py-2 hover:bg-gray-200 rounded-lg transition-all text-sm font-semibold text-gray-700">
                    H2
                  </button>
                  <button className="px-3 py-2 hover:bg-gray-200 rounded-lg transition-all text-sm font-semibold text-gray-700">
                    H3
                  </button>
                </div>

                {/* Lists */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Bullet List">
                    <ListIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Numbered List">
                    <ListOrdered className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Insert */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Insert Link">
                    <LinkIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Insert Image">
                    <ImageIcon className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Code Block">
                    <Code className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Quote">
                    <Quote className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Align Left">
                    <AlignLeft className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Undo">
                    <Undo className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 rounded-lg transition-all" title="Redo">
                    <Redo className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6">
              <textarea
                placeholder="Bắt đầu viết nội dung của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-[400px] text-gray-900 placeholder-gray-400 focus:outline-none resize-none leading-relaxed"
                style={{ fontSize: "16px", lineHeight: "1.6" }}
              />
            </div>

            {/* Footer - Word Count */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 flex items-center justify-between text-sm text-gray-600">
              <span>{wordCount} từ</span>
              <span>{charCount} ký tự</span>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 sticky top-6 z-10 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Status Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700">Trạng thái:</span>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-8 font-medium"
                  >
                    <option value="draft">Nháp</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSaveDraft}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 text-sm"
                >
                  <Save className="w-4 h-4" />
                  Lưu nháp
                </button>
                <button className="px-4 py-2 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4" />
                  Xem trước
                </button>
                <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30 text-sm">
                  Xuất bản
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Sidebar (30%) */}
        <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
          {/* Post Settings Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cài đặt bài viết</h3>

            {/* Post Type */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại bài viết
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="postType"
                    value="grammar"
                    checked={postType === "grammar"}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Grammar</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="postType"
                    value="tips"
                    checked={postType === "tips"}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Tips</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="postType"
                    value="vocabulary"
                    checked={postType === "vocabulary"}
                    onChange={(e) => setPostType(e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Vocabulary</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Danh mục
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="ielts">IELTS</option>
                  <option value="toefl">TOEFL</option>
                  <option value="cambridge">Cambridge</option>
                  <option value="general">General English</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* URL Slug */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug-bai-viet"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL: /blog/{slug || "url-slug"}
              </p>
            </div>
          </div>

          {/* Thumbnail Upload Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ảnh đại diện</h3>

            {thumbnail ? (
              <div className="relative">
                <img
                  src={thumbnail}
                  alt="Thumbnail preview"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  onClick={() => setThumbnail(null)}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Kéo thả ảnh vào đây
                  </p>
                  <p className="text-xs text-gray-500">hoặc nhấp để chọn ảnh</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                />
              </label>
            )}

            <p className="text-xs text-gray-500 mt-2">
              Kích thước đề xuất: 1200x630px
            </p>
          </div>

          {/* SEO Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">SEO</h3>

            {/* Meta Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mô tả meta
              </label>
              <textarea
                placeholder="Mô tả ngắn gọn về bài viết..."
                maxLength={160}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 160 ký tự</p>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Từ khóa
              </label>
              <input
                type="text"
                placeholder="grammar, english, tips..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}