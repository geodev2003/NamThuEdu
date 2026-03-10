<!-- src/views/Teacher/TestManagements/DetailTest/DetailTest.vue -->
<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
                <div class="header-left">
                    <h3>Test Details</h3>
                </div>
                <button class="btn-close" @click="handleClose">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="loading-section">
                <div class="spinner"></div>
                <p>Loading test details...</p>
            </div>

            <!-- Content -->
            <div v-else-if="test" class="modal-body">
                <!-- Test Header Info -->
                <div class="test-header-info">
                    <div class="test-name-section">
                        <h2>{{ test.title }}</h2>
                        <span class="category-badge" :class="getTypeClass(test.examType)">
                            <i class="bi bi-tag-fill"></i>
                            {{ test.examType }}
                        </span>
                    </div>
                    <span class="status-badge" :class="getStatusClass(test.status)">
                        {{ test.status }}
                    </span>
                </div>

                <!-- Info Grid -->
                <div class="info-grid">
                    <!-- Target Level -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #e0f2fe;">
                            <i class="bi bi-people-fill" style="color: #0369a1;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Test Level</span>
                            <span class="info-value">{{ test.targetLevel }}</span>
                        </div>
                    </div>

                    <!-- Duration -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #fef3c7;">
                            <i class="bi bi-clock-fill" style="color: #b45309;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Duration</span>
                            <span class="info-value">{{ test.duration }}</span>
                        </div>
                    </div>

                    <!-- Total Score -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #e9d5ff;">
                            <i class="bi bi-calendar-week-fill" style="color: #7c3aed;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Total Score</span>
                            <span class="info-value">{{ test.totalScore }}</span>
                        </div>
                    </div>

                    <!-- Pass Score -->
                    <div class="info-card">
                        <div class="info-icon" style="background-color: #dcfce7;">
                            <i class="bi bi-calendar-check-fill" style="color: #16a34a;"></i>
                        </div>
                        <div class="info-content">
                            <span class="info-label">Pass Score</span>
                            <span class="info-value">{{ test.passScore }}</span>
                        </div>
                    </div>


                </div>


                <!-- Description Section (optional) -->
                <div v-if="test.description" class="description-section">
                    <h4>
                        <i class="bi bi-file-text"></i>
                        Description
                    </h4>
                    <div class="description-content" v-html="test.description"></div>
                </div>

                <!-- Skills Blocks -->
                <div class="skills-container">
                    <SkillBlock
                        v-for="(skillGroup, index) in test.skills"
                        :key="index"
                        :examTitle="test.title"
                        :skillCode="skillGroup.skillCode"
                        :instructions="skillGroup.instructions"
                        :sections="skillGroup.sections"
                    />
                </div>

            </div>

            <!-- Error State -->
            <div v-else class="error-section">
                <i class="bi bi-exclamation-triangle"></i>
                <p>Failed to load test details</p>
            </div>

            <!-- Footer Actions -->
            <div class="modal-footer" v-if="!loading && test">
                <button class="btn-secondary" @click="handleClose">
                    <i class="bi bi-x-circle"></i>
                    Close
                </button>
                
                <button class="btn-builder" @click="handleOpenBuilder">
                    <i class="bi bi-layout-text-window-reverse"></i>
                    Edit Content
                </button>
                <button class="btn-danger" @click="handleDelete">
                    <i class="bi bi-trash"></i>
                    Delete
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
import SkillBlock from '@/components/Teachers/TestManagement/TestDetail/SkillBlock.vue'

const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true
    },
    testId: {
        type: [Number, String],
        default: null
    }
})

const emit = defineEmits(['close', 'edit', 'delete', 'refresh', 'open-builder'])
// Helper: Format question type cho badge
// ============================================
// THÊM VÀO <script setup> TRONG DetailTest.vue
// ============================================

// Helper: Format duration from seconds to MM:SS
const formatDuration = (seconds) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, '0')}`
}

// Helper: Format question type cho badge
const formatQuestionType = (type) => {
    const typeMap = {
        'multiple_choice': 'Multiple Choice',
        'true_false': 'True/False',
        'fill_blank': 'Fill Blank',
        'matching': 'Matching',
        'short_answer': 'Short Answer',
        'essay': 'Essay',
        'letter': 'Letter/Email',
        'speaking_response': 'Speaking'
    }
    return typeMap[type] || type
}

// Helper: Format rubric key names
const formatRubricKey = (key) => {
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
}

const toast = useToast()

// State
const loading = ref(false)
const test = ref(null)

// Fetch test details
const fetchTestDetail = async () => {
    if (!props.testId) return

    loading.value = true
    try {
        const res = await http.get(`/api/teacher/tests/${props.testId}/full`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        if (res.data && res.data.code === 'SUCCESS') {
            test.value = res.data.data
        } else {
            test.value = null
            toast.error('Failed to load test details')
        }
    } catch (error) {
        console.error('Error fetching test:', error)
        test.value = null
        toast.error('Error loading test details')
    } finally {
        loading.value = false
    }
}

// Watch for modal open and testId changes
watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.testId) {
        fetchTestDetail()
    } else {
        test.value = null
    }
})

watch(() => props.testId, (newId) => {
    if (props.isOpen && newId) {
        fetchTestDetail()
    }
})

// Helper functions


const getTypeClass = (type) => {
    const classes = {
        'TOEIC': 'category-toeic',
        'VSTEP': 'category-vstep',
        'IELTS': 'category-ielts'
    };
    return classes[type] || 'category-default';
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
    emit('close')
    emit('edit', test.value)
}

const handleOpenBuilder = () => {
    emit('close')
    emit('open-builder', test.value.id)
}

const handleDelete = async () => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Test "${test.value.title}" will be permanently deleted!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            const res = await http.delete(`/api/teacher/tests/${test.value.id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (res.data.code === 'SUCCESS') {
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'Test has been deleted.',
                    timer: 1500,
                    showConfirmButton: false
                })

                emit('delete', test.value.id)
                emit('refresh')
                handleClose()
            }
        } catch (error) {
            console.error('Delete error:', error)
            toast.error('Failed to delete test')
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

.test-id {
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

/* Test Header Info */
.test-header-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f3f4f6;
}

.test-name-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.test-name-section h2 {
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

.btn-builder {
    background-color: #6366f1;
    color: white;
}

.btn-builder:hover {
    background-color: #4f46e5;
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

    .test-header-info {
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

/* ============================================== */
/* THÊM VÀO <style scoped> TRONG DetailTest.vue */
/* ============================================== */

/* Section Body */
.section-body {
    padding: 16px;
}

.subsection-title {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 6px;
}

.subsection-title i {
    color: #6b7280;
    font-size: 16px;
}

/* ============================================== */
/* CONTENT ITEMS */
/* ============================================== */

.content-items-section {
    margin-bottom: 20px;
}

.content-item-card {
    padding: 14px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
}

/* Text content */
.content-text .content-title {
    margin: 0 0 10px 0;
    font-size: 15px;
    font-weight: 700;
    color: #111827;
}

.content-body {
    font-size: 14px;
    color: #374151;
    line-height: 1.7;
}

/* Audio content */
.content-audio {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.audio-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.audio-header i {
    color: #7c3aed;
    font-size: 18px;
}

.audio-title {
    flex: 1;
}

.audio-duration {
    font-size: 13px;
    color: #6b7280;
    background: #f3f4f6;
    padding: 3px 8px;
    border-radius: 4px;
}

.audio-player {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    outline: none;
}

.transcript-details {
    margin-top: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 10px;
    background: #fafafa;
}

.transcript-details summary {
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #6b7280;
    user-select: none;
}

.transcript-details summary:hover {
    color: #111827;
}

.transcript-content {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e5e7eb;
    font-size: 13px;
    color: #374151;
    line-height: 1.6;
    white-space: pre-wrap;
}

/* Image content */
.content-image h6 {
    margin: 0 0 10px 0;
    font-size: 14px;
    font-weight: 600;
    color: #111827;
}

.img-preview {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
}

/* ============================================== */
/* QUESTION TYPE BADGE */
/* ============================================== */

.q-type-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 10px;
    background: #e0f2fe;
    color: #0369a1;
    text-transform: capitalize;
}

.question-img {
    margin-top: 10px;
    max-width: 100%;
    border-radius: 6px;
    border: 1px solid #e5e7eb;
}

/* ============================================== */
/* TASK PROMPT SECTION */
/* ============================================== */

.task-prompt-section {
    margin-top: 12px;
    padding: 14px;
    background: #fef3c7;
    border-left: 4px solid #f59e0b;
    border-radius: 6px;
}

.prompt-situation,
.prompt-text,
.prompt-requirements {
    margin-bottom: 12px;
}

.prompt-situation strong,
.prompt-text strong,
.prompt-requirements strong {
    display: block;
    margin-bottom: 6px;
    font-size: 13px;
    color: #92400e;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.prompt-situation p,
.prompt-text div {
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
}

.requirements-text {
    font-size: 14px;
    color: #374151;
    background: white;
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #fbbf24;
    white-space: pre-wrap;
    font-family: inherit;
}

/* Cue card */
.prompt-cue-card {
    background: white;
    border: 2px dashed #f59e0b;
    border-radius: 8px;
    padding: 12px;
    margin-bottom: 12px;
}

.cue-card-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 700;
    color: #92400e;
    margin-bottom: 8px;
}

.cue-card-header i {
    font-size: 16px;
}

.cue-card-text {
    font-size: 14px;
    color: #374151;
    white-space: pre-wrap;
    font-family: inherit;
    margin: 0;
}

/* Chart/Image */
.prompt-chart,
.prompt-img {
    max-width: 100%;
    border-radius: 8px;
    border: 1px solid #fbbf24;
    margin-bottom: 12px;
}

/* Meta badges */
.prompt-meta {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 12px;
}

.meta-badge {
    font-size: 12px;
    padding: 4px 10px;
    background: white;
    border: 1px solid #fbbf24;
    border-radius: 12px;
    color: #92400e;
    display: flex;
    align-items: center;
    gap: 4px;
}

.meta-badge i {
    font-size: 13px;
}

/* Rubric */
.rubric-details,
.sample-details {
    margin-top: 12px;
    border: 1px solid #fbbf24;
    border-radius: 6px;
    padding: 10px;
    background: white;
}

.rubric-details summary,
.sample-details summary {
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #92400e;
    user-select: none;
}

.rubric-details summary:hover,
.sample-details summary:hover {
    color: #78350f;
}

.rubric-content {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #fef3c7;
}

.rubric-item {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 6px 0;
    font-size: 13px;
}

.rubric-label {
    font-weight: 600;
    color: #374151;
    text-transform: capitalize;
}

.rubric-weight {
    font-weight: 700;
    color: #f59e0b;
}

.rubric-desc {
    color: #6b7280;
    font-size: 12px;
}

/* Sample content */
.sample-content {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #fef3c7;
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
}

.sample-audio {
    margin-top: 12px;
}

.sample-audio strong {
    display: block;
    margin-bottom: 8px;
    font-size: 13px;
    color: #92400e;
}

.content-instruction {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    background: #eff6ff;
    /* Light blue background */
    border-left: 3px solid #3b82f6;
    /* Blue accent */
    color: #1e40af;
    /* Dark blue text */
    font-size: 13px;
    font-weight: 500;
}
/* Skills Container */
.skills-container {
    display: flex;
    flex-direction: column;
    gap: 28px;
    margin-top: 20px;
}
</style>