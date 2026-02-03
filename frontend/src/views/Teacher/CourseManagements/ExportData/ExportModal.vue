<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content export-modal">
            <div class="modal-header">
                <div class="header-left">
                    <div class="header-icon-container">
                        <i class="bi bi-cloud-download-fill"></i>
                    </div>
                    <div>
                        <h3>Xuất Dữ Liệu Khóa Học</h3>
                        <p class="header-subtitle">Tùy chỉnh định dạng và font chữ tiếng Việt</p>
                    </div>
                </div>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <div class="modal-body custom-scrollbar">
                <div class="detail-section">
                    <h4 class="section-title"><i class="bi bi-file-earmark-arrow-down"></i> Định dạng file</h4>
                    <div class="format-grid">
                        <label v-for="fmt in formats" :key="fmt.id" class="format-card"
                            :class="{ active: config.format === fmt.id }">
                            <input type="radio" v-model="config.format" :value="fmt.id" hidden />
                            <div class="format-icon" :class="`${fmt.id}-bg`"><i :class="fmt.icon"></i></div>
                            <div class="format-info">
                                <span class="format-name">{{ fmt.label }}</span>
                                <span class="format-ext">{{ fmt.ext }}</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="detail-section mt-4">
                    <div class="flex-between mb-3">
                        <h4 class="section-title mb-0"><i class="bi bi-check2-square"></i> Chọn cột dữ liệu</h4>
                        <label class="select-all-label">
                            <input type="checkbox" v-model="isAllSelected" />
                            <span>Chọn tất cả</span>
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

                <div class="detail-section mt-4" v-if="config.format === 'pdf'">
                    <h4 class="section-title"><i class="bi bi-fonts"></i> Cấu hình PDF & Font</h4>
                    <div class="styling-grid">
                        <div class="input-group-custom">
                            <label>Chọn Font chữ (TTF)</label>
                            <select v-model="config.fontFamily" class="form-select">
                                <option v-for="font in fontOptions" :key="font.key" :value="font.key">
                                    {{ font.name }}
                                </option>
                            </select>
                        </div>
                        <div class="input-group-custom">
                            <label>Kích thước chữ (pt)</label>
                            <input type="number" v-model="config.fontSize" min="8" max="20" />
                        </div>
                    </div>

                    <div class="preview-box mt-3">
                        <p class="preview-label">Xem trước hiển thị:</p>
                        <div class="preview-content" :style="{ fontSize: config.fontSize + 'px' }">
                            <p class="mb-1"><strong>Mẫu:</strong> Cộng hòa Xã hội Chủ nghĩa Việt Nam</p>
                            <p class="mb-0 text-truncate"><strong>Dữ liệu:</strong> {{ data[0]?.name || 'Tên khóa học mẫu' }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel-custom" @click="$emit('close')">Hủy bỏ</button>
                <button class="btn-export-primary" @click="handleExport" :disabled="isExporting">
                    <span v-if="isExporting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-download me-2"></i>
                    {{ isExporting ? 'Đang xử lý...' : 'Bắt đầu Xuất' }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const props = defineProps({
    isOpen: Boolean,
    data: Array
});

const emit = defineEmits(['close']);
const isExporting = ref(false);
const fontOptions = ref([]);

// 1. Tự động quét toàn bộ font đã convert trong thư mục assets/fonts
const loadFontsFromAssets = async () => {
    // Sử dụng Vite glob để tìm các file .js chứa base64 font
    const fontModules = import.meta.glob('@/assets/fonts/*.js');
    const loadedOptions = [];

    for (const path in fontModules) {
        const module = await fontModules[path]();
        const fileName = path.split('/').pop().replace('.js', '');
        // Lấy giá trị export đầu tiên (base64)
        const fontBase64 = Object.values(module)[0];

        loadedOptions.push({
            key: fileName,
            name: fileName.replace(/-/g, ' '),
            data: fontBase64
        });
    }

    fontOptions.value = loadedOptions;

    // Ưu tiên chọn font Regular làm mặc định
    if (loadedOptions.length > 0) {
        const defaultFont = loadedOptions.find(f => f.key.toLowerCase().includes('regular')) || loadedOptions[0];
        config.fontFamily = defaultFont.key;
    }
};

onMounted(loadFontsFromAssets);

// Định nghĩa các định dạng hỗ trợ
const formats = [
    { id: 'excel', label: 'Excel', ext: '.xlsx', icon: 'bi-file-earmark-excel' },
    { id: 'pdf', label: 'PDF', ext: '.pdf', icon: 'bi-file-earmark-pdf' },
    { id: 'csv', label: 'CSV', ext: '.csv', icon: 'bi-filetype-csv' },
    { id: 'word', label: 'Word', ext: '.docx', icon: 'bi-file-earmark-word' }
];

const availableFields = [
    { key: 'name', label: 'Tên khóa học' },
    { key: 'type', label: 'Phân loại' },
    { key: 'numberOfStudent', label: 'Số học viên' },
    { key: 'startDate', label: 'Ngày bắt đầu' },
    { key: 'status', label: 'Trạng thái' }
];

const config = reactive({
    format: 'excel',
    fields: ['name', 'type', 'startDate', 'status'],
    fontSize: 10,
    fontFamily: ''
});

const isAllSelected = computed({
    get: () => config.fields.length === availableFields.length,
    set: (val) => config.fields = val ? availableFields.map(f => f.key) : []
});

const handleExport = async () => {
    if (config.fields.length === 0) {
        return Swal.fire('Thông báo', 'Vui lòng chọn ít nhất một cột dữ liệu!', 'warning');
    }

    isExporting.value = true;

    try {
        // Chuẩn bị dữ liệu theo các trường đã chọn
        const exportData = props.data.map(item => {
            const row = {};
            config.fields.forEach(key => {
                const field = availableFields.find(f => f.key === key);
                row[field.label] = item[key] || '-';
            });
            return row;
        });

        if (config.format === 'pdf') {
            await exportToPDF(exportData);
        } else if (config.format === 'word') {
            // Logic xuất Word (HTML Blob)
            exportToWord(exportData);
        } else {
            // Excel và CSV sử dụng SheetJS
            exportToExcel(exportData, config.format);
        }

        Swal.fire({ icon: 'success', title: 'Thành công', text: 'File của bạn đã được tải xuống.', timer: 2000 });
        emit('close');
    } catch (error) {
        console.error(error);
        Swal.fire('Lỗi', 'Không thể xuất file: ' + error.message, 'error');
    } finally {
        isExporting.value = false;
    }
};

const exportToPDF = async (data) => {
    // 1. Khởi tạo jsPDF (Khổ ngang - landscape)
    const doc = new jsPDF({ orientation: 'l', unit: 'mm', format: 'a4' });
    
    // 2. Lấy font mà người dùng đã chọn từ danh sách options
    const selectedFont = fontOptions.value.find(f => f.key === config.fontFamily);

    if (selectedFont && selectedFont.data) {
        try {
            const fontFileName = `${selectedFont.key}.ttf`;
            const fontName = selectedFont.key;

            // Làm sạch chuỗi Base64 để tránh lỗi 'atob'
            const cleanBase64 = selectedFont.data.trim().replace(/\s/g, '');

            // 3. Đăng ký font vào hệ thống ảo của jsPDF
            doc.addFileToVFS(fontFileName, cleanBase64);
            doc.addFont(fontFileName, fontName, 'normal');
            
            // Thiết lập font mặc định cho toàn bộ tài liệu
            doc.setFont(fontName);

            // 4. Cấu hình bảng AutoTable
            autoTable(doc, {
                head: [Object.keys(data[0])],
                body: data.map(Object.values),
                
                // Áp dụng font cho PHẦN THÂN bảng
                styles: { 
                    font: fontName, 
                    fontSize: config.fontSize,
                    cellPadding: 3
                },
                
                // QUAN TRỌNG: Áp dụng font cho PHẦN TIÊU ĐỀ bảng
                headStyles: { 
                    font: fontName,      // Ép tiêu đề dùng font tiếng Việt
                    fontStyle: 'normal', // Tránh dùng 'bold' nếu file ttf không có biến thể bold
                    fillColor: [17, 24, 39], // Màu nền đen/xám đậm
                    halign: 'center'
                },
                
                margin: { top: 20 },
                theme: 'grid'
            });

            doc.save(`Bao_Cao_Khoa_Hoc_${Date.now()}.pdf`);
        } catch (error) {
            console.error("Lỗi xuất PDF:", error);
            Swal.fire('Lỗi font', 'Không thể xử lý dữ liệu font. Vui lòng thử lại.', 'error');
        }
    } else {
        Swal.fire('Lỗi', 'Vui lòng chọn một font chữ hợp lệ!', 'error');
    }
};

const exportToExcel = (data, format) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `Bao_Cao_${Date.now()}.${format === 'excel' ? 'xlsx' : 'csv'}`);
};

const exportToWord = (data) => {
    let tableHtml = `<table border="1" style="border-collapse:collapse; width:100%;"><thead><tr>`;
    Object.keys(data[0]).forEach(h => tableHtml += `<th style="background:#f2f2f2; padding:8px;">${h}</th>`);
    tableHtml += `</tr></thead><tbody>`;
    data.forEach(row => {
        tableHtml += `<tr>`;
        Object.values(row).forEach(v => tableHtml += `<td style="padding:8px;">${v}</td>`);
        tableHtml += `</tr>`;
    });
    tableHtml += `</tbody></table>`;

    const content = `<html><head><meta charset="utf-8"></head><body><h2>DANH SÁCH KHÓA HỌC</h2>${tableHtml}</body></html>`;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_${Date.now()}.doc`;
    link.click();
};
</script>

<style scoped>
/* Modal Layout */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 3000;
}

.export-modal {
    background: white;
    width: 90%;
    max-width: 650px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    max-height: 85vh;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    gap: 15px;
    align-items: center;
}

.header-icon-container {
    width: 40px;
    height: 40px;
    background: #111827;
    color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
}

.modal-body {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
}

/* Sections */
.detail-section {
    padding: 15px;
    border: 1px solid #f0f0f0;
    border-radius: 10px;
}

.section-title {
    font-size: 13px;
    font-weight: 700;
    color: #4b5563;
    text-transform: uppercase;
    margin-bottom: 15px;
    display: flex;
    gap: 8px;
}

/* Grid Systems */
.format-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

.format-card {
    border: 2px solid #f3f4f6;
    border-radius: 10px;
    padding: 12px;
    cursor: pointer;
    text-align: center;
    transition: 0.2s;
}

.format-card.active {
    border-color: #111827;
    background: #f9fafb;
}

.format-icon {
    font-size: 24px;
    margin-bottom: 5px;
    color: #111827;
}

.fields-list-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.field-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background: #f9fafb;
    border-radius: 6px;
    cursor: pointer;
}

/* Preview & Inputs */
.styling-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.input-group-custom label {
    font-size: 12px;
    color: #6b7280;
    display: block;
    margin-bottom: 5px;
}

.form-select,
input[type="number"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
}

.preview-box {
    background: #f8fafc;
    border: 1px dashed #cbd5e1;
    padding: 12px;
    border-radius: 8px;
}

.preview-label {
    font-size: 11px;
    color: #94a3b8;
    margin-bottom: 4px;
}

.preview-content {
    color: #1e293b;
    border-left: 3px solid #111827;
    padding-left: 10px;
}

/* Footer */
.modal-footer {
    padding: 15px 20px;
    background: #f9fafb;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

.btn-cancel-custom {
    padding: 8px 20px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 6px;
    cursor: pointer;
}

.btn-export-primary {
    padding: 8px 25px;
    background: #111827;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Custom Checkbox */
.checkbox-wrapper {
    position: relative;
    width: 18px;
    height: 18px;
}

.checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 4px;
}

input:checked~.checkmark {
    background: #111827;
    border-color: #111827;
}
</style>