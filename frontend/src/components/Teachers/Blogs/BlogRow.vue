<template>
    <tr class="blog-row">
        <td class="col-thumb">
            <div class="blog-thumbnail-wrapper">
                <img :src="blog.thumbnail || 'https://via.placeholder.com/150'" :alt="blog.name" />
            </div>
        </td>

        <td class="col-name">
            <div class="blog-name-content">
                <span class="blog-title" :title="blog.name">{{ blog.name }}</span>
            </div>
        </td>

        <td class="col-type">
            <span class="category-badge" :class="getTypeClass(blog.type)">{{ blog.type }}</span>
        </td>

        <td class="col-category">
            <span class="category-badge" :class="getCategoryClass(blog.category)">{{ blog.category }}</span>
        </td>

        <td class="col-author text-center">
            <span><b>{{ blog.author }}</b></span>
        </td>

        <td class="col-date text-center">
            <span>{{ formatDate(blog.createAt) }}</span>
        </td>

        <td class="col-status text-center">
            <span class="status-badge" :class="getStatusClass(blog.status)">
                {{ blog.status }}
            </span>
        </td>

        <td class="col-action text-center">
            <div class="action-buttons">
                <button class="btn-action btn-edit" @click="viewBlogDetail" title="View Details">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action btn-delete" @click="deleteBlog" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { useToast } from 'vue-toastification';
import http from '@/api/http';
import Swal from 'sweetalert2';

const props = defineProps({
    blog: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['blog-deleted', 'view-detail'])

const toast = useToast();

const getStatusClass = (status) => {
    const classes = {
        'Active': 'status-active',
        'Draft': 'status-draft',
        'InActive': 'status-inactive'
    };
    return classes[status] || 'status-default';
}

// 1. Hàm lấy class cho TYPE (Grammar, Tips...)
const getTypeClass = (type) => {
    const map = {
        'grammar': 'badge-grammar',
        'tips': 'badge-tips',
        'vocabulary': 'badge-vocab'
    };
    return map[type?.toLowerCase()] || 'badge-default';
}

// 2. Hàm lấy class cho CATEGORY (TOEIC, IELTS...)
const getCategoryClass = (category) => {
    const map = {
        'toeic': 'badge-toeic',
        'vstep': 'badge-vstep',
        'ielts': 'badge-ielts'
    };
    return map[category?.toLowerCase()] || 'badge-default';
}
const formatDate = (dateInput) => {
    // Đảm bảo đầu vào là đối tượng Date
    const date = new Date(dateInput);

    // Kiểm tra nếu ngày không hợp lệ
    if (isNaN(date.getTime())) return "Invalid Date";

    // Hàm phụ để thêm số 0 vào trước nếu số nhỏ hơn 10 (ví dụ: 9 -> 09)
    const pad = (num) => String(num).padStart(2, '0');

    // Lấy các thành phần thời gian
    const h = pad(date.getHours());
    const m = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    // Lấy các thành phần ngày tháng
    const dd = pad(date.getDate());
    const mm = pad(date.getMonth() + 1); // Lưu ý: Tháng trong JS bắt đầu từ 0
    const yyyy = date.getFullYear();

    // Trả về chuỗi định dạng
    return `${h}:${m}:${s} ${dd}/${mm}/${yyyy}`;
}

// Open detail modal
const viewBlogDetail = () => {
    emit('view-detail', props.blog.id);
}

const deleteBlog = async () => {
    Swal.fire({
        title: 'Are you sure?',
        text: `Course "${props.blog.name}" will be permanently deleted!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await http.delete(`/api/teacher/blogs/${props.blog.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (res.data.code === 'SUCCESS') {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Blog has been deleted.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    emit('blog-deleted');
                }
            } catch (error) {
                toast.error("Failed to delete. Please try again.");
                console.error(error);
            }
        }
    });
}
</script>

<style scoped>
/* --- 1. CẤU HÌNH CỘT (QUAN TRỌNG) --- */
.col-thumb {
    width: 140px;
    min-width: 100px;
}

/* Cố định pixel cho ảnh */
.col-name {
    width: 25%;
    min-width: 200px;
}

/* Co giãn, nhưng không nhỏ hơn 200px */
.col-type {
    width: 8%;
}

.col-category {
    width: 8%;
}

.col-author {
    width: 12%;
}

.col-date {
    width: 8%;
    min-width: 80px;
}

/* Đủ rộng để ngày tháng ko nhảy dòng */
.col-status {
    width: 8%;
}

.col-action {
    width: 100px;
    min-width: 80px;
}

/* --- 2. CSS CHO CÁC THÀNH PHẦN BÊN TRONG --- */

.blog-row {
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.15s;
}

.blog-row:hover {
    background-color: #f9fafb;
}

.blog-row td {
    padding: 12px 8px;
    /* Padding vừa phải */
    font-size: 14px;
    color: #374151;
    vertical-align: middle;
    /* Căn giữa theo chiều dọc */
}

/* Thumbnail Image */
.blog-thumbnail-wrapper {
    width: 140px;
    height: 70px;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
}

.blog-thumbnail-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

/* Blog Name - Xử lý văn bản quá dài */
.blog-name-content {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    /* Giới hạn 2 dòng */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
}

.blog-title {
    font-weight: 600;
    color: #111827;
}

/* Date Column */
.col-date span {
    font-size: 13px;
    color: #6b7280;
    white-space: nowrap;
    /* Ngăn ngày giờ bị ngắt dòng xấu */
}

/* --- 1. BASE BADGE STYLE (Cấu trúc chung) --- */
.badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;      /* Khoảng cách nội dung */
    border-radius: 6px;     /* Bo góc mềm mại */
    font-size: 11px;
    font-weight: 700;       /* Chữ đậm */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    border: 1px solid transparent; /* Khai báo viền để tránh layout shift */
    line-height: 1;
    min-width: 60px;        /* Độ rộng tối thiểu cho đều */
}

/* --- 2. TYPE COLORS (Màu cho cột Type) --- */

/* Grammar: Màu Tím Indigo (Tri thức) */
.badge-grammar {
    background-color: #e0e7ff; /* Nền nhạt */
    color: #4338ca;            /* Chữ đậm */
    border-color: #c7d2fe;     /* Viền trung bình */
}

/* Tips: Màu Xanh Lá (Gợi ý/Helpful) */
.badge-tips {
    background-color: #dcfce7;
    color: #15803d;
    border-color: #86efac;
}

/* Vocabulary: Màu Cam (Nổi bật) */
.badge-vocab {
    background-color: #ffedd5;
    color: #c2410c;
    border-color: #fdba74;
}

/* --- 3. CATEGORY COLORS (Màu cho cột Category) --- */

/* TOEIC: Màu Xanh Dương (Chuẩn mực/Doanh nghiệp) */
.badge-toeic {
    background-color: #dbeafe;
    color: #1e40af;
    border-color: #93c5fd;
}

/* VSTEP: Màu Tím Hồng (Học thuật) */
.badge-vstep {
    background-color: #f3e8ff;
    color: #7e22ce;
    border-color: #d8b4fe;
}

/* IELTS: Màu Đỏ/Hồng Đậm (Quốc tế/Cao cấp) */
.badge-ielts {
    background-color: #fee2e2;
    color: #b91c1c;
    border-color: #fca5a5;
}

/* Default: Màu Xám (Dự phòng) */
.badge-default {
    background-color: #f3f4f6;
    color: #4b5563;
    border-color: #d1d5db;
}

/* --- Các CSS cũ của bảng giữ nguyên --- */
.blog-row td { padding: 12px 8px; vertical-align: middle; }

/* Status Badge */
.status-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    /* Bo tròn kiểu viên thuốc đẹp hơn */
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
}

/* Các class màu sắc Badge cũ giữ nguyên... */
.status-active {
    background-color: #d1fae5;
    color: #065f46;
}

.status-draft {
    background-color: #f3f4f6;
    color: #6b7280;
}

.status-inactive {
    background-color: #fee2e2;
    color: #991b1b;
}

.category-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.btn-action {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    color: white;
}

/* Các màu nút giữ nguyên... */
.btn-edit {
    background-color: #3b82f6;
}

.btn-edit:hover {
    background-color: #2563eb;
}

.btn-delete {
    background-color: #ef4444;
}

.btn-delete:hover {
    background-color: #dc2626;
}
</style>