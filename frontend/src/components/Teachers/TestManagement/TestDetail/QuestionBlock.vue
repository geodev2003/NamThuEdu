<template>
  <div class="question-block">
    <!-- Question Header -->
    <div class="question-header">
      <span class="q-number">Q{{ question.questionNumber }}</span>
      <span class="q-type-badge" :class="`type-${question.questionType}`">
        {{ formatQuestionType(question.questionType) }}
      </span>
      <span class="q-points">{{ question.points }} {{ question.points > 1 ? 'pts' : 'pt' }}</span>
    </div>

    <!-- Question Text -->
    <div class="question-text">
      <span v-html="question.questionText"></span>
      <img 
        v-if="question.questionImage" 
        :src="question.questionImage" 
        class="question-img" 
        alt="Question image"
      />
    </div>

    <!-- Answers (Multiple Choice, True/False, etc.) -->
    <div v-if="question.answers && question.answers.length > 0" class="answers-list">
      <div 
        v-for="answer in question.answers" 
        :key="answer.id"
        class="answer-option"
        :class="{ 'correct-answer': answer.isCorrect }"
      >
        <span class="answer-key">{{ answer.answerKey }}.</span>
        <span class="answer-text">{{ answer.answerText }}</span>
        <i v-if="answer.isCorrect" class="bi bi-check-circle-fill correct-icon"></i>
      </div>
    </div>

    <!-- Task Prompt (Writing/Speaking) -->
    <TaskPrompt 
      v-if="question.taskPrompt" 
      :data="question.taskPrompt" 
    />
  </div>
</template>

<script setup>
import TaskPrompt from './TaskPrompt.vue'

defineProps({
  question: {
    type: Object,
    required: true
  }
})

// Helper: Format question type for badge
const formatQuestionType = (type) => {
  const typeMap = {
    'multiple_choice': 'Multiple Choice',
    'true_false': 'True/False',
    'fill_blank': 'Fill in Blank',
    'matching': 'Matching',
    'short_answer': 'Short Answer',
    'essay': 'Essay',
    'letter': 'Letter/Email',
    'speaking_response': 'Speaking'
  }
  return typeMap[type] || type
}
</script>

<style scoped>
.question-block {
  margin-bottom: 24px;
  padding: 18px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.question-block:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* ============================================ */
/* QUESTION HEADER */
/* ============================================ */

.question-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
}

.q-number {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  background: #f3f4f6;
  padding: 5px 12px;
  border-radius: 8px;
  min-width: 45px;
  text-align: center;
}

.q-type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 12px;
  text-transform: capitalize;
  flex: 1;
}

.type-multiple_choice {
  background: #dbeafe;
  color: #1e40af;
}

.type-true_false {
  background: #fce7f3;
  color: #be123c;
}

.type-fill_blank {
  background: #e0e7ff;
  color: #4338ca;
}

.type-matching {
  background: #fef3c7;
  color: #b45309;
}

.type-essay,
.type-letter {
  background: #dcfce7;
  color: #15803d;
}

.type-speaking_response {
  background: #ede9fe;
  color: #7c3aed;
}

.q-points {
  font-size: 13px;
  font-weight: 700;
  color: #7c3aed;
  padding: 4px 10px;
  background: #faf5ff;
  border-radius: 12px;
  border: 1px solid #e9d5ff;
}

/* ============================================ */
/* QUESTION TEXT */
/* ============================================ */

.question-text {
  font-size: 15px;
  color: #111827;
  line-height: 1.7;
  margin-bottom: 14px;
  font-weight: 500;
}

.question-text :deep(strong) {
  color: #000;
  font-weight: 700;
}

.question-text :deep(em) {
  color: #6b7280;
  font-style: italic;
}

.question-img {
  display: block;
  max-width: 100%;
  margin-top: 12px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* ============================================ */
/* ANSWERS LIST */
/* ============================================ */

.answers-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.answer-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
  cursor: default;
}

.answer-option:hover {
  background: #f3f4f6;
}

.answer-option.correct-answer {
  background: #d1fae5;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.answer-key {
  font-weight: 700;
  color: #6b7280;
  min-width: 25px;
  font-size: 15px;
}

.answer-option.correct-answer .answer-key {
  color: #065f46;
}

.answer-text {
  flex: 1;
  color: #374151;
  line-height: 1.6;
}

.answer-option.correct-answer .answer-text {
  color: #111827;
  font-weight: 500;
}

.correct-icon {
  color: #10b981;
  font-size: 18px;
  flex-shrink: 0;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 768px) {
  .question-block {
    padding: 14px;
  }

  .question-header {
    flex-wrap: wrap;
  }

  .q-type-badge {
    order: 3;
    width: 100%;
    text-align: center;
  }

  .question-text {
    font-size: 14px;
  }

  .answer-option {
    padding: 10px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .question-header {
    gap: 8px;
  }

  .q-number {
    padding: 4px 10px;
    font-size: 13px;
  }

  .q-points {
    padding: 3px 8px;
    font-size: 12px;
  }
}
</style>