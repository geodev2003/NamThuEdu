import { api } from './api';

// Types
export interface CreateBlogDto {
  blogName: string;
  blogContent: string;
  blogType: 'grammar' | 'tips' | 'vocabulary' | 'teaching' | 'news';
  blogCategory: number;
  blogUrl?: string;
  blogThumbnail?: string;
  blogStatus: 'draft' | 'pending'; // Teacher: draft hoặc pending
}

export interface UpdateBlogDto extends Partial<CreateBlogDto> {}

export interface BlogFilters {
  status?: 'draft' | 'pending' | 'active' | 'inactive';
  type?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface Blog {
  pId: number;
  pTitle: string;
  pContent: string;
  pType: string;
  pCategory: number;
  pUrl: string;
  pThumbnail: string;
  pAuthor_id: number;
  pStatus: string;
  pView: number;
  pLike: number;
  pApproved_by?: number;
  pApproved_at?: string;
  pRejected_by?: number;
  pRejected_at?: string;
  pReject_reason?: string;
  pCreated_at: string;
  author?: {
    uId: number;
    uName: string;
    uRole: string;
  };
  category?: {
    caId: number;
    caName: string;
  };
}

// Teacher Blog APIs
export const teacherBlogApi = {
  getMyBlogs: (params?: BlogFilters) => api.get('/teacher/blogs', { params }),
  createBlog: (data: CreateBlogDto) => api.post('/teacher/blogs', data),
  getBlogDetail: (id: number) => api.get(`/teacher/blogs/${id}`),
  updateBlog: (id: number, data: UpdateBlogDto) => api.put(`/teacher/blogs/${id}`, data),
  deleteBlog: (id: number) => api.delete(`/teacher/blogs/${id}`),
  submitForReview: (id: number) => api.put(`/teacher/blogs/${id}`, { blogStatus: 'pending' }),
};

// Category APIs (nếu cần)
export const categoryApi = {
  getCategories: () => api.get('/categories'), // Giả sử có API này
};

// Blog Types APIs
export interface BlogType {
  id: number;
  type_value: string;
  type_label: string;
  type_icon: string;
  is_default: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogTypeDto {
  type_value: string;
  type_label: string;
  type_icon?: string;
}

export const blogTypeApi = {
  getBlogTypes: () => api.get<{ status: string; data: BlogType[] }>('/teacher/blog-types'),
  createBlogType: (data: CreateBlogTypeDto) => api.post<{ status: string; data: BlogType; message: string }>('/teacher/blog-types', data),
};
