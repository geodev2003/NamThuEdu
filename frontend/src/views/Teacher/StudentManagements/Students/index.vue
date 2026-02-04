<!-- src/views/Teacher/CourseManagements/index.vue -->
<template>
    <div class="course-management">
        <!-- Action Buttons -->
        <div class="action-section">
            <button class="btn-primary" @click="openModal">
                <i class="bi bi-plus-circle"></i>
                Create New Student
            </button>
            <button class="btn-secondary" @click="isImportModalOpen = true">
                <i class="bi bi-file-earmark-arrow-up"></i> Import Students
            </button>
            <button class="btn-secondary" @click="isExportModalOpen = true">
                <i class="bi bi-download"></i> Export Students
            </button>
            <button class="btn-secondary" @click="isImportModalOpen = true">
                <i class="bi bi-archive"></i> Student Deleted
            </button>
        </div>

                <CreateStudent :isModalOpen="isModalOpen" :form="form" :submitting="submitting"
            @close-modal="closeModal" @create-student="handleCreateNewStudent" />

        <ListStudent :studentList="studentList" :loading="loading" @fetch-students="fetchStudents"
            @edit-student="openEditModal" />


                <EditStudent :is-open="isEditModalOpen" :course-data="seletecdStudent"
            @close="isEditModalOpen = false" @updated="fetchStudents" />

    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/api/http.js';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';
import ListStudent from './ListStudent/ListStudent.vue';
import EditStudent from './EditStudent/EditStudent.vue';

const toast = useToast();

// State
const studentList = ref([])
// const categories = ref([])
const loading = ref(false)
const submitting = ref(false)
const isModalOpen = ref(false)

const isExportModalOpen = ref(false);
const isImportModalOpen = ref(false);


// Form data
const initialForm = {
    studentName: '',
    studentDoB: ''
}

const form = reactive({ ...initialForm })

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// console.log('Token:', token);
// console.log('User:', user);
// console.log('API Response:', res.data);

const fetchStudents = async () => {
    loading.value = true;
    try {
        // Đảm bảo có từ khóa const trước res
        const res = await http.get('/api/teacher/students');
        console.log('API Response:', res.data);
        // Kiểm tra cấu trúc trả về từ Response::success của Backend
        if (res.data && res.data.code === 'SUCCESS') {
            studentList.value = res.data.data;
        } else {
            studentList.value = [];
        }
    } catch (e) {
        console.error("Lỗi fetch khóa học:", e);
        studentList.value = [];
    } finally {
        loading.value = false;
    }
};

// Load categories
// const loadCategories = async () => {
//     try {
//         const res = await http.get('/api/teacher/categories');
//         if (res.data && res.data.code === 'SUCCESS') {
//             categories.value = res.data.data;
//         }
//     } catch (e) {
//         console.error("Lỗi khi lấy danh mục:", e);
//         toast.error("Không thể tải danh mục");
//     }
// }

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
const handleCreateNewStudent = async (formData) => {
    submitting.value = true;
    try {
        // Loại bỏ duration trước khi gửi
        const { duration, ...payload } = formData;

        const res = await http.post('/api/teacher/student', payload, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.data && res.data.code === 'SUCCESS') {
            await Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Học viên mới đã được tạo.',
                timer: 1500,
                showConfirmButton: false
            });

            closeModal();
            await fetchStudents(); // Reload danh sách
        }
    } catch (e) {
        console.error("Lỗi khi tạo khóa học:", e);
        toast.error("Lỗi khi tạo khóa học. Vui lòng thử lại.");
    } finally {
        submitting.value = false;
    }
}

const isEditModalOpen = ref(false);
const seletecdStudent = ref(null);

const openEditModal = (student) => {
    // Mapping đầy đủ các trường (trừ các trường thời gian hệ thống)
    seletecdStudent.value = {
        id: student.id,
        studentName: student.name,
        studentDoB: student.DoB
    };
    isEditModalOpen.value = true; // Hiển thị cửa sổ Edit
};

// Initialize
onMounted(() => {
    fetchStudents();
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