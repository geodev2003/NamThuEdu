<template>
  <div class="assessment-page">
    <h1>📊 Assessment Test</h1>
    <p>Chấm điểm và đánh giá bài kiểm tra</p>
    
    <div class="assessment-container">
      <div class="filter-section">
        <div class="form-group">
          <label>Chọn bài kiểm tra</label>
          <select v-model="selectedTest" class="form-select">
            <option value="">-- Chọn bài kiểm tra --</option>
            <option value="1">Kiểm tra giữa kỳ</option>
            <option value="2">Kiểm tra cuối kỳ</option>
            <option value="3">Bài kiểm tra thử</option>
          </select>
        </div>
      </div>

      <div v-if="selectedTest" class="results-section">
        <div class="stats-cards">
          <div class="stat-card">
            <i class="bi bi-people-fill"></i>
            <div class="stat-info">
              <span class="stat-label">Tổng học sinh</span>
              <span class="stat-value">45</span>
            </div>
          </div>
          
          <div class="stat-card">
            <i class="bi bi-check-circle-fill"></i>
            <div class="stat-info">
              <span class="stat-label">Đã hoàn thành</span>
              <span class="stat-value">42</span>
            </div>
          </div>
          
          <div class="stat-card">
            <i class="bi bi-star-fill"></i>
            <div class="stat-info">
              <span class="stat-label">Điểm trung bình</span>
              <span class="stat-value">7.5</span>
            </div>
          </div>
        </div>

        <div class="student-results">
          <h3>Kết quả chi tiết</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên học sinh</th>
                  <th>Thời gian nộp</th>
                  <th>Điểm</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(student, index) in students" :key="student.id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ student.name }}</td>
                  <td>{{ student.submitTime }}</td>
                  <td>
                    <span class="score" :class="getScoreClass(student.score)">
                      {{ student.score }}
                    </span>
                  </td>
                  <td>
                    <span class="status-badge" :class="student.status">
                      {{ student.status === 'completed' ? 'Hoàn thành' : 'Chưa nộp' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn-view-detail">
                      <i class="bi bi-eye"></i> Xem
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>Vui lòng chọn bài kiểm tra để xem kết quả</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedTest = ref('')

const students = ref([
  { id: 1, name: 'Nguyễn Văn A', submitTime: '2024-01-15 10:30', score: 8.5, status: 'completed' },
  { id: 2, name: 'Trần Thị B', submitTime: '2024-01-15 10:25', score: 9.0, status: 'completed' },
  { id: 3, name: 'Lê Văn C', submitTime: '2024-01-15 10:40', score: 7.0, status: 'completed' },
  { id: 4, name: 'Phạm Thị D', submitTime: '2024-01-15 10:35', score: 6.5, status: 'completed' },
  { id: 5, name: 'Hoàng Văn E', submitTime: '', score: 0, status: 'pending' }
])

const getScoreClass = (score) => {
  if (score >= 8) return 'excellent'
  if (score >= 6.5) return 'good'
  if (score >= 5) return 'average'
  return 'poor'
}
</script>

<style scoped>
.assessment-page h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
}

.assessment-page p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.assessment-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-section {
  margin-bottom: 30px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-select {
  width: 100%;
  max-width: 400px;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  color: white;
}

.stat-card:nth-child(2) {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-card:nth-child(3) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card i {
  font-size: 40px;
  opacity: 0.9;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.student-results h3 {
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8f9fa;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #666;
}

tbody tr:hover {
  background-color: #f8f9fa;
}

.score {
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.score.excellent {
  background-color: #d4edda;
  color: #155724;
}

.score.good {
  background-color: #d1ecf1;
  color: #0c5460;
}

.score.average {
  background-color: #fff3cd;
  color: #856404;
}

.score.poor {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.completed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-view-detail {
  padding: 6px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.btn-view-detail:hover {
  background-color: #0056b3;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state i {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
  color: #999;
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }
  
  .table-container {
    overflow-x: scroll;
  }
  
  table {
    min-width: 600px;
  }
}
</style>
