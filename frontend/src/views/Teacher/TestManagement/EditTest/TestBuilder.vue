<!-- src/views/Teacher/TestManagement/TestBuilder/TestBuilder.vue -->
<!-- Usage: <TestBuilder :isOpen="bool" :testId="id" @close="..." @saved="..." /> -->
<template>
  <Teleport to="body">
    <Transition name="builder-slide">
      <div v-if="isOpen" class="builder-overlay">
        <div class="builder-modal">

          <!-- TOP BAR -->
          <div class="top-bar">
            <div class="top-bar-left">
              <button class="back-btn" @click="handleClose" title="Close">
                <i class="bi bi-x-lg"></i>
              </button>
              <div class="exam-meta">
                <span class="exam-type-badge">{{ test.examType || "—" }}</span>
                <span class="exam-title-text">{{ test.title || "Loading..." }}</span>
              </div>
            </div>
            <div class="top-bar-right">
              <span class="save-status" :class="saveStatus.type">
                <i :class="saveStatus.icon"></i>
                {{ saveStatus.text }}
              </span>
              <button class="btn-save-all" :disabled="saving" @click="saveAll">
                <i class="bi bi-floppy"></i>
                {{ saving ? "Saving..." : "Save" }}
              </button>
            </div>
          </div>

          <!-- SKILL TABS -->
          <div class="skill-tabs">
            <button
              v-for="tab in skillTabs" :key="tab.key"
              class="skill-tab" :class="{ active: activeSkill === tab.key }"
              @click="activeSkill = tab.key"
            >
              <i :class="tab.icon"></i>
              {{ tab.label }}
              <span class="tab-count">{{ getSectionCount(tab.key) }}</span>
            </button>
          </div>

          <!-- BODY -->
          <div class="builder-body">

            <!-- LEFT TREE -->
            <div class="sidebar-tree">
              <div class="tree-header">
                <span>Sections</span>
                <button class="btn-add-section" @click="addSection(activeSkill)">
                  <i class="bi bi-plus-lg"></i> Add
                </button>
              </div>
              <div class="tree-list">
                <template v-if="loading">
                  <div v-for="n in 3" :key="n" class="skeleton-item"></div>
                </template>
                <template v-else>
                  <div
                    v-for="section in currentSections" :key="section._id"
                    class="tree-section" :class="{ selected: selectedSectionId === section._id }"
                    @click="selectSection(section)"
                  >
                    <div class="tree-section-header">
                      <i class="bi bi-folder2-open"></i>
                      <span class="tree-section-title">{{ section.sectionTitle || "Untitled" }}</span>
                      <div class="tree-section-actions">
                        <button @click.stop="deleteSection(section)"><i class="bi bi-trash3"></i></button>
                      </div>
                    </div>
                    <div class="tree-items" v-if="selectedSectionId === section._id">
                      <div
                        v-for="item in section.contentItems" :key="item._id"
                        class="tree-item" :class="{ selected: selectedItemId === item._id }"
                        @click.stop="selectItem(item)"
                      >
                        <i :class="getContentIcon(item.contentType)"></i>
                        {{ item.title || "Untitled" }}
                      </div>
                      <div
                        v-for="q in section.questions" :key="q._id"
                        class="tree-item tree-question" :class="{ selected: selectedQuestionId === q._id }"
                        @click.stop="selectQuestion(q)"
                      >
                        <i class="bi bi-question-circle"></i>
                        Q{{ q.questionNumber }}. {{ truncate(q.questionText, 20) }}
                      </div>
                    </div>
                  </div>
                  <div v-if="currentSections.length === 0" class="tree-empty">
                    No sections yet.<br/>Click <strong>Add</strong> to start.
                  </div>
                </template>
              </div>
            </div>

            <!-- RIGHT EDITOR -->
            <div class="editor-panel">

              <!-- Section editor -->
              <div v-if="selectedSection && !selectedItem && !selectedQuestion" class="editor-block">
                <div class="editor-header">
                  <h3><i class="bi bi-folder2-open"></i> Section</h3>
                  <div class="editor-actions">
                    <button class="btn-add-content" @click="addContentItem(selectedSection)">
                      <i class="bi bi-file-earmark-plus"></i> Add Content
                    </button>
                    <button class="btn-add-q" @click="addQuestion(selectedSection)">
                      <i class="bi bi-plus-circle"></i> Add Question
                    </button>
                  </div>
                </div>
                <div class="form-grid">
                  <div class="form-field full"><label>Section Title</label>
                    <input v-model="selectedSection.sectionTitle" placeholder="e.g. Part 1" /></div>
                  <div class="form-field"><label>Section Code</label>
                    <input v-model="selectedSection.sectionCode" placeholder="e.g. R-P1" /></div>
                  <div class="form-field"><label>Duration (min)</label>
                    <input type="number" v-model.number="selectedSection.duration" min="0" /></div>
                  <div class="form-field"><label>Max Score</label>
                    <input type="number" v-model.number="selectedSection.maxScore" min="0" step="0.5" /></div>
                  <div class="form-field full"><label>Instructions</label>
                    <textarea v-model="selectedSection.instructions" rows="3" placeholder="Instructions for students..." /></div>
                </div>
                <div class="section-summary">
                  <div class="summary-pill"><i class="bi bi-collection"></i> {{ selectedSection.contentItems?.length || 0 }} content items</div>
                  <div class="summary-pill"><i class="bi bi-question-circle"></i> {{ selectedSection.questions?.length || 0 }} questions</div>
                </div>
              </div>

              <!-- Content item editor -->
              <div v-else-if="selectedItem" class="editor-block">
                <div class="editor-header">
                  <h3><i class="bi bi-file-earmark-text"></i> Content Item</h3>
                  <button class="btn-delete-item" @click="deleteContentItem(selectedItem)">
                    <i class="bi bi-trash3"></i> Delete
                  </button>
                </div>
                <div class="form-grid">
                  <div class="form-field"><label>Type</label>
                    <select v-model="selectedItem.contentType">
                      <option value="text">Text / Passage</option>
                      <option value="audio">Audio</option>
                      <option value="image">Image</option>
                    </select>
                  </div>
                  <div class="form-field"><label>Title</label>
                    <input v-model="selectedItem.title" placeholder="e.g. Passage 1" /></div>
                  <div class="form-field full"><label>Instruction</label>
                    <input v-model="selectedItem.instruction" placeholder="e.g. Read and answer..." /></div>
                  <div v-if="selectedItem.contentType === 'text'" class="form-field full"><label>Content</label>
                    <textarea v-model="selectedItem.content" rows="10" class="monospace" placeholder="Paste text here..." /></div>
                  <template v-if="selectedItem.contentType === 'audio'">
                    <div class="form-field full"><label>Audio URL</label>
                      <input v-model="selectedItem.audioUrl" placeholder="uploads/audio/folder/file.mp3" /></div>
                    <div class="form-field"><label>Duration (sec)</label>
                      <input type="number" v-model.number="selectedItem.audioDuration" min="0" /></div>
                    <div class="form-field full"><label>Transcript (optional)</label>
                      <textarea v-model="selectedItem.transcript" rows="4" placeholder="Transcript..." /></div>
                    <div v-if="selectedItem.audioUrl" class="form-field full">
                      <audio controls :src="getAudioUrl(selectedItem.audioUrl)" class="preview-player"></audio>
                    </div>
                  </template>
                  <template v-if="selectedItem.contentType === 'image'">
                    <div class="form-field full"><label>Image URL</label>
                      <input v-model="selectedItem.imageUrl" placeholder="https://..." /></div>
                    <div v-if="selectedItem.imageUrl" class="form-field full">
                      <img :src="selectedItem.imageUrl" class="img-preview" alt="Preview" />
                    </div>
                  </template>
                </div>
              </div>

              <!-- Question editor -->
              <div v-else-if="selectedQuestion" class="editor-block">
                <div class="editor-header">
                  <h3><i class="bi bi-question-circle"></i> Question {{ selectedQuestion.questionNumber }}</h3>
                  <button class="btn-delete-item" @click="deleteQuestion(selectedQuestion)">
                    <i class="bi bi-trash3"></i> Delete
                  </button>
                </div>
                <div class="form-grid">
                  <div class="form-field"><label>Question #</label>
                    <input type="number" v-model.number="selectedQuestion.questionNumber" min="1" /></div>
                  <div class="form-field"><label>Type</label>
                    <select v-model="selectedQuestion.questionType" @change="onTypeChange(selectedQuestion)">
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True / False</option>
                      <option value="fill_blank">Fill in Blank</option>
                      <option value="short_answer">Short Answer</option>
                      <option value="essay">Essay (Writing)</option>
                      <option value="letter">Letter / Email</option>
                      <option value="speaking_response">Speaking Response</option>
                    </select>
                  </div>
                  <div class="form-field"><label>Points</label>
                    <input type="number" v-model.number="selectedQuestion.points" min="0" step="0.5" /></div>
                  <div class="form-field full"><label>Question Text</label>
                    <textarea v-model="selectedQuestion.questionText" rows="3" placeholder="Enter question..." /></div>
                </div>
                <!-- MCQ answers -->
                <div v-if="['multiple_choice','true_false'].includes(selectedQuestion.questionType)" class="answers-editor">
                  <div class="answers-header">
                    <span>Answer Options</span>
                    <button v-if="selectedQuestion.questionType === 'multiple_choice'" class="btn-add-ans" @click="addAnswer(selectedQuestion)">
                      <i class="bi bi-plus-lg"></i> Add
                    </button>
                  </div>
                  <div v-for="(ans, idx) in selectedQuestion.answers" :key="idx" class="answer-row" :class="{ correct: ans.isCorrect }">
                    <span class="ans-key">{{ ans.answerKey }}</span>
                    <input v-model="ans.answerText" class="ans-input" placeholder="Answer text..." />
                    <button class="btn-correct" :class="{ active: ans.isCorrect }" @click="setCorrectAnswer(selectedQuestion, idx)">
                      <i class="bi" :class="ans.isCorrect ? 'bi-check-circle-fill' : 'bi-circle'"></i>
                    </button>
                    <button v-if="selectedQuestion.questionType === 'multiple_choice'" class="btn-del-ans" @click="removeAnswer(selectedQuestion, idx)">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
                <!-- Task prompt -->
                <div v-if="['essay','letter','speaking_response'].includes(selectedQuestion.questionType)" class="prompt-editor">
                  <div class="prompt-editor-title"><i class="bi bi-file-earmark-text"></i> Task Prompt</div>
                  <div class="form-grid">
                    <div v-if="selectedQuestion.questionType === 'letter'" class="form-field full"><label>Situation</label>
                      <textarea v-model="selectedQuestion.taskPrompt.situation" rows="3" placeholder="Describe the situation..." /></div>
                    <div class="form-field full"><label>Requirements</label>
                      <textarea v-model="selectedQuestion.taskPrompt.requirements" rows="4" placeholder="Requirements (one per line)..." /></div>
                    <div v-if="selectedQuestion.questionType === 'speaking_response'" class="form-field full"><label>Cue Card</label>
                      <textarea v-model="selectedQuestion.taskPrompt.cueCard" rows="5" placeholder="Topic: ...&#10;- Cue 1" /></div>
                    <div class="form-field"><label>Min Words</label>
                      <input type="number" v-model.number="selectedQuestion.taskPrompt.minWords" min="0" /></div>
                    <div class="form-field"><label>Time (min)</label>
                      <input type="number" v-model.number="selectedQuestion.taskPrompt.suggestedTime" min="0" /></div>
                  </div>
                </div>
              </div>

              <!-- Empty state -->
              <div v-else class="editor-empty">
                <i class="bi bi-arrow-left-circle"></i>
                <p>Select a section or question from the left panel to start editing.</p>
                <button v-if="currentSections.length === 0" class="btn-start" @click="addSection(activeSkill)">
                  <i class="bi bi-plus-circle"></i> Add first section
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import http from '@/api/http'
import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  testId: { type: [Number, String], default: null }
})
const emit = defineEmits(['close', 'saved'])
const toast = useToast()

// ── Media URL helper ───────────────────────────────────────────
// DB lưu path tương đối: 'uploads/audio/folder/file.mp3'
// Cần ghép với base URL của backend
const BASE_MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost/NamThuEdu2/backend/app/'

const getAudioUrl = (path) => {
  if (!path) return ''
  // Nếu đã là URL đầy đủ thì giữ nguyên
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path
  return BASE_MEDIA_URL + path
}

const loading     = ref(false)
const saving      = ref(false)
const activeSkill = ref('reading')
const test = ref({ id: null, title: '', examType: '', status: 'draft',
  skills: { reading: [], listening: [], writing: [], speaking: [] } })
const selectedSectionId  = ref(null)
const selectedItemId     = ref(null)
const selectedQuestionId = ref(null)
const saveStatus = ref({ type: 'idle', icon: 'bi bi-dash-circle', text: 'No changes' })

const skillTabs = [
  { key: 'reading',   label: 'Reading',   icon: 'bi bi-book' },
  { key: 'listening', label: 'Listening', icon: 'bi bi-headphones' },
  { key: 'writing',   label: 'Writing',   icon: 'bi bi-pencil-square' },
  { key: 'speaking',  label: 'Speaking',  icon: 'bi bi-mic' },
]

const currentSections = computed(() => test.value.skills[activeSkill.value] || [])
const selectedSection = computed(() => currentSections.value.find(s => s._id === selectedSectionId.value) || null)
const selectedItem = computed(() => {
  if (!selectedSection.value || !selectedItemId.value) return null
  return selectedSection.value.contentItems?.find(i => i._id === selectedItemId.value) || null
})
const selectedQuestion = computed(() => {
  if (!selectedSection.value || !selectedQuestionId.value) return null
  return selectedSection.value.questions?.find(q => q._id === selectedQuestionId.value) || null
})

watch(() => props.isOpen, (val) => {
  if (val && props.testId) { resetState(); fetchTest() }
})
watch(activeSkill, () => {
  selectedSectionId.value = selectedItemId.value = selectedQuestionId.value = null
})

const resetState = () => {
  activeSkill.value = 'reading'
  selectedSectionId.value = selectedItemId.value = selectedQuestionId.value = null
  test.value = { id: null, title: '', examType: '', status: 'draft',
    skills: { reading: [], listening: [], writing: [], speaking: [] } }
  setSaveStatus('idle')
}

const fetchTest = async () => {
  loading.value = true
  try {
    const res = await http.get(`/api/teacher/tests/${props.testId}/builder`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (res.data.code === 'SUCCESS') { mapApiToLocal(res.data.data); setSaveStatus('saved') }
  } catch { toast.error('Failed to load test content') }
  finally { loading.value = false }
}

const saveAll = async () => {
  saving.value = true; setSaveStatus('saving')
  try {
    const res = await http.put(`/api/teacher/tests/${props.testId}/builder`, mapLocalToApi(), {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    if (res.data.code === 'SUCCESS') {
      setSaveStatus('saved'); toast.success('Saved successfully!')
      emit('saved'); await fetchTest()
    }
  } catch (e) {
    setSaveStatus('error'); toast.error('Save failed: ' + (e.response?.data?.message || e.message))
  } finally { saving.value = false }
}

const mapApiToLocal = (data) => {
  test.value.id = data.id; test.value.title = data.title
  test.value.examType = data.examType || ''; test.value.status = data.status?.toLowerCase() || 'draft'
  const skills = { reading: [], listening: [], writing: [], speaking: [] }
  ;(data.skills || []).forEach(sg => {
    const skill = sg.skillCode?.toLowerCase()
    if (!skills[skill]) return
    skills[skill] = (sg.sections || []).map(sec => ({
      _id: sec.id || uid(), id: sec.id || null,
      sectionCode: sec.sectionCode || '', sectionTitle: sec.sectionTitle || '',
      duration: sec.duration || 0, maxScore: sec.maxScore || 0,
      instructions: sec.instructions || '', skill,
      contentItems: (sec.contentItems || []).map(mapCI),
      questions: (sec.questions || []).map(mapQ),
    }))
  })
  test.value.skills = skills
}

const mapCI = (ci) => ({
  _id: ci.id || uid(), id: ci.id || null,
  contentType: ci.contentType || 'text', title: ci.title || '',
  instruction: ci.instruction || '', content: ci.content || ci.contentText || '',
  audioUrl: ci.audioUrl || '', audioDuration: ci.audioDuration || 0,
  transcript: ci.transcript || '', imageUrl: ci.imageUrl || '',
})

const mapQ = (q) => ({
  _id: q.id || uid(), id: q.id || null,
  questionNumber: q.questionNumber || 1, questionType: q.questionType || 'multiple_choice',
  questionText: q.questionText || '', points: q.points || 1,
  answers: (q.answers || []).map((a, i) => ({
    _id: a.id || uid(), id: a.id || null,
    answerKey: a.answerKey || String.fromCharCode(65 + i),
    answerText: a.answerText || '', isCorrect: a.isCorrect || false,
  })),
  taskPrompt: q.taskPrompt ? {
    situation: q.taskPrompt.situation || '', requirements: q.taskPrompt.requirements || '',
    cueCard: q.taskPrompt.cueCard || '', minWords: q.taskPrompt.minWords || 0,
    suggestedTime: q.taskPrompt.suggestedTime || 0,
  } : null,
})

const mapLocalToApi = () => ({
  skills: Object.entries(test.value.skills).map(([skillCode, sections]) => ({
    skillCode,
    sections: sections.map(sec => ({
      id: sec.id, sectionCode: sec.sectionCode, sectionTitle: sec.sectionTitle,
      duration: sec.duration, maxScore: sec.maxScore, instructions: sec.instructions,
      contentItems: (sec.contentItems || []).map(ci => ({
        id: ci.id, contentType: ci.contentType, title: ci.title,
        instruction: ci.instruction, content: ci.content,
        audioUrl: ci.audioUrl, audioDuration: ci.audioDuration,
        transcript: ci.transcript, imageUrl: ci.imageUrl,
      })),
      questions: (sec.questions || []).map(q => ({
        id: q.id, questionNumber: q.questionNumber, questionType: q.questionType,
        questionText: q.questionText, points: q.points,
        answers: (q.answers || []).map(a => ({
          id: a.id, answerKey: a.answerKey, answerText: a.answerText, isCorrect: a.isCorrect,
        })),
        taskPrompt: q.taskPrompt,
      })),
    }))
  }))
})

const addSection = (skill) => {
  const idx = (test.value.skills[skill] || []).length + 1
  const s = { _id: uid(), id: null, skill,
    sectionCode: `${skill[0].toUpperCase()}-P${idx}`, sectionTitle: `Part ${idx}`,
    duration: 20, maxScore: 10, instructions: '', contentItems: [], questions: [] }
  test.value.skills[skill].push(s)
  selectedSectionId.value = s._id; selectedItemId.value = selectedQuestionId.value = null
}

const deleteSection = async (section) => {
  const r = await Swal.fire({ title: 'Delete section?',
    text: `"${section.sectionTitle}" and all its content will be removed.`,
    icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!r.isConfirmed) return
  const list = test.value.skills[activeSkill.value]
  const idx = list.findIndex(s => s._id === section._id)
  if (idx > -1) list.splice(idx, 1)
  if (selectedSectionId.value === section._id)
    selectedSectionId.value = selectedItemId.value = selectedQuestionId.value = null
}

const addContentItem = (section) => {
  const item = mapCI({ contentType: 'text', title: 'New Content' })
  section.contentItems = section.contentItems || []
  section.contentItems.push(item)
  selectedItemId.value = item._id; selectedQuestionId.value = null
}

const deleteContentItem = (item) => {
  if (!selectedSection.value) return
  const idx = selectedSection.value.contentItems.findIndex(i => i._id === item._id)
  if (idx > -1) selectedSection.value.contentItems.splice(idx, 1)
  selectedItemId.value = null
}

const addQuestion = (section) => {
  const nextNum = (section.questions?.length || 0) + 1
  const isWS = ['writing', 'speaking'].includes(activeSkill.value)
  const type = isWS ? (activeSkill.value === 'writing' ? 'essay' : 'speaking_response') : 'multiple_choice'
  const q = mapQ({
    questionNumber: nextNum, questionType: type, questionText: '', points: 1,
    answers: type === 'multiple_choice'
      ? ['A','B','C','D'].map(k => ({ answerKey: k, answerText: '', isCorrect: false })) : [],
    taskPrompt: isWS ? { situation: '', requirements: '', cueCard: '', minWords: 0, suggestedTime: 20 } : null,
  })
  section.questions = section.questions || []
  section.questions.push(q)
  selectedQuestionId.value = q._id; selectedItemId.value = null
}

const deleteQuestion = async (question) => {
  const r = await Swal.fire({ title: 'Delete question?',
    text: `Question ${question.questionNumber} will be removed.`,
    icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!r.isConfirmed) return
  const questions = selectedSection.value?.questions
  if (!questions) return
  const idx = questions.findIndex(q => q._id === question._id)
  if (idx > -1) questions.splice(idx, 1)
  selectedQuestionId.value = null
}

const onTypeChange = (question) => {
  const needsAnswers = ['multiple_choice', 'true_false'].includes(question.questionType)
  const needsPrompt  = ['essay', 'letter', 'speaking_response'].includes(question.questionType)
  if (needsAnswers && (!question.answers || !question.answers.length)) {
    question.answers = question.questionType === 'true_false'
      ? [{ _id: uid(), id: null, answerKey: 'A', answerText: 'True',  isCorrect: false },
         { _id: uid(), id: null, answerKey: 'B', answerText: 'False', isCorrect: false }]
      : ['A','B','C','D'].map(k => ({ _id: uid(), id: null, answerKey: k, answerText: '', isCorrect: false }))
  }
  if (needsPrompt && !question.taskPrompt)
    question.taskPrompt = { situation: '', requirements: '', cueCard: '', minWords: 0, suggestedTime: 20 }
}

const addAnswer = (question) => {
  const nextKey = String.fromCharCode(65 + (question.answers?.length || 0))
  question.answers = question.answers || []
  question.answers.push({ _id: uid(), id: null, answerKey: nextKey, answerText: '', isCorrect: false })
}
const removeAnswer     = (q, idx) => q.answers.splice(idx, 1)
const setCorrectAnswer = (q, idx) => q.answers.forEach((a, i) => { a.isCorrect = i === idx })

const selectSection  = (s) => { selectedSectionId.value = s._id; selectedItemId.value = selectedQuestionId.value = null }
const selectItem     = (i) => { selectedItemId.value = i._id; selectedQuestionId.value = null }
const selectQuestion = (q) => { selectedQuestionId.value = q._id; selectedItemId.value = null }

const handleClose = async () => {
  if (saveStatus.value.type === 'saved' || saveStatus.value.type === 'idle') { emit('close'); return }
  const r = await Swal.fire({ title: 'Close without saving?', text: 'You have unsaved changes.',
    icon: 'warning', showCancelButton: true, confirmButtonText: 'Close anyway', cancelButtonText: 'Stay', confirmButtonColor: '#dc2626' })
  if (r.isConfirmed) emit('close')
}

let _uid = 1
const uid = () => `new_${_uid++}`
const truncate = (s, n) => s && s.length > n ? s.slice(0, n) + '\u2026' : (s || '')
const getSectionCount = (skill) => (test.value.skills[skill] || []).length
const getContentIcon = (t) => ({ audio: 'bi bi-music-note-beamed', image: 'bi bi-image', text: 'bi bi-file-text' })[t] || 'bi bi-file'
const setSaveStatus = (type) => {
  saveStatus.value = {
    idle:   { type: 'idle',   icon: 'bi bi-dash-circle',      text: 'No changes' },
    saving: { type: 'saving', icon: 'bi bi-arrow-repeat spin',  text: 'Saving...'  },
    saved:  { type: 'saved',  icon: 'bi bi-check-circle',      text: 'All saved'  },
    error:  { type: 'error',  icon: 'bi bi-x-circle',          text: 'Save failed'},
  }[type]
}
</script>

<style scoped>
.builder-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.55); backdrop-filter: blur(3px);
  z-index: 1200;
  display: flex; align-items: stretch; justify-content: flex-end;
}
.builder-modal {
  width: min(92vw, 1200px); height: 100vh;
  background: #f4f5f7; display: flex; flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.25);
}
.builder-slide-enter-active { transition: opacity .22s ease; }
.builder-slide-leave-active { transition: opacity .18s ease; }
.builder-slide-enter-active .builder-modal,
.builder-slide-leave-active .builder-modal { transition: transform .25s ease; }
.builder-slide-enter-from { opacity: 0; }
.builder-slide-enter-from .builder-modal { transform: translateX(60px); }
.builder-slide-leave-to { opacity: 0; }
.builder-slide-leave-to .builder-modal { transform: translateX(60px); }

.top-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 20px; height: 54px; background: #111827; color: white; flex-shrink: 0; gap: 16px;
}
.top-bar-left, .top-bar-right { display: flex; align-items: center; gap: 12px; }
.back-btn {
  background: rgba(255,255,255,0.1); border: none; color: white;
  width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; font-size: 15px; transition: background .15s;
}
.back-btn:hover { background: rgba(255,255,255,0.22); }
.exam-meta { display: flex; align-items: center; gap: 9px; }
.exam-type-badge {
  font-size: 11px; font-weight: 700; padding: 3px 9px; background: #6366f1;
  border-radius: 5px; letter-spacing: .05em; text-transform: uppercase;
}
.exam-title-text {
  font-size: 15px; font-weight: 600; color: #f9fafb;
  max-width: 340px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.save-status {
  font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 12px;
}
.save-status.idle { color: #6b7280; }
.save-status.saving { color: #fbbf24; }
.save-status.saved { color: #6ee7b7; }
.save-status.error { color: #fca5a5; }
.btn-save-all {
  display: flex; align-items: center; gap: 6px; background: #6366f1; color: white; border: none;
  border-radius: 7px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s;
}
.btn-save-all:hover:not(:disabled) { background: #4f46e5; }
.btn-save-all:disabled { background: #6b7280; cursor: not-allowed; }

.skill-tabs { display: flex; gap: 1px; background: #1f2937; padding: 0 20px; flex-shrink: 0; }
.skill-tab {
  display: flex; align-items: center; gap: 6px; padding: 10px 15px; border: none;
  background: transparent; color: #9ca3af; font-size: 13px; font-weight: 600; cursor: pointer;
  border-bottom: 3px solid transparent; transition: all .15s;
}
.skill-tab:hover { color: #e5e7eb; }
.skill-tab.active { color: white; border-bottom-color: #6366f1; }
.tab-count { background: rgba(255,255,255,0.12); border-radius: 10px; padding: 1px 7px; font-size: 11px; }
.skill-tab.active .tab-count { background: #6366f1; }

.builder-body { display: flex; flex: 1; overflow: hidden; }

.sidebar-tree {
  width: 235px; background: white; border-right: 1px solid #e5e7eb;
  display: flex; flex-direction: column; flex-shrink: 0;
}
.tree-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 14px; border-bottom: 1px solid #f3f4f6;
  font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .05em;
}
.btn-add-section {
  display: flex; align-items: center; gap: 4px; background: #111827; color: white;
  border: none; border-radius: 6px; padding: 4px 10px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.tree-list { overflow-y: auto; flex: 1; padding: 6px; }
.skeleton-item {
  height: 38px; border-radius: 7px; margin-bottom: 6px;
  background: linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%);
  background-size: 200% 100%; animation: shimmer 1.2s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
.tree-section {
  margin-bottom: 3px; border-radius: 7px; border: 1px solid transparent; cursor: pointer; transition: all .12s;
}
.tree-section:hover { background: #f9fafb; border-color: #e5e7eb; }
.tree-section.selected { background: #eff6ff; border-color: #bfdbfe; }
.tree-section-header {
  display: flex; align-items: center; gap: 7px; padding: 8px 10px; font-size: 13px; font-weight: 600; color: #374151;
}
.tree-section-header > i { color: #6366f1; font-size: 13px; }
.tree-section-title { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tree-section-actions { opacity: 0; transition: opacity .12s; }
.tree-section:hover .tree-section-actions { opacity: 1; }
.tree-section-actions button { background: none; border: none; color: #ef4444; cursor: pointer; padding: 2px 4px; font-size: 11px; }
.tree-items { padding: 2px 6px 6px 22px; display: flex; flex-direction: column; gap: 1px; }
.tree-item {
  display: flex; align-items: center; gap: 5px; padding: 5px 7px; border-radius: 5px;
  font-size: 12px; color: #6b7280; cursor: pointer; transition: all .12s;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.tree-item:hover { background: #f3f4f6; color: #374151; }
.tree-item.selected { background: #dbeafe; color: #1e40af; }
.tree-item i { font-size: 11px; flex-shrink: 0; }
.tree-question { color: #7c3aed; }
.tree-question.selected { background: #ede9fe; color: #5b21b6; }
.tree-empty { padding: 24px 12px; text-align: center; font-size: 13px; color: #9ca3af; line-height: 1.7; }

.editor-panel { flex: 1; overflow-y: auto; padding: 18px; }
.editor-block { background: white; border-radius: 10px; border: 1px solid #e5e7eb; padding: 18px; margin-bottom: 14px; }
.editor-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 16px; padding-bottom: 13px; border-bottom: 1.5px solid #f3f4f6;
}
.editor-header h3 { margin: 0; font-size: 15px; font-weight: 700; color: #111827; display: flex; align-items: center; gap: 7px; }
.editor-header h3 i { color: #6366f1; }
.editor-actions { display: flex; gap: 7px; }
.btn-add-content, .btn-add-q {
  display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 7px;
  font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all .15s;
}
.btn-add-content { background: #eff6ff; color: #1d4ed8; }
.btn-add-content:hover { background: #dbeafe; }
.btn-add-q { background: #111827; color: white; }
.btn-add-q:hover { background: #1f2937; }
.btn-delete-item {
  display: flex; align-items: center; gap: 5px; padding: 7px 12px; border-radius: 7px;
  font-size: 13px; font-weight: 600; cursor: pointer; background: #fff5f5; color: #dc2626; border: 1px solid #fecaca;
}
.btn-delete-item:hover { background: #fee2e2; }

.form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 13px; }
.form-field { display: flex; flex-direction: column; gap: 5px; }
.form-field.full { grid-column: 1/-1; }
.form-field label { font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .05em; }
.form-field input, .form-field select, .form-field textarea {
  padding: 8px 11px; border: 1.5px solid #e5e7eb; border-radius: 7px;
  font-size: 14px; color: #111827; background: #fafafa; outline: none; transition: all .15s; font-family: inherit;
}
.form-field input:focus, .form-field select:focus, .form-field textarea:focus {
  border-color: #6366f1; background: white; box-shadow: 0 0 0 3px rgba(99,102,241,.08);
}
.form-field textarea { resize: vertical; }
.form-field textarea.monospace { font-family: 'Courier New',monospace; font-size: 13px; }
.section-summary { display: flex; gap: 10px; margin-top: 8px; }
.summary-pill {
  display: flex; align-items: center; gap: 6px; padding: 5px 12px;
  background: #f3f4f6; border-radius: 20px; font-size: 12px; color: #6b7280; font-weight: 500;
}

.answers-editor { background: #f9fafb; border: 1.5px solid #e5e7eb; border-radius: 10px; padding: 13px; margin-top: 14px; }
.answers-header {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px;
  font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .05em;
}
.btn-add-ans {
  display: flex; align-items: center; gap: 4px; background: #eff6ff; color: #1d4ed8;
  border: none; border-radius: 5px; padding: 4px 9px; font-size: 12px; font-weight: 600; cursor: pointer;
}
.answer-row {
  display: flex; align-items: center; gap: 7px; padding: 7px; border-radius: 7px; margin-bottom: 5px;
  background: white; border: 1.5px solid #e5e7eb; transition: all .12s;
}
.answer-row.correct { border-color: #10b981; background: #f0fdf4; }
.ans-key { font-weight: 700; font-size: 13px; color: #6b7280; min-width: 18px; text-align: center; }
.answer-row.correct .ans-key { color: #065f46; }
.ans-input { flex: 1; border: none; background: transparent; font-size: 13px; color: #374151; outline: none; }
.btn-correct { background: none; border: none; cursor: pointer; font-size: 17px; color: #d1d5db; padding: 2px; transition: color .12s; }
.btn-correct.active, .btn-correct:hover { color: #10b981; }
.btn-del-ans { background: none; border: none; cursor: pointer; color: #d1d5db; font-size: 11px; padding: 4px; transition: color .12s; }
.btn-del-ans:hover { color: #ef4444; }

.prompt-editor {
  background: linear-gradient(135deg,#fffbeb,#fef3c7); border: 1.5px solid #fbbf24;
  border-radius: 10px; padding: 13px; margin-top: 14px;
}
.prompt-editor-title {
  display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 700; color: #92400e;
  text-transform: uppercase; letter-spacing: .05em; margin-bottom: 11px;
}

.preview-player { width: 100%; height: 42px; border-radius: 7px; }
.img-preview { max-width: 100%; max-height: 180px; border-radius: 7px; border: 1px solid #e5e7eb; margin-top: 6px; }

.editor-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  height: 100%; min-height: 260px; text-align: center; color: #9ca3af;
}
.editor-empty i { font-size: 42px; margin-bottom: 13px; color: #d1d5db; }
.editor-empty p { font-size: 14px; line-height: 1.6; max-width: 250px; margin-bottom: 16px; }
.btn-start {
  display: flex; align-items: center; gap: 7px; background: #111827; color: white;
  border: none; border-radius: 8px; padding: 10px 18px; font-size: 14px; font-weight: 600; cursor: pointer;
}

@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.spin { display: inline-block; animation: spin 1s linear infinite; }

@media (max-width: 640px) {
  .builder-modal { width: 100vw; }
  .sidebar-tree { width: 190px; }
  .exam-title-text { max-width: 160px; }
}
</style>