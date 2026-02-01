<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content export-modal">
            <div class="modal-header">
                <div class="header-left">
                    <div class="header-icon-container">
                        <i class="bi bi-cloud-download-fill"></i>
                    </div>
                    <div>
                        <h3>Export Course Data</h3>
                        <p class="header-subtitle">Configure your document settings below</p>
                    </div>
                </div>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body custom-scrollbar">
                <div class="detail-section">
                    <h4 class="section-title">
                        <i class="bi bi-file-earmark-arrow-down"></i> File Format
                    </h4>
                    <div class="format-grid">
                        <label class="format-card" :class="{ active: config.format === 'excel' }">
                            <input type="radio" v-model="config.format" value="excel" hidden />
                            <div class="format-icon excel-bg"><i class="bi bi-file-earmark-excel"></i></div>
                            <div class="format-info">
                                <span class="format-name">Excel</span>
                                <span class="format-ext">.xlsx</span>
                            </div>
                        </label>

                        <label class="format-card" :class="{ active: config.format === 'pdf' }">
                            <input type="radio" v-model="config.format" value="pdf" hidden />
                            <div class="format-icon pdf-bg"><i class="bi bi-file-earmark-pdf"></i></div>
                            <div class="format-info">
                                <span class="format-name">PDF</span>
                                <span class="format-ext">.pdf</span>
                            </div>
                        </label>

                        <label class="format-card" :class="{ active: config.format === 'csv' }">
                            <input type="radio" v-model="config.format" value="csv" hidden />
                            <div class="format-icon csv-bg"><i class="bi bi-filetype-csv"></i></div>
                            <div class="format-info">
                                <span class="format-name">CSV</span>
                                <span class="format-ext">.csv</span>
                            </div>
                        </label>

                        <label class="format-card" :class="{ active: config.format === 'word' }">
                            <input type="radio" v-model="config.format" value="word" hidden />
                            <div class="format-icon word-bg"><i class="bi bi-file-earmark-word"></i></div>
                            <div class="format-info">
                                <span class="format-name">Word</span>
                                <span class="format-ext">.docx</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="detail-section mt-4">
                    <div
                        style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <h4 class="section-title" style="margin-bottom: 0;">
                            <i class="bi bi-check2-square"></i> Select Fields
                        </h4>

                        <label class="field-item" style="padding: 0; cursor: pointer; background: transparent;">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" v-model="isAllSelected" />
                                <span class="checkmark"></span>
                            </div>
                            <span class="field-label" style="font-weight: 700; color: #111827;">Select All</span>
                        </label>
                    </div>

                    <div class="fields-list-grid">
                        <label v-for="field in availableFields" :key="field.key" class="field-item">
                            <div class="checkbox-wrapper">
                                <input type="checkbox" v-model="config.fields" :value="field.key" />
                                <span class="checkmark"></span>
                            </div>
                            <span class="field-label">{{ field.label }}</span>
                        </label>
                    </div>
                </div>

                <div class="detail-section mt-4">
                    <h4 class="section-title">
                        <i class="bi bi-type"></i> Document Styling
                    </h4>
                    <div class="styling-grid">
                        <div class="input-group-custom">
                            <label>Font Family</label>
                            <select v-model="config.fontFamily">
                                <option value="Arial">Arial (Default)</option>
                                <option value="Times New Roman">Times New Roman</option>
                                <option value="Courier New">Courier New</option>
                            </select>
                        </div>
                        <div class="input-group-custom">
                            <label>Font Size (pt)</label>
                            <input type="number" v-model="config.fontSize" min="8" max="24" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel-custom" @click="$emit('close')">
                    <i class="bi bi-x-circle"></i> Cancel
                </button>
                <button class="btn-export-primary" @click="handleExport" :disabled="isExporting">
                    <i class="bi bi-download" v-if="!isExporting"></i>
                    <span class="spinner-border spinner-border-sm" v-else></span>
                    {{ isExporting ? 'Processing...' : 'Export Document' }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Modal Base */
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
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-height: 90vh;
    border: 1px solid #e5e7eb;
}

/* Custom Header */
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
    background: #111827;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
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

/* Sections */
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
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
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

/* Format Cards */
.format-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 12px;
}

.format-card {
    border: 2px solid #f3f4f6;
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.format-card:hover {
    border-color: #d1d5db;
    transform: translateY(-2px);
}

.format-card.active {
    border-color: #111827;
    background: #f9fafb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.format-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.excel-bg {
    background: #dcfce7;
    color: #16a34a;
}

.pdf-bg {
    background: #fee2e2;
    color: #dc2626;
}

.csv-bg {
    background: #e0f2fe;
    color: #0284c7;
}

.word-bg {
    background: #eef2ff;
    color: #4f46e5;
}

.format-info {
    text-align: center;
}

.format-name {
    display: block;
    font-weight: 700;
    font-size: 14px;
    color: #111827;
}

.format-ext {
    font-size: 11px;
    color: #6b7280;
    font-weight: 500;
}

/* Fields Grid */
.fields-list-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.field-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 8px;
    transition: background 0.2s;
    cursor: pointer;
}

.field-item:hover {
    background: #f9fafb;
}

.field-label {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
}

/* Styling Grid */
.styling-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.input-group-custom {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.input-group-custom label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
}

.input-group-custom select,
.input-group-custom input {
    padding: 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
}

/* Custom Footer */
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

.btn-export-primary:hover {
    background: #1f2937;
}

.btn-export-primary:disabled {
    opacity: 0.7;
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

<script setup>
import { reactive, ref, computed } from 'vue';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
// Import font từ file đã tạo ở Bước 1
import { robotoBase64 } from '@/assets/fonts/RobotoFont.js';

const props = defineProps({
    isOpen: Boolean,
    data: Array
});

const emit = defineEmits(['close']);
const isExporting = ref(false);

const availableFields = [
    { key: 'name', label: 'Course Name' },
    { key: 'type', label: 'Category' },
    { key: 'numberOfStudent', label: 'Students' },
    { key: 'time', label: 'Time' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status' }
];

const formats = [
    { id: 'excel', name: 'Excel', ext: '.xlsx', icon: 'bi bi-file-earmark-excel', bgClass: 'excel-bg' },
    { id: 'pdf', name: 'PDF', ext: '.pdf', icon: 'bi bi-file-earmark-pdf', bgClass: 'pdf-bg' },
    { id: 'csv', name: 'CSV', ext: '.csv', icon: 'bi bi-filetype-csv', bgClass: 'csv-bg' },
    { id: 'word', name: 'Word', ext: '.docx', icon: 'bi bi-file-earmark-word', bgClass: 'word-bg' }
];

const config = reactive({
    format: 'excel',
    fields: ['name', 'type', 'startDate', 'endDate', 'status'],
    fontFamily: 'Roboto',
    fontSize: 11
});

// Logic Select All
const isAllSelected = computed({
    get: () => config.fields.length === availableFields.length,
    set: (val) => config.fields = val ? availableFields.map(f => f.key) : []
});

const prepareData = () => {
    return props.data.map(course => {
        const item = {};
        availableFields.forEach(f => {
            if (config.fields.includes(f.key)) {
                if (f.key === 'schedule' && Array.isArray(course[f.key])) {
                    item[f.label] = course[f.key].map(d => `T${d}`).join(', ');
                } else {
                    item[f.label] = course[f.key] || '-';
                }
            }
        });
        return item;
    });
};

const handleExport = async () => {
    if (config.fields.length === 0) {
        return Swal.fire('Warning', 'Vui lòng chọn ít nhất một trường dữ liệu.', 'warning');
    }
    if (!props.data || props.data.length === 0) {
        return Swal.fire('Error', 'Không có dữ liệu để xuất.', 'error');
    }

    isExporting.value = true;
    const exportData = prepareData();

    try {
        if (config.format === 'excel' || config.format === 'csv') {
            exportToExcel(exportData, config.format);
        } else if (config.format === 'pdf') {
            exportToPDF(exportData);
        } else if (config.format === 'word') {
            exportToWord(exportData);
        }

        await Swal.fire({ icon: 'success', title: 'Thành công!', timer: 1500, showConfirmButton: false });
        emit('close');
    } catch (err) {
        console.error(err);
        Swal.fire('Error', 'Lỗi trong quá trình xuất file.', 'error');
    } finally {
        isExporting.value = false;
    }
};

const exportToExcel = (data, format) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Courses");
    XLSX.writeFile(wb, `Course_Report_${Date.now()}.${format === 'excel' ? 'xlsx' : 'csv'}`, { bookType: format === 'excel' ? 'xlsx' : 'csv' });
};

const exportToPDF = (data) => {
    const doc = new jsPDF();
    const fontFileName = 'Roboto-Regular.ttf';

    // Đăng ký font vào hệ thống Virtual File System của jsPDF
    doc.addFileToVFS(fontFileName, robotoBase64);
    doc.addFont(fontFileName, 'Roboto', 'normal');
    doc.setFont('Roboto');

    const headers = [config.fields.map(key => {
        const field = availableFields.find(f => f.key === key);
        return field ? field.label : key;
    })];

    const rows = data.map(item => config.fields.map(key => item[key] || ''));

    doc.setFontSize(16);
    doc.text("DANH SÁCH KHÓA HỌC - NAM THU EDUCATION", 14, 15);

    autoTable(doc, {
        head: headers,
        body: rows,
        startY: 25,
        styles: {
            font: 'Roboto', // Áp dụng font Roboto để hiển thị tiếng Việt trong bảng
            fontSize: config.fontSize
        },
        headStyles: {
            fillColor: [17, 24, 39],
            font: 'Roboto'
        }
    });

    doc.save(`Export_Course_${Date.now()}.pdf`);
};

const exportToWord = (data) => {
    let headerHtml = Object.keys(data[0]).map(h => `<th style="border:1px solid #ddd; background:#f2f2f2; padding:8px;">${h}</th>`).join('');
    let rowsHtml = data.map(item => `<tr>${Object.values(item).map(v => `<td style="border:1px solid #ddd; padding:8px;">${v}</td>`).join('')}</tr>`).join('');

    const content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'></head>
        <body style="font-family: Arial;">
            <h2 style="text-align:center">BÁO CÁO KHÓA HỌC</h2>
            <table style="border-collapse:collapse; width:100%;">${headerHtml}${rowsHtml}</table>
        </body></html>`;

    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Course_Report_${Date.now()}.doc`;
    link.click();
};
</script>
