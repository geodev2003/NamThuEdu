<template>
    <div class="login-wrapper">
        <div class="bg-circle circle-1"></div>
        <div class="bg-circle circle-2"></div>
        <div class="bg-circle circle-3"></div>

        <div class="login-container">
            <div class="header">
                <div class="welcome-animation">
                    <span class="wave-emoji">👋</span>
                </div>
                <h2>CHÀO MỪNG TRỞ LẠI!</h2>
                <p class="subtitle">Hãy tiếp tục hành trình học tập của bạn nào! 🎯</p>
            </div>

            <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                    <label for="phone">
                        <span class="label-icon">📱</span>
                        Số điện thoại
                    </label>
                    <div class="input-wrapper">
                        <div class="input-icon-container">
                            <span class="input-emoji">📞</span>
                        </div>
                        <input id="phone" v-model="form.phone" type="tel" placeholder="Nhập số điện thoại" required
                            :disabled="loading" />
                        <div class="input-underline"></div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">
                        <span class="label-icon">🔑</span>
                        Mật khẩu
                    </label>
                    <div class="input-wrapper">
                        <div class="input-icon-container">
                            <span class="input-emoji">🔒</span>
                        </div>
                        <input id="password" v-model="form.password" type="password" placeholder="Nhập mật khẩu" required
                            :disabled="loading" />
                        <div class="input-underline"></div>
                    </div>
                </div>

                <div class="form-options">
                    <router-link to="/forgetpassword" class="forgot-password">Quên mật khẩu?</router-link>
                </div>

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
            </form>

            <div class="footer-text">
                Chưa có tài khoản? <router-link to="/register" class="register-link">Đăng ký ngay</router-link>
            </div>

            <div class="motivation-quote">
                <span class="quote-icon">✨</span>
                <p>Học tập là chìa khóa của thành công!</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import http from '@/api/http';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const form = reactive({
    phone: '',
    password: ''
});

const handleLogin = async () => {
    if (!form.phone || !form.password) {
        toast.warning("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    loading.value = true;

    try {
        const response = await http.post("/api/login", {
            phone: form.phone,
            password: form.password
        });

        if (response.data && response.data.code === 'SUCCESS') {
            const { access_token, user } = response.data.data;

            // Lưu thông tin phiên đăng nhập
            localStorage.setItem("token", access_token);
            localStorage.setItem("uRole", user.role);
            localStorage.setItem("user", JSON.stringify(user));

            toast.success("Đăng nhập thành công! 🎉");

            // Chuyển hướng dựa trên Role và Age
            const role = user.role.toLowerCase();
            const age = parseInt(user.age);

            setTimeout(() => {
                if (role === "admin") {
                    router.push("/admin/homepage");
                } else if (role === "teacher") {
                    router.push("/teacher/homepage");
                } else if (role === "student") {
                    if (age >= 5 && age <= 10) router.push("/students/children/homepage");
                    else if (age >= 11 && age <= 12) router.push("/students/pre-teens/homepage");
                    else if (age >= 13 && age <= 19) router.push("/students/teenagers/homepage");
                    else router.push("/");
                }
            }, 800);
        }
    } catch (err) {
        const msg = err.response?.data?.message || "Số điện thoại hoặc mật khẩu không đúng";
        toast.error(msg);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
/* Giữ nguyên toàn bộ CSS giao diện của bạn */
.login-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f7fafc;
    position: relative;
    overflow: hidden;
}

.login-container {
    background: white;
    padding: 2.5rem;
    border-radius: 24px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px;
    z-index: 10;
}

.header {
    text-align: center;
    margin-bottom: 2rem;
}

.welcome-animation {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.subtitle {
    color: #718096;
    margin-top: 0.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.input-wrapper {
    position: relative;
    margin-top: 0.5rem;
}

.input-icon-container {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
}

input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.3s ease;
}

input:focus {
    border-color: #667eea;
    outline: none;
}

.submit-btn {
    width: 100%;
    padding: 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
    background: #5a67d8;
}

.loading-spinner {
    display: inline-block;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.footer-text {
    text-align: center;
    margin-top: 1.5rem;
    color: #718096;
}

.register-link {
    color: #667eea;
    font-weight: 800;
    text-decoration: none;
}

.motivation-quote {
    margin-top: 2rem;
    padding: 1rem;
    background: #fffaf0;
    border: 2px dashed #f6ad55;
    border-radius: 16px;
    text-align: center;
}
</style>