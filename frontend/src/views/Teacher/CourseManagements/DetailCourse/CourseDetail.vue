<!-- src/views/Teacher/CourseManagements/DetailCourse/CourseDetail.vue -->
<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
                <div class="header-left">
                    <h3>Course Details</h3>
                </div>
                <button class="btn-close" @click="handleClose">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-section">
                <div class="spinner"></div>
                <p>Loading course details...</p>
            </div>

            <!-- Content -->
            <div v-else-if="course" class="modal-body">
                <!-- Course Header Info -->
                <div class="course-header-info">
                    <div class="course-name-section">
                        <h2>{{ course.name }}</h2>
                        <span class="category-badge" :class="getCategoryClass(course.type)">
                            <i class="bi bi-tag-fill"></i>
                            {{ course.type }}
                        </span>
                    </div>
                    <span class="status-badge" :class="getStatusClass(course.status)">
                        {{ course.status }}
                    </span>
                </div>

                <!-- Info Grid -->
                <div class="info-grid">
                    <!-- Students -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #e0f2fe;">
                            <i class="bi bi-people-fill" style="color: #0369a1;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Students Enrolled</span>
                            <span class="info-value">{{ course.numberOfStudent || 0 }}</span>
                        </div>
                    </div>

                    <!-- Duration -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #fef3c7;">
                            <i class="bi bi-clock-fill" style="color: #b45309;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Time</span>
                            <span class="info-value">{{ course.time }}</span>
                        </div>
                    </div>

                    <!-- Schedule -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #e9d5ff;">
                            <i class="bi bi-calendar-week-fill" style="color: #7c3aed;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Schedule</span>
                            <span class="info-value">{{ getScheduleDays(course.schedule) }}</span>
                        </div>
                    </div>

                    <!-- Start Date -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #dcfce7;">
                            <i class="bi bi-calendar-check-fill" style="color: #16a34a;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Start Date</span>
                            <span class="info-value">{{ formatDate(course.startDate) }}</span>
                        </div>
                    </div>

                    <!-- End Date -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #fee2e2;">
                            <i class="bi bi-calendar-x-fill" style="color: #dc2626;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">End Date</span>
                            <span class="info-value">{{ formatDate(course.endDate) }}</span>
                        </div>
                    </div>

                    <!-- Created Date -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #f3f4f6;">
                            <i class="bi bi-clock-history" style="color: #6b7280;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Created At</span>
                            <span class="info-value">{{ formatDate(course.createdAt) }}</span>
                        </div>
                    </div>
                </div>

                <!-- Description Section -->
                <div class="description-section">
                    <h4>
                        <i class="bi bi-file-text"></i>
                        Description
                    </h4>
                    <div class="description-content" v-html="course.description || 'No description available'"></div>
                </div>

                <!-- Additional Info (nếu có) -->
                <div class="additional-info" v-if="course.instructor || course.location">
                    <h4>
                        <i class="bi bi-info-circle"></i>
                        Additional Information
                    </h4>
                    <div class="info-list">
                        <div class="info-item" v-if="course.instructor">
                            <span class="item-label">Instructor:</span>
                            <span class="item-value">{{ course.instructor }}</span>
                        </div>
                        <div class="info-item" v-if="course.location">
                            <span class="item-label">Location:</span>
                            <span class="item-value">{{ course.location }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Error State -->
            <div v-else class="error-section">
                <i class="bi bi-exclamation-triangle"></i>
                <p>Failed to load course details</p>
            </div>

            <!-- Footer Actions -->
            <div class="modal-footer" v-if="!loading && course">
                <button class="btn-secondary" @click="handleClose">
                    <i class="bi bi-x-circle"></i>
                    Close
                </button>
                <button class="btn-edit" @click="handleEdit">
                    <i class="bi bi-pencil"></i>
                    Edit Course
                </button>
                <button class="btn-danger" @click="handleDelete">
                    <i class="bi bi-trash"></i>
                    Delete Course
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import http from '@/api/http.js'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    courseId: {
        type: [Number, String],
        default: null
    }
})

const emit = defineEmits(['close', 'edit', 'delete', 'refresh'])

const toast = useToast()

// State
const loading = ref(false)
const course = ref(null)

// Fetch course details
const fetchCourseDetail = async () => {
    if (!props.courseId) return

    loading.value = true
    try {
        const res = await http.get(`/api/teacher/courses/${props.courseId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (res.data && res.data.code === 'SUCCESS') {
            course.value = res.data.data
        } else {
            course.value = null
            toast.error('Failed to load course details')
        }
    } catch (error) {
        console.error('Error fetching course:', error)
        course.value = null
        toast.error('Error loading course details')
    } finally {
        loading.value = false
    }
}

// Watch for modal open and courseId changes
watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.courseId) {
        fetchCourseDetail()
    } else {
        course.value = null
    }
})

watch(() => props.courseId, (newId) => {
    if (props.isOpen && newId) {
        fetchCourseDetail()
    }
})

// Helper functions
const getScheduleDays = (schedule) => {
    if (!Array.isArray(schedule) || schedule.length === 0) return '-'
    return schedule.map(day => `T${day}`).join(', ')
}

const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })
}

const getCategoryClass = (type) => {
    const classes = {
        'TOEIC': 'category-toeic',
        'VSTEP': 'category-vstep',
        'IELTS': 'category-ielts'
    }
    return classes[type] || 'category-default'
}

const getStatusClass = (status) => {
    const classes = {
        'Active': 'status-active',
        'Draft': 'status-draft',
        'Complete': 'status-completed',
        'Ongoing': 'status-ongoing'
    }
    return classes[status] || 'status-default'
}

// Event handlers
const handleClose = () => {
    emit('close')
}

const handleEdit = () => {
    emit('close'); // Đóng modal chi tiết
    emit('edit', course.value); // Gửi dữ liệu khóa học lên component cha
}

const handleDelete = async () => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Course "${course.value.name}" will be permanently deleted!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            const res = await http.delete(`/api/teacher/courses/${course.value.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (res.data.code === 'SUCCESS') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Course has been deleted.',
                    timer: 1500,
                    showConfirmButton: false
                })

                emit('delete', course.value.id)
                emit('refresh')
                handleClose()
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete course')
        }
    }
}
</script>

<style scoped>
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
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 900px;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

/* Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #e5e7eb;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
}

.course-id {
    font-size: 13px;
    color: #6b7280;
    background-color: #f3f4f6;
    padding: 4px 10px;
    border-radius: 4px;
    font-weight: 600;
}

.btn-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #9ca3af;
    padding: 8px;
    border-radius: 6px;
    transition: all 0.2s;
}

.btn-close:hover {
    color: #111827;
    background-color: #f3f4f6;
}

/* Body */
.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.modal-body::-webkit-scrollbar {
    width: 6px;
}

.modal-body::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
}

/* Course Header Info */
.course-header-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f3f4f6;
}

.course-name-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.course-name-section h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #111827;
}

/* Category Badge */
.category-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    width: fit-content;
}

.category-badge i {
    font-size: 12px;
}

.category-default {
    background-color: #f3f4f6;
    color: #6b7280;
}

.category-toeic {
    background-color: #dbeafe;
    color: #1e40af;
}

.category-vstep {
    background-color: #ede9fe;
    color: #7c3aed;
}

.category-ielts {
    background-color: #fef3c7;
    color: #b45309;
}

/* Status Badge */
.status-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
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

/* Info Grid */
.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
}

.info-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s;
}

.info-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-icon {
    width: 48px;
    height: 48px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.info-icon i {
    font-size: 22px;
}

.info-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.info-label {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.info-value {
    font-size: 16px;
    color: #111827;
    font-weight: 700;
}

/* Description Section */
.description-section {
    margin-bottom: 24px;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.description-section h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
}

.description-section h4 i {
    color: #6b7280;
}

.description-content {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
}

.description-content:deep(p) {
    margin: 0 0 8px 0;
}

.description-content:deep(ul),
.description-content:deep(ol) {
    margin: 8px 0;
    padding-left: 20px;
}

/* Additional Info */
.additional-info {
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.additional-info h4 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 8px;
}

.additional-info h4 i {
    color: #6b7280;
}

.info-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.info-item {
    display: flex;
    gap: 8px;
    font-size: 14px;
}

.item-label {
    color: #6b7280;
    font-weight: 600;
    min-width: 100px;
}

.item-value {
    color: #111827;
}

/* Loading */
.loading-section {
    padding: 80px 20px;
    text-align: center;
    color: #6b7280;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #6b7280;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-section p {
    font-size: 14px;
}

/* Error */
.error-section {
    padding: 80px 20px;
    text-align: center;
}

.error-section i {
    font-size: 48px;
    color: #ef4444;
    margin-bottom: 12px;
    display: block;
}

.error-section p {
    color: #6b7280;
    font-size: 14px;
}

/* Footer */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid #e5e7eb;
    background-color: #f9fafb;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

.modal-footer button {
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    border: none;
}

.btn-secondary {
    background-color: white;
    color: #374151;
    border: 1px solid #d1d5db;
}

.btn-secondary:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
}

.btn-edit {
    background-color: #111827;
    color: white;
}

.btn-edit:hover {
    background-color: #1f2937;
}

.btn-danger {
    background-color: #dc2626;
    color: white;
}

.btn-danger:hover {
    background-color: #b91c1c;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-height: 95vh;
    }

    .modal-header,
    .modal-body,
    .modal-footer {
        padding: 16px;
    }

    .course-header-info {
        flex-direction: column;
        gap: 12px;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .modal-footer {
        flex-wrap: wrap;
    }

    .modal-footer button {
        flex: 1;
        min-width: calc(50% - 6px);
        justify-content: center;
    }
}
</style>