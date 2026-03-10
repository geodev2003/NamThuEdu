<template>
  <div class="section-block">
    <!-- Section Header -->
    <div class="section-header">
      <div class="title-wrapper">
        <h3 class="section-title">
          <span class="section-code">{{ section.sectionCode }}</span>
          <span class="section-separator">—</span>
          <span class="section-name">{{ section.sectionTitle }}</span>
        </h3>
        <div class="section-meta">
          <span class="meta-item">
            <i class="bi bi-clock"></i>
            {{ section.duration }} min
          </span>
          <span class="meta-item">
            <i class="bi bi-card-checklist"></i>
            {{ section.totalQuestions }} Qs
          </span>
          <span class="meta-item">
            <i class="bi bi-star"></i>
            {{ section.maxScore }} pts
          </span>
        </div>
      </div>
    </div>

    <!-- Section Instructions -->
    <div v-if="section.instructions" class="section-instructions">
      <div class="instructions-header">
        <i class="bi bi-info-circle-fill"></i>
        <strong>Directions</strong>
      </div>
      <div class="instructions-scroll">
        <div class="instructions-content" v-html="section.instructions"></div>
      </div>
    </div>

    <!-- Content Container -->
    <div class="section-content">
      <!-- ========================================== -->
      <!-- LISTENING: Audio Groups (Audio + Questions) -->
      <!-- ========================================== -->
      <div v-if="isListening && audioGroups.length > 0" class="audio-groups">
        <div v-for="(group, index) in audioGroups" :key="index" class="audio-group">
          <!-- Audio Content -->
          <AudioBlock :item="group.audio" />

          <!-- Questions thuộc audio này -->
          <div v-if="group.questions.length > 0" class="audio-questions">
            <QuestionBlock v-for="question in group.questions" :key="question.id" :question="question" />
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- SPEAKING: Topic Groups (Topic + Questions) -->
      <!-- ========================================== -->
      <div v-else-if="isSpeaking && topicGroups.length > 0" class="topic-groups">
        <div v-for="(group, index) in topicGroups" :key="index" class="topic-group">
          <!-- Topic Header -->
          <div class="topic-header">
            <h4 class="topic-title">
              <i class="bi bi-chat-dots-fill"></i>
              {{ group.topic }}
            </h4>
          </div>

          <!-- Topic Instructions/Requirements (Part 1) -->
          <div v-if="group.requirements" class="topic-requirements">
            <div class="requirements-label">
              <i class="bi bi-info-circle"></i>
              Topic
            </div>
            <div class="requirements-text">{{ group.requirements }}</div>
          </div>

          <!-- Cue Words (Part 3) -->
          <div v-if="group.cueWords" class="topic-cue-words">
            <div class="cue-words-label">
              <i class="bi bi-tags-fill"></i>
              Key Words
            </div>
            <div class="cue-words-list">
              <span v-for="(word, idx) in group.cueWords" :key="idx" class="cue-word-badge">
                {{ word }}
              </span>
            </div>
          </div>

          <!-- Questions thuộc topic này -->
          <div class="topic-questions">
            <div class="questions-label">
              <i class="bi bi-patch-question-fill"></i>
              Questions
            </div>
            <div class="questions-list">
              <div v-for="question in group.questions" :key="question.id" class="speaking-question-item">
                <!-- <span class="q-num">{{ question.questionNumber }}.</span> -->
                <span class="q-text">{{ question.questionText }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- DEFAULT: Reading, Writing (Normal Flow) -->
      <!-- ========================================== -->
      <div v-else>
        <!-- Content Items (Text passages, images) -->
        <div v-if="section.contentItems && section.contentItems.length > 0" class="content-items">
          <AudioBlock v-for="item in section.contentItems" :key="item.id" :item="item" />
        </div>

        <!-- Questions -->
        <div v-if="section.questions && section.questions.length > 0" class="questions-container">
          <QuestionBlock v-for="question in section.questions" :key="question.id" :question="question" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AudioBlock from './AudioBlock.vue'
import QuestionBlock from './QuestionBlock.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  }
})

// Detect section type
const sectionSkill = computed(() => {
  return props.section.skill?.toLowerCase() || ''
})

const isListening = computed(() => sectionSkill.value === 'listening')
const isSpeaking = computed(() => sectionSkill.value === 'speaking')

// ============================================
// LISTENING: Group questions by audio
// ============================================
const audioGroups = computed(() => {
  if (!isListening.value) return []

  const contentItems = props.section.contentItems || []
  const questions = props.section.questions || []

  if (contentItems.length === 0 || questions.length === 0) return []

  // Strategy: Distribute questions evenly across audios
  const questionsPerAudio = Math.ceil(questions.length / contentItems.length)

  return contentItems.map((audio, index) => {
    const startIdx = index * questionsPerAudio
    const endIdx = startIdx + questionsPerAudio
    const audioQuestions = questions.slice(startIdx, endIdx)

    return {
      audio,
      questions: audioQuestions
    }
  })
})

// ============================================
// SPEAKING: Group questions by topic
// ============================================
const topicGroups = computed(() => {
  if (!isSpeaking.value) return []

  const questions = props.section.questions || []
  if (questions.length === 0) return []

  // Group by taskPrompt.situation (Part 1) or cueCard (Part 3)
  const grouped = {}

  questions.forEach(question => {
    const prompt = question.taskPrompt

    if (!prompt) return

    // Determine topic
    let topic = 'General Discussion'
    let requirements = null
    let cueWords = null

    if (prompt.requirements) {
      // Part 1: Interview - use situation as topic
      topic = extractTopic(prompt.requirements) || 'Personal Information'

    } else if (prompt.cueCard) {
      // Part 3: Discussion - extract from cue card
      const extracted = extractTopicAndCues(prompt.cueCard)
      topic = extractTopic(prompt.promptText)
      cueWords = extracted.cueWords
    }

    // Group key
    const key = topic

    if (!grouped[key]) {
      grouped[key] = {
        topic,
        requirements,
        cueWords,
        questions: []
      }
    }

    grouped[key].questions.push(question)
  })

  return Object.values(grouped)
})

// Helper: Extract topic from situation text
const extractTopic = (text) => {
  if (!text) return null

  // Common patterns
  const patterns = [
    /topic:?\s*([^.]+)/i,

    /regarding\s+([^.]+)/i
  ]

  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return match[1].trim()
  }

  // Fallback: use first sentence
  const firstSentence = text.split('.')[0]
  return firstSentence.length < 50 ? firstSentence : null
}

// Helper: Extract topic and cue words from cue card
const extractTopicAndCues = (cueCard) => {
  if (!cueCard) return { topic: 'Discussion', cueWords: [] }

  const lines = cueCard.split('\n').filter(line => line.trim())

  // First line usually is topic
  const topic = lines[0]?.replace(/^topic:?\s*/i, '').trim() || 'Discussion'

  // Extract cue words (words in bullet points or comma-separated)
  const cueWords = []
  lines.forEach(line => {
    const cleaned = line.replace(/^[-•*]\s*/, '').trim()
    if (cleaned && !cleaned.toLowerCase().startsWith('topic')) {
      // Split by comma or use whole line
      const words = cleaned.includes(',')
        ? cleaned.split(',').map(w => w.trim())
        : [cleaned]
      cueWords.push(...words)
    }
  })

  return {
    topic,
    cueWords: cueWords.slice(0, 6) // Limit to 6 words
  }
}
</script>

<style scoped>
.section-block {
  margin-bottom: 28px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.section-block:hover {
  border-color: #d1d5db;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
}

/* Section Header */
.section-header {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  border-bottom: 2px solid #e5e7eb;
}

.title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.section-code {
  font-family: 'Courier New', monospace;
  color: #6366f1;
  background: #eef2ff;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 800;
  border: 1px solid #c7d2fe;
}

.section-separator {
  color: #d1d5db;
  font-weight: 400;
}

.section-name {
  color: #111827;
}

.section-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 13px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.meta-item i {
  font-size: 14px;
  color: #9ca3af;
}

/* Section Instructions */
.section-instructions {
  padding: 16px 20px;
  background: #eff6ff;
  border-bottom: 1px solid #bfdbfe;
}

.instructions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #1e40af;
  font-size: 14px;
}

.instructions-header i {
  font-size: 18px;
  color: #3b82f6;
}

.instructions-header strong {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.instructions-content {
  font-size: 14px;
  line-height: 1.7;
  color: #374151;
  padding: 12px 14px;
  background: white;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
  white-space: pre-line;
}
.instructions-scroll {
  max-height: 360px;   /* chiều cao khung đọc */
  overflow-y: auto;    /* bật scroll dọc */
  padding-right: 6px;
}

/* Tùy chỉnh scrollbar cho đẹp hơn */
.instructions-scroll::-webkit-scrollbar {
  width: 6px;
}

.instructions-scroll::-webkit-scrollbar-thumb {
  background: #cbd5f5;
  border-radius: 4px;
}

.instructions-scroll::-webkit-scrollbar-thumb:hover {
  background: #a5b4fc;
}


/* ============================================ */
/* LISTENING: AUDIO GROUPS */
/* ============================================ */

.section-content {
  padding: 20px;
}

.audio-groups {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.audio-group {
  padding: 20px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
}

.audio-questions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ============================================ */
/* SPEAKING: TOPIC GROUPS */
/* ============================================ */

.topic-groups {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.topic-group {
  padding: 24px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 3px solid #fbbf24;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(251, 191, 36, 0.2);
}

.topic-header {
  margin-bottom: 16px;
  padding-bottom: 14px;
  border-bottom: 2px solid #fbbf24;
}

.topic-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #78350f;
  display: flex;
  align-items: center;
  gap: 10px;
}

.topic-title i {
  font-size: 24px;
  color: #f59e0b;
}

/* Topic Requirements (Part 1) */
.topic-requirements {
  margin-bottom: 16px;
  padding: 14px;
  background: white;
  border-left: 4px solid #f59e0b;
  border-radius: 6px;
}

.requirements-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.requirements-label i {
  color: #f59e0b;
}

.requirements-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
}

/* Cue Words (Part 3) */
.topic-cue-words {
  margin-bottom: 16px;
  padding: 14px;
  background: white;
  border-radius: 6px;
  border: 1px solid #fbbf24;
}

.cue-words-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.cue-words-label i {
  color: #f59e0b;
}

.cue-words-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cue-word-badge {
  padding: 6px 12px;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 14px;
  font-size: 13px;
  font-weight: 600;
  color: #92400e;
}

/* Questions List */
.topic-questions {
  background: white;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid #fbbf24;
}

.questions-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.questions-label i {
  font-size: 16px;
  color: #f59e0b;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.speaking-question-item {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  background: #fef9c3;
  border-left: 3px solid #f59e0b;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
}

.q-num {
  font-weight: 700;
  color: #92400e;
  min-width: 25px;
}

.q-text {
  flex: 1;
  color: #374151;
}

/* ============================================ */
/* DEFAULT (Reading, Writing) */
/* ============================================ */

.content-items,
.questions-container {
  margin-bottom: 20px;

}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 768px) {
  .section-header {
    padding: 14px 16px;
  }

  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .section-title {
    font-size: 16px;
  }

  .section-meta {
    width: 100%;
    justify-content: space-between;
  }

  .section-content {
    padding: 16px;
    white-space: pre-line;
  }

  .audio-group,
  .topic-group {
    padding: 16px;
  }

  .topic-title {
    font-size: 18px;
  }

  .cue-words-list {
    gap: 6px;
  }

  .cue-word-badge {
    font-size: 12px;
    padding: 5px 10px;
  }
}
</style>