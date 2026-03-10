<!-- src/views/Teacher/TestManagements/index.vue -->
<template>
    <div class="test-management">
        <!-- Action Buttons -->
        <div class="action-section">
            <button class="btn-primary" @click="openCreateModal">
                <i class="bi bi-plus-circle"></i>
                Create New Test
            </button>
            <button class="btn-secondary" @click="isImportModalOpen = true">
                <i class="bi bi-file-earmark-arrow-up"></i> Import Test
            </button>
            <button class="btn-secondary" @click="isExportModalOpen = true">
                <i class="bi bi-download"></i> Export Test
            </button>
        </div>

        <ImportTest :isOpen="isImportModalOpen" @close="isImportModalOpen = false"
            @imported="fetchTests" />

        <ExportModal :isOpen="isExportModalOpen" :data="testList" @close="isExportModalOpen = false" />

        <!-- Create Test Modal -->
        <CreateTest 
            :isOpen="isCreateModalOpen" 
            @close="isCreateModalOpen = false"
            @created="handleTestCreated" 
        />

        <!-- Test List -->
        <ListTest :testList="testList" :loading="loading" @fetch-tests="fetchTests"
            @edit-test="openEditModal" />
            
        <!-- Test Edit -->
        <EditTest :is-open="isEditModalOpen" :test-data="selectedTest"
            @close="isEditModalOpen = false" @updated="fetchTests" />
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '@/api/http.js';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';
import ListTest from './ListTest/ListTest.vue';
import EditTest from './EditTest/EditTest.vue';
import ImportTest from './ImportData/ImportTest.vue';
import ExportModal from './ExportData/ExportModal.vue';
import CreateTest from './CreateTest/CreateTest.vue';

const toast = useToast();

// State
const testList = ref([])
const loading = ref(false)
const isExportModalOpen = ref(false)
const isImportModalOpen = ref(false)
const isCreateModalOpen = ref(false)

const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

// Navigate to wizard page
const openCreateModal = () => {
    isCreateModalOpen.value = true
}
// Fetch tests from API
const fetchTests = async () => {
    loading.value = true;
    try {
        const res = await http.get('/api/teacher/tests');
        
        if (res.data && res.data.code === 'SUCCESS') {
            testList.value = res.data.data;
        } else {
            testList.value = [];
        }
    } catch (e) {
        console.error("Error fetch tests:", e);
        testList.value = [];
        toast.error("Failed to load test list");
    } finally {
        loading.value = false;
    }
};

// Edit Modal
const isEditModalOpen = ref(false);
const selectedTest = ref(null);

const openEditModal = (test) => {
    selectedTest.value = {
        id: test.id,
        testName: test.title,
        examType: test.examType,
        targetLevel: test.targetLevel,
        duration: test.duration,
        totalScore: test.totalScore,
        passScore: test.passScore,
        visibility: test.visibility.toLowerCase(),
        status: test.status.toLowerCase(),
        description: test.description || ''
    };
    isEditModalOpen.value = true;
};

// Initialize
onMounted(() => {
    fetchTests();
});
</script>

<style scoped>
.test-management {
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