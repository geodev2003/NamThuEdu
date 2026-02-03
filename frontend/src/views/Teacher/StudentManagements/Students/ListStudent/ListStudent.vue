<template>
    <div class="student-table-section">
        <div class="table-header">
            <h1>Student List</h1>

            <!-- <div class="table-controls">
                <div class="search-box">
                    <i class="bi bi-search"></i>
                    <input type="text" v-model="searchQuery" placeholder="Search courses..." @input="handleSearch" />
                </div>
                <select class="filter-select" v-model="selectedCategory" @change="handleFilter">
                    <option value="">All Categories</option>
                    <option value="TOEIC">TOEIC</option>
                    <option value="VSTEP">VSTEP</option>
                    <option value="IELTS">IELTS</option>
                </select>
            </div> -->

        </div>

        <div class="table-wrapper">
            <table class="student-table">
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Class</th>
                        <th></th>
                        <th></th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Loading -->
                    <tr v-if="loading">
                        <td colspan="9" class="loading-cell">
                            <div class="spinner"></div>
                            Loading students...
                        </td>
                    </tr>

                    <!-- Có data -->
                    <template v-else-if="paginatedStudents.length > 0">
                        <StudentRow v-for="student in paginatedStudents" :key="student.id" :student="student"
                            @student-deleted="handleStudentDeleted" @view-detail="handleViewDetail" />
                    </template>

                    <!-- Không có data -->
                    <tr v-else>
                        <td colspan="9" class="no-data">
                            <i class="bi bi-inbox"></i>
                            <p v-if="searchQuery">
                                No student found matching your criteria
                            </p>
                            <p v-else>No student available</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <!-- <div class="pagination-container" v-if="filteredCourses.length > 0"> -->
            <!-- <div class="pagination-info">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                {{ Math.min(currentPage * itemsPerPage, filteredCourses.length) }}
                of {{ filteredCourses.length }} entries
            </div> -->
            <!-- <div class="per-page-selector">
                <span>Show</span>
                <select v-model.number="itemsPerPage" class="filter-select">
                    <option :value="6">6</option>
                    <option :value="12">12</option>
                    <option :value="24">24</option>
                    <option :value="50">50</option>
                </select>
                <span>entries</span>
            </div> -->
            <!-- <Pagination :total-pages="totalPages" :current-page="currentPage"
                @update:current-page="val => currentPage = val" /> -->
        <!-- </div> -->

        <!-- Course Detail Modal -->
        <!-- <CourseDetail :isOpen="isDetailModalOpen" :courseId="selectedCourseId" @close="handleCloseDetail"
            @edit="handleEditCourse" @delete="handleDeleteCourse" @refresh="handleRefresh" /> -->
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import StudentRow from '@/components/Teachers/StudentManagement/StudentRow.vue'

// import Pagination from '@/components/Common/Pagination.vue'

const props = defineProps({
    studentList: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    // categories: { type: Array, default: () => [] }
})

// const emit = defineEmits(['fetch-courses'])

// Thêm 'edit-course' vào danh sách khai báo emit
const emit = defineEmits(['fetch-students', 'edit-student']) // Cập nhật dòng này

const handleEditStudent = (student) => {
    handleCloseDetail(); // Đóng modal chi tiết trước
    emit('edit-student', student); // Gửi dữ liệu khóa học lên index.vue
}

// Search and filter state
const searchQuery = ref('')
// const selectedCategory = ref('')

// Detail modal state
const isDetailModalOpen = ref(false)
const selectedStudentId = ref(null)

// Phân trang
const currentPage = ref(1)
const itemsPerPage = ref(6) // Mặc định hiển thị 6 course

// Reset về trang 1 khi người dùng search hoặc lọc danh mục
watch([searchQuery, itemsPerPage], () => {
    currentPage.value = 1
})

// Filtered courses
const filteredStudents = computed(() => {
    return props.studentList.filter(student => {
        // 1. Lấy từ khóa tìm kiếm
        const query = searchQuery.value.toLowerCase();

        // 2. Kiểm tra an toàn cho name và phone (sử dụng Optional Chaining ?. và mặc định là chuỗi rỗng)
        const name = (student.name || '').toLowerCase();
        const phone = (student.phone || '').toLowerCase();

        // 3. Thực hiện lọc
        return name.includes(query) || phone.includes(query);
    });
})

// Dữ liệu thực tế hiển thị trên trang hiện tại
const paginatedStudents = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredStudents.value.slice(start, end);
})

// Tính tổng số trang
const totalPages = computed(() => {
    return Math.ceil(filteredStudents.value.length / itemsPerPage.value);
})

const handleStudentDeleted = () => {
    emit('fetch-students')
}

const handleViewDetail = (studentId) => {
    selectedStudentId.value = studentId
    isDetailModalOpen.value = true
}

const handleCloseDetail = () => {
    isDetailModalOpen.value = false
    selectedStudentId.value = null
}

// const handleEditCourse = (course) => {
//     // TODO: Implement edit functionality
//     console.log('Edit course:', course)
//     // You can emit event to parent or navigate to edit page
// }

const handleDeleteCourse = (courseId) => {
    // Course deleted from detail modal
    handleCloseDetail()
    emit('fetch-students')
}

const handleRefresh = () => {
    emit('fetch-students')
}

</script>

<style scoped>
.per-page-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #6b7280;
}

.per-page-selector select {
    padding: 4px 8px;
}

.pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.pagination-info {
    font-size: 14px;
    color: #6b7280;
}


/* Course Table Section */
.student-table-section {
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

.table-header h1 {
    font-size: 26px;
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
    padding: 0px 12px;
    gap: 8px;
    transition: border-color 0.2s;
}

.search-box:focus-within {
    border-color: #9ca3af;
}

.search-box::placeholder {
    border-color: #9ca3af;
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

/* .search-box input::placeholder {
    color: #9ca3af;
} */

.filter-select {
    width: fit-content;
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

.student-table {
    width: 100%;
    border-collapse: collapse;
}

.student-table thead {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.student-table th {
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
@media (max-width: 768px) {
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

    .student-table-section {
        padding: 20px 16px;
    }
}
</style>