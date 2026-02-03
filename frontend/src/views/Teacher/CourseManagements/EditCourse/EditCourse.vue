<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-left">
                    <!-- <i class="bi bi-pencil-square" style="font-size: 1.5rem; color: #111827;"></i> -->
                    <h3>Edit Course: {{ form.courseName }}</h3>
                </div>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <form @submit.prevent="handleUpdate" class="modal-body">
                <div class="info-grid-form">
                    <div class="form-group full-width">
                        <label><i class="bi bi-fonts"></i> Course Name</label>
                        <input type="text" v-model="form.courseName" placeholder="Enter course name" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-tag"></i> Category</label>
                        <select v-model="form.category" required>
                            <option value="" disabled>Select category</option>
                            <option v-for="cat in categories" :key="cat.caId || cat.id" :value="cat.caId || cat.id">
                                {{ cat.caName || cat.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-people"></i> Students Limit</label>
                        <input type="number" v-model.number="form.numberOfStudent" min="1" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-clock"></i> Time (e.g., 18h00)</label>
                        <input type="text" v-model="form.time" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-calendar-week"></i> Schedule (e.g., 2,4,6)</label>
                        <input type="text" v-model="form.schedule" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-calendar-check"></i> Start Date</label>
                        <input type="date" v-model="form.startDate" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-calendar-x"></i> End Date</label>
                        <input type="date" v-model="form.endDate" required />
                    </div>
                </div>

                <div class="description-edit-section">
                    <h4><i class="bi bi-file-text"></i> Description</h4>
                    <div id="summernote-edit"></div>
                </div>

                <div class="modal-footer-custom">
                    <button type="button" class="btn-secondary-custom" @click="$emit('close')">
                        <i class="bi bi-x-circle"></i> Cancel
                    </button>
                    <button type="submit" class="btn-save-custom" :disabled="submitting">
                        <i class="bi bi-check-circle"></i>
                        {{ submitting ? 'Saving Changes...' : 'Save Changes' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref, nextTick, onBeforeUnmount } from 'vue';
import http from '@/api/http';
import Swal from 'sweetalert2';

const props = defineProps({
    isOpen: Boolean,
    courseData: Object,
    categories: Array
});

const emit = defineEmits(['close', 'updated']);
const submitting = ref(false);
const form = reactive({
    id: null,
    courseName: '',
    category: '',
    numberOfStudent: 0,
    time: '',
    schedule: '',
    startDate: '',
    endDate: '',
    description: ''
});

// Khởi tạo/Cập nhật dữ liệu vào form
watch(() => props.isOpen, async (newVal) => {
    if (newVal && props.courseData) {
        Object.assign(form, props.courseData);

        await nextTick();
        // Initialize Summernote
        $('#summernote-edit').summernote({
            height: 200,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['insert', ['link', 'picture']],
                ['view', ['fullscreen', 'codeview']]
            ],
            callbacks: {
                onChange: (contents) => { form.description = contents; }
            }
        });
        $('#summernote-edit').summernote('code', form.description || '');
    }
});

const handleUpdate = async () => {
    submitting.value = true;
    try {
        // Đảm bảo lấy nội dung mới nhất từ Summernote trước khi gửi
        if ($('#summernote-edit').data('summernote')) {
            form.description = $('#summernote-edit').summernote('code');
        }

        // Kiểm tra dữ liệu bắt buộc
        if (!form.courseName || !form.category) {
            Swal.fire('Chú ý', 'Vui lòng điền đầy đủ thông tin bắt buộc', 'warning');
            return;
        }

        const res = await http.put(`/api/teacher/courses/${form.id}`, form);
        
        if (res.data.code === 'SUCCESS') {
            await Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Thông tin khóa học đã được cập nhật.',
                timer: 1500,
                showConfirmButton: false
            });
            emit('updated');
            emit('close');
        }
    } catch (e) {
        console.error("Lỗi Update:", e.response?.data);
        Swal.fire('Thất bại', e.response?.data?.message || 'Không thể cập nhật khóa học', 'error');
    } finally {
        submitting.value = false;
    }
};

onBeforeUnmount(() => {
    $('#summernote-edit').summernote('destroy');
});
</script>

<style scoped>
/* Reuse Modal Overlay & Content from Detail */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 750px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

/* Form Grid tương tự Info Grid của Detail */
.info-grid-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 13px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
}

.form-group input,
.form-group select {
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #f9fafb;
    font-size: 15px;
    transition: all 0.2s;
}

h3 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
}

.form-group input:focus {
    background-color: white;
    border-color: #111827;
    outline: none;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.05);
}

.full-width {
    grid-column: 1 / -1;
}

.description-edit-section {
    margin-top: 10px;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.description-edit-section h4 {
    margin-bottom: 15px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Custom Footer */
.modal-footer-custom {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
}

.btn-secondary-custom,
.btn-save-custom {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border: none;
}

.btn-secondary-custom {
    background: #f3f4f6;
    color: #374151;
}

.btn-save-custom {
    background: #111827;
    color: white;
}

.btn-save-custom:hover {
    background: #1f2937;
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

:deep(.note-editor) {
    border-radius: 8px;
    border: 1px solid #e5e7eb !important;
    background: white;
}
</style>