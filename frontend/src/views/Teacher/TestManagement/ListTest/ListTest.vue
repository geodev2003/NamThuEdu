<template>
    <div class="test-table-section">
        <div class="table-header">
            <h1>Your Tests</h1>

            <div class="table-controls">
                <div class="search-box">
                    <i class="bi bi-search"></i>
                    <input type="text" v-model="searchQuery" placeholder="Search tests..." @input="handleSearch" />
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
            <table class="test-table">
                <thead>
                    <tr>
                        <th>Title Exam</th>
                        <th>Exam Type</th>
                        <th>Target Level</th>
                        <th>Duration</th>
                        <th>Total Score</th>
                        <th>Pass Score</th>
                        <th>Visibility</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Loading -->
                    <tr v-if="loading">
                        <td colspan="9" class="loading-cell">
                            <div class="spinner"></div>
                            Loading tests...
                        </td>
                    </tr>

                    <!-- Có data -->
                    <template v-else-if="paginatedTests.length > 0">
                        <TestRow
                            v-for="test in paginatedTests"
                            :key="test.id"
                            :test="test"
                            @test-deleted="handleTestDeleted"
                            @view-detail="handleViewDetail"
                            @open-edit="handleOpenEdit"
                        />
                    </template>

                    <!-- Không có data -->
                    <tr v-else>
                        <td colspan="9" class="no-data">
                            <i class="bi bi-inbox"></i>
                            <p v-if="searchQuery || selectedCategory">
                                No tests found matching your criteria
                            </p>
                            <p v-else>No tests available</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-container" v-if="filteredTests.length > 0">
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
        <!-- Test Detail Modal -->
        <TestDetail
            :isOpen="isDetailModalOpen"
            :testId="selectedTestId"
            @close="handleCloseDetail"
            @edit="handleEditTest"
            @delete="handleDeleteTest"
            @refresh="handleRefresh"
            @open-builder="handleOpenBuilder"
        />

        <!-- Edit Basic Info Modal -->
        <EditTestBasicInfo
            :isOpen="isEditModalOpen"
            :testData="selectedTestForEdit"
            @close="isEditModalOpen = false"
            @updated="handleEditUpdated"
        />

        <!-- Test Builder Modal (slide-in từ phải) -->
        <TestBuilder
            :isOpen="isBuilderOpen"
            :testId="selectedBuilderTestId"
            @close="isBuilderOpen = false"
            @saved="handleBuilderSaved"
        />

    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import TestRow from '@/components/Teachers/TestManagement/TestRow.vue'
import Pagination from '@/components/Teachers/Pagination/pagination.vue'
import TestDetail from '@/views/Teacher/TestManagement/DetailTest/DetailTest.vue'
import EditTestBasicInfo from '@/views/Teacher/TestManagement/EditTest/EditTestBasicInfo.vue'
import TestBuilder from '@/views/Teacher/TestManagement/EditTest/TestBuilder.vue'
const props = defineProps({
    testList: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['fetch-tests', 'edit-test'])

const handleEditTest = (test) => {
    handleCloseDetail();
    emit('edit-test', test);
}

// Edit modal state
const isEditModalOpen = ref(false)
const selectedTestForEdit = ref(null)

// Builder modal state
const isBuilderOpen = ref(false)
const selectedBuilderTestId = ref(null)

// Search and filter state
const searchQuery = ref('')
const selectedCategory = ref('')

// Detail modal state
const isDetailModalOpen = ref(false)
const selectedTestId = ref(null)

// Phân trang
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Reset về trang 1 khi người dùng search hoặc lọc
watch([searchQuery, selectedCategory, itemsPerPage], () => {
    currentPage.value = 1
})

// Filtered tests
const filteredTests = computed(() => {
    return props.testList.filter(test => {
        const query = searchQuery.value.toLowerCase();

        // Tìm trong title hoặc examType
        const matchesSearch = test.title.toLowerCase().includes(query) ||
            test.examType.toLowerCase().includes(query);

        // Lọc theo category
        const matchesCategory = selectedCategory.value === '' ||
            test.examType === selectedCategory.value;

        return matchesSearch && matchesCategory;
    });
})

// Dữ liệu phân trang
const paginatedTests = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredTests.value.slice(start, end);
})

// Tổng số trang
const totalPages = computed(() => {
    return Math.ceil(filteredTests.value.length / itemsPerPage.value);
})

const handleTestDeleted = () => {
    emit('fetch-tests')
}

const handleViewDetail = (testId) => {
    selectedTestId.value = testId
    isDetailModalOpen.value = true
}

const handleCloseDetail = () => {
    isDetailModalOpen.value = false
    selectedTestId.value = null
}

const handleDeleteTest = (testId) => {
    handleCloseDetail()
    emit('fetch-tests')
}

const handleRefresh = () => {
    emit('fetch-tests')
}

// Edit modal handlers
const handleOpenEdit = (test) => {
    selectedTestForEdit.value = test
    isEditModalOpen.value = true
}

const handleEditUpdated = () => {
    isEditModalOpen.value = false
    emit('fetch-tests')
}

// Navigate to Test Builder
const handleOpenBuilder = (testId) => {
    selectedBuilderTestId.value = testId
    isBuilderOpen.value = true
}

const handleBuilderSaved = () => {
    emit('fetch-tests')
}

const handleSearch = () => {
    // Search logic already handled by computed filteredTests
}

const handleFilter = () => {
    // Filter logic already handled by computed filteredTests
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

/* Test Table Section */
.test-table-section {
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

.test-table {
    width: 100%;
    border-collapse: collapse;
}

.test-table thead {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
}

.test-table th {
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

    .test-table-section {
        padding: 20px 16px;
    }

    .pagination-container {
        flex-direction: column;
        gap: 12px;
    }
}
</style>