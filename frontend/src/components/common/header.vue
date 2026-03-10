<template>
        <!-- Header -->
    <header class="app-header">
      <div class="header-glow"></div>
      <div class="header-container">
        <RouterLink class="logo-section" to="/">
          <div class="logo-wrapper">
            <div class="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div class="logo-sparkle sparkle-1">✨</div>
            <div class="logo-sparkle sparkle-2">⭐</div>
          </div>
          <div class="logo-text">
            <h1>NamThuEdu</h1>
            <span class="logo-tagline">English Made Easy! 🇬🇧</span>
          </div>
        </RouterLink>

        <nav class="nav-menu">
          <RouterLink to="/" class="nav-link">
            <span class="nav-emoji">🏠</span>
            <span class="nav-text">Trang chủ</span>
            <div class="nav-underline"></div>
          </RouterLink>

          <RouterLink to="/courses" class="nav-link">
            <span class="nav-emoji">📚</span>
            <span class="nav-text">Khóa học</span>
            <div class="nav-underline"></div>
          </RouterLink>

          <RouterLink to="/documents" class="nav-link">
            <span class="nav-emoji">📄</span>
            <span class="nav-text">Tài liệu</span>
            <div class="nav-underline"></div>
          </RouterLink>

          <RouterLink to="/blog" class="nav-link">
            <span class="nav-emoji">✍️</span>
            <span class="nav-text">Bài viết</span>
            <div class="nav-underline"></div>
          </RouterLink>

          <RouterLink to="/help" class="nav-link">
            <span class="nav-emoji">💬</span>
            <span class="nav-text">Trợ giúp</span>
            <div class="nav-underline"></div>
          </RouterLink>

          <RouterLink to="/login" class="nav-link nav-link-special">
            <span class="nav-emoji">🚀</span>
            <span class="nav-text">Đăng nhập</span>
            <div class="btn-shine"></div>
          </RouterLink>
        </nav>

        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen" :aria-label="mobileMenuOpen ? 'Đóng menu' : 'Mở menu'">
          <div class="hamburger-menu" :class="{ active: mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      <!-- Mobile menu -->
      <transition name="slide-down">
        <nav v-if="mobileMenuOpen" class="mobile-nav">
          <RouterLink to="/" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <span class="mobile-emoji">🏠</span>
            <span>Trang chủ</span>
            <span class="mobile-arrow">→</span>
          </RouterLink>
          
          <RouterLink to="/courses" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <span class="mobile-emoji">📚</span>
            <span>Khóa học</span>
            <span class="mobile-arrow">→</span>
          </RouterLink>

          <RouterLink to="/documents" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <span class="mobile-emoji">📄</span>
            <span>Tài liệu</span>
            <span class="mobile-arrow">→</span>
          </RouterLink>

          <RouterLink to="/blog" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <span class="mobile-emoji">✍️</span>
            <span>Bài viết</span>
            <span class="mobile-arrow">→</span>
          </RouterLink>

          <RouterLink to="/help" class="mobile-nav-link" @click="mobileMenuOpen = false">
            <span class="mobile-emoji">💬</span>
            <span>Trợ giúp</span>
            <span class="mobile-arrow">→</span>
          </RouterLink>

          <RouterLink to="/login" class="mobile-nav-link mobile-nav-special" @click="mobileMenuOpen = false">
            <span class="mobile-emoji">🚀</span>
            <span>Đăng nhập</span>
            <span class="mobile-arrow">→</span>
          </RouterLink>
        </nav>
      </transition>
    </header>
</template>


<script setup>
import { ref } from "vue";
import { RouterView, RouterLink } from "vue-router";

const mobileMenuOpen = ref(false);
</script>

<style scoped>
/* ===================== HEADER ===================== */
.app-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  overflow: hidden;
}

.header-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.header-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem clamp(1rem, 5vw, 2rem);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

/* Logo Section */
.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: white;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.logo-section:hover {
  transform: scale(1.05);
}

.logo-wrapper {
  position: relative;
}

.logo-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.logo-section:hover .logo-icon {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(-5deg);
}

.logo-sparkle {
  position: absolute;
  font-size: 1.25rem;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle-1 {
  top: -5px;
  right: -5px;
  animation-delay: 0s;
}

.sparkle-2 {
  bottom: -5px;
  left: -5px;
  animation-delay: 1s;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
}

.logo-text h1 {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
  font-weight: 900;
  letter-spacing: -0.5px;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.logo-tagline {
  font-size: clamp(0.625rem, 2vw, 0.75rem);
  font-weight: 600;
  opacity: 0.9;
  display: block;
  margin-top: -2px;
}

/* Desktop Navigation */
.nav-menu {
  display: none;
  gap: 0.5rem;
  align-items: center;
  flex: 1;
  justify-content: flex-end;
}

.nav-link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  white-space: nowrap;
}

.nav-emoji {
  font-size: 1.125rem;
  display: inline-block;
  transition: transform 0.3s ease;
}

.nav-link:hover .nav-emoji {
  transform: scale(1.2) rotate(10deg);
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: white;
  color: #667eea;
}

.nav-link.router-link-active .nav-underline {
  transform: scaleX(1);
}

.nav-underline {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 80%;
  height: 3px;
  background: linear-gradient(90deg, #FF6B9D, #FFE66D);
  border-radius: 2px;
  transition: transform 0.3s ease;
}

/* Special CTA Button */
.nav-link-special {
  background: linear-gradient(135deg, #FF6B9D, #FFE66D);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  font-weight: 800;
  position: relative;
  overflow: hidden;
}

.nav-link-special:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 107, 157, 0.4);
}

.btn-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: flex;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.75rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.hamburger-menu {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-menu span {
  width: 100%;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -7px);
}

/* Mobile Navigation */
.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem clamp(1rem, 5vw, 2rem);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-top: 2px solid rgba(255, 255, 255, 0.2);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  color: white;
  text-decoration: none;
  border-radius: 16px;
  font-weight: 700;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
}

.mobile-emoji {
  font-size: 1.5rem;
}

.mobile-arrow {
  margin-left: auto;
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.mobile-nav-link:hover,
.mobile-nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(5px);
}

.mobile-nav-link:hover .mobile-arrow {
  transform: translateX(5px);
}

.mobile-nav-special {
  background: linear-gradient(135deg, #FF6B9D, #FFE66D);
  font-weight: 800;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

</style>