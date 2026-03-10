<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content export-modal">
            <div class="modal-header">
                <div class="header-left">
                    <div class="header-icon-container" style="background: #eef2ff;">
                        <i class="bi bi-file-earmark-arrow-up-fill" style="color: #4f46e5;"></i>
                    </div>
                    <div>
                        <h3>Import Course Data</h3>
                        <p class="header-subtitle">Tải lên file Excel/CSV để tạo khóa học hàng loạt</p>
                    </div>
                </div>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body custom-scrollbar">
                <div class="detail-section">
                    <h4 class="section-title">
                        <i class="bi bi-cloud-upload"></i> Chọn tài liệu
                    </h4>

                    <div class="upload-zone" :class="{ 'dragging': isDragging }" @dragover.prevent="isDragging = true"
                        @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
                        @click="$refs.fileInput.click()">
                        <input type="file" ref="fileInput" hidden accept=".xlsx, .xls, .csv"
                            @change="handleFileChange" />
                        <div class="upload-content">
                            <i class="bi bi-file-earmark-excel-fill" v-if="!selectedFile"></i>
                            <i class="bi bi-check-circle-fill text-success" v-else></i>

                            <p v-if="!selectedFile" class="upload-text">
                                Kéo thả file vào đây hoặc <span>Duyệt file</span>
                            </p>
                            <p v-else class="selected-filename">
                                {{ selectedFile.name }}
                            </p>
                            <small class="upload-hint">Hỗ trợ .xlsx, .xls, .csv (Tối đa 5MB)</small>
                        </div>
                    </div>

                    <div class="template-download-card">
                        <div class="info">
                            <i class="bi bi-info-circle"></i>
                            <span> Sử dụng file mẫu để tránh lỗi định dạng.</span>
                        </div>
                        <button class="btn-link-custom" @click="downloadTemplate">
                            <i class="bi bi-download"></i> Tải file mẫu
                        </button>
                    </div>
                </div>

                <div class="detail-section mt-4">
                    <h4 class="section-title">
                        <i class="bi bi-key"></i> Tra cứu Category ID
                    </h4>
                    <div class="category-reference-grid">
                        <div v-for="cat in categories" :key="cat.caId || cat.id" class="category-ref-item">
                            <span class="ref-id">{{ cat.caId || cat.id }}</span>
                            <span class="ref-name">{{ cat.caName || cat.name }}</span>
                        </div>
                    </div>
                    <p class="ref-hint">* Nhập số ID tương ứng vào cột <strong>Category ID</strong> trong file Excel.
                    </p>
                </div>

                <div v-if="previewData.length > 0" class="detail-section mt-4">
                    <h4 class="section-title">
                        <i class="bi bi-table"></i> Xem trước dữ liệu (5 dòng đầu)
                    </h4>
                    <div class="preview-table-wrapper">
                        <table class="preview-table">
                            <thead>
                                <tr>
                                    <th>Khóa học</th>
                                    <th>ID</th>
                                    <th>Học viên</th>
                                    <th>Lịch học</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(row, index) in previewData.slice(0, 5)" :key="index">
                                    <td class="font-medium">{{ row.courseName }}</td>
                                    <td><span class="badge-mini">{{ row.category }}</span></td>
                                    <td>{{ row.numberOfStudent }}</td>
                                    <td class="text-muted">{{ row.schedule }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel-custom" @click="$emit('close')">
                    <i class="bi bi-x-circle"></i> Hủy bỏ
                </button>
                <button class="btn-export-primary" :disabled="!selectedFile || isImporting" @click="processImport">
                    <span v-if="isImporting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-box-arrow-in-down me-2"></i>
                    {{ isImporting ? 'Đang Import...' : 'Bắt đầu Import' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import http from '@/api/http.js';
import Swal from 'sweetalert2';

const props = defineProps({
    isOpen: Boolean,
    categories: Array // Danh sách category truyền từ index.vue
});

const emit = defineEmits(['close', 'imported']);

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);
const isImporting = ref(false);
const previewData = ref([]);

const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndParse(file);
};

const handleDrop = (e) => {
    isDragging.value = false;
    const file = e.dataTransfer.files[0];
    if (file) validateAndParse(file);
};

const validateAndParse = (file) => {
    const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
    ];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        Swal.fire('Lỗi', 'Vui lòng chọn đúng định dạng Excel (.xlsx) hoặc CSV', 'error');
        return;
    }
    selectedFile.value = file;
    parseFile(file);
};

const parseFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

        // Map dữ liệu khớp với API của CourseController
        previewData.value = jsonData.map(row => ({
            courseName: row['Course Name'] || row['name'],
            category: row['Category ID'] || row['category'],
            numberOfStudent: parseInt(row['Students'] || row['numberOfStudent'] || 30),
            time: row['Time'] || row['time'] || '18:00',
            schedule: row['Schedule'] || row['schedule'] || '2,4,6',
            startDate: row['Start Date'] || row['startDate'],
            endDate: row['End Date'] || row['endDate'],
            description: row['Description'] || row['description'] || ''
        }));
    };
    reader.readAsArrayBuffer(file);
};

const processImport = async () => {
    isImporting.value = true;
    let successCount = 0;

    for (const course of previewData.value) {
        try {
            // Gửi dữ liệu về backend xử lý lưu trữ
            await http.post('/api/teacher/courses', course);
            successCount++;
        } catch (error) {
            console.error("Dòng dữ liệu lỗi:", error);
        }
    }

    isImporting.value = false;
    await Swal.fire({
        icon: 'success',
        title: 'Hoàn tất',
        text: `Đã nhập thành công ${successCount} khóa học.`,
        confirmButtonColor: '#111827'
    });
    emit('imported'); // Thông báo để index.vue load lại bảng
    emit('close');
};

const downloadTemplate = () => {
    // 1. Tạo dữ liệu cho Sheet nhập liệu
    const ws = XLSX.utils.json_to_sheet([{
        'Course Name': 'Lớp luyện thi IC3 GS6',
        'Category ID': props.categories[0]?.caId || 1,
        'Students': 30,
        'Time': '18:00',
        'Schedule': '2,4,6',
        'Start Date': '2026-03-01',
        'End Date': '2026-06-01',
        'Description': 'Nhập mô tả khóa học'
    }]);

    // 2. Tạo dữ liệu tra cứu Category động
    const catData = props.categories.map(c => ({
        'ID (Cần nhập)': c.caId || c.id,
        'Tên Danh Mục': c.caName || c.name
    }));
    const wsRef = XLSX.utils.json_to_sheet(catData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Import");
    XLSX.utils.book_append_sheet(wb, wsRef, "Tra_Cuu_Category_ID");

    XLSX.writeFile(wb, "Huong_Dan_Import_Course.xlsx");
};
</script>

<style scoped>
/* Reuse styles from ExportModal.vue */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(6px);
}

.export-modal {
    background: white;
    width: 95%;
    max-width: 650px;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    border: 1px solid #e5e7eb;
}

.modal-header {
    padding: 24px;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-icon-container {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.header-left {
    display: flex;
    gap: 16px;
    align-items: center;
}

.header-left h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
}

.header-subtitle {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.detail-section {
    background: #ffffff;
    border: 1px solid #f3f4f6;
    padding: 20px;
    border-radius: 12px;
}

.section-title {
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Upload Zone */
.upload-zone {
    border: 2px dashed #e5e7eb;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;
    background: #f9fafb;
}

.upload-zone:hover,
.upload-zone.dragging {
    border-color: #4f46e5;
    background: #f5f7ff;
}

.upload-content i {
    font-size: 40px;
    color: #9ca3af;
    margin-bottom: 12px;
    display: block;
}

.upload-text {
    font-size: 14px;
    color: #4b5563;
}

.upload-text span {
    color: #4f46e5;
    font-weight: 600;
    text-decoration: underline;
}

.template-download-card {
    margin-top: 16px;
    padding: 12px 16px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.btn-link-custom {
    background: none;
    border: none;
    color: #4f46e5;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
}

/* Category Reference */
.category-reference-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 10px;
}

.category-ref-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #374151;
}

.ref-id {
    background: #111827;
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-weight: 700;
    min-width: 28px;
    text-align: center;
}

.ref-hint {
    font-size: 12px;
    color: #6b7280;
    margin-top: 12px;
    font-style: italic;
}

/* Preview Table */
.preview-table-wrapper {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 8px;
}

.preview-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
}

.preview-table th {
    background: #f9fafb;
    padding: 12px;
    text-align: left;
    font-weight: 600;
    color: #374151;
}

.preview-table td {
    padding: 12px;
    border-top: 1px solid #e5e7eb;
    color: #4b5563;
}

.badge-mini {
    background: #e0e7ff;
    color: #4338ca;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 700;
}

.modal-footer {
    padding: 20px 24px;
    background: #f9fafb;
    border-top: 1px solid #f3f4f6;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel-custom {
    padding: 10px 20px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-weight: 600;
    color: #374151;
    cursor: pointer;
}

.btn-export-primary {
    padding: 10px 24px;
    background: #111827;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.btn-export-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-close {
    background: none; /* Loại bỏ hoàn toàn màu nền xanh */
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #9ca3af; /* Màu xám nhạt cho biểu tượng X */
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close:hover {
    color: #111827; /* Chuyển sang màu đen đậm khi di chuột qua */
    background-color: #f3f4f6; /* Tạo hiệu ứng nền xám nhẹ khi hover */
}

.mt-4 {
    margin-top: 16px;
}
</style>