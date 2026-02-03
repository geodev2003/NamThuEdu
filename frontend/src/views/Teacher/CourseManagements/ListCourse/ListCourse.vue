<template>
    <div class="course-table-section">
        <div class="table-header">
            <h1>Your Courses</h1>

            <div class="table-controls">
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
            </div>

        </div>

        <div class="table-wrapper">
            <table class="course-table">
                <thead>
                    <tr>
                        <th>Course Name</th>
                        <th>Category</th>
                        <th>Students</th>
                        <th>Time</th>
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
                    <template v-else-if="paginatedCourses.length > 0">
                        <CourseRow v-for="course in paginatedCourses" :key="course.id" :course="course"
                            @course-deleted="handleCourseDeleted" @view-detail="handleViewDetail" />
                    </template>

                    <!-- Không có data -->
                    <tr v-else>
                        <td colspan="9" class="no-data">
                            <i class="bi bi-inbox"></i>
                            <p v-if="searchQuery || selectedCategory">
                                No courses found matching your criteria
                            </p>
                            <p v-else>No courses available</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" v-if="filteredCourses.length > 0">
            <!-- <div class="pagination-info">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                {{ Math.min(currentPage * itemsPerPage, filteredCourses.length) }}
                of {{ filteredCourses.length }} entries
            </div> -->
            <div class="per-page-selector">
                <span>Show</span>
                <select v-model.number="itemsPerPage" class="filter-select">
                    <option :value="6">6</option>
                    <option :value="12">12</option>
                    <option :value="24">24</option>
                    <option :value="50">50</option>
                </select>
                <span>entries</span>
            </div>
            <Pagination :total-pages="totalPages" :current-page="currentPage"
                @update:current-page="val => currentPage = val" />
        </div>

        <!-- Course Detail Modal -->
        <CourseDetail :isOpen="isDetailModalOpen" :courseId="selectedCourseId" @close="handleCloseDetail"
            @edit="handleEditCourse" @delete="handleDeleteCourse" @refresh="handleRefresh" />
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import CourseRow from '@/components/Teachers/CourseManagement/CourseRow.vue'
import Pagination from '@/components/Teachers/Pagination/pagination.vue'
import CourseDetail from '@/views/Teacher/CourseManagements/DetailCourse/CourseDetail.vue'

const props = defineProps({
    courseList: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    categories: { type: Array, default: () => [] }
})

// const emit = defineEmits(['fetch-courses'])

// Thêm 'edit-course' vào danh sách khai báo emit
const emit = defineEmits(['fetch-courses', 'edit-course']) // Cập nhật dòng này

const handleEditCourse = (course) => {
    handleCloseDetail(); // Đóng modal chi tiết trước
    emit('edit-course', course); // Gửi dữ liệu khóa học lên index.vue
}

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('')

// Detail modal state
const isDetailModalOpen = ref(false)
const selectedCourseId = ref(null)

// Phân trang
const currentPage = ref(1)
const itemsPerPage = ref(6) // Mặc định hiển thị 6 course

// Reset về trang 1 khi người dùng search hoặc lọc danh mục
watch([searchQuery, selectedCategory, itemsPerPage], () => {
    currentPage.value = 1
})

// Filtered courses
const filteredCourses = computed(() => {
    return props.courseList.filter(course => {
        // 1. Chuyển tất cả về chữ thường để so sánh không phân biệt hoa thường
        const query = searchQuery.value.toLowerCase();

        // 2. Kiểm tra Search (Tìm trong Tên khóa học hoặc Loại khóa học)
        const matchesSearch = course.name.toLowerCase().includes(query) ||
            course.type.toLowerCase().includes(query);

        // 3. Kiểm tra Categories (Nếu chọn "All" - chuỗi rỗng thì bỏ qua lọc)
        const matchesCategory = selectedCategory.value === '' ||
            course.type === selectedCategory.value;

        // Kết quả phải thỏa mãn cả 2 (Search VÀ Category)
        return matchesSearch && matchesCategory;
    });
})

// Dữ liệu thực tế hiển thị trên trang hiện tại
const paginatedCourses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredCourses.value.slice(start, end);
})

// Tính tổng số trang
const totalPages = computed(() => {
    return Math.ceil(filteredCourses.value.length / itemsPerPage.value);
})

const handleCourseDeleted = () => {
    emit('fetch-courses')
}

const handleViewDetail = (courseId) => {
    selectedCourseId.value = courseId
    isDetailModalOpen.value = true
}

const handleCloseDetail = () => {
    isDetailModalOpen.value = false
    selectedCourseId.value = null
}

// const handleEditCourse = (course) => {
//     // TODO: Implement edit functionality
//     console.log('Edit course:', course)
//     // You can emit event to parent or navigate to edit page
// }

const handleDeleteCourse = (courseId) => {
    // Course deleted from detail modal
    handleCloseDetail()
    emit('fetch-courses')
}

const handleRefresh = () => {
    emit('fetch-courses')
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

    .course-table-section {
        padding: 20px 16px;
    }
}
</style>