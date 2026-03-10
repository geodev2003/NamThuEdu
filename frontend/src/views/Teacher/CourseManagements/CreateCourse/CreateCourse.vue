<template>
    <div v-if="isModalOpen" class="modal-overlay" @click.self="handleCloseModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Create New Course</h3>
                <button class="btn-close" @click="handleCloseModal">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="create-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Course Name <span class="required">*</span></label>
                        <input 
                            type="text" 
                            v-model="localForm.courseName" 
                            placeholder="E.g: TOEIC 650+" 
                            required 
                        />
                    </div>

                    <div class="form-group">
                        <label>Category <span class="required">*</span></label>
                        <select v-model="localForm.category" required>
                            <option value="" disabled>Select category</option>
                            <option 
                                v-for="cat in categories" 
                                :key="cat.caId || cat.id"
                                :value="cat.caId || cat.id"
                            >
                                {{ cat.caName || cat.name }}
                            </option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Students Limit <span class="required">*</span></label>
                        <input 
                            type="number" 
                            v-model.number="localForm.numberOfStudent" 
                            min="1" 
                            placeholder="30"
                            required 
                        />
                    </div>

                    <div class="form-group">
                        <label>Duration (weeks) <span class="required">*</span></label>
                        <input 
                            type="number" 
                            v-model.number="localForm.duration" 
                            min="1" 
                            placeholder="12"
                            required 
                        />
                    </div>

                    <div class="form-group">
                        <label>Time <span class="required">*</span></label>
                        <input 
                            type="text" 
                            v-model="localForm.time" 
                            placeholder="e.g: 18h00"
                            required 
                        />
                    </div>

                    <div class="form-group">
                        <label>Schedule <span class="required">*</span></label>
                        <input 
                            type="text" 
                            v-model="localForm.schedule" 
                            placeholder="e.g: 2,4,6"
                            required 
                        />
                        <small class="helper-text">Enter days separated by commas (1=Mon, 2=Tue, ...)</small>
                    </div>

                    <div class="form-group">
                        <label>Start Date <span class="required">*</span></label>
                        <input 
                            type="date" 
                            v-model="localForm.startDate" 
                            required 
                        />
                    </div>

                    <div class="form-group">
                        <label>End Date <span class="required">*</span></label>
                        <input 
                            type="date" 
                            v-model="localForm.endDate" 
                            :min="localForm.startDate"
                            required 
                            readonly
                        />
                        <small class="helper-text">Auto-calculated based on duration</small>
                    </div>

                    <div class="form-group full-width">
                        <label>Description</label>
                        <div id="summernote"></div>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn-cancel" @click="handleCloseModal">
                        Cancel
                    </button>
                    <button type="submit" class="btn-save" :disabled="submitting">
                        <span v-if="submitting">Creating...</span>
                        <span v-else>Create Course</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
    isModalOpen: {
        type: Boolean,
        required: true
    },
    categories: {
        type: Array,
        default: () => []
    },
    form: {
        type: Object,
        required: true
    },
    submitting: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close-modal', 'create-course'])

// Local form để tránh mutate props trực tiếp
const localForm = reactive({ ...props.form })

// Watch props.form để sync khi parent reset
watch(() => props.form, (newForm) => {
    Object.assign(localForm, newForm)
}, { deep: true })

// Auto-calculate end date
const updateEndDate = () => {
    if (localForm.startDate && localForm.duration) {
        const start = new Date(localForm.startDate);
        const end = new Date(start.getTime() + localForm.duration * 7 * 24 * 60 * 60 * 1000);
        localForm.endDate = end.toISOString().split('T')[0];
    }
}

watch(() => localForm.startDate, updateEndDate);
watch(() => localForm.duration, updateEndDate);

// Initialize Summernote when modal opens
watch(() => props.isModalOpen, async (isOpen) => {
    if (isOpen) {
        await nextTick(); // Đợi DOM render
        
        // Destroy existing instance if any
        if ($('#summernote').data('summernote')) {
            $('#summernote').summernote('destroy');
        }
        
        // Initialize Summernote
        $('#summernote').summernote({
            placeholder: 'Enter detailed course description...',
            tabsize: 2,
            height: 150,
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link']],
                ['view', ['fullscreen', 'codeview']]
            ],
            callbacks: {
                onChange: function(contents) {
                    localForm.description = contents;
                }
            }
        });
        
        // Clear content
        $('#summernote').summernote('code', localForm.description || '');
    } else {
        // Destroy when modal closes
        if ($('#summernote').data('summernote')) {
            $('#summernote').summernote('destroy');
        }
    }
});

// Cleanup on component unmount
onBeforeUnmount(() => {
    if ($('#summernote').data('summernote')) {
        $('#summernote').summernote('destroy');
    }
});

// Handlers
const handleCloseModal = () => {
    emit('close-modal');
}

const handleSubmit = () => {
    // Get Summernote content
    if ($('#summernote').data('summernote')) {
        localForm.description = $('#summernote').summernote('code');
    }
    
    // Emit form data to parent
    emit('create-course', { ...localForm });
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
    max-width: 700px;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
}

.create-form {
    overflow-y: auto;
    padding-right: 2px;
}

/* Scrollbar */
.create-form::-webkit-scrollbar {
    width: 6px;
}

.create-form::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 3px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 12px;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    color: #9ca3af;
    padding: 4px;
    transition: color 0.2s;
}

.btn-close:hover {
    color: #111827;
}

.form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.full-width {
    grid-column: span 2;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
}

.required {
    color: #dc2626;
}

.form-group input,
.form-group select {
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
    color: #111827;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #111827;
}

.form-group input[readonly] {
    background-color: #f9fafb;
    cursor: not-allowed;
}

.helper-text {
    font-size: 12px;
    color: #6b7280;
    margin-top: -2px;
}

/* Summernote styling */
:deep(.note-editor) {
    margin-top: 5px;
    border-radius: 8px;
    border: 1px solid #d1d5db !important;
}

:deep(.note-toolbar) {
    background-color: #f9fafb !important;
    border-bottom: 1px solid #d1d5db !important;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid #f3f4f6;
}

.btn-cancel,
.btn-save {
    padding: 10px 20px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-cancel {
    background: white;
    border: 1px solid #d1d5db;
    color: #374151;
}

.btn-cancel:hover {
    background: #f9fafb;
}

.btn-save {
    background: #111827;
    color: white;
    border: none;
}

.btn-save:hover {
    background: #1f2937;
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
    .modal-content {
        width: 95%;
        max-height: 95vh;
    }

    .form-grid {
        grid-template-columns: 1fr;
    }

    .full-width {
        grid-column: span 1;
    }
}
</style>