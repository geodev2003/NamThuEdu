<!-- src/views/Teacher/CourseManagements/index.vue -->
<template>
    <div class="course-management">
        <!-- Action Buttons -->
        <div class="action-section">
             <button class="btn-primary" @click="isImportModalOpen = true">
                <i class="bi bi-bar-chart"></i> Scores Dashboard
            </button>
            <button class="btn-secondary" @click="isImportModalOpen = true">
                <i class="bi bi-plus-circle"></i> Create Scores
            </button>
            <button class="btn-secondary" @click="isImportModalOpen = true">
                <i class="bi bi-file-earmark-arrow-up"></i> Import Scores
            </button>
            <button class="btn-secondary" @click="isExportModalOpen = true">
                <i class="bi bi-download"></i> Export Scores
            </button>
        </div>


    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/api/http.js';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const toast = useToast();

// State
const courseList = ref([])
const categories = ref([])
const loading = ref(false)
const submitting = ref(false)
const isModalOpen = ref(false)

const isExportModalOpen = ref(false);
const isImportModalOpen = ref(false);


// Form data
const initialForm = {
    courseName: '',
    category: '',
    duration: 12,
    numberOfStudent: 30,
    time: '',
    schedule: '',
    startDate: '',
    endDate: '',
    description: ''
}

const form = reactive({ ...initialForm })

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// console.log('Token:', token);
// console.log('User:', user);
// console.log('API Response:', res.data);

const fetchCourses = async () => {
    loading.value = true;
    try {
        // Đảm bảo có từ khóa const trước res
        const res = await http.get('/api/teacher/courses');
        
        // Kiểm tra cấu trúc trả về từ Response::success của Backend
        if (res.data && res.data.code === 'SUCCESS') {
            courseList.value = res.data.data;
        } else {
            courseList.value = [];
        }
    } catch (e) {
        console.error("Lỗi fetch khóa học:", e);
        courseList.value = [];
    } finally {
        loading.value = false;
    }
};

// Load categories
const loadCategories = async () => {
    try {
        const res = await http.get('/api/teacher/categories');
        if (res.data && res.data.code === 'SUCCESS') {
            categories.value = res.data.data;
        }
    } catch (e) {
        console.error("Lỗi khi lấy danh mục:", e);
        toast.error("Không thể tải danh mục");
    }
}

// Modal handlers
const openModal = () => {
    // Reset form
    Object.assign(form, initialForm);
    isModalOpen.value = true;
}

const closeModal = () => {
    isModalOpen.value = false;
}

// Create new course
const handleCreateNewCourse = async (formData) => {
    submitting.value = true;
    try {
        // Loại bỏ duration trước khi gửi
        const { duration, ...payload } = formData;

        const res = await http.post('/api/teacher/courses', payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.data && res.data.code === 'SUCCESS') {
            await Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Khóa học mới đã được tạo.',
                timer: 1500,
                showConfirmButton: false
            });

            closeModal();
            await fetchCourses(); // Reload danh sách
        }
    } catch (e) {
        console.error("Lỗi khi tạo khóa học:", e);
        toast.error("Lỗi khi tạo khóa học. Vui lòng thử lại.");
    } finally {
        submitting.value = false;
    }
}

const isEditModalOpen = ref(false);
const selectedCourse = ref(null);

const openEditModal = (course) => {
    // Mapping đầy đủ các trường (trừ các trường thời gian hệ thống)
    selectedCourse.value = {
        id: course.id,
        courseName: course.name,
        category: course.categoryId || course.cCategory, // Đảm bảo lấy ID danh mục
        numberOfStudent: course.numberOfStudent,
        duration: course.duration || 12, // Số tuần để tính toán lại nếu cần
        time: course.time,
        schedule: Array.isArray(course.schedule) ? course.schedule.join(', ') : course.schedule,
        startDate: course.startDate,
        endDate: course.endDate,
        description: course.description
    };
    isEditModalOpen.value = true; // Hiển thị cửa sổ Edit
};

// Initialize
onMounted(() => {
    fetchCourses();
    loadCategories();
});
</script>

<style scoped>
.course-management {
    width: 100%;
}

/* Action Section */
.action-section {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
    padding: 10px 18px;
    border: 1px solid;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}

.btn-primary {
    background-color: #111827;
    color: white;
    border-color: #111827;
}

.btn-primary:hover {
    background-color: #1f2937;
}

.btn-secondary {
    background-color: white;
    color: #374151;
    border-color: #d1d5db;
}

.btn-secondary:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

/* Responsive */
@media (max-width: 768px) {
    .action-section {
        flex-direction: column;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
        justify-content: center;
    }
}
</style>