<!-- src/views/Teacher/TestManagement/CreateTest.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
    
    <!-- ─── HEADER ───────────────────────────────────────────── -->
    <div class="page-header">
      <div class="header-content">
        <button class="btn-back" @click="handleBack">
          <i class="bi bi-arrow-left"></i>
        </button>
        <div class="header-text">
          <h1>Create New Test</h1>
          <p>Build a professional exam in 3 easy steps</p>
        </div>
      </div>
      <div class="step-indicator">
        <div 
          v-for="s in steps" :key="s.id"
          class="step-dot"
          :class="{ active: currentStep === s.id, completed: currentStep > s.id }"
          @click="currentStep > s.id && goToStep(s.id)"
        >
          <span class="step-number">{{ s.id }}</span>
          <span class="step-label">{{ s.label }}</span>
        </div>
      </div>
    </div>

    <!-- ─── MAIN CONTENT ─────────────────────────────────────── -->
    <div class="wizard-body">
      
      <!-- LEFT: Form Panel -->
      <div class="form-panel">
        <Transition name="slide-fade" mode="out-in">
          <div :key="currentStep" class="step-wrapper">
          
          <!-- STEP 1: Basic Info -->
          <div v-if="currentStep === 1" class="step-content">
            <div class="step-title">
              <i class="bi bi-info-circle-fill"></i>
              <h2>Test Information</h2>
            </div>

            <div class="form-grid">
              <div class="form-field span-2">
                <label>Test Title <span class="required">*</span></label>
                <input 
                  v-model="form.title" 
                  placeholder="e.g. VSTEP B1 Mock Test 2024"
                  @input="validateField('title')"
                  :class="{ error: errors.title }"
                />
                <span v-if="errors.title" class="error-text">{{ errors.title }}</span>
              </div>

              <div class="form-field">
                <label>Exam Type <span class="required">*</span></label>
                <select 
                  v-model="form.examTypeId"
                  @change="handleExamTypeChange"
                  :class="{ error: errors.examTypeId }"
                >
                  <option value="">Select type...</option>
                  <option v-for="et in examTypes" :key="et.id" :value="et.id">
                    {{ et.code }} — {{ et.name }}
                  </option>
                </select>
                <span v-if="errors.examTypeId" class="error-text">{{ errors.examTypeId }}</span>
              </div>

              <div class="form-field">
                <label>Target Level</label>
                <select v-model="form.targetLevel">
                  <option value="">Any level</option>
                  <option value="A1">A1 - Beginner</option>
                  <option value="A2">A2 - Elementary</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Proficiency</option>
                </select>
              </div>

              <div class="form-field span-2">
                <label>Description (optional)</label>
                <textarea 
                  v-model="form.description" 
                  rows="3"
                  placeholder="Brief description of the test content and purpose..."
                ></textarea>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-next" @click="nextStep">
                Next: Scoring
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- STEP 2: Scoring -->
          <div v-else-if="currentStep === 2" class="step-content">
            <div class="step-title">
              <i class="bi bi-calculator-fill"></i>
              <h2>Scoring & Duration</h2>
            </div>

            <div class="form-grid">
              <div class="form-field">
                <label>Duration (minutes) <span class="required">*</span></label>
                <input 
                  type="number" 
                  v-model.number="form.duration" 
                  min="1" max="300"
                  @input="validateField('duration')"
                  :class="{ error: errors.duration }"
                />
                <span v-if="errors.duration" class="error-text">{{ errors.duration }}</span>
                <span class="field-hint">
                  <i class="bi bi-clock"></i>
                  {{ formatDuration(form.duration) }}
                </span>
              </div>

              <div class="form-field">
                <label>Total Score <span class="required">*</span></label>
                <input 
                  type="number" 
                  v-model.number="form.totalScore" 
                  min="1" max="1000"
                  @input="validateField('totalScore')"
                  :class="{ error: errors.totalScore }"
                />
                <span v-if="errors.totalScore" class="error-text">{{ errors.totalScore }}</span>
              </div>

              <div class="form-field">
                <label>Pass Score <span class="required">*</span></label>
                <input 
                  type="number" 
                  v-model.number="form.passScore" 
                  min="1" 
                  :max="form.totalScore"
                  @input="validateField('passScore')"
                  :class="{ error: errors.passScore }"
                />
                <span v-if="errors.passScore" class="error-text">{{ errors.passScore }}</span>
                <span v-if="form.totalScore > 0 && form.passScore > 0" class="field-hint success">
                  <i class="bi bi-check-circle"></i>
                  {{ passPercentage }}% passing threshold
                </span>
              </div>

              <div class="form-field">
                <label>Exam Code</label>
                <input 
                  v-model="form.examCode" 
                  placeholder="e.g. VSTEP-2024-001"
                  :disabled="autoGenerateCode"
                />
                <label class="checkbox-label">
                  <input type="checkbox" v-model="autoGenerateCode" />
                  Auto-generate code
                </label>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-back-step" @click="prevStep">
                <i class="bi bi-arrow-left"></i>
                Back
              </button>
              <button class="btn-next" @click="nextStep">
                Next: Review
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- STEP 3: Template Selection -->
          <div v-else-if="currentStep === 3" class="step-content">
            <div class="step-title">
              <i class="bi bi-file-earmark-richtext"></i>
              <h2>Content Template</h2>
            </div>

            <p class="step-desc">Choose a starting template for your test structure. You can customize everything later.</p>

            <div class="template-grid">
              <div 
                v-for="tmpl in templates" 
                :key="tmpl.id"
                class="template-card"
                :class="{ selected: selectedTemplate === tmpl.id }"
                @click="selectedTemplate = tmpl.id"
              >
                <div class="template-icon">
                  <i :class="tmpl.icon"></i>
                </div>
                <h4>{{ tmpl.name }}</h4>
                <p>{{ tmpl.description }}</p>
                <div class="template-structure">
                  <div v-for="skill in tmpl.structure" :key="skill" class="structure-pill">
                    <i :class="getSkillIcon(skill)"></i>
                    {{ skill }}
                  </div>
                </div>
                <div v-if="selectedTemplate === tmpl.id" class="selected-badge">
                  <i class="bi bi-check-circle-fill"></i>
                  Selected
                </div>
              </div>
            </div>

            <div class="step-actions">
              <button class="btn-back-step" @click="prevStep">
                <i class="bi bi-arrow-left"></i>
                Back
              </button>
              <button class="btn-next" @click="nextStep">
                Next: Review
                <i class="bi bi-arrow-right"></i>
              </button>
            </div>
          </div>

          <!-- STEP 3: Review & Create -->
          <div v-else-if="currentStep === 4" class="step-content">
            <div class="step-title">
              <i class="bi bi-check-circle-fill"></i>
              <h2>Review & Create</h2>
            </div>

            <div class="review-card">
              <h3>Test Details</h3>
              <div class="review-grid">
                <div class="review-item">
                  <span class="review-label">Title</span>
                  <span class="review-value">{{ form.title }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label">Type</span>
                  <span class="review-value">
                    <span class="type-badge">{{ getExamTypeName(form.examTypeId) }}</span>
                  </span>
                </div>
                <div class="review-item">
                  <span class="review-label">Level</span>
                  <span class="review-value">{{ form.targetLevel || '—' }}</span>
                </div>
                <div class="review-item">
                  <span class="review-label">Duration</span>
                  <span class="review-value">
                    <i class="bi bi-clock"></i>
                    {{ formatDuration(form.duration) }}
                  </span>
                </div>
                <div class="review-item">
                  <span class="review-label">Scoring</span>
                  <span class="review-value">
                    {{ form.passScore }}/{{ form.totalScore }} ({{ passPercentage }}%)
                  </span>
                </div>
                <div class="review-item">
                  <span class="review-label">Code</span>
                  <span class="review-value">{{ displayExamCode }}</span>
                </div>
              </div>
            </div>

            <div class="next-steps-card">
              <h4><i class="bi bi-lightbulb"></i> What's Next?</h4>
              <ol>
                <li>Test will be created with "Draft" status</li>
                <li>Use Test Builder to add sections, questions, and content</li>
                <li>Preview and publish when ready</li>
              </ol>
            </div>

            <div class="step-actions">
              <button class="btn-back-step" @click="prevStep">
                <i class="bi bi-arrow-left"></i>
                Back
              </button>
              <button class="btn-create" @click="createTest" :disabled="creating">
                <i class="bi" :class="creating ? 'bi-arrow-repeat spin' : 'bi-plus-circle'"></i>
                {{ creating ? 'Creating...' : 'Create Test' }}
              </button>
            </div>
          </div>

          </div>
        </Transition>
      </div>

      <!-- RIGHT: Live Preview -->
      <div class="preview-panel">
        <div class="preview-header">
          <i class="bi bi-eye"></i>
          <span>Live Preview</span>
        </div>
        <div class="preview-content">
          <div class="preview-test-card">
            <div class="preview-badge">
              {{ getExamTypeName(form.examTypeId) || 'Select Type' }}
            </div>
            <h3>{{ form.title || 'Test Title' }}</h3>
            <p v-if="form.description" class="preview-desc">{{ form.description }}</p>
            <p v-else class="preview-desc placeholder">No description provided</p>
            
            <div class="preview-meta">
              <div class="meta-item">
                <i class="bi bi-clock"></i>
                <span>{{ formatDuration(form.duration) || '—' }}</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-star"></i>
                <span>{{ form.totalScore || 0 }} points</span>
              </div>
              <div class="meta-item">
                <i class="bi bi-trophy"></i>
                <span>Pass: {{ form.passScore || 0 }}</span>
              </div>
            </div>

            <div v-if="form.targetLevel" class="preview-level">
              Target: <strong>{{ form.targetLevel }}</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import http from '@/api/http'
import { useToast } from 'vue-toastification'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'created'])

const toast = useToast()

// ── State ──────────────────────────────────────────────────────
const currentStep = ref(1)
const creating = ref(false)
const autoGenerateCode = ref(true)

const form = ref({
  title: '',
  examTypeId: '',
  targetLevel: '',
  description: '',
  duration: 90,
  totalScore: 100,
  passScore: 60,
  examCode: ''
})

const selectedTemplate = ref('standard')

const templates = [
  {
    id: 'standard',
    name: 'Standard 4-Skills',
    description: 'Reading, Listening, Writing, Speaking with multiple-choice and essay questions',
    icon: 'bi bi-grid-3x3-gap',
    structure: ['Reading', 'Listening', 'Writing', 'Speaking']
  },
  {
    id: 'receptive',
    name: 'Receptive Skills Only',
    description: 'Focus on Reading and Listening comprehension',
    icon: 'bi bi-book',
    structure: ['Reading', 'Listening']
  },
  {
    id: 'productive',
    name: 'Productive Skills Only',
    description: 'Focus on Writing and Speaking production',
    icon: 'bi bi-pencil-square',
    structure: ['Writing', 'Speaking']
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Empty test — build your own structure',
    icon: 'bi bi-file-earmark',
    structure: []
  }
]

const errors = ref({})
const examTypes = ref([])

const steps = [
  { id: 1, label: 'Basic Info' },
  { id: 2, label: 'Scoring' },
  { id: 3, label: 'Template' },
  { id: 4, label: 'Review' }
]

// ── Close handler ──────────────────────────────────────────────
const handleClose = () => {
  if (currentStep.value === 4 && creating.value) return // đang tạo thì không cho đóng
  emit('close')
}

// ── Computed ───────────────────────────────────────────────────
const passPercentage = computed(() => {
  if (!form.value.totalScore || !form.value.passScore) return 0
  return Math.round((form.value.passScore / form.value.totalScore) * 100)
})

const displayExamCode = computed(() => {
  if (!autoGenerateCode.value && form.value.examCode) return form.value.examCode
  const type = examTypes.value.find(et => et.id === form.value.examTypeId)
  const code = type ? type.code : 'EXAM'
  const year = new Date().getFullYear()
  return `${code}-${year}-XXX` // XXX sẽ được tạo bởi backend
})

// ── Lifecycle ──────────────────────────────────────────────────
onMounted(async () => {
  await fetchExamTypes()
})

// ── API ────────────────────────────────────────────────────────
const fetchExamTypes = async () => {
  try {
    const res = await http.get('/api/teacher/exam-types', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (res.data.code === 'SUCCESS') {
      examTypes.value = res.data.data
    }
  } catch (err) {
    console.error('Failed to fetch exam types:', err)
    toast.error('Failed to load exam types')
  }
}

const createTest = async () => {
  if (!validateAll()) {
    toast.warning('Please fix all errors before creating')
    return
  }

  creating.value = true
  try {
    const payload = {
      examTitle: form.value.title,
      examTypeId: form.value.examTypeId,
      examCode: autoGenerateCode.value ? generateExamCode() : form.value.examCode,
      examDescription: form.value.description,
      examDuration: form.value.duration,
      totalScore: form.value.totalScore,
      passScore: form.value.passScore,
      targetLevel: form.value.targetLevel || null,
      template: selectedTemplate.value
    }

    const res = await http.post('/api/teacher/tests', payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })

    if (res.data.code === 'SUCCESS') {
      toast.success('Test created successfully!')
      emit('close')
      emit('created', res.data.data.testId)
    }
  } catch (err) {
    console.error('Create test error:', err)
    toast.error(err.response?.data?.message || 'Failed to create test')
  } finally {
    creating.value = false
  }
}

// ── Validation ─────────────────────────────────────────────────
const validateField = (field) => {
  delete errors.value[field]

  switch (field) {
    case 'title':
      if (!form.value.title?.trim()) {
        errors.value.title = 'Test title is required'
      } else if (form.value.title.length < 5) {
        errors.value.title = 'Title must be at least 5 characters'
      }
      break
    case 'examTypeId':
      if (!form.value.examTypeId) {
        errors.value.examTypeId = 'Please select an exam type'
      }
      break
    case 'duration':
      if (!form.value.duration || form.value.duration < 1) {
        errors.value.duration = 'Duration must be at least 1 minute'
      }
      break
    case 'totalScore':
      if (!form.value.totalScore || form.value.totalScore < 1) {
        errors.value.totalScore = 'Total score must be at least 1'
      }
      break
    case 'passScore':
      if (!form.value.passScore || form.value.passScore < 1) {
        errors.value.passScore = 'Pass score must be at least 1'
      } else if (form.value.passScore > form.value.totalScore) {
        errors.value.passScore = 'Pass score cannot exceed total score'
      }
      break
  }
}

const validateAll = () => {
  validateField('title')
  validateField('examTypeId')
  validateField('duration')
  validateField('totalScore')
  validateField('passScore')
  return Object.keys(errors.value).length === 0
}

// ── Navigation ─────────────────────────────────────────────────
const nextStep = () => {
  if (currentStep.value === 1) {
    validateField('title')
    validateField('examTypeId')
    if (errors.value.title || errors.value.examTypeId) {
      toast.warning('Please fill required fields')
      return
    }
  }
  if (currentStep.value === 2) {
    validateField('duration')
    validateField('totalScore')
    validateField('passScore')
    if (Object.keys(errors.value).length > 0) {
      toast.warning('Please fix scoring errors')
      return
    }
  }
  // Step 3: Template (no validation)
  if (currentStep.value < 4) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const goToStep = (step) => {
  currentStep.value = step
}


// ── Helpers ────────────────────────────────────────────────────
const formatDuration = (minutes) => {
  if (!minutes) return '0 min'
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hrs > 0) return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`
  return `${mins} min`
}

const getSkillIcon = (skill) => {
  const icons = {
    Reading: 'bi bi-book',
    Listening: 'bi bi-headphones',
    Writing: 'bi bi-pencil-square',
    Speaking: 'bi bi-mic'
  }
  return icons[skill] || 'bi bi-circle'
}

const handleExamTypeChange = () => {
  validateField('examTypeId')
  if (autoGenerateCode.value) {
    form.value.examCode = ''
  }
}

const generateExamCode = () => {
  const type = examTypes.value.find(et => et.id === form.value.examTypeId)
  const code = type ? type.code : 'EXAM'
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `${code}-${year}-${random}`
}

const getExamTypeName = (id) => {
  const type = examTypes.value.find(et => et.id === id)
  return type ? type.code : ''
}
</script>

<style scoped>
/* ─── MODAL OVERLAY ──────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  max-width: 1400px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 24px;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-container {
  transform: scale(0.95) translateY(20px);
}

.modal-fade-leave-to .modal-container {
  transform: scale(0.95) translateY(20px);
}

/* ─── HEADER ─────────────────────────────────────────────────── */
.page-header {
  max-width: 1400px;
  margin: 0 auto 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 24px 32px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-text h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.header-text p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #64748b;
}

/* Step Indicator */
.step-indicator {
  display: flex;
  gap: 12px;
}

.step-dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  opacity: 0.4;
  transition: all 0.3s;
}

.step-dot.active,
.step-dot.completed {
  opacity: 1;
}

.step-dot.completed {
  cursor: pointer;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  transition: all 0.3s;
}

.step-dot.active .step-number {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.step-dot.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.step-dot.active .step-label {
  color: #6366f1;
}

/* ─── WIZARD BODY ────────────────────────────────────────────── */
.wizard-body {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  align-items: start;
}

/* ─── FORM PANEL ─────────────────────────────────────────────── */
.form-panel {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  min-height: 500px;
}

.step-content {
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-fade-enter-active {
  transition: all 0.25s ease;
}

.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}

.step-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.step-title i {
  font-size: 32px;
  color: #6366f1;
}

.step-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-field.span-2 {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  letter-spacing: 0.01em;
}

.required {
  color: #ef4444;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  color: #0f172a;
  background: white;
  transition: all 0.2s;
  font-family: inherit;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.form-field input.error,
.form-field select.error {
  border-color: #ef4444;
}

.form-field input:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.form-field textarea {
  resize: vertical;
  min-height: 80px;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 4px;
}

.field-hint {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 5px;
}

.field-hint.success {
  color: #10b981;
  font-weight: 600;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  cursor: pointer;
  margin-top: 8px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Actions */
.step-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px solid #f1f5f9;
}

.btn-back-step,
.btn-next,
.btn-create {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-back-step {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-back-step:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-next {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.btn-next:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.btn-create {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-create:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn-create:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Review Card */
.review-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
}

.review-card h3 {
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.review-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.review-value {
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;
}

.type-badge {
  background: #6366f1;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
}

/* Next Steps */
.next-steps-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #fbbf24;
  border-radius: 12px;
  padding: 20px;
}

.next-steps-card h4 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 700;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.next-steps-card ol {
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  color: #78350f;
  line-height: 1.8;
}

/* ─── PREVIEW PANEL ──────────────────────────────────────────── */
.preview-panel {
  position: sticky;
  top: 24px;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
}

.preview-header i {
  font-size: 18px;
}

.preview-content {
  padding: 20px;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  border-radius: 12px;
  border: 2px dashed #c084fc;
}

.preview-test-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.preview-badge {
  display: inline-block;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preview-test-card h3 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.preview-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 16px;
}

.preview-desc.placeholder {
  font-style: italic;
  color: #94a3b8;
}

.preview-meta {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #64748b;
}

.meta-item i {
  font-size: 16px;
  color: #6366f1;
}

.preview-level {
  margin-top: 12px;
  padding: 10px 14px;
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
  font-size: 13px;
  color: #1e40af;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ─── TEMPLATE SELECTION ─────────────────────────────────────── */
.step-desc {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 24px;
  line-height: 1.6;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.template-card {
  position: relative;
  background: white;
  border: 3px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
}

.template-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
}

.template-card.selected {
  border-color: #6366f1;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
}

.template-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.template-card.selected .template-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.template-icon i {
  font-size: 28px;
  color: white;
}

.template-card h4 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.template-card p {
  margin: 0 0 16px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
}

.template-structure {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.structure-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.template-card.selected .structure-pill {
  background: #ede9fe;
  color: #6d28d9;
}

.structure-pill i {
  font-size: 14px;
}

.selected-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: #6366f1;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.selected-badge i {
  font-size: 14px;
}

/* ─── RESPONSIVE ─────────────────────────────────────────────── */
@media (max-width: 1200px) {
  .wizard-body {
    grid-template-columns: 1fr;
  }
  
  .preview-panel {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 20px;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-field.span-2 {
    grid-column: 1;
  }
  
  .review-grid {
    grid-template-columns: 1fr;
  }
  
  .step-actions {
    flex-direction: column;
  }
  
  .btn-back-step,
  .btn-next,
  .btn-create {
    width: 100%;
    justify-content: center;
  }
}
</style>