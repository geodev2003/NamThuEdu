import { Link, useParams } from "react-router";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Share2,
  Eye,
  Heart,
  Calendar,
  User,
  Tag,
} from "lucide-react";

export function PostDetail() {
  const { postId } = useParams();

  // Mock data
  const post = {
    id: postId,
    title: "10 Common Grammar Mistakes and How to Fix Them",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200",
    type: "grammar",
    category: "English Grammar",
    status: "active",
    author: {
      name: "Nguyễn Văn An",
      avatar: "NA",
    },
    publishedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    views: 1245,
    likes: 89,
    content: `
      <h2>Introduction</h2>
      <p>Grammar mistakes are common among English learners, but with practice and awareness, you can avoid them. In this article, we'll explore 10 of the most frequent grammar errors and provide clear solutions.</p>

      <h2>1. Subject-Verb Agreement</h2>
      <p>One of the most common mistakes is failing to match the subject with the correct verb form. Remember that singular subjects take singular verbs, and plural subjects take plural verbs.</p>
      <p><strong>Wrong:</strong> The group of students were late.</p>
      <p><strong>Correct:</strong> The group of students was late.</p>

      <h2>2. Misusing Apostrophes</h2>
      <p>Apostrophes are often misused, especially with possessives and contractions.</p>
      <p><strong>Wrong:</strong> Its' a beautiful day.</p>
      <p><strong>Correct:</strong> It's a beautiful day. (It is)</p>

      <h2>3. Confusing Their, There, and They're</h2>
      <p>These three words sound the same but have different meanings and uses.</p>
      <ul>
        <li><strong>Their:</strong> Possessive pronoun (their book)</li>
        <li><strong>There:</strong> Location or existence (over there, there is)</li>
        <li><strong>They're:</strong> Contraction of "they are"</li>
      </ul>

      <h2>Conclusion</h2>
      <p>By being aware of these common mistakes and practicing regularly, you can significantly improve your English grammar. Remember, practice makes perfect!</p>
    `,
    tags: ["Grammar", "English Tips", "Common Mistakes", "Language Learning"],
  };

  const relatedPosts = [
    {
      id: "2",
      title: "Essential IELTS Vocabulary for Academic Writing",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    },
    {
      id: "3",
      title: "Study Tips for Cambridge KET Exam Success",
      thumbnail: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400",
    },
  ];

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { text: string; color: string }> = {
      grammar: { text: "Grammar", color: "bg-blue-100 text-blue-700" },
      tips: { text: "Tips", color: "bg-purple-100 text-purple-700" },
      vocabulary: { text: "Vocabulary", color: "bg-green-100 text-green-700" },
    };
    return badges[type];
  };

  const typeBadge = getTypeBadge(post.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      {/* Header with Actions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/giao-vien/bai-viet"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to={`/giao-vien/bai-viet/${post.id}/chinh-sua`}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all flex items-center gap-2 font-semibold"
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Link>
            <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all flex items-center gap-2 font-semibold">
              <Trash2 className="w-4 h-4" />
              Xóa
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all flex items-center gap-2 font-semibold">
              <Share2 className="w-4 h-4" />
              Chia sẻ
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto">
        {/* Post Metadata */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-6">
          {/* Badges */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${typeBadge.color}`}>
              {typeBadge.text}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold">
              {post.category}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
              Hoạt động
            </span>
          </div>

          {/* Author & Date */}
          <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {post.author.avatar}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-xs">Tác giả</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {post.publishedDate.toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views.toLocaleString()} lượt xem</span>
            </div>

            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{post.likes} lượt thích</span>
            </div>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden mb-6">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Post Title */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
        </div>

        {/* Post Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 mb-6">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#374151",
            }}
          />
        </div>

        {/* Tags */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Thẻ
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-all cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Related Posts */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Bài viết liên quan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/giao-vien/bai-viet/${relatedPost.id}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                  <img
                    src={relatedPost.thumbnail}
                    alt={relatedPost.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedPost.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}