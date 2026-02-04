<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-left">
                    <h3>Blog Details</h3>
                </div>
                <button class="btn-close" @click="handleClose">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div v-if="loading" class="loading-section">
                <div class="spinner"></div>
                <p>Loading blog details...</p>
            </div>

            <div v-else-if="blog" class="modal-body">
                <div class="blog-header-info">
                    <div class="blog-name-section">
                        <h2>{{ blog.name }}</h2>
                        <div class="meta-info">
                            <span class="category-badge" v-if="blog" :class="getTypeClass(blog.type)">
                                {{ blog.type }}
                            </span>
                            <span class="meta-item meta-category" v-if="blog" :class="getCategoryClass(blog.category)">
                                <i class="bi bi-folder"></i> {{ blog.category }}
                            </span>
                            <span class="meta-item meta-author">
                                <i class="bi bi-person"></i> {{ blog.author }}
                            </span>
                        </div>
                        <div class="meta-info">
                            <span class="info-value">
                                <i class="bi bi-eye-fill" style="color: #0284c7;"></i> {{ blog.view || 0 }}
                            </span>
                            <span class="info-value">
                                <i class="bi bi-heart-fill" style="color: #dc2626;"></i> {{ blog.like || 0 }}
                            </span>
                            <span class="info-value">
                                <i class="bi bi-calendar-check-fill" style="color: #16a34a;"></i> {{ formatDate(blog.createdAt) }}
                            </span>
                            
                        </div>
                    </div>

                    <span class="status-badge" :class="getStatusClass(blog.status)">
                        {{ blog.status }}
                    </span>
                </div>

                <div class="thumbnail-section" v-if="blog.thumbnail">
                    <h4>Thumbnail</h4>
                    <img :src="blog.thumbnail" alt="Blog Thumbnail" class="detail-thumbnail"
                        @error="$event.target.style.display = 'none'" />
                </div>

                <div class="description-section">
                    <h4>
                        <i class="bi bi-file-text"></i>
                        Content
                    </h4>
                    <div class="description-content" v-html="blog.content || 'No content available'"></div>
                </div>
            </div>

            <div v-else class="error-section">
                <i class="bi bi-exclamation-triangle"></i>
                <p>Failed to load blog details</p>
            </div>

            <div class="modal-footer" v-if="!loading && blog">
                <button class="btn-secondary" @click="handleClose">
                    <i class="bi bi-x-circle"></i>
                    Close
                </button>
                <button class="btn-edit" @click="handleEdit">
                    <i class="bi bi-pencil"></i>
                    Edit Blog
                </button>
                <button class="btn-danger" @click="handleDelete">
                    <i class="bi bi-trash"></i>
                    Delete Blog
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import http from '@/api/http.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    blogId: {
        type: [Number, String], // Chấp nhận cả số và chuỗi
        default: null
    }
})

const emit = defineEmits(['close', 'edit', 'delete', 'refresh'])
const toast = useToast()

// State
const loading = ref(false)
const blog = ref(null)

// Fetch blog details
const fetchBlogDetail = async () => {
    if (!props.blogId) return

    loading.value = true
    try {
        const res = await http.get(`/api/teacher/blogs/${props.blogId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (res.data && res.data.code === 'SUCCESS') {
            blog.value = res.data.data
        } else {
            blog.value = null
            toast.error('Failed to load blog details')
        }
    } catch (error) {
        console.error('Error fetching blog:', error)
        blog.value = null
        toast.error('Error loading blog details')
    } finally {
        loading.value = false
    }
}

// Watchers: SỬA LỖI props.courseId -> props.blogId
watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.blogId) {
        fetchBlogDetail()
    } else {
        blog.value = null
    }
})

watch(() => props.blogId, (newId) => {
    if (props.isOpen && newId) {
        fetchBlogDetail()
    }
})

// Helper functions
const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}

const getTypeClass = (type) => {
    const classes = {
        'grammar': 'type-grammar',
        'tips': 'type-tips',
        'vocabulary': 'type-vocabulary'
    }
    // Handle case sensitivity
    return classes[type?.toLowerCase()] || 'type-default'
}

const getCategoryClass = (category) => {
    const classes = {
        'ielts': 'meta-ielts',
        'toeic': 'meta-toeic',
        'vstep': 'meta-vstep'
    }
    // SỬA LỖI: Đổi 'type' thành 'category'
    return classes[category?.toLowerCase()] || 'type-default' 
}

const getStatusClass = (status) => {
    const classes = {
        'Active': 'status-active',
        'Draft': 'status-draft',
        'Inactive': 'status-inactive'
    }
    return classes[status] || 'status-default'
}

// Event handlers
const handleClose = () => {
    emit('close')
}

const handleEdit = () => {
    emit('close');
    emit('edit', blog.value);
}

const handleDelete = async () => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Blog "${blog.value.name}" will be permanently deleted!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            const res = await http.delete(`/api/teacher/blogs/${blog.value.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (res.data.code === 'SUCCESS') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Blog has been deleted.',
                    timer: 1500,
                    showConfirmButton: false
                })

                emit('delete', blog.value.id)
                emit('refresh')
                handleClose()
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete blog')
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 900px;
    border-radius: 12px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.meta-info {
    display: flex;
    gap: 15px;
    color: #6b7280;
    font-size: 14px;
    margin-top: 5px;
}

.meta-item i {
    margin-right: 4px;
}

/* Tìm class .meta-ielts và bổ sung thêm các dòng dưới */
.meta-ielts {
    color: #b45309;
    background-color: #fef3c7;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
}

.meta-toeic {
    color: #1e40af;
    background-color: #dbeafe;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
}

.meta-vstep {
    color: #7c3aed;
    background-color: #ede9fe;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
}

.meta-author {
    color: #faf6fb;
    background-color: #817f8e;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
}

/* Thumbnail Styling */
.thumbnail-section {
    margin-bottom: 20px;
    padding: 15px;
    background: #f9fafb;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

.thumbnail-section h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 14px;
    color: #374151;
}

.detail-thumbnail {
    max-width: 100%;
    max-height: 300px;
    border-radius: 6px;
    object-fit: contain;
}

/* Các class Type color */
.type-grammar {
    background-color: #e0e7ff;
    color: #4338ca;
}

.type-tips {
    background-color: #dcfce7;
    color: #15803d;
}

.type-vocabulary {
    background-color: #ffedd5;
    color: #c2410c;
}

.type-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 900px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
}

.blog-id {
    font-size: 13px;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #9ca3af;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.btn-close:hover {
    color: #111827;
    background-color: #f3f4f6;
}

/* Body */
.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
}

/* Course Header Info */
.blog-header-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f3f4f6;
    gap: 20px; /* Tạo khoảng cách an toàn với Status Badge */
}

.blog-name-section {
    /* Thay đổi display thành Grid để chia cột */
    display: grid; 
    grid-template-columns: 1fr auto; /* Cột trái tự giãn, Cột phải vừa nội dung */
    row-gap: 12px; /* Khoảng cách giữa Tiêu đề và dòng Meta */
    flex: 1; /* Chiếm toàn bộ không gian còn lại (đẩy Status sang phải) */
}

.blog-name-section h2 {
    grid-column: 1 / -1; /* Tiêu đề trải dài hết cả 2 cột */
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    line-height: 1.3;
}

/* Class chung cho cả 2 meta-info */
.meta-info {
    display: flex;
    gap: 15px;
    color: #6b7280;
    font-size: 14px;
    align-items: center;
    flex-wrap: wrap; /* Cho phép xuống dòng nếu màn hình nhỏ */
}

/* Selector chọn thẻ meta-info thứ 2 (View/Like/Date) */
.blog-name-section .meta-info:nth-of-type(2) {
    justify-self: end; /* Đẩy toàn bộ khối này sang bên phải */
    text-align: right;
}

/* Category Badge */
.category-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    width: fit-content;
}

.category-badge i {
    font-size: 12px;
}

.category-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

.category-toeic {
    background-color: #dbeafe;
    color: #1e40af;
}

.category-vstep {
    background-color: #ede9fe;
    color: #7c3aed;
}

.category-ielts {
    background-color: #fef3c7;
    color: #b45309;
}

/* Status Badge */
.status-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.status-active {
    background-color: #d1fae5;
    color: #065f46;
}

.status-draft {
    background-color: #f3f4f6;
    color: #6b7280;
}

.status-completed {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-ongoing {
    background-color: #fed7aa;
    color: #92400e;
}

.status-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

/* Info Grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.info-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
}

.info-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.info-icon i {
    font-size: 22px;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.info-value {
    font-size: 16px;
    color: #111827;
    font-weight: 700;
}

/* Description Section */
.description-section {
    margin-bottom: 24px;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.description-section h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
}

.description-section h4 i {
    color: #6b7280;
}

.description-content {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
}

.description-content:deep(p) {
    margin: 0 0 8px 0;
}

.description-content:deep(ul),
.description-content:deep(ol) {
    margin: 8px 0;
    padding-left: 20px;
}

/* Additional Info */
.additional-info {
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.additional-info h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
}

.additional-info h4 i {
    color: #6b7280;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-item {
    display: flex;
    gap: 8px;
    font-size: 14px;
}

.item-label {
    color: #6b7280;
    font-weight: 600;
    min-width: 100px;
}

.item-value {
    color: #111827;
}

/* Loading */
.loading-section {
    padding: 80px 20px;
    text-align: center;
    color: #6b7280;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #6b7280;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-section p {
    font-size: 14px;
}

/* Error */
.error-section {
    padding: 80px 20px;
    text-align: center;
}

.error-section i {
    font-size: 48px;
    color: #ef4444;
    margin-bottom: 12px;
    display: block;
}

.error-section p {
    color: #6b7280;
    font-size: 14px;
}

/* Footer */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

.modal-footer button {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    border: none;
}

.btn-secondary {
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.btn-edit {
    background-color: #111827;
    color: white;
}

.btn-edit:hover {
    background-color: #1f2937;
}

.btn-danger {
    background-color: #dc2626;
    color: white;
}

.btn-danger:hover {
    background-color: #b91c1c;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-height: 95vh;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 16px;
    }

    .blog-header-info {
        flex-direction: column;
        gap: 12px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .modal-footer {
        flex-wrap: wrap;
    }

    .modal-footer button {
        flex: 1;
        min-width: calc(50% - 6px);
        justify-content: center;
    }

    .blog-header-info {
        flex-direction: column;
        gap: 12px;
    }

    .blog-name-section {
        display: flex; /* Quay về flex column trên mobile */
        flex-direction: column;
        gap: 12px;
    }
    
    .blog-name-section .meta-info:nth-of-type(2) {
        justify-self: start; /* Quay về căn trái trên mobile */
        text-align: left;
    }
}
</style>