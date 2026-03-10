<template>
  <div class="task-prompt-section">
    <!-- Situation (cho Email/Letter) -->
    <div v-if="data.situation" class="prompt-situation">
      <div class="prompt-label">
        <i class="bi bi-envelope"></i>
        Situation
      </div>
      <p class="prompt-text">{{ data.situation }}</p>
    </div>

    <!-- Main Prompt Text -->
    <div v-if="data.promptText" class="prompt-main">
      <div class="prompt-label">
        <i class="bi bi-file-text"></i>
        Prompt
      </div>
      <div class="prompt-text" v-html="data.promptText"></div>
    </div>

    <!-- Requirements (bullet points) -->
    <div v-if="data.requirements" class="prompt-requirements">
      <div class="prompt-label">
        <i class="bi bi-list-check"></i>
        Requirements
      </div>
      <pre class="requirements-text">{{ data.requirements }}</pre>
    </div>

    <!-- Cue Card (Speaking Part 2) -->
    <div v-if="data.cueCard" class="prompt-cue-card">
      <div class="cue-card-header">
        <i class="bi bi-card-text"></i>
        Cue Card
      </div>
      <pre class="cue-card-text">{{ data.cueCard }}</pre>
    </div>

    <!-- Chart/Graph (IELTS Writing Task 1) -->
    <div v-if="data.promptChart || data.promptImage" class="prompt-visual">
      <img 
        :src="data.promptChart || data.promptImage" 
        class="prompt-img" 
        alt="Prompt visual"
      />
    </div>

    <!-- Meta Info (word count, time limits) -->
    <div v-if="hasMetaInfo" class="prompt-meta">
      <span v-if="data.minWords" class="meta-badge">
        <i class="bi bi-pencil"></i>
        Min: {{ data.minWords }} words
      </span>
      <span v-if="data.maxWords" class="meta-badge">
        <i class="bi bi-file-text"></i>
        Max: {{ data.maxWords }} words
      </span>
      <span v-if="data.preparationTime" class="meta-badge">
        <i class="bi bi-clock"></i>
        Prep: {{ data.preparationTime }}s
      </span>
      <span v-if="data.suggestedTime" class="meta-badge">
        <i class="bi bi-hourglass-split"></i>
        Time: {{ data.suggestedTime }} min
      </span>
    </div>

    <!-- Rubric (Scoring Criteria) -->
    <details v-if="data.rubric" class="rubric-details">
      <summary>
        <i class="bi bi-clipboard-data"></i>
        Scoring Rubric
      </summary>
      <div class="rubric-content">
        <div 
          v-for="(criterion, key) in data.rubric" 
          :key="key"
          class="rubric-item"
        >
          <span class="rubric-label">{{ formatRubricKey(key) }}</span>
          <span class="rubric-weight">{{ getCriterionWeight(criterion) }}%</span>
          <span v-if="getCriterionDescription(criterion)" class="rubric-desc">
            {{ getCriterionDescription(criterion) }}
          </span>
        </div>
      </div>
    </details>

    <!-- Sample Answer -->
    <details v-if="data.sampleAnswer" class="sample-details">
      <summary>
        <i class="bi bi-lightbulb"></i>
        Sample Answer
      </summary>
      <div class="sample-content" v-html="data.sampleAnswer"></div>
    </details>

    <!-- Sample Audio (Speaking) -->
    <div v-if="data.sampleAudio" class="sample-audio">
      <div class="sample-audio-label">
        <i class="bi bi-mic"></i>
        Sample Audio Response
      </div>
      <audio controls class="audio-player">
        <source :src="data.sampleAudio" type="audio/mpeg">
        <source :src="data.sampleAudio" type="audio/wav">
      </audio>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

// Check if có meta info
const hasMetaInfo = computed(() => {
  return props.data.minWords || props.data.maxWords || 
         props.data.preparationTime || props.data.suggestedTime
})

// Helper: Format rubric key names
const formatRubricKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

// Helper: Get criterion weight
const getCriterionWeight = (criterion) => {
  if (typeof criterion === 'object' && criterion.weight !== undefined) {
    return criterion.weight
  }
  return criterion
}

// Helper: Get criterion description
const getCriterionDescription = (criterion) => {
  if (typeof criterion === 'object' && criterion.description) {
    return criterion.description
  }
  return ''
}
</script>

<style scoped>
.task-prompt-section {
  margin-top: 14px;
  padding: 18px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left: 5px solid #f59e0b;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.15);
}

/* ============================================ */
/* PROMPT SECTIONS */
/* ============================================ */

.prompt-situation,
.prompt-main,
.prompt-requirements {
  margin-bottom: 16px;
}

.prompt-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.prompt-label i {
  font-size: 16px;
  color: #f59e0b;
}

.prompt-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.7;
  background: white;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #fcd34d;
}

.prompt-text :deep(p) {
  margin: 0 0 10px 0;
}

.prompt-text :deep(p:last-child) {
  margin-bottom: 0;
}

.prompt-text :deep(strong) {
  color: #111827;
  font-weight: 700;
}

.requirements-text {
  font-size: 14px;
  color: #374151;
  background: white;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #fcd34d;
  white-space: pre-wrap;
  font-family: inherit;
  line-height: 1.7;
  margin: 0;
}

/* ============================================ */
/* CUE CARD */
/* ============================================ */

.prompt-cue-card {
  background: white;
  border: 3px dashed #f59e0b;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.cue-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 2px solid #fef3c7;
}

.cue-card-header i {
  font-size: 18px;
  color: #f59e0b;
}

.cue-card-text {
  font-size: 14px;
  color: #374151;
  white-space: pre-wrap;
  font-family: inherit;
  margin: 0;
  line-height: 1.7;
}

/* ============================================ */
/* VISUAL (Chart/Image) */
/* ============================================ */

.prompt-visual {
  margin-bottom: 16px;
}

.prompt-img {
  max-width: 100%;
  border-radius: 10px;
  border: 2px solid #fcd34d;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* ============================================ */
/* META INFO */
/* ============================================ */

.prompt-meta {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.meta-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  background: white;
  border: 1px solid #fcd34d;
  border-radius: 14px;
  color: #92400e;
  display: flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.meta-badge i {
  font-size: 13px;
  color: #f59e0b;
}

/* ============================================ */
/* RUBRIC */
/* ============================================ */

.rubric-details,
.sample-details {
  margin-bottom: 12px;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.rubric-details summary,
.sample-details summary {
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 4px 0;
}

.rubric-details summary:hover,
.sample-details summary:hover {
  color: #78350f;
}

.rubric-details summary::-webkit-details-marker,
.sample-details summary::-webkit-details-marker {
  display: none;
}

.rubric-details summary::before,
.sample-details summary::before {
  content: "▶";
  display: inline-block;
  transition: transform 0.2s;
  font-size: 10px;
  color: #f59e0b;
}

.rubric-details[open] summary::before,
.sample-details[open] summary::before {
  transform: rotate(90deg);
}

.rubric-details summary i,
.sample-details summary i {
  font-size: 15px;
  color: #f59e0b;
}

.rubric-content {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #fef3c7;
}

.rubric-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 0;
  font-size: 13px;
  border-bottom: 1px solid #fef9c3;
}

.rubric-item:last-child {
  border-bottom: none;
}

.rubric-label {
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
  min-width: 140px;
}

.rubric-weight {
  font-weight: 700;
  color: #f59e0b;
  min-width: 40px;
}

.rubric-desc {
  color: #6b7280;
  font-size: 12px;
  flex: 1;
}

/* ============================================ */
/* SAMPLE CONTENT */
/* ============================================ */

.sample-content {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 2px solid #fef3c7;
  font-size: 14px;
  color: #374151;
  line-height: 1.7;
}

.sample-content :deep(p) {
  margin: 0 0 10px 0;
}

.sample-content :deep(p:last-child) {
  margin-bottom: 0;
}

/* ============================================ */
/* SAMPLE AUDIO */
/* ============================================ */

.sample-audio {
  background: white;
  padding: 14px;
  border-radius: 8px;
  border: 1px solid #fcd34d;
}

.sample-audio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 10px;
}

.sample-audio-label i {
  font-size: 16px;
  color: #f59e0b;
}

.audio-player {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  outline: none;
  background: #fef9c3;
  border: 1px solid #fcd34d;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 768px) {
  .task-prompt-section {
    padding: 14px;
  }

  .prompt-label {
    font-size: 12px;
  }

  .prompt-text,
  .requirements-text,
  .cue-card-text {
    font-size: 13px;
    padding: 10px 12px;
  }

  .meta-badge {
    font-size: 11px;
    padding: 5px 10px;
  }

  .rubric-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .rubric-label,
  .rubric-weight {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .prompt-meta {
    flex-direction: column;
  }

  .meta-badge {
    width: 100%;
    justify-content: center;
  }
}
</style>