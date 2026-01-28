<template>
    <div class="login-wrapper">
        <!-- Animated background elements -->
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
        <div class="bg-circle circle-3"></div>
        
        <div class="login-container">
            <!-- Welcome Header -->
            <div class="header">
                <div class="welcome-animation">
                    <span class="wave-emoji">👋</span>
                </div>
                <h2>CHÀO MỪNG TRỞ LẠI!</h2>
                <p class="subtitle">Hãy tiếp tục hành trình học tập của bạn nào! 🎯</p>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleLogin" class="login-form">
                <!-- Phone Input -->
                <div class="form-group">
                    <label for="phone">
                        <span class="label-icon">📱</span>
                        Số điện thoại
                    </label>
                    <div class="input-wrapper">
                        <div class="input-icon-container">
                            <span class="input-emoji">📞</span>
                        </div>
                        <input 
                            id="phone"
                            v-model="form.phone"
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            required
                            :disabled="loading"
                        />
                        <div class="input-underline"></div>
                    </div>
                </div>

                <!-- Password Input -->
                <div class="form-group">
                    <label for="password">
                        <span class="label-icon">🔐</span>
                        Mật khẩu
                    </label>
                    <div class="input-wrapper">
                        <div class="input-icon-container">
                            <span class="input-emoji">🔑</span>
                        </div>
                        <input 
                            id="password"
                            v-model="form.password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Nhập mật khẩu"
                            required
                            :disabled="loading"
                        />
                        <button 
                            type="button" 
                            class="toggle-password"
                            @click="showPassword = !showPassword"
                            :disabled="loading"
                            :title="showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'"
                        >
                            <span v-if="!showPassword">👁️</span>
                            <span v-else">🙈</span>
                        </button>
                        <div class="input-underline"></div>
                    </div>
                </div>

                <!-- Remember me & Forgot password -->
                <div class="form-options">
                    <label class="checkbox-container">
                        <input type="checkbox" v-model="rememberMe" :disabled="loading" />
                        <span class="checkmark"></span>
                        <span class="checkbox-text">Nhớ đăng nhập</span>
                    </label>
                    <router-link to="/forgetpassword" class="forgot-link">
                        Quên mật khẩu?
                    </router-link>
                </div>

                <!-- Alert Messages -->
                <transition name="slide-fade">
                    <div v-if="error" class="alert alert-error">
                        <span class="alert-emoji">😢</span>
                        <span>{{ error }}</span>
                    </div>
                </transition>

                <transition name="slide-fade">
                    <div v-if="success" class="alert alert-success">
                        <span class="alert-emoji">🎉</span>
                        <span>{{ success }}</span>
                    </div>
                </transition>

                <!-- Submit Button -->
                <button type="submit" class="submit-btn" :disabled="loading">
                    <span v-if="!loading" class="btn-content">
                        <span>Đăng nhập</span>
                        <span class="btn-icon">🚀</span>
                    </span>
                    <span v-else class="btn-content">
                        <span class="loading-spinner">⏳</span>
                        <span>Đang xử lý...</span>
                    </span>
                    <div class="btn-glow"></div>
                </button>

                <!-- Divider -->
                <!-- <div class="divider">
                    <span>HOẶC</span>
                </div> -->

                <!-- Social Login (placeholder) -->
                <!-- <div class="social-login">
                    <button type="button" class="social-btn google-btn">
                        <span class="social-icon">🔍</span>
                        <span>Google</span>
                    </button>
                    <button type="button" class="social-btn facebook-btn">
                        <span class="social-icon">👥</span>
                        <span>Facebook</span>
                    </button>
                </div> -->

                <!-- Register Link -->
                <div class="footer-text">
                    Chưa có tài khoản? 
                    <router-link to="/register" class="register-link">
                        Đăng ký ngay 🎨
                    </router-link>
                </div>
            </form>

            <!-- Motivational Quote -->
            <!-- <div class="motivation-quote">
                <span class="quote-icon">💭</span>
                <p>"Học hành là kho báu sẽ theo bạn khắp mọi nơi"</p>
            </div> -->
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import http from "../api/http";
import TeacherHomePage from "./Teacher/HomePage.vue";   
import { useRouter } from "vue-router";

const router = useRouter();

const loading = ref(false);
const error = ref("");
const success = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);

const form = reactive({
    phone: "",
    password: ""
});

const handleLogin = async () => {
    error.value = "";
    success.value = "";

    if (!form.phone || !form.password) {
        error.value = "Vui lòng nhập đầy đủ thông tin";
        return;
    }

    loading.value = true;

    try {
        const response = await http.post("/api/login", {
            phone: form.phone,
            password: form.password
        });

        const { access_token, user } = response.data.data;

        if (!access_token || !user?.role) {
            throw new Error("Dữ liệu đăng nhập không hợp lệ");
        }

        // Lưu token
        localStorage.setItem("token", access_token);

        // Điều hướng theo role
        if (user.role === "student") {
            router.push("/students/homepage");
        } 
        else if (user.role === "teacher") {
            router.push("/teacher/homepage");
        } 
        else if (user.role === "admin") {
            router.push("/admin/homepage");
        } 
        else {
            throw new Error("Vai trò người dùng không xác định");
        }

        // ✅ CHỈ set success khi mọi thứ OK
        success.value = "Đăng nhập thành công! 🎉";

    } catch (err) {
        console.error(err);
        error.value =
            err.response?.data?.message ||
            err.message ||
            "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
    } finally {
        loading.value = false;
    }
};

</script>

<style scoped>
* {
    box-sizing: border-box;
}

.login-wrapper {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    position: relative;
    overflow: hidden;
}

/* Animated Background */
.bg-circle {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
    opacity: 0.3;
    animation: float-rotate 20s ease-in-out infinite;
}

.circle-1 {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, #FF6B9D, #FFE66D);
    top: -100px;
    left: -100px;
    animation-delay: 0s;
}

.circle-2 {
    width: 250px;
    height: 250px;
    background: linear-gradient(135deg, #4ECDC4, #667eea);
    bottom: -80px;
    right: -80px;
    animation-delay: 7s;
}

.circle-3 {
    width: 200px;
    height: 200px;
    background: linear-gradient(135deg, #FFE66D, #FF6B9D);
    top: 50%;
    right: 10%;
    animation-delay: 14s;
}

@keyframes float-rotate {
    0%, 100% {
        transform: translate(0, 0) rotate(0deg);
    }
    33% {
        transform: translate(30px, -30px) rotate(120deg);
    }
    66% {
        transform: translate(-20px, 20px) rotate(240deg);
    }
}

.login-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 450px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 28px;
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
    padding: 1.5rem 2rem;
    animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 2px solid rgba(255, 255, 255, 0.8);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(40px) scale(0.9);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* Header */
.header {
    text-align: center;
    margin-bottom: 2rem;
}

.welcome-animation {
    margin-bottom: 1rem;
}

.wave-emoji {
    font-size: 4rem;
    display: inline-block;
    animation: wave 1.5s ease-in-out infinite;
    transform-origin: 70% 70%;
}

@keyframes wave {
    0%, 100% {
        transform: rotate(0deg);
    }
    10%, 30%, 50%, 70%, 90% {
        transform: rotate(14deg);
    }
    20%, 40%, 60%, 80% {
        transform: rotate(-8deg);
    }
}

.header h2 {
    margin: 0 0 0.75rem;
    font-size: 1.875rem;
    font-weight: 900;
    background: linear-gradient(135deg, #667eea, #FF6B9D);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    margin: 0;
    color: #718096;
    font-size: 0.9375rem;
    font-weight: 600;
}

/* Form */
.login-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-size: 0.9375rem;
    font-weight: 700;
    color: #2d3748;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.label-icon {
    font-size: 1.25rem;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon-container {
    position: absolute;
    left: 1rem;
    z-index: 1;
}

.input-emoji {
    font-size: 1.5rem;
}

.input-wrapper input {
    width: 100%;
    padding: 1rem 1rem 1rem 3.5rem;
    border: 3px solid #e2e8f0;
    border-radius: 16px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
    font-weight: 500;
}

.input-wrapper input:focus {
    outline: none;
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}

.input-wrapper input:focus ~ .input-underline {
    transform: scaleX(1);
}

.input-underline {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #FF6B9D, #FFE66D, #4ECDC4);
    border-radius: 0 0 16px 16px;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}

.input-wrapper input:disabled {
    background: #edf2f7;
    cursor: not-allowed;
    opacity: 0.6;
}

.toggle-password {
    position: absolute;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.25rem;
    transition: transform 0.2s ease;
    z-index: 1;
}

.toggle-password:hover {
    transform: scale(1.2);
}

.toggle-password:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

/* Form Options */
.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.checkbox-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    position: relative;
    padding-left: 2rem;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.checkmark {
    position: absolute;
    left: 0;
    height: 20px;
    width: 20px;
    background-color: #e2e8f0;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.checkbox-container:hover .checkmark {
    background-color: #cbd5e0;
}

.checkbox-container input:checked ~ .checkmark {
    background: linear-gradient(135deg, #667eea, #764ba2);
}

.checkmark:after {
    content: "✓";
    position: absolute;
    display: none;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 14px;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkbox-text {
    color: #2d3748;
    font-weight: 600;
}

.forgot-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.2s ease;
}

.forgot-link:hover {
    color: #FF6B9D;
}

/* Alerts */
.alert {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: 16px;
    font-size: 0.9375rem;
    font-weight: 600;
}

.alert-emoji {
    font-size: 1.5rem;
}

.alert-error {
    background: linear-gradient(135deg, #fff5f5, #ffe5e5);
    color: #c53030;
    border: 2px solid #feb2b2;
}

.alert-success {
    background: linear-gradient(135deg, #f0fff4, #dcffe4);
    color: #2f855a;
    border: 2px solid #9ae6b4;
}

.slide-fade-enter-active {
    animation: slideInDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-fade-leave-active {
    animation: slideOutUp 0.3s ease;
}

@keyframes slideInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideOutUp {
    to {
        opacity: 0;
        transform: translateY(-20px);
    }
}

/* Submit Button */
.submit-btn {
    position: relative;
    width: 100%;
    padding: 1.25rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1.125rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.4s ease;
    margin-top: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    overflow: hidden;
}

.submit-btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.submit-btn:hover::before {
    width: 300px;
    height: 300px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
}

.submit-btn:active:not(:disabled) {
    transform: translateY(-1px);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-icon {
    font-size: 1.25rem;
    animation: bounce 1s ease-in-out infinite;
}

.loading-spinner {
    font-size: 1.25rem;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Divider */
.divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
}

.divider::before,
.divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 40%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.divider::before {
    left: 0;
}

.divider::after {
    right: 0;
}

.divider span {
    position: relative;
    padding: 0 1rem;
    background: rgba(255, 255, 255, 0.95);
    color: #a0aec0;
    font-size: 0.75rem;
    font-weight: 700;
}

/* Social Login */
.social-login {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.social-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background: white;
    font-weight: 700;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.social-icon {
    font-size: 1.25rem;
}

.google-btn:hover {
    border-color: #FF6B9D;
    background: #fff5f8;
    transform: translateY(-2px);
}

.facebook-btn:hover {
    border-color: #4ECDC4;
    background: #f0fdfa;
    transform: translateY(-2px);
}

/* Footer */
.footer-text {
    text-align: center;
    margin-top: 1.5rem;
    color: #718096;
    font-size: 0.9375rem;
    font-weight: 600;
}

.register-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 800;
    transition: all 0.2s ease;
}

.register-link:hover {
    color: #FF6B9D;
}

/* Motivation Quote */
.motivation-quote {
    margin-top: 2rem;
    padding: 1rem;
    background: linear-gradient(135deg, rgba(255, 230, 109, 0.2), rgba(78, 205, 196, 0.2));
    border-radius: 16px;
    border: 2px dashed #FFE66D;
    text-align: center;
}

.quote-icon {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 0.5rem;
}

.motivation-quote p {
    margin: 0;
    font-size: 0.875rem;
    color: #2d3748;
    font-weight: 600;
    font-style: italic;
}

/* Responsive */
@media (max-width: 480px) {
    .login-wrapper {
        padding: 1.5rem 1rem;
    }

    .login-container {
        padding: 2rem 1.5rem;
    }

    .header h2 {
        font-size: 1.625rem;
    }

    .wave-emoji {
        font-size: 3rem;
    }

    .login-form {
        gap: 1.25rem;
    }

    .social-login {
        grid-template-columns: 1fr;
    }

    .form-options {
        flex-direction: column;
        align-items: flex-start;
    }
}

@media (min-width: 481px) and (max-width: 768px) {
    .login-container {
        max-width: 480px;
        padding: 2.75rem 2.25rem;
    }
}
</style>