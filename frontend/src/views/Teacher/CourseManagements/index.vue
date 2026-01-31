<!-- src/views/Teacher/CourseManagements/index.vue -->
<template>
    <div class="course-management">

        <div class="course-management">
            <div class="action-section">
                <button class="btn-primary" @click="openModal">
                    <i class="bi bi-plus-circle"></i>
                    Create New Course
                </button>
                <button class="btn-secondary">
                    <i class="bi bi-file-earmark-plus"></i>
                    Create Register Form
                </button>
                <button class="btn-secondary">
                    <i class="bi bi-file-earmark-arrow-up"></i>
                    Import Course
                </button>
                <button class="btn-secondary">
                    <i class="bi bi-download"></i>
                    Export Data
                </button>
            </div>

            <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Create New Course</h3>
                        <button class="btn-close" @click="closeModal"><i class="bi bi-x-lg"></i></button>
                    </div>

                    <form @submit.prevent="handleCreateNewCourse" class="create-form">
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Course Name</label>
                                <input type="text" v-model="form.courseName" placeholder="Ví dụ: TOEIC 650+" required />
                            </div>

                            <div class="form-group">
                                <label>Category</label>
                                <select v-model="form.category" required>
                                    <option value="" disabled>Select category</option>
                                    <option v-for="cat in categories" :key="cat.caId || cat.id"
                                        :value="cat.caId || cat.id">
                                        {{ cat.caName || cat.name }}
                                    </option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Students Limit</label>
                                <input type="number" v-model="form.numberOfStudent" min="1" required />
                            </div>

                            <div class="form-group">
                                <label>Duration (weeks)</label>
                                <input type="number" v-model="form.duration" min="1" required />
                            </div>

                            <div class="form-group">
                                <label>Time(e.g: 18h00)</label>
                                <input type="text" v-model="form.time" placeholder="Nhập thời gian học trong ngày"
                                    required />
                            </div>

                            <div class="form-group">
                                <label>Schedule (e.g., 2,4,6)</label>
                                <input type="text" v-model="form.schedule"
                                    placeholder="Nhập các thứ trong tuần cách nhau bằng dấu phẩy" required />
                            </div>

                            <div class="form-group">
                                <label>Start Date</label>
                                <input type="date" v-model="form.startDate" required />
                            </div>

                            <div class="form-group">
                                <label>End Date</label>
                                <input type="date" v-model="form.endDate" required />
                            </div>

                            <div class="form-group full-width">
                                <label>Description</label>
                                <div id="summernote"></div>
                            </div>  
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
                            <button type="submit" class="btn-save" :disabled="submitting">
                                <span v-if="submitting">Saving...</span>
                                <span v-else>Save</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>


        </div>

        <!-- Course List -->
        <div class="course-table-section">
            <div class="table-header">
                <h2>Your Courses</h2>
                <div class="table-controls">
                    <div class="search-box">
                        <i class="bi bi-search"></i>
                        <input type="text" placeholder="Search courses..." />
                    </div>
                    <select class="filter-select">
                        <option>All Categories</option>
                        <option>TOEIC</option>
                        <option>VSTEP</option>
                        <option>IELTS</option>
                    </select>
                </div>
            </div>

            <div class="table-wrapper">
                <table class="course-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Category</th>
                            <th>Students</th>
                            <th>Duration</th>
                            <th>Schedule</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Loading -->
                        <tr v-if="loading">
                            <td colspan="9" class="loading-cell">
                                <div class="spinner"></div>
                                Loading courses...
                            </td>
                        </tr>

                        <!-- Có data -->
                        <template v-else-if="courseList.length > 0">
                            <CourseRow v-for="course in courseList" :key="course.id" :course="course" @course-deleted="fetchCourses" />
                        </template>

                        <!-- Không có data -->
                        <tr v-else>
                            <td colspan="9" class="no-data">
                                <i class="bi bi-inbox"></i>
                                <p>No courses available</p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Pagination v-if="courseList.length > 0" />
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, onBeforeUnmount } from 'vue'
import CourseRow from '../../../components/Teachers/CourseManagement/CourseRow.vue'
import Pagination from '../../../components/Teachers/Pagination/pagination.vue'
import http from '@/api/http.js';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2'; // Import thư viện SweetAlert2
const toast = useToast();

const courseList = ref([])
const loading = ref(false)
const submitting = ref(false)
const isModalOpen = ref(false)

const fetchCourses = async () => {
    if (loading.value) return;

    try {
        loading.value = true;
        const res = await http.get('/api/teacher/courses', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (res.data && res.data.code === 'SUCCESS') {
            courseList.value = res.data.data;
        } else {
            courseList.value = [];
        }

    } catch (e) {
        courseList.value = [];
        console.error("Lỗi xác thực hoặc API:", e);
    } finally {
        loading.value = false;
    }
}

const initialForm = {
    courseName: '',
    category: 1,
    duration: 12,
    numberOfStudent: 30,
    time: '',
    schedule: '',
    startDate: '',
    endDate: '',
    description: ''
}

const form = reactive({ ...initialForm })

// Hàm tự động tính toán End Date
const updateEndDate = () => {
    if (form.startDate && form.duration) {
        const start = new Date(form.startDate);
        // Cộng thêm (số tuần * 7 ngày) vào ngày bắt đầu
        const end = new Date(start.getTime() + form.duration * 7 * 24 * 60 * 60 * 1000);
        
        // Định dạng lại thành YYYY-MM-DD để hiển thị lên input date
        form.endDate = end.toISOString().split('T')[0];
    }
}

// Theo dõi sự thay đổi để cập nhật End Date ngay lập tức
watch(() => form.startDate, updateEndDate);
watch(() => form.duration, updateEndDate);

const categories = ref([]);
// Lấy danh sách danh mục
const loadCategories = async () => {
    try {
        const res = await http.get('/api/teacher/categories'); // Giả định API này tồn tại
        console.log(res);
        if (res.data && res.data.code === 'SUCCESS') {
            categories.value = res.data.data;
        }
    } catch (e) {
        console.error("Lỗi khi lấy danh mục:", e);
    }
}

// Hàm gửi dữ liệu (Loại bỏ duration trước khi gửi)
const handleCreateNewCourse = async () => {
    submitting.value = true;
    try {
        // Tách duration ra, chỉ lấy các trường còn lại để gửi đi
        const { duration, ...payload } = form; 
        
        const res = await http.post('/api/teacher/courses', payload);
        if (res.data && res.data.code === 'SUCCESS') {
            Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Khóa học mới đã được tạo.',
                timer: 1500,
                showConfirmButton: false
            });
            closeModal();
            fetchCourses();
        }
    } catch (e) {
       toast.error("Lỗi khi tạo khóa học.");
    } finally {
        submitting.value = false;
    }
}

onMounted(() => {
    fetchCourses();
    loadCategories();


    // Khởi tạo Summernote sử dụng jQuery
    // @ts-ignore
    $('#summernote').summernote({
        placeholder: 'Nhập mô tả khóa học chi tiết tại đây...',
        tabsize: 2,
        height: 150,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ],
        callbacks: {
            // Khi nội dung thay đổi, cập nhật vào form.description
            onChange: function(contents) {
                form.description = contents;
            }
        }
    });
})

// Hủy editor khi component bị xóa để tránh rò rỉ bộ nhớ
onBeforeUnmount(() => {
    // @ts-ignore
    $('#summernote').summernote('destroy');
});

// --- LOGIC MODAL & SUMMERNOTE ---
const openModal = () => {
    Object.assign(form, initialForm);
    isModalOpen.value = true;
    
    // Khởi tạo Summernote sau khi DOM của modal được render
    setTimeout(() => {
        $('#summernote').summernote({
            placeholder: 'Mô tả khóa học...',
            height: 150,
            callbacks: {
                onChange: (contents) => { form.description = contents; }
            }
        });
        $('#summernote').summernote('code', '');
    }, 100);
}

const closeModal = () => {
    $('#summernote').summernote('destroy');
    isModalOpen.value = false;
}

</script>

<style scoped>
/* Thêm vào phần style hiện có của bạn */

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* Làm mờ nền */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 700px; /* Độ rộng tối đa của modal */
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    
    /* THÊM CÁC DÒNG DƯỚI ĐÂY */
    max-height: 90vh; /* Giới hạn chiều cao tối đa là 90% chiều cao màn hình */
    display: flex;
    flex-direction: column;
}

.create-form {
    /* THÊM DÒNG NÀY */
    overflow-y: auto; /* Cho phép cuộn dọc nội dung form */
    padding-right: 2px; /* Tránh nội dung bị đè bởi thanh cuộn */
}

/* Tùy chỉnh thanh cuộn cho đẹp hơn (tùy chọn) */
.create-form::-webkit-scrollbar {
    width: 0px;
}

.create-form::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 12px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #9ca3af;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

/* Trong thẻ <style scoped> */
.full-width {
    grid-column: span 2;
}

/* Đảm bảo toolbar của Summernote không bị ảnh hưởng bởi styles của form */
:deep(.note-editor) {
    margin-top: 5px;
    border-radius: 8px;
    border: 1px solid #d1d5db !important;
}

:deep(.note-toolbar) {
    background-color: #f9fafb !important;
    border-bottom: 1px solid #d1d5db !important;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
}

.form-group input,
.form-group select {
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #111827;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
}

.btn-cancel {
    padding: 10px 20px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    color: #000;
}

.btn-cancel:hover {
    background: #f9fafb;
}

.btn-save {
    padding: 10px 20px;
    background: #111827;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
}

.btn-save:hover {
    background: #1f2937;
}

.btn-save:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}


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

/* Course Table Section */
.course-table-section {
    background: white;
    border-radius: 8px;
    padding: 24px;
    border: 1px solid #e5e7eb;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e5e7eb;
    flex-wrap: wrap;
    gap: 16px;
}

.table-header h2 {
    font-size: 18px;
    color: #111827;
    margin: 0;
    font-weight: 600;
}

.table-controls {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-box {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 8px 12px;
    gap: 8px;
    transition: border-color 0.2s;
}

.search-box:focus-within {
    border-color: #6b7280;
}

.search-box i {
    color: #9ca3af;
    font-size: 14px;
}

.search-box input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #111827;
    width: 200px;
}

.search-box input::placeholder {
    color: #9ca3af;
}

.filter-select {
    padding: 8px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background-color: white;
    font-size: 14px;
    cursor: pointer;
    color: #374151;
    transition: border-color 0.2s;
}

.filter-select:hover {
    border-color: #9ca3af;
}

.filter-select:focus {
    outline: none;
    border-color: #6b7280;
}

/* Table */
.table-wrapper {
    overflow-x: auto;
}

.course-table {
    width: 100%;
    border-collapse: collapse;
}

.course-table thead {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.course-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Loading */
.loading-cell {
    padding: 60px 20px !important;
    text-align: center;
    color: #6b7280;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e5e7eb;
    border-top: 3px solid #6b7280;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 12px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* No Data */
.no-data {
    padding: 60px 20px !important;
    text-align: center;
}

.no-data i {
    font-size: 48px;
    color: #d1d5db;
    margin-bottom: 12px;
    display: block;
}

.no-data p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .stats-grid {
        grid-template-columns: 1fr;
    }

    .table-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .table-controls {
        flex-direction: column;
        width: 100%;
    }

    .search-box,
    .filter-select {
        width: 100%;
    }

    .search-box input {
        width: 100%;
    }

    .course-table-section {
        padding: 20px 16px;
    }

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