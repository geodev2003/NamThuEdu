<template>
    <tr class="course-row">
        <td>
            <div class="course-name">
                <span class="course-title">{{ course.name }}</span>
            </div>
        </td>

        <td>
            <span class="category-badge" :class="getTypeClass(course.type)">{{ course.type }}</span>
        </td>

        <td class="text-center">
            <span>{{ course.numberOfStudent }}</span>
        </td>

        <td class="text-center">
            <span>{{ course.time }}h</span>
        </td>

        <td class="text-center">
            <div class="schedule-list">
                <span class="schedule-day">
                    {{ getScheduleDays(course.schedule) }}
                </span>
            </div>
        </td>

        <td class="text-center">
            <span class="date-text">{{ formatDate(course.startDate) }}</span>
        </td>

        <td class="text-center">
            <span class="date-text">{{ formatDate(course.endDate) }}</span>
        </td>

        <td class="text-center">
            <span class="status-badge" :class="getStatusClass(course.status)">
                {{ course.status }}
            </span>
        </td>

        <td class="text-center">
            <div class="action-buttons">
                <button class="btn-action" @click="editCourse" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-action" @click="viewCourse" title="View">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action" @click="deleteCourse" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { useToast } from 'vue-toastification';
import http from '@/api/http';
import Swal from 'sweetalert2'; // Import thư viện SweetAlert2

const props = defineProps({
    course: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['course-deleted']); // Để báo cho cha load lại danh sách
const toast = useToast();

const getDayName = (day) => {
    const days = {
        1: 'Mon',
        2: 'Tue',
        3: 'Wed',
        4: 'Thu',
        5: 'Fri',
        6: 'Sat',
        7: 'Sun'
    };
    return days[day] || day;
}

const getScheduleDays = (schedule) => {
    if (!Array.isArray(schedule) || schedule.length === 0) return '-';

    // Cách này đảm bảo mỗi số đều có chữ T đi kèm và cách nhau bằng dấu phẩy
    return schedule
        .map(day => `T${day}`) // Biến [2, 4, 6] thành ["T2", "T4", "T6"]
        .join(', ');           // Nối lại thành "T2, T4, T6"
}

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

const getStatusClass = (status) => {
    const classes = {
        'Active': 'status-active',
        'Draft': 'status-draft',
        'Complete': 'status-completed',
        'Ongoing': 'status-ongoing'
    };
    return classes[status] || 'status-default';
}

const getTypeClass = (type) => {
    const classes = {
        'TOEIC': 'category-toeic',
        'VSTEP': 'category-vstep',
        'IELTS': 'category-ielts'
    };
    return classes[type] || 'category-default';
}

const editCourse = () => {
    console.log('Edit course:', props.course.id)
}

const viewCourse = () => {
    console.log('View course:', props.course.id)
}

const deleteCourse = async () => {
    // Hiển thị hộp thoại xác nhận phong cách SweetAlert2
    Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa?',
        text: `Khóa học "${props.course.name}" sẽ bị xóa vĩnh viễn!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545', // Màu đỏ cho nút xóa
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Có! Tôi muốn xóa',
        cancelButtonText: 'Không, Tôi hủy',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await http.delete(`/api/teacher/courses/${props.course.id}`);
                
                if (res.data.code === 'SUCCESS') {
                    toast.success("Đã xóa khóa học thành công!");
                    emit('course-deleted');
                }
            } catch (error) {
                toast.error("Xóa thất bại. Vui lòng thử lại.");
                console.error(error);
            }
        }
    });
}
</script>

<style scoped>
.course-row {
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.15s;
}

.course-row:hover {
    background-color: #f9fafb;
}

.course-row td {
    padding: 16px;
    font-size: 14px;
    color: #374151;
}

.text-center {
    text-align: center;
}

.category-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

.category-toeic {
    background-color: #c1d1eb;
    color: #750535;
}

.category-vstep {
    background-color: #ede9fe;
    color: #7c3aed;
}

.category-ielts {
    background-color: #fef3c7;
    color: #b45309;
}

/* Course Name */
.course-name {
    display: flex;
    align-items: center;
}

.course-title {
    font-weight: 500;
    color: #111827;
}

/* Category Badge */
.category-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
}

/* Schedule */
.schedule-list {
    display: flex;
    gap: 6px;
    justify-content: center;
    flex-wrap: wrap;
}

.schedule-day {
    padding: 3px 8px;
    background-color: #f3f4f6;
    color: #6b7280;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 500;
}

/* Date */
.date-text {
    color: #6b7280;
    font-size: 13px;
}

/* Status Badge */
.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.status-active {
    background-color: #d1fae5;
    color: #065f46;
}

.status-draft {
    background-color: #f3f4f6;
    color: #6b7280;
}

.status-completed {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-ongoing {
    background-color: #fed7aa;
    color: #92400e;
}

.status-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: 4px;
    justify-content: center;
}

.btn-action {
    width: 32px;
    height: 32px;
    border: 1px solid #e5e7eb;
    background-color: white;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    color: #6b7280;
}

.btn-action:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    color: #111827;
}

.btn-action i {
    font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
    .course-row td {
        padding: 12px 8px;
        font-size: 13px;
    }

    .schedule-list {
        flex-direction: column;
        gap: 4px;
    }

    .action-buttons {
        flex-direction: column;
        gap: 4px;
    }

    .btn-action {
        width: 28px;
        height: 28px;
    }

    .btn-action i {
        font-size: 12px;
    }
}
</style>