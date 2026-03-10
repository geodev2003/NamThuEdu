<template>
  <div class="test-content">
    <!-- Test Info Header -->
    <div class="test-info-header">
      <h1 class="test-main-title">{{ test.title }}</h1>
      <div class="test-meta">
        <span class="meta-badge">
          <i class="bi bi-tag-fill"></i>
          {{ test.examType }}
        </span>
        <span class="meta-badge">
          <i class="bi bi-clock"></i>
          {{ test.duration }} phút
        </span>
        <span class="meta-badge">
          <i class="bi bi-star-fill"></i>
          {{ test.totalScore }} điểm
        </span>
      </div>
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
</template>

<script setup>
import SkillBlock from './SkillBlock.vue'

const props = defineProps({
  test: {
    type: Object,
    required: true
  }
})

/*
Expected test structure:
{
  title: "VSTEP Sample Test",
  examType: "VSTEP",
  duration: 172,
  totalScore: 100,
  skills: [
    {
      skillCode: "reading",
      instructions: "You have 60 minutes to complete this section...",
      sections: [
        {
          id: 1,
          sectionTitle: "Part 1",
          contentItems: [...],
          questions: [...]
        }
      ]
    },
    {
      skillCode: "listening",
      instructions: "You will hear...",
      sections: [...]
    }
  ]
}
*/
</script>

<style scoped>
.test-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* ============================================ */
/* TEST INFO HEADER */
/* ============================================ */

.test-info-header {
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.test-main-title {
  margin: 0 0 16px 0;
  font-size: 32px;
  font-weight: 800;
  color: white;
  text-align: center;
}

.test-meta {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.meta-badge i {
  font-size: 16px;
}

/* ============================================ */
/* SKILLS CONTAINER */
/* ============================================ */

.skills-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 768px) {
  .test-content {
    padding: 16px;
  }

  .test-info-header {
    padding: 20px;
  }

  .test-main-title {
    font-size: 24px;
  }

  .test-meta {
    flex-direction: column;
    align-items: center;
  }

  .meta-badge {
    width: 100%;
    justify-content: center;
  }

  .skills-container {
    gap: 24px;
  }
}
</style>