<template>
    <tr class="test-row">
        <td>
            <div class="test-name">
                <span class="test-title">{{ test.title }}</span>
            </div>
        </td>

        <td>
            <span class="category-badge" :class="getTypeClass(test.examType)">{{ test.examType }}</span>
        </td>

        <td class="text-center">
            <span>{{ test.targetLevel }}</span>
        </td>

        <td class="text-center">
            <span>{{ test.duration }} min</span>
        </td>

        <td class="text-center">
            <span>{{ test.totalScore }}</span>
        </td>

        <td class="text-center">
            <span>{{ test.passScore }}</span>
        </td>

        <td class="text-center">
            <span class="visibility-badge">{{ test.visibility }}</span>
        </td>

        <td class="text-center">
            <span class="status-badge" :class="getStatusClass(test.status)">
                {{ test.status }}
            </span>
        </td>

        <td class="text-center">
            <div class="action-buttons">
                <button class="btn-action btn-view" @click="viewTestDetail" title="View Details">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn-action btn-edit" @click="openEdit" title="Edit Info">
                    <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn-action btn-delete" @click="deleteTest" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </td>
    </tr>
</template>

<script setup>
import { useToast } from 'vue-toastification';
import http from '@/api/http';
import Swal from 'sweetalert2';

const props = defineProps({
    test: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['test-deleted', 'view-detail', 'open-edit'])

const toast = useToast();

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

// Navigate to detail modal
const viewTestDetail = () => {
    emit('view-detail', props.test.id)
}

// Emit lên ListTest để mở EditTestBasicInfo modal
const openEdit = () => {
    emit('open-edit', props.test)
}
//     Swal.fire({
//         title: 'Are you sure?',
//         text: `Test "${props.test.title}" will be permanently deleted!`,
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#dc2626',
//         cancelButtonColor: '#6b7280',
//         confirmButtonText: 'Yes, delete it!',
//         cancelButtonText: 'Cancel',
//         reverseButtons: true
//     }).then(async (result) => {
//         if (result.isConfirmed) {
//             try {
//                 const res = await http.delete(`/api/teacher/tests/${props.test.id}`, {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem('token')}`
//                     }
//                 });
                
//                 if (res.data.code === 'SUCCESS') {
//                     await Swal.fire({
//                         icon: 'success',
//                         title: 'Deleted!',
//                         text: 'Test has been deleted.',
//                         timer: 1500,
//                         showConfirmButton: false
//                     });
//                     emit('test-deleted');
//                 }
//             } catch (error) {
//                 toast.error("Failed to delete. Please try again.");
//                 console.error(error);
//             }
//         }
//     });

</script>

<style scoped>
.test-row {
    border-bottom: 1px solid #f3f4f6;
    transition: background-color 0.15s;
}

.test-row:hover {
    background-color: #f9fafb;
}

.test-row td {
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

/* Test Name */
.test-name {
    display: flex;
    align-items: center;
}

.test-title {
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

/* Visibility Badge */
.visibility-badge {
    padding: 4px 12px;
    background-color: #f3f4f6;
    color: #6b7280;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
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

.btn-view {
    background-color: #6b7280;
}

.btn-view:hover {
    background-color: #4b5563;
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
    .test-row td {
        padding: 12px 8px;
        font-size: 13px;
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