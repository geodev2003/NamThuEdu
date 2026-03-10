<template>
  <div class="audio-block">
    <!-- Content Text/Passage (nếu có) -->
    <div v-if="item.content || item.contentText" class="passage-content">
      <h6 v-if="item.title" class="content-title">
        <i class="bi bi-file-text"></i>
        {{ item.title }}
      </h6>
      <div v-if="item.instruction" class="content-instruction">
        <i class="bi bi-info-circle"></i>
        {{ item.instruction }}
      </div>
      <div class="passage-text" v-html="item.content || item.contentText"></div>
    </div>

    <!-- Audio Player -->
    <div v-if="item.audioUrl" class="audio-player-container">
      <div class="audio-header">
        <i class="bi bi-volume-up-fill"></i>
        <span class="audio-title">{{ item.title || 'Audio Track' }}</span>
        <span v-if="item.audioDuration" class="audio-duration">
          <i class="bi bi-clock"></i>
          {{ formatDuration(item.audioDuration) }}
        </span>
      </div>

      <div v-if="item.instruction && !item.content" class="audio-instruction">
        <i class="bi bi-info-circle-fill"></i>
        {{ item.instruction }}
      </div>

      <audio controls class="audio-player" controlsList="nodownload">
        <source :src="getAudioUrl(item.audioUrl)" type="audio/mp3">
        <source :src="getAudioUrl(item.audioUrl)" type="audio/wav">
        Your browser does not support the audio element.
      </audio>

      <!-- Transcript (collapsible) -->
      <details v-if="item.transcript" class="transcript-details">
        <summary>
          <i class="bi bi-file-text"></i>
          View Transcript
        </summary>
        <div class="transcript-content">{{ item.transcript }}</div>
      </details>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})

// DB lưu path tương đối: 'uploads/audio/folder/file.mp3'
// Dùng env variable để dễ thay đổi giữa dev/prod
const BASE_MEDIA_URL = import.meta.env.VITE_MEDIA_BASE_URL || 'http://localhost/NamThuEdu2/backend/app/'

const getAudioUrl = (path) => {
  if (!path) return ''
  // Nếu đã là URL đầy đủ thì giữ nguyên
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) return path
  return BASE_MEDIA_URL + path
}


// Helper: Format duration from seconds to MM:SS
const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}
</script>

<style scoped>
.audio-block {
  margin-bottom: 24px;
}

/* ============================================ */
/* PASSAGE CONTENT */
/* ============================================ */

.passage-content {
  margin-bottom: 16px;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.content-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  display: flex;
  align-items: center;
  gap: 8px;
}

.content-title i {
  color: #6b7280;
}

.content-instruction {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 14px 0;
  font-size: 13px;
  font-weight: 500;
  color: #1e40af;
  line-height: 1.6;
  padding: 10px 12px;
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
}

.content-instruction i {
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.passage-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.8;
}

.passage-text :deep(p) {
  margin: 0 0 12px 0;
}

.passage-text :deep(p:last-child) {
  margin-bottom: 0;
}

/* ============================================ */
/* AUDIO PLAYER */
/* ============================================ */

.audio-player-container {
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 10px;
}

.audio-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #bae6fd;
  margin-bottom: 12px;
}

.audio-header i {
  color: #0284c7;
  font-size: 22px;
  animation: pulse-audio 2s ease-in-out infinite;
}

@keyframes pulse-audio {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

.audio-title {
  flex: 1;
  font-size: 15px;
  font-weight: 700;
  color: #111827;
}

.audio-duration {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 700;
  color: #0369a1;
  background: white;
  padding: 5px 12px;
  border-radius: 14px;
  border: 1px solid #bae6fd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.audio-duration i {
  font-size: 13px;
}

.audio-instruction {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #0c4a6e;
  line-height: 1.5;
  padding: 10px 12px;
  background: white;
  border-left: 3px solid #0284c7;
  border-radius: 6px;
  margin-bottom: 12px;
}

.audio-instruction i {
  font-size: 15px;
  margin-top: 1px;
  color: #0284c7;
  flex-shrink: 0;
}

.audio-player {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  outline: none;
  background: white;
  border: 2px solid #bae6fd;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s;
}

.audio-player:hover {
  border-color: #7dd3fc;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.15);
}

.audio-player:focus {
  border-color: #0284c7;
}

/* Transcript */
.transcript-details {
  margin-top: 12px;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.transcript-details summary {
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #0284c7;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  padding: 4px 0;
}

.transcript-details summary:hover {
  color: #0369a1;
}

.transcript-details summary::-webkit-details-marker {
  display: none;
}

.transcript-details summary::before {
  content: "▶";
  display: inline-block;
  transition: transform 0.2s;
  font-size: 10px;
  color: #0284c7;
}

.transcript-details[open] summary::before {
  transform: rotate(90deg);
}

.transcript-details summary i {
  font-size: 14px;
}

.transcript-content {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0f2fe;
  font-size: 13px;
  color: #374151;
  line-height: 1.7;
  white-space: pre-wrap;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* ============================================ */
/* RESPONSIVE */
/* ============================================ */

@media (max-width: 768px) {
  .audio-header {
    flex-wrap: wrap;
  }

  .audio-duration {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 4px;
  }

  .audio-player {
    height: 44px;
  }
}

@media (max-width: 480px) {
  .audio-player {
    height: 40px;
  }

  .audio-title {
    font-size: 14px;
  }

  .passage-content,
  .audio-player-container {
    padding: 12px;
  }
}
</style>