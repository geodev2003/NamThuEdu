import { useState } from "react";
import { Link } from "react-router";
import {
  Plus,
  Search,
  ChevronDown,
  Eye,
  Heart,
  FileText,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Grid3x3,
  List,
  Calendar,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  thumbnail: string;
  type: "grammar" | "tips" | "vocabulary";
  category: string;
  status: "active" | "draft" | "rejected";
  author: {
    name: string;
    avatar: string;
  };
  createdDate: Date;
  views: number;
  likes: number;
}

export function BlogList() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const stats = {
    totalPosts: 48,
    activePosts: 35,
    draftPosts: 10,
    rejectedPosts: 3,
    totalViews: 12580,
    totalLikes: 1847,
  };

  const posts: BlogPost[] = [
    {
      id: "1",
      title: "10 Common Grammar Mistakes and How to Fix Them",
      thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
      type: "grammar",
      category: "English Grammar",
      status: "active",
      author: {
        name: "Nguyễn Văn An",
        avatar: "NA",
      },
      createdDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      views: 1245,
      likes: 89,
    },
    {
      id: "2",
      title: "Essential IELTS Vocabulary for Academic Writing",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
      type: "vocabulary",
      category: "IELTS",
      status: "active",
      author: {
        name: "Trần Thị Bình",
        avatar: "TB",
      },
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      views: 892,
      likes: 67,
    },
    {
      id: "3",
      title: "Study Tips for Cambridge KET Exam Success",
      thumbnail: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400",
      type: "tips",
      category: "Cambridge",
      status: "draft",
      author: {
        name: "Lê Hoàng Cường",
        avatar: "LC",
      },
      createdDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      views: 0,
      likes: 0,
    },
  ];

  const getTypeBadge = (type: BlogPost["type"]) => {
    const badges = {
      grammar: { text: "Grammar", color: "bg-blue-100 text-blue-700" },
      tips: { text: "Tips", color: "bg-purple-100 text-purple-700" },
      vocabulary: { text: "Vocabulary", color: "bg-green-100 text-green-700" },
    };
    return badges[type];
  };

  const getStatusBadge = (status: BlogPost["status"]) => {
    const badges = {
      active: { text: "Hoạt động", color: "bg-green-100 text-green-700" },
      draft: { text: "Nháp", color: "bg-gray-100 text-gray-700" },
      rejected: { text: "Bị từ chối", color: "bg-red-100 text-red-700" },
    };
    return badges[status];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "" || post.status === filterStatus;
    const matchType = filterType === "" || post.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý bài viết 📝</h1>
          <Link
            to="/giao-vien/bai-viet/tao-moi"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            Tạo bài viết mới
          </Link>
        </div>
        <p className="text-gray-600">Tạo và quản lý nội dung giáo dục của bạn</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tổng bài viết</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Đang hoạt động</p>
          <p className="text-3xl font-bold text-green-600">{stats.activePosts}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Bản nháp</p>
          <p className="text-3xl font-bold text-gray-600">{stats.draftPosts}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Bị từ chối</p>
          <p className="text-3xl font-bold text-red-600">{stats.rejectedPosts}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Eye className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tổng lượt xem</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-1">Tổng lượt thích</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalLikes.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="draft">Nháp</option>
              <option value="rejected">Bị từ chối</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Filter Type */}
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Tất cả loại</option>
              <option value="grammar">Grammar</option>
              <option value="tips">Tips</option>
              <option value="vocabulary">Vocabulary</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>

          {/* Date Range */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => {
            const typeBadge = getTypeBadge(post.type);
            const statusBadge = getStatusBadge(post.status);

            return (
              <div
                key={post.id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusBadge.color}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Type & Category */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeBadge.color}`}>
                      {typeBadge.text}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>

                  {/* Author */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {post.author.avatar}
                    </div>
                    <div className="text-sm text-gray-600">{post.author.name}</div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(post.createdDate)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/giao-vien/bai-viet/${post.id}`}
                      className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center gap-2 font-semibold text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Xem
                    </Link>
                    <Link
                      to={`/giao-vien/bai-viet/${post.id}/chinh-sua`}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Bài viết
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Loại
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Tác giả
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Lượt xem
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPosts.map((post) => {
                const typeBadge = getTypeBadge(post.type);
                const statusBadge = getStatusBadge(post.status);

                return (
                  <tr key={post.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                          <p className="text-sm text-gray-500">{post.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeBadge.color}`}>
                        {typeBadge.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {post.author.avatar}
                        </div>
                        <span className="text-sm text-gray-700">{post.author.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Eye className="w-4 h-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(post.createdDate)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          to={`/giao-vien/bai-viet/${post.id}`}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/giao-vien/bai-viet/${post.id}/chinh-sua`}
                          className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-600 font-semibold mb-2">Chưa có bài viết nào</p>
          <p className="text-sm text-gray-500 mb-4">Bắt đầu tạo bài viết đầu tiên của bạn</p>
          <Link
            to="/giao-vien/bai-viet/tao-moi"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
          >
            Tạo bài viết mới
          </Link>
        </div>
      )}
    </div>
  );
}