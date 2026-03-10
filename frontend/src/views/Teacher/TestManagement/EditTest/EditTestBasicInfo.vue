<!-- src/components/Teachers/TestManagement/EditTestBasicInfo.vue -->
<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-left">
                    <h3>Edit Test: {{ form.title }}</h3>
                </div>
                <button class="btn-close" @click="$emit('close')">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <form @submit.prevent="handleUpdate" class="modal-body">
                <div class="info-grid-form">

                    <!-- Exam Title (full width) -->
                    <div class="form-group full-width">
                        <label><i class="bi bi-fonts"></i> Test Title</label>
                        <input
                            type="text"
                            v-model="form.title"
                            placeholder="Enter test title"
                            required
                        />
                    </div>

                    <!-- Exam Type (dropdown) -->
                    <div class="form-group">
                        <label><i class="bi bi-tag"></i> Exam Type</label>
                        <select v-model="form.examTypeId" required>
                            <option value="" disabled>Select exam type</option>
                            <option
                                v-for="et in examTypes"
                                :key="et.id"
                                :value="et.id"
                            >
                                {{ et.code }} — {{ et.name }}
                            </option>
                        </select>
                        <span v-if="loadingTypes" class="field-hint">Loading...</span>
                    </div>

                    <!-- Target Level -->
                    <div class="form-group">
                        <label><i class="bi bi-bar-chart-steps"></i> Target Level</label>
                        <select v-model="form.targetLevel">
                            <option value="">All Levels</option>
                            <option value="A1">A1</option>
                            <option value="A2">A2</option>
                            <option value="B1">B1</option>
                            <option value="B1-B2">B1-B2</option>
                            <option value="B2">B2</option>
                            <option value="C1">C1</option>
                            <option value="C2">C2</option>
                        </select>
                    </div>

                    <!-- Duration -->
                    <div class="form-group">
                        <label><i class="bi bi-clock"></i> Duration (minutes)</label>
                        <input
                            type="number"
                            v-model.number="form.duration"
                            min="1"
                            max="600"
                            required
                        />
                    </div>

                    <!-- Total Score -->
                    <div class="form-group">
                        <label><i class="bi bi-trophy"></i> Total Score</label>
                        <input
                            type="number"
                            v-model.number="form.totalScore"
                            min="1"
                            required
                        />
                    </div>

                    <!-- Pass Score -->
                    <div class="form-group">
                        <label><i class="bi bi-check-circle"></i> Pass Score</label>
                        <input
                            type="number"
                            v-model.number="form.passScore"
                            min="1"
                            :max="form.totalScore"
                            required
                        />
                        <span v-if="passScoreError" class="field-error">
                            Pass score cannot exceed total score!
                        </span>
                    </div>

                    <!-- Status -->
                    <div class="form-group">
                        <label><i class="bi bi-toggle-on"></i> Status</label>
                        <select v-model="form.status" required>
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>

                    <!-- Visibility -->
                    <div class="form-group">
                        <label><i class="bi bi-eye"></i> Visibility</label>
                        <select v-model="form.visibility" required>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                </div>

                <!-- Description -->
                <div class="description-edit-section">
                    <h4><i class="bi bi-file-text"></i> Description</h4>
                    <textarea
                        v-model="form.description"
                        rows="4"
                        placeholder="Enter test description (optional)..."
                    ></textarea>
                </div>

                <div class="modal-footer-custom">
                    <button type="button" class="btn-secondary-custom" @click="$emit('close')">
                        <i class="bi bi-x-circle"></i> Cancel
                    </button>
                    <button
                        type="submit"
                        class="btn-save-custom"
                        :disabled="submitting || passScoreError"
                    >
                        <i class="bi bi-check-circle"></i>
                        {{ submitting ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref, computed, onMounted } from 'vue'
import http from '@/api/http'
import Swal from 'sweetalert2'

const props = defineProps({
    isOpen: Boolean,
    testData: Object
})

const emit = defineEmits(['close', 'updated'])
const submitting = ref(false)

// Exam types list
const examTypes = ref([])
const loadingTypes = ref(false)

const fetchExamTypes = async () => {
    if (examTypes.value.length > 0) return  // cache
    loadingTypes.value = true
    try {
        const res = await http.get('/api/teacher/exam-types', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        if (res.data.code === 'SUCCESS') {
            examTypes.value = res.data.data
        }
    } catch (e) {
        console.error('Failed to load exam types', e)
    } finally {
        loadingTypes.value = false
    }
}

const form = reactive({
    id: null,
    title: '',
    examTypeId: '',
    targetLevel: '',
    duration: 0,
    totalScore: 0,
    passScore: 0,
    status: 'draft',
    visibility: 'public',
    description: ''
})

// Validation: pass score <= total score
const passScoreError = computed(() => {
    return form.passScore > form.totalScore && form.totalScore > 0
})

// Fetch exam types once
onMounted(fetchExamTypes)

// Sync data khi modal mở
watch(() => props.isOpen, (newVal) => {
    if (newVal && props.testData) {
        fetchExamTypes()
        form.id          = props.testData.id
        form.title       = props.testData.title       || ''
        form.examTypeId  = props.testData.examTypeId  || ''
        form.targetLevel = props.testData.targetLevel || ''
        form.duration    = props.testData.duration    || 0
        form.totalScore  = props.testData.totalScore  || 0
        form.passScore   = props.testData.passScore   || 0
        form.status      = props.testData.status?.toLowerCase()     || 'draft'
        form.visibility  = props.testData.visibility?.toLowerCase() || 'public'
        form.description = props.testData.description || ''
    }
})

const handleUpdate = async () => {
    if (passScoreError.value) return

    submitting.value = true
    try {
        const res = await http.put(`/api/teacher/tests/${form.id}`, {
            examTitle:       form.title,
            examTypeId:      form.examTypeId,
            targetLevel:     form.targetLevel,
            examDuration:    form.duration,
            totalScore:      form.totalScore,
            passScore:       form.passScore,
            status:          form.status,
            visibility:      form.visibility,
            examDescription: form.description
        }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })

        if (res.data.code === 'SUCCESS') {
            await Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Test information has been updated.',
                timer: 1500,
                showConfirmButton: false
            })
            emit('updated')
            emit('close')
        }
    } catch (e) {
        console.error('Update error:', e.response?.data)
        Swal.fire('Error', e.response?.data?.message || 'Failed to update test', 'error')
    } finally {
        submitting.value = false
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

/* ============================================ */
/* HEADER */
/* ============================================ */

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
    border-radius: 12px 12px 0 0;
}

.header-left h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111827;
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
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-close:hover {
    color: #111827;
    background-color: #f3f4f6;
}

/* ============================================ */
/* BODY / FORM */
/* ============================================ */

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

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

.form-group.full-width {
    grid-column: 1 / -1;
}

.form-group label {
    font-size: 12px;
    font-weight: 700;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 6px;
}

.form-group label i {
    font-size: 14px;
}

.form-group input,
.form-group select {
    padding: 11px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background-color: #f9fafb;
    font-size: 15px;
    color: #111827;
    transition: all 0.2s;
    outline: none;
}

.form-group input:focus,
.form-group select:focus {
    background-color: white;
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.06);
}

.form-group input:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
}

.field-error {
    font-size: 12px;
    color: #dc2626;
    font-weight: 500;
}

.field-hint {
    font-size: 12px;
    color: #9ca3af;
}

/* ============================================ */
/* DESCRIPTION */
/* ============================================ */

.description-edit-section {
    margin-top: 4px;
    padding: 20px;
    background-color: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.description-edit-section h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 700;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 8px;
}

.description-edit-section h4 i {
    color: #9ca3af;
}

.description-edit-section textarea {
    width: 100%;
    padding: 12px 14px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: white;
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
    resize: vertical;
    transition: all 0.2s;
    outline: none;
    font-family: inherit;
    box-sizing: border-box;
}

.description-edit-section textarea:focus {
    border-color: #111827;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.06);
}

/* ============================================ */
/* FOOTER */
/* ============================================ */

.modal-footer-custom {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
}

.btn-secondary-custom,
.btn-save-custom {
    padding: 11px 22px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;
}

.btn-secondary-custom {
    background: #f3f4f6;
    color: #374151;
    border: 1px solid #e5e7eb;
}

.btn-secondary-custom:hover {
    background: #e5e7eb;
}

.btn-save-custom {
    background: #111827;
    color: white;
}

.btn-save-custom:hover:not(:disabled) {
    background: #1f2937;
}

.btn-save-custom:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 640px) {
    .modal-content {
        width: 100%;
        max-width: none;
        height: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .info-grid-form {
        grid-template-columns: 1fr;
    }

    .modal-footer-custom {
        flex-direction: column;
    }

    .btn-secondary-custom,
    .btn-save-custom {
        width: 100%;
        justify-content: center;
    }
}
</style>