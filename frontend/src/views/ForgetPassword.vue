<template>
    <div class="forgot-wrapper">
        <!-- Floating decorations -->
        <div class="floating-decoration dec-1">✨</div>
        <div class="floating-decoration dec-2">🎨</div>
        <div class="floating-decoration dec-3">📚</div>
        <div class="floating-decoration dec-4">🚀</div>
        
        <div class="forgot-container">
            <!-- Header with fun design -->
            <div class="header">
                <div class="welcome-emoji">🎉</div>
                <h2>BẠN QUÊN MẬT KHẨU?</h2>
                <!-- <p class="subtitle">Tạo tài khoản để bắt đầu hành trình học tập thú vị</p> -->
            </div>

            <!-- Progress Indicator -->
            <div class="progress-steps">
                <div class="step" :class="{ active: step >= 1 }">
                    <div class="step-circle">1</div>
                    <span>Thông tin</span>
                </div>
                <div class="step-line"></div>
                <div class="step" :class="{ active: step >= 2 }">
                    <div class="step-circle">2</div>
                    <span>Xác nhận</span>
                </div>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="forgot-form">
                
                <!-- STEP 1: Phone Input -->
                <div v-if="step === 1" class="step-content">
                    <div class="form-group">
                        <label for="phone">
                            <span class="label-icon">📱</span>
                            Số điện thoại
                        </label>
                        <div class="input-wrapper">
                            <input 
                                id="phone"
                                v-model="form.phone"
                                type="tel"
                                placeholder="Nhập số điện thoại của bạn"
                                required
                                :disabled="loading"
                            />
                            <div class="input-border"></div>
                        </div>
                    </div>
                </div>

                <!-- STEP 2: OTP & New Password -->
                <div v-else-if="step === 2" class="step-content">
                    <div class="form-group">
                        <label for="otp">
                            <span class="label-icon">🔢</span>
                            Mã OTP
                        </label>
                        <div class="input-wrapper">
                            <input 
                                id="otp"
                                v-model="form.otp"
                                type="text"
                                placeholder="Nhập mã OTP 6 số"
                                required
                                :disabled="loading"
                            />
                            <div class="input-border"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="password">
                            <span class="label-icon">🔒</span>
                            Mật khẩu mới
                        </label>
                        <div class="input-wrapper">
                            <input 
                                id="password"
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                placeholder="Nhập mật khẩu mới"
                                required
                                :disabled="loading"
                            />
                            <button 
                                type="button" 
                                class="toggle-password"
                                @click="showPassword = !showPassword"
                                :disabled="loading"
                            >
                                {{ showPassword ? '👁️' : '🙈' }}
                            </button>
                            <div class="input-border"></div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">
                            <span class="label-icon">🔐</span>
                            Xác nhận mật khẩu
                        </label>
                        <div class="input-wrapper">
                            <input 
                                id="confirmPassword"
                                v-model="form.confirmPassword"
                                :type="showConfirmPassword ? 'text' : 'password'"
                                placeholder="Nhập lại mật khẩu mới"
                                required
                                :disabled="loading"
                            />
                             <button 
                                type="button" 
                                class="toggle-password"
                                @click="showConfirmPassword = !showConfirmPassword"
                                :disabled="loading"
                            >
                                {{ showConfirmPassword ? '👁️' : '🙈' }}
                            </button>
                            <div class="input-border"></div>
                        </div>
                    </div>
                </div>

                <!-- Alert Messages -->
                <transition name="bounce">
                    <div v-if="error" class="alert alert-error">
                        <span class="alert-icon">😢</span>
                        <span>{{ error }}</span>
                    </div>
                </transition>

                <transition name="bounce">
                    <div v-if="success" class="alert alert-success">
                        <span class="alert-icon">🎉</span>
                        <span>{{ success }}</span>
                    </div>
                </transition>

                <!-- Submit Button -->
                <button type="submit" class="submit-btn" :disabled="loading">
                    <span v-if="!loading" class="btn-content">
                        <span class="btn-emoji">🚀</span>
                        <span>{{ step === 1 ? 'Gửi OTP' : 'Đổi mật khẩu' }}</span>
                    </span>
                    <span v-else class="btn-content">
                        <span class="spinner">⏳</span>
                        <span>Đang xử lý...</span>
                    </span>
                </button>

                <!-- Login Link -->
                <div class="footer-text">
                    Đã có tài khoản rồi? 
                    <router-link to="/login" class="login-link">
                        Đăng nhập ngay 👉
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import http from "../api/http";

const router = useRouter();
const loading = ref(false);
const error = ref("");
const success = ref("");
const step = ref(1);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
    phone: "",
    otp: "",
    password: "",
    confirmPassword: "",
});

const handleSubmit = async () => {
    error.value = "";
    success.value = "";

    if (step.value === 1) {
        await handleSendOTP();
    } else {
        await handleResetPassword();
    }
};

const handleSendOTP = async () => {
    loading.value = true;
    try {
        const response = await http.post("/api/users/accept", {
            phone: form.phone,
        });

        success.value = response.data.message || "Mã OTP đã được gửi!";
        // Auto move to step 2 after a short delay
        setTimeout(() => {
            step.value = 2;
            success.value = ""; // Clear success message for next step
        }, 1500);

    } catch (err) {
        error.value = err.response?.data?.message || "Không tìm thấy số điện thoại.";
    } finally {
        loading.value = false;
    }
};

const handleResetPassword = async () => {
    if (form.password !== form.confirmPassword) {
        error.value = "Mật khẩu xác nhận không khớp";
        return;
    }

    if (form.password.length < 6) {
        error.value = "Mật khẩu phải có ít nhất 6 ký tự";
        return;
    }

    loading.value = true;
    try {
        const response = await http.post("/api/users/reset-password", {
            phone: form.phone,
            otp: form.otp,
            password: form.password
        });

        success.value = response.data.message || "Đổi mật khẩu thành công! 🎉";
        
        // Redirect to login after success
        setTimeout(() => {
            router.push('/login');
        }, 2000);

    } catch (err) {
        error.value = err.response?.data?.message || "Đổi mật khẩu thất bại.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
* {
    box-sizing: border-box;
}

.forgot-wrapper {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.5rem;
    position: relative;
    overflow: hidden;
}

/* Floating decorations */
.floating-decoration {
    position: absolute;
    font-size: 2rem;
    animation: float 6s ease-in-out infinite;
    opacity: 0.6;
    z-index: 0;
}

.dec-1 {
    top: 10%;
    left: 10%;
    animation-delay: 0s;
}

.dec-2 {
    top: 20%;
    right: 15%;
    animation-delay: 1s;
}

.dec-3 {
    bottom: 15%;
    left: 15%;
    animation-delay: 2s;
}

.dec-4 {
    bottom: 10%;
    right: 10%;
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

.forgot-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    background: white;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    padding: 2.5rem 2rem;
    animation: slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 3px solid transparent;
    background-image: linear-gradient(white, white), 
                      linear-gradient(135deg, #FF6B9D, #4ECDC4, #FFE66D);
    background-origin: border-box;
    background-clip: padding-box, border-box;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
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

.welcome-emoji {
    font-size: 4rem;
    margin-bottom: 1rem;
    display: inline-block;
    animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.header h2 {
    margin: 0 0 0.75rem;
    font-size: 1.75rem;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    margin: 0;
    color: #718096;
    font-size: 0.9375rem;
    font-weight: 500;
}

/* Progress Steps */
.progress-steps {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    gap: 0.5rem;
}

.step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.step-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #a0aec0;
    transition: all 0.3s ease;
}

.step.active .step-circle {
    background: linear-gradient(135deg, #FF6B9D, #FFE66D);
    color: white;
    transform: scale(1.1);
}

.step span {
    font-size: 0.75rem;
    color: #a0aec0;
    font-weight: 600;
    transition: all 0.3s ease;
}

.step.active span {
    color: #2c3e50;
}

.step-line {
    width: 60px;
    height: 3px;
    background: #e2e8f0;
    border-radius: 2px;
}

/* Form */
.forgot-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.step-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
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
}

.input-wrapper input {
    width: 100%;
    padding: 1rem;
    border: 3px solid #e2e8f0;
    border-radius: 16px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #f7fafc;
    font-weight: 500;
}

.input-wrapper input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    transform: translateY(-2px);
}

.input-wrapper input:focus ~ .input-border {
    opacity: 1;
    transform: scaleX(1);
}

.input-border {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, #FF6B9D, #4ECDC4, #FFE66D);
    border-radius: 0 0 16px 16px;
    opacity: 0;
    transform: scaleX(0);
    transform-origin: left;
    transition: all 0.3s ease;
}

.input-wrapper input:disabled {
    background: #edf2f7;
    cursor: not-allowed;
    opacity: 0.6;
}

.toggle-password {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s ease;
    z-index: 2;
}

.toggle-password:hover {
    transform: translateY(-50%) scale(1.2);
}

.toggle-password:disabled {
    cursor: not-allowed;
    opacity: 0.5;
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
    animation: shake 0.5s ease;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

.alert-icon {
    font-size: 1.5rem;
}

.alert-error {
    background: #fff5f5;
    color: #c53030;
    border: 2px solid #feb2b2;
}

.alert-success {
    background: #f0fff4;
    color: #2f855a;
    border: 2px solid #9ae6b4;
}

.bounce-enter-active {
    animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.bounce-leave-active {
    animation: bounceOut 0.3s ease;
}

@keyframes bounceIn {
    from {
        opacity: 0;
        transform: scale(0.8) translateY(-10px);
    }
    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

@keyframes bounceOut {
    to {
        opacity: 0;
        transform: scale(0.8) translateY(-10px);
    }
}

/* Submit Button */
.submit-btn {
    width: 100%;
    padding: 1.125rem;
    background: linear-gradient(135deg, #FF6B9D 0%, #FFE66D 50%, #4ECDC4 100%);
    background-size: 200% 100%;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1.125rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.4s ease;
    margin-top: 0.5rem;
    box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.submit-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 25px rgba(255, 107, 157, 0.5);
    background-position: 100% 0;
}

.submit-btn:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn-emoji {
    font-size: 1.25rem;
    display: inline-block;
    animation: bounce 1s ease-in-out infinite;
}

.spinner {
    font-size: 1.25rem;
    display: inline-block;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Footer */
.footer-text {
    text-align: center;
    margin-top: 1.5rem;
    color: #718096;
    font-size: 0.9375rem;
    font-weight: 500;
}

.login-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 700;
    transition: all 0.2s ease;
}

.login-link:hover {
    color: #FF6B9D;
    transform: translateX(2px);
}

/* Responsive */
@media (max-width: 480px) {
    .forgot-wrapper {
        padding: 1.5rem 1rem;
    }

    .forgot-container {
        padding: 2rem 1.5rem;
    }

    .header h2 {
        font-size: 1.5rem;
    }

    .welcome-emoji {
        font-size: 3rem;
    }

    .progress-steps {
        transform: scale(0.9);
    }

    .forgot-form {
        gap: 1.25rem;
    }

    .floating-decoration {
        font-size: 1.5rem;
    }
}
</style>