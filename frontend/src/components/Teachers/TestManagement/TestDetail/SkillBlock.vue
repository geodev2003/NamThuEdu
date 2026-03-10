<template>
  <div class="skill-block">
    <!-- Header: Đề thi + Skill -->
    <div class="skill-header">
      <div class="title-wrapper">
        <h2 class="skill-title">
          <span class="exam-prefix">Đề thi:</span>
          <span class="exam-title">{{ examTitle }}</span>
          <span class="skill-separator">—</span>
          <span class="skill-code">{{ skillCode }}</span>
        </h2>
        <div class="skill-badge" :class="`badge-${skillCode.toLowerCase()}`">
          <i :class="getSkillIcon(skillCode)"></i>
          {{ formatSkillName(skillCode) }}
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div v-if="instructions" class="skill-instructions">
      <div class="instructions-header">
        <i class="bi bi-info-circle-fill"></i>
        <strong>Directions</strong>
      </div>
      <div class="instructions-content" v-html="instructions"></div>
    </div>

    <!-- Sections List -->
    <div class="sections-container">
      <SectionBlock
        v-for="section in sections"
        :key="section.id"
        :section="section"
      />
    </div>
  </div>
</template>

<script setup>
import SectionBlock from './SectionBlock.vue'

const props = defineProps({
  examTitle: {
    type: String,
    required: true
  },
  skillCode: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    default: ''
  },
  sections: {
    type: Array,
    default: () => []
  }
})

// Helper: Get icon cho từng skill
const getSkillIcon = (skill) => {
  const iconMap = {
    'reading': 'bi bi-book',
    'listening': 'bi bi-headphones',
    'writing': 'bi bi-pencil-square',
    'speaking': 'bi bi-mic'
  }
  return iconMap[skill.toLowerCase()] || 'bi bi-file-text'
}

// Helper: Format skill name
const formatSkillName = (skill) => {
  return skill.charAt(0).toUpperCase() + skill.slice(1).toLowerCase()
}
</script>

<style scoped>
.skill-block {
  margin-bottom: 40px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  overflow: hidden;
}

/* ============================================ */
/* SKILL HEADER */
/* ============================================ */

.skill-header {
  padding: 20px 24px;
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

.skill-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  line-height: 1.4;
}

.exam-prefix {
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
}

.exam-title {
  color: #111827;
}

.skill-separator {
  color: #d1d5db;
  font-weight: 400;
}

.skill-code {
  color: #3b82f6;
  text-transform: uppercase;
  font-weight: 800;
}

/* Skill Badge */
.skill-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skill-badge i {
  font-size: 18px;
}

.badge-reading {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 2px solid #93c5fd;
}

.badge-listening {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
  color: #be123c;
  border: 2px solid #f9a8d4;
}

.badge-writing {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #15803d;
  border: 2px solid #86efac;
}

.badge-speaking {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #b45309;
  border: 2px solid #fcd34d;
}

/* ============================================ */
/* INSTRUCTIONS */
/* ============================================ */

.skill-instructions {
  padding: 20px 24px;
  background: #fffbeb;
  border-bottom: 2px solid #fde047;
}

.instructions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #92400e;
  font-size: 15px;
}

.instructions-header i {
  font-size: 20px;
  color: #f59e0b;
}

.instructions-header strong {
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
}

.instructions-content {
  font-size: 14px;
  line-height: 1.8;
  color: #374151;
  padding: 12px 16px;
  background: white;
  border-left: 4px solid #f59e0b;
  border-radius: 6px;
}

.instructions-content :deep(p) {
  margin: 0 0 10px 0;
}

.instructions-content :deep(p:last-child) {
  margin-bottom: 0;
}

.instructions-content :deep(ul),
.instructions-content :deep(ol) {
  margin: 10px 0;
  padding-left: 24px;
}

.instructions-content :deep(li) {
  margin: 6px 0;
}

.instructions-content :deep(strong) {
  color: #111827;
  font-weight: 700;
}

.instructions-content :deep(em) {
  color: #6b7280;
  font-style: italic;
}

/* ============================================ */
/* SECTIONS CONTAINER */
/* ============================================ */

.sections-container {
  padding: 24px;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 768px) {
  .skill-header {
    padding: 16px 18px;
  }

  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .skill-title {
    font-size: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .skill-separator {
    display: none;
  }

  .skill-badge {
    width: 100%;
    justify-content: center;
  }

  .skill-instructions {
    padding: 16px 18px;
  }

  .sections-container {
    padding: 18px;
  }
}

@media (max-width: 480px) {
  .skill-title {
    font-size: 18px;
  }

  .exam-prefix {
    font-size: 14px;
  }

  .instructions-content {
    font-size: 13px;
    padding: 10px 12px;
  }
}
</style>