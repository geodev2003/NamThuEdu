<template>
    <tr class="student-row">
        <td>
            <div class="student-name">
                <span class="student-title">{{ student.name }}</span>
            </div>
        </td>

        <td class="text-center">
            <span>{{ student.gender === 1 ? 'Nam' : 'Nữ' }}</span>
        </td>

        <td class="text-center">
            <span>{{ student.age || '21' }}</span>
        </td>

        <td class="text-center">
            <span>{{ student.phone }}</span>
        </td>

        <td class="text-center">
            <span>{{ student.class || '-' }}</span>
        </td>

        <td class="text-center">
            <span class="address-text" :title="student.address">{{ student.address || '-' }}</span>
        </td>

        <td class="text-center">
            <span class="status-badge" :class="getStatusClass(student.status)">
                {{ student.status }}
            </span>
        </td>

        <td class="text-center">
            <div class="action-buttons">
                <button class="btn-action btn-edit" @click="viewStudentDetail"><i class="bi bi-eye"></i></button>
                <button class="btn-action btn-delete" @click="deleteStudent"><i class="bi bi-trash"></i></button>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { useToast } from 'vue-toastification';
import http from '@/api/http';
import Swal from 'sweetalert2';

const props = defineProps({
    student: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['student-deleted', 'view-detail'])

const toast = useToast();

const calculateAge = (dateString) => {
    if (!dateString) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
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

// Open detail modal
const viewStudentDetail = () => {
    emit('view-detail', props.student.id);
}

const deleteStudent = async () => {
    Swal.fire({
        title: 'Are you sure?',
        text: `Student "${props.student.name}" will be permanently deleted!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await http.delete(`/api/teacher/student/${props.student.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (res.data.code === 'SUCCESS') {
                    await Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: 'Student has been deleted.',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    emit('student-deleted');
                }
            } catch (error) {
                toast.error("Failed to delete. Please try again.");
                console.error(error);
            }
        }
    });
}
</script>

<style scoped>
.student-row {
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.15s;
}

.student-row:hover {
    background-color: #f9fafb;
}

.student-row td {
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

/* student Name */
.student-name {
    display: flex;
    align-items: center;
}

.student-title {
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
    gap: 6px;
    justify-content: center;
}

.btn-action {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
    color: white;
}

.btn-edit {
    background-color: #3b82f6;
}

.btn-edit:hover {
    background-color: #2563eb;
}

.btn-delete {
    background-color: #ef4444;
}

.btn-delete:hover {
    background-color: #dc2626;
}

.btn-action i {
    font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
    .student-row td {
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