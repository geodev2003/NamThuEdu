<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-left">
                    <i class="bi bi-pencil-square" style="font-size: 1.5rem; color: #111827;"></i>
                    <h3>Cập nhật học viên: {{ form.studentName }}</h3>
                </div>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <form @submit.prevent="handleUpdate" class="modal-body">
                <div class="info-grid-form">
                    <div class="form-group full-width">
                        <label><i class="bi bi-person-badge"></i> Họ và Tên</label>
                        <input type="text" v-model="form.studentName" placeholder="Nhập tên học viên" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-gender-ambiguous"></i> Giới tính</label>
                        <select v-model.number="form.studentGender" required class="form-select-custom">
                            <option :value="1">Nam</option>
                            <option :value="0">Nữ</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-calendar-event"></i> Ngày sinh</label>
                        <input type="date" v-model="form.studentDoB" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-telephone"></i> Số điện thoại</label>
                        <input type="text" v-model="form.studentPhone" placeholder="Nhập số điện thoại" required />
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-door-open"></i> Lớp học (ID)</label>
                        <input type="number" v-model.number="form.classId" placeholder="Nhập mã lớp" required />
                    </div>

                    <div class="form-group full-width">
                        <label><i class="bi bi-geo-alt"></i> Địa chỉ</label>
                        <textarea v-model="form.studentAddress" rows="2"
                            placeholder="Nhập địa chỉ thường trú"></textarea>
                    </div>

                    <div class="form-group">
                        <label><i class="bi bi-shield-check"></i> Trạng thái</label>
                        <select v-model="form.studentStatus" class="form-select-custom">
                            <option value="active">Đang học (Active)</option>
                            <option value="inactive">Nghỉ học (Inactive)</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer-custom">
                    <button type="button" class="btn-secondary-custom" @click="$emit('close')">
                        <i class="bi bi-x-circle"></i> Hủy
                    </button>
                    <button type="submit" class="btn-save-custom" :disabled="submitting">
                        <i class="bi bi-check-circle"></i>
                        {{ submitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import http from '@/api/http';
import Swal from 'sweetalert2';

const props = defineProps({
    isOpen: Boolean,
    studentData: Object, // Đổi từ courseData sang studentData cho đúng ngữ nghĩa
});

const emit = defineEmits(['close', 'updated']);
const submitting = ref(false);

const form = reactive({
    id: null,
    studentName: '',
    studentPhone: '',
    studentGender: 1,
    studentDoB: '',
    studentAddress: '',
    classId: null,
    studentStatus: 'active'
});

// Khởi tạo dữ liệu vào form khi Modal mở
watch(() => props.isOpen, (newVal) => {
    if (newVal && props.studentData) {
        // Ánh xạ dữ liệu từ props vào form
        form.id = props.studentData.id;
        form.studentName = props.studentData.studentName || '';
        form.studentPhone = props.studentData.studentPhone || '';
        form.studentDoB = props.studentData.studentDoB || '';
        form.studentGender = props.studentData.studentGender !== undefined ? props.studentData.studentGender : 1;
        form.studentAddress = props.studentData.studentAddress || '';
        form.classId = props.studentData.classId || null;
        form.studentStatus = (props.studentData.studentStatus || 'active').toLowerCase();
    }
});

const handleUpdate = async () => {
    submitting.value = true;
    try {
        // Gửi request PUT tới API Backend bạn đã viết
        const res = await http.put(`/api/teacher/student/${form.id}`, form);

        if (res.data && res.data.code === 'SUCCESS') {
            await Swal.fire({
                icon: 'success',
                title: 'Thành công!',
                text: 'Thông tin học viên đã được cập nhật.',
                timer: 1500,
                showConfirmButton: false
            });
            emit('updated'); // Load lại danh sách ở Index.vue
            emit('close');
        }
    } catch (e) {
        console.error("Lỗi Update Student:", e.response?.data);
        Swal.fire('Thất bại', e.response?.data?.message || 'Không thể cập nhật thông tin', 'error');
    } finally {
        submitting.value = false;
    }
};
</script>

<style scoped>
/* Giữ nguyên các Style Modal cũ của bạn và bổ sung một chút cho textarea/select */
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
    z-index: 2000;
    backdrop-filter: blur(4px);
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 700px;
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

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.info-grid-form {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
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
.form-select-custom,
textarea {
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #f9fafb;
    font-size: 15px;
    transition: all 0.2s;
}

.form-group input:focus,
textarea:focus {
    background-color: white;
    border-color: #111827;
    outline: none;
}

.full-width {
    grid-column: 1 / -1;
}

.modal-footer-custom {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
}

.btn-secondary-custom {
    background: #f3f4f6;
    color: #374151;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
}

.btn-save-custom {
    background: #111827;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #9ca3af;
}
</style>