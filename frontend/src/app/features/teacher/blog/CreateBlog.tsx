import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useBlog } from '../../../../hooks/useBlog';
import { generateSlug } from '../../../../utils/slugUtils';
import { useToast } from '../../../../hooks/useToast';

export function CreateBlog() {
  const navigate = useNavigate();
  const { createBlog, loading } = useBlog();
  const toast = useToast();
  const showToast = (msg: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => toast[type](msg);
  
  const [formData, setFormData] = useState({
    blogName: '',
    blogContent: '',
    blogType: 'teaching' as 'grammar' | 'tips' | 'vocabulary' | 'teaching' | 'news',
    blogCategory: 1,
    blogUrl: '',
    blogThumbnail: '',
  });
  
  // Auto-generate slug from title
  useEffect(() => {
    if (formData.blogName) {
      setFormData(prev => ({
        ...prev,
        blogUrl: generateSlug(prev.blogName)
      }));
    }
  }, [formData.blogName]);
  
  const handleSubmit = async (status: 'draft' | 'pending') => {
    // Validation
    if (!formData.blogName.trim()) {
      showToast('Vui lòng nhập tiêu đề bài viết', 'error');
      return;
    }
    
    if (!formData.blogContent.trim() || formData.blogContent === '<p><br></p>') {
      showToast('Vui lòng nhập nội dung bài viết', 'error');
      return;
    }
    
    try {
      await createBlog({
        ...formData,
        blogStatus: status
      });
      
      showToast(
        status === 'draft'
          ? 'Lưu nháp thành công'
          : 'Gửi bài viết duyệt thành công',
        'success'
      );
      
      navigate('/giao-vien/bai-viet');
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };
  
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tạo bài viết mới ✍️</h1>
            <p className="mt-1 text-sm text-gray-600">
              Tạo bài viết mới và gửi duyệt để hiển thị công khai
            </p>
          </div>
          <button
            onClick={() => navigate('/giao-vien/bai-viet')}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            ← Quay lại
          </button>
        </div>
        
        {/* Form */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {/* Title */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tiêu đề bài viết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.blogName}
              onChange={(e) => setFormData({ ...formData, blogName: e.target.value })}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          
          {/* URL Slug */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              URL Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">namthuedu.vn/bai-viet/</span>
              <input
                type="text"
                value={formData.blogUrl}
                onChange={(e) => setFormData({ ...formData, blogUrl: e.target.value })}
                placeholder="url-slug-bai-viet"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              URL tự động tạo từ tiêu đề, bạn có thể chỉnh sửa
            </p>
          </div>
          
          {/* Type & Category */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Loại bài viết <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.blogType}
                onChange={(e) => setFormData({ ...formData, blogType: e.target.value as any })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value="grammar">Grammar</option>
                <option value="tips">Tips</option>
                <option value="vocabulary">Vocabulary</option>
                <option value="teaching">Teaching</option>
                <option value="news">News</option>
              </select>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Danh mục
              </label>
              <select
                value={formData.blogCategory}
                onChange={(e) => setFormData({ ...formData, blogCategory: parseInt(e.target.value) })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              >
                <option value={1}>Chung</option>
                {/* TODO: Load categories from API */}
              </select>
            </div>
          </div>
          
          {/* Thumbnail URL */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ảnh đại diện (URL)
            </label>
            <input
              type="text"
              value={formData.blogThumbnail}
              onChange={(e) => setFormData({ ...formData, blogThumbnail: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            {formData.blogThumbnail && (
              <div className="mt-3">
                <img
                  src={formData.blogThumbnail}
                  alt="Preview"
                  className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Content Editor */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Nội dung bài viết <span className="text-red-500">*</span>
            </label>
            <div className="rounded-lg border border-gray-300">
              <ReactQuill
                theme="snow"
                value={formData.blogContent}
                onChange={(content) => setFormData({ ...formData, blogContent: content })}
                modules={modules}
                className="min-h-[400px]"
                placeholder="Bắt đầu viết nội dung của bạn..."
              />
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
            <button
              onClick={() => navigate('/giao-vien/bai-viet')}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            
            <button
              onClick={() => handleSubmit('draft')}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Đang lưu...' : '💾 Lưu nháp'}
            </button>
            
            <button
              onClick={() => handleSubmit('pending')}
              disabled={loading}
              className="rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
            >
              {loading ? 'Đang gửi...' : '📤 Gửi duyệt'}
            </button>
          </div>
        </div>
        
        {/* Info Box */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-medium text-blue-900">Lưu ý khi tạo bài viết</h3>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• <strong>Lưu nháp:</strong> Bài viết sẽ được lưu và bạn có thể chỉnh sửa sau</li>
                <li>• <strong>Gửi duyệt:</strong> Bài viết sẽ được gửi đến Admin để duyệt trước khi hiển thị công khai</li>
                <li>• Bạn sẽ nhận được thông báo khi bài viết được duyệt hoặc từ chối</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
