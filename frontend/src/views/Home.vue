<template>
  <div class="home">
    <!-- Hero Section with playful design -->
    <section class="hero">
      <div class="hero-background">
        <div class="floating-shape shape-1"></div>
        <div class="floating-shape shape-2"></div>
        <div class="floating-shape shape-3"></div>
        <div class="floating-shape shape-4"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge">🎓 Học tập thông minh, tương lai rực rỡ</div>
        <h1 class="hero-title">
          Chào bạn đến với
          <span class="gradient-text">NamThuEdu</span>
        </h1>
        <p class="hero-subtitle">Nơi học tập trở nên vui vẻ và thú vị! 🚀</p>
        <p class="hero-description">
          Khám phá hàng ngàn khóa học được thiết kế đặc biệt cho học sinh, 
          với phương pháp học hiện đại, sinh động và dễ hiểu.
        </p>
        <div class="hero-actions">
          <router-link to="/register" class="btn btn-primary">
            <span>Bắt đầu học ngay</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </router-link>
          <router-link to="/login" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            <span>Đăng nhập</span>
          </router-link>
        </div>
      </div>

      <!-- Illustration -->
      <div class="hero-illustration">
        <div class="illustration-circle">
          <div class="book-icon">📚</div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <div class="section-header">
        <h2 class="section-title">
          Tại sao các bạn học sinh <span class="emoji">💖</span> NamThuEdu?
        </h2>
        <p class="section-subtitle">Những điều tuyệt vời đang chờ bạn khám phá!</p>
      </div>

      <div class="features-grid">
        <div class="feature-card card-1">
          <div class="feature-emoji">📖</div>
          <h3>Bài học sinh động</h3>
          <p>Video HD, hình ảnh minh họa đẹp mắt giúp bạn học dễ hiểu và nhớ lâu hơn</p>
          <div class="card-decoration"></div>
        </div>

        <div class="feature-card card-2">
          <div class="feature-emoji">👨‍🏫</div>
          <h3>Thầy cô tận tâm</h3>
          <p>Giảng viên giàu kinh nghiệm, dạy dễ hiểu và luôn sẵn sàng hỗ trợ bạn</p>
          <div class="card-decoration"></div>
        </div>

        <div class="feature-card card-3">
          <div class="feature-emoji">🎮</div>
          <h3>Học như chơi game</h3>
          <p>Hệ thống điểm thưởng, bảng xếp hạng khiến việc học trở nên thú vị</p>
          <div class="card-decoration"></div>
        </div>

        <div class="feature-card card-4">
          <div class="feature-emoji">📱</div>
          <h3>Học mọi lúc mọi nơi</h3>
          <p>Học trên điện thoại, máy tính bảng hay laptop đều tiện lợi như nhau</p>
          <div class="card-decoration"></div>
        </div>

        <div class="feature-card card-5">
          <div class="feature-emoji">🏆</div>
          <h3>Chứng chỉ online</h3>
          <p>Nhận chứng chỉ điện tử sau khi hoàn thành khóa học để khoe với bạn bè</p>
          <div class="card-decoration"></div>
        </div>

        <div class="feature-card card-6">
          <div class="feature-emoji">👥</div>
          <h3>Cộng đồng vui vẻ</h3>
          <p>Kết nối với bạn bè cùng học, chia sẻ kinh nghiệm và giúp đỡ lẫn nhau</p>
          <div class="card-decoration"></div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-icon">👨‍🎓</div>
          <div class="stat-number">10,000+</div>
          <div class="stat-label">Học sinh vui vẻ</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">📚</div>
          <div class="stat-number">500+</div>
          <div class="stat-label">Khóa học thú vị</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">⭐</div>
          <div class="stat-number">100+</div>
          <div class="stat-label">Thầy cô giỏi</div>
        </div>
        <div class="stat-item">
          <div class="stat-icon">😊</div>
          <div class="stat-number">98%</div>
          <div class="stat-label">Yêu thích</div>
        </div>
      </div>
    </section>

    <!-- Popular Subjects -->
    <section class="subjects">
      <div class="section-header">
        <h2 class="section-title">Môn học phổ biến <span class="emoji">🔥</span></h2>
        <p class="section-subtitle">Chọn môn bạn thích và bắt đầu học ngay!</p>
      </div>

      <div class="subjects-grid">
        <div class="subject-card" style="--color: #FF6B9D">
          <div class="subject-icon">🧮</div>
          <h3>Toán học</h3>
          <p>150+ bài học</p>
        </div>
        <div class="subject-card" style="--color: #4ECDC4">
          <div class="subject-icon">🔬</div>
          <h3>Khoa học</h3>
          <p>120+ bài học</p>
        </div>
        <div class="subject-card" style="--color: #FFE66D">
          <div class="subject-icon">🌍</div>
          <h3>Địa lý</h3>
          <p>80+ bài học</p>
        </div>
        <div class="subject-card" style="--color: #A8E6CF">
          <div class="subject-icon">📖</div>
          <h3>Văn học</h3>
          <p>100+ bài học</p>
        </div>
        <div class="subject-card" style="--color: #C7CEEA">
          <div class="subject-icon">🇬🇧</div>
          <h3>Tiếng Anh</h3>
          <p>200+ bài học</p>
        </div>
        <div class="subject-card" style="--color: #FFDAC1">
          <div class="subject-icon">🎨</div>
          <h3>Nghệ thuật</h3>
          <p>60+ bài học</p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-content">
        <div class="cta-emoji">🎉</div>
        <h2>Sẵn sàng trở thành học sinh xuất sắc?</h2>
        <p>Tham gia cùng hàng ngàn bạn học sinh đang phát triển mỗi ngày!</p>
        <router-link to="/register" class="btn btn-large btn-cta">
          <span>Đăng ký miễn phí ngay</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14"></path>
            <path d="m12 5 7 7-7 7"></path>
          </svg>
        </router-link>
        <p class="cta-note">✨ Không cần thẻ tín dụng, chỉ cần email và số điện thoại!</p>
      </div>
    </section>
  </div>
</template>

<script setup>
// No additional logic needed
</script>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 1.5rem;
  border-radius: 24px;
  margin-bottom: 4rem;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  top: 10%;
  left: 5%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  left: 80%;
  animation-delay: 1s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  top: 30%;
  right: 10%;
  animation-delay: 2s;
}

.shape-4 {
  width: 120px;
  height: 120px;
  bottom: 10%;
  left: 50%;
  animation-delay: 3s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.25rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  margin-bottom: 1rem;
  font-weight: 900;
  line-height: 1.2;
}

.gradient-text {
  display: inline-block;
  background: linear-gradient(45deg, #FFE66D, #FF6B9D, #4ECDC4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 3s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.hero-subtitle {
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  margin-bottom: 1rem;
  font-weight: 600;
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-primary:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.hero-illustration {
  position: relative;
  z-index: 2;
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.illustration-circle {
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.book-icon {
  font-size: 4rem;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 800;
}

.section-subtitle {
  font-size: clamp(1rem, 2vw, 1.125rem);
  color: #718096;
  font-weight: 500;
}

.emoji {
  display: inline-block;
  animation: wave 1s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(20deg);
  }
  75% {
    transform: rotate(-20deg);
  }
}

/* Features Section */
.features {
  margin-bottom: 5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  position: relative;
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
  border: 3px solid transparent;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #FF6B9D, #4ECDC4, #FFE66D);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-10px) rotate(1deg);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.card-decoration {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.1;
  right: -20px;
  bottom: -20px;
}

.card-1 .card-decoration { background: #FF6B9D; }
.card-2 .card-decoration { background: #4ECDC4; }
.card-3 .card-decoration { background: #FFE66D; }
.card-4 .card-decoration { background: #A8E6CF; }
.card-5 .card-decoration { background: #C7CEEA; }
.card-6 .card-decoration { background: #FFDAC1; }

.feature-emoji {
  font-size: 3.5rem;
  margin-bottom: 1.25rem;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
}

.feature-card h3 {
  font-size: 1.375rem;
  margin-bottom: 0.75rem;
  color: #2c3e50;
  font-weight: 700;
}

.feature-card p {
  color: #718096;
  line-height: 1.7;
  margin: 0;
  font-size: 0.9375rem;
}

/* Stats Section */
.stats {
  background: linear-gradient(135deg, #FF6B9D 0%, #FFE66D 100%);
  padding: 4rem 1.5rem;
  border-radius: 24px;
  margin-bottom: 5rem;
  position: relative;
  overflow: hidden;
}

.stats::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.stats-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  z-index: 1;
}

.stat-item {
  text-align: center;
  color: white;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-10px) scale(1.05);
  background: rgba(255, 255, 255, 0.25);
}

.stat-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.stat-number {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 600;
}

/* Subjects Section */
.subjects {
  margin-bottom: 5rem;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.subject-card {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 3px solid var(--color);
  cursor: pointer;
}

.subject-card:hover {
  transform: translateY(-8px) rotate(-2deg);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  background: var(--color);
}

.subject-card:hover .subject-icon {
  transform: scale(1.2) rotate(10deg);
}

.subject-card:hover h3,
.subject-card:hover p {
  color: white;
}

.subject-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: all 0.3s ease;
}

.subject-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
  font-weight: 700;
  transition: color 0.3s ease;
}

.subject-card p {
  color: #718096;
  font-size: 0.9rem;
  margin: 0;
  font-weight: 600;
  transition: color 0.3s ease;
}

/* CTA Section */
.cta {
  background: linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%);
  padding: 4rem 2rem;
  border-radius: 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta::before {
  content: '🎉🎊🎈🌟✨';
  position: absolute;
  top: 1rem;
  left: 0;
  width: 100%;
  font-size: 2rem;
  opacity: 0.2;
  animation: scroll 15s linear infinite;
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-emoji {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bounce 2s ease-in-out infinite;
}

.cta h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 1rem;
  color: white;
  font-weight: 800;
}

.cta p {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 2rem;
  font-weight: 500;
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 1.25rem;
}

.btn-cta {
  background: white;
  color: #4ECDC4;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-cta:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
}

.cta-note {
  margin-top: 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 3rem 1.5rem;
    margin-bottom: 3rem;
  }

  .features,
  .stats,
  .subjects,
  .cta {
    margin-bottom: 3rem;
  }

  .features-grid,
  .subjects-grid {
    gap: 1.5rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
  }

  .stats {
    padding: 3rem 1.5rem;
  }

  .stats-container {
    gap: 1.5rem;
  }

  .cta {
    padding: 3rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .subjects-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .subject-card {
    padding: 1.5rem 1rem;
  }
}
</style>