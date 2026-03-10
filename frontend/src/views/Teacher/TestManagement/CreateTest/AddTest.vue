<template>
  <div class="add-test-page">
    <div class="box">
      <h2>📝 Create Test</h2>

      <!-- Tabs -->
      <div class="tab">
        <button
          :class="{ active: tab === 'manual' }"
          @click="tab = 'manual'"
        >✍️ Nhập tay</button>

        <button
          :class="{ active: tab === 'file' }"
          @click="tab = 'file'"
        >📂 Nhập từ file</button>
      </div>

      <!-- TAB NHẬP TAY -->
      <form v-if="tab === 'manual'" @submit.prevent="submitExam">
        <div class="form-group">
          <label>Title Test</label>
          <input v-model="exam.title" required class="form-input" />
        </div>
        
        <div class="form-group">
          <label>Visibility</label>
          <select v-model="exam.visibility" class="form-select">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>Time (minutes)</label>
          <input type="number" v-model="exam.duration" min="10" step="5" class="form-input"/>
        </div>

        <!-- Skills -->
        <div class="form-group">
          <label>Skills</label>
          <div class="skills-checkbox">
            <label v-for="s in skills" :key="s" class="checkbox-label">
              <input type="checkbox" :value="s" v-model="exam.skills" />
              <span>{{ s }}</span>
            </label>
          </div>
        </div>

        <!-- READING -->
        <div v-if="exam.skills.includes('reading')" class="skill-section">
          <h3>📘 Reading</h3>
          <div v-for="(q, i) in exam.reading" :key="i" class="question-card">
            <div class="question-header">
              <span class="question-number">Question {{ i + 1 }}</span>
              <button type="button" @click="removeQuestion('reading', i)" class="btn-remove">
                ❌ Xóa
              </button>
            </div>

            <div class="form-group">
              <label>Question</label>
              <input v-model="q.content" class="form-input" />
            </div>

            <div class="options-grid">
              <div class="form-group">
                <label>A</label>
                <input v-model="q.A" class="form-input" />
              </div>
              <div class="form-group">
                <label>B</label>
                <input v-model="q.B" class="form-input" />
              </div>
              <div class="form-group">
                <label>C</label>
                <input v-model="q.C" class="form-input" />
              </div>
              <div class="form-group">
                <label>D</label>
                <input v-model="q.D" class="form-input" />
              </div>
            </div>

            <div class="answer-point-row">
              <div class="form-group">
                <label>Answer</label>
                <select v-model="q.correct" class="form-select">
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </div>

              <div class="form-group">
                <label>Point</label>
                <input type="number" v-model="q.point" class="form-input" />
              </div>
            </div>
          </div>

          <button type="button" @click="addQuestion('reading')" class="btn-add">
            ➕ Add Question
          </button>
        </div>

        <!-- LISTENING -->
        <div v-if="exam.skills.includes('listening')" class="skill-section">
          <h3>🎧 Listening</h3>
          <div v-for="(q, i) in exam.listening" :key="i" class="question-card">
            <div class="question-header">
              <span class="question-number">Question {{ i + 1 }}</span>
              <button type="button" @click="removeQuestion('listening', i)" class="btn-remove">
                ❌ Xóa
              </button>
            </div>

            <div class="form-group">
              <label>Question</label>
              <input v-model="q.content" class="form-input" />
            </div>

            <div class="form-group">
              <label>Audio File</label>
              <div class="file-upload-wrapper">
                <input 
                  type="file" 
                  :ref="'audioFile' + i"
                  @change="handleAudioFile($event, i)" 
                  accept="audio/*"
                  class="form-file"
                  :id="'audio-' + i"
                />
                <div v-if="q.audioFileName" class="file-info">
                  <i class="bi bi-file-earmark-music"></i>
                  <span>{{ q.audioFileName }}</span>
                  <button 
                    type="button" 
                    @click="removeAudioFile(i)" 
                    class="btn-remove-file"
                  >
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="options-grid">
              <div class="form-group">
                <label>A</label>
                <input v-model="q.A" class="form-input" />
              </div>
              <div class="form-group">
                <label>B</label>
                <input v-model="q.B" class="form-input" />
              </div>
              <div class="form-group">
                <label>C</label>
                <input v-model="q.C" class="form-input" />
              </div>
              <div class="form-group">
                <label>D</label>
                <input v-model="q.D" class="form-input" />
              </div>
            </div>

            <div class="answer-point-row">
              <div class="form-group">
                <label>Answer</label>
                <select v-model="q.correct" class="form-select">
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                </select>
              </div>

              <div class="form-group">
                <label>Point</label>
                <input type="number" v-model="q.point" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="q.listenOnce" />
                <span>Chỉ nghe 1 lần</span>
              </label>
            </div>

            <div class="form-group">
              <label>Transcript (Optional)</label>
              <textarea v-model="q.transcript" class="form-textarea" rows="3" placeholder="Nội dung bài nghe..."></textarea>
            </div>
          </div>

          <button type="button" @click="addQuestion('listening')" class="btn-add">
            ➕ Add Question
          </button>
        </div>

        <!-- WRITING -->
        <div v-if="exam.skills.includes('writing')" class="skill-section">
          <h3>✍️ Writing</h3>
          <div v-for="(q, i) in exam.writing" :key="i" class="question-card">
            <div class="question-header">
              <span class="question-number">Question {{ i + 1 }}</span>
              <button type="button" @click="removeQuestion('writing', i)" class="btn-remove">
                ❌ Xóa
              </button>
            </div>

            <div class="form-group">
              <label>Question</label>
              <textarea v-model="q.content" class="form-textarea" rows="4" placeholder="Đề bài viết..."></textarea>
            </div>

            <div class="form-group">
              <label>Point</label>
              <input type="number" v-model="q.point" class="form-input" />
            </div>
          </div>

          <button type="button" @click="addQuestion('writing')" class="btn-add">
            ➕ Add Question
          </button>
        </div>

        <!-- SPEAKING -->
        <div v-if="exam.skills.includes('speaking')" class="skill-section">
          <h3>🗣️ Speaking</h3>
          <div v-for="(q, i) in exam.speaking" :key="i" class="question-card">
            <div class="question-header">
              <span class="question-number">Question {{ i + 1 }}</span>
              <button type="button" @click="removeQuestion('speaking', i)" class="btn-remove">
                ❌ Xóa
              </button>
            </div>

            <div class="form-group">
              <label>Question</label>
              <input v-model="q.content" class="form-input" placeholder="Câu hỏi speaking..." />
            </div>

            <div class="form-group">
              <label>Point</label>
              <input type="number" v-model="q.point" class="form-input" />
            </div>
          </div>

          <button type="button" @click="addQuestion('speaking')" class="btn-add">
            ➕ Add Question
          </button>
        </div>

        <button type="submit" class="btn-submit">💾 Save Test</button>
      </form>

      <!-- TAB FILE -->
      <form v-if="tab === 'file'" @submit.prevent="uploadFile">
        <div class="form-group">
          <label>Tên đề thi</label>
          <input v-model="fileExam.title" class="form-input" />
        </div>

        <div class="form-group">
          <label>File</label>
          <input type="file" @change="handleFile" class="form-file" />
        </div>

        <button class="btn-submit">📤 Upload</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tab: 'manual',
      skills: ['reading', 'listening', 'writing', 'speaking'],

      exam: {
        title: '',
        visibility: 'public',
        duration: 60,
        skills: [],
        reading: [
          {
            content: '',
            A: '', B: '', C: '', D: '',
            correct: 'A',
            point: 1
          }
        ],
        listening: [
          {
            content: '',
            audioFile: null,
            audioFileName: '',
            A: '', B: '', C: '', D: '',
            correct: 'A',
            point: 1,
            listenOnce: false,
            transcript: ''
          }
        ],
        writing: [
          {
            content: '',
            point: 1
          }
        ],
        speaking: [
          {
            content: '',
            point: 1
          }
        ]
      },

      fileExam: {
        title: '',
        file: null
      }
    }
  },

  methods: {
    addQuestion(skill) {
      const questionTemplates = {
        reading: {
          content: '',
          A: '', B: '', C: '', D: '',
          correct: 'A',
          point: 1
        },
        listening: {
          content: '',
          audioFile: null,
          audioFileName: '',
          A: '', B: '', C: '', D: '',
          correct: 'A',
          point: 1,
          listenOnce: false,
          transcript: ''
        },
        writing: {
          content: '',
          point: 1
        },
        speaking: {
          content: '',
          point: 1
        }
      }

      this.exam[skill].push({ ...questionTemplates[skill] })
    },

    removeQuestion(skill, index) {
      if (this.exam[skill].length === 1) {
        alert('Phải có ít nhất 1 câu hỏi')
        return
      }
      this.exam[skill].splice(index, 1)
    },

    handleAudioFile(event, index) {
      const file = event.target.files[0]
      if (file) {
        this.exam.listening[index].audioFile = file
        this.exam.listening[index].audioFileName = file.name
      }
    },

    removeAudioFile(index) {
      this.exam.listening[index].audioFile = null
      this.exam.listening[index].audioFileName = ''
      // Reset input file
      const input = document.getElementById('audio-' + index)
      if (input) input.value = ''
    },

    submitExam() {
      // Tạo FormData để gửi cả text và files
      const formData = new FormData()
      
      formData.append('title', this.exam.title)
      formData.append('visibility', this.exam.visibility)
      formData.append('duration', this.exam.duration)
      formData.append('skills', JSON.stringify(this.exam.skills))

      // Xử lý từng skill
      this.exam.skills.forEach(skill => {
        if (skill === 'listening') {
          // Xử lý riêng cho listening vì có file audio
          this.exam.listening.forEach((q, index) => {
            formData.append(`listening[${index}][content]`, q.content)
            formData.append(`listening[${index}][A]`, q.A)
            formData.append(`listening[${index}][B]`, q.B)
            formData.append(`listening[${index}][C]`, q.C)
            formData.append(`listening[${index}][D]`, q.D)
            formData.append(`listening[${index}][correct]`, q.correct)
            formData.append(`listening[${index}][point]`, q.point)
            formData.append(`listening[${index}][listenOnce]`, q.listenOnce)
            formData.append(`listening[${index}][transcript]`, q.transcript)
            
            if (q.audioFile) {
              formData.append(`listening[${index}][audio]`, q.audioFile)
            }
          })
        } else {
          // Các skill khác không có file
          formData.append(skill, JSON.stringify(this.exam[skill]))
        }
      })

      console.log('Exam data:', {
        title: this.exam.title,
        visibility: this.exam.visibility,
        duration: this.exam.duration,
        skills: this.exam.skills,
        reading: this.exam.reading,
        listening: this.exam.listening.map(q => ({
          ...q,
          audioFile: q.audioFile ? q.audioFile.name : null
        })),
        writing: this.exam.writing,
        speaking: this.exam.speaking
      })

      alert('Đề thi đã được lưu! Xem console để kiểm tra dữ liệu.')
      
      // Gửi FormData lên server
      // axios.post('/api/save_exam.php', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // })
    },

    handleFile(e) {
      this.fileExam.file = e.target.files[0]
    },

    uploadFile() {
      if (!this.fileExam.file) {
        alert('Vui lòng chọn file!')
        return
      }

      const form = new FormData()
      form.append('title', this.fileExam.title)
      form.append('file', this.fileExam.file)

      console.log('Uploading file:', this.fileExam.file.name)
      alert('File đã được upload!')
      // axios.post('/api/save_exam_file.php', form)
    }
  }
}
</script>

<style scoped>
.add-test-page {
  max-width: 1000px;
  margin: 0 auto;
}

.box {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.box h2 {
  font-size: 28px;
  color: #333;
  margin-bottom: 24px;
  text-align: center;
}

/* Tabs */
.tab {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e0e0e0;
}

.tab button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
}

.tab button:hover {
  color: #007bff;
  background-color: #f8f9fa;
}

.tab button.active {
  color: #007bff;
  border-bottom-color: #007bff;
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-file {
  width: 100%;
  padding: 10px;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.form-file:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

/* File Upload Wrapper */
.file-upload-wrapper {
  position: relative;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 12px;
  background-color: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 6px;
  color: #0066cc;
  font-size: 14px;
}

.file-info i {
  font-size: 18px;
}

.btn-remove-file {
  margin-left: auto;
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.btn-remove-file:hover {
  color: #c82333;
  transform: scale(1.1);
}

/* Skills Checkbox */
.skills-checkbox {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.checkbox-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 44px;
  background-color: white;
}

.checkbox-label:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin: 0;
  flex-shrink: 0;
}

.checkbox-label span {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  text-transform: capitalize;
  line-height: 1;
  white-space: nowrap;
}

/* Skill Section */
.skill-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.skill-section h3 {
  font-size: 22px;
  color: #333;
  margin-bottom: 20px;
}

/* Question Card */
.question-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e0e0e0;
}

.question-number {
  font-size: 16px;
  font-weight: 600;
  color: #007bff;
}

/* Options Grid */
.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.answer-point-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Buttons */
.btn-remove {
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-remove:hover {
  background-color: #c82333;
  transform: translateY(-1px);
}

.btn-add {
  width: 100%;
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;
}

.btn-add:hover {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
}

.btn-submit {
  width: 100%;
  padding: 16px 32px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 30px;
}

.btn-submit:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .box {
    padding: 20px;
  }

  .box h2 {
    font-size: 24px;
  }

  .options-grid,
  .answer-point-row {
    grid-template-columns: 1fr;
  }

  .tab button {
    padding: 10px 16px;
    font-size: 14px;
  }

  .skills-checkbox {
    flex-direction: column;
  }
}
</style>