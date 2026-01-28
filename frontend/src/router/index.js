import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import LoginVue from '../views/Login.Vue'
import RegisterVue from '../views/Register.vue'
import ForgetPassword from '../views/ForgetPassword.vue'
import NotFound from '../views/NotFound.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Trang chủ - NamThuEdu'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterVue,
    meta: {
      title: 'Đăng ký - NamThuEdu'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginVue,
    meta: {
      title: 'Đăng nhập - NamThuEdu'
    }
  },
  {
    path: '/forgetpassword',
    name: 'ForgotPassword',
    component: ForgetPassword,
    meta: {
      title: 'Quên mật khẩu - NamThuEdu'
    }
  },
  // Teacher Routes
  {
    path: '/teacher/homepage',
    name: 'TeacherHome',
    component: () => import('../views/Teacher/HomePage.vue'),
  },
  // Student Routes
  {
    path: '/students/homepage',
    name: 'StudentHome',
    component: () => import('../views/Students/HomePage.vue'),
  },
  // Admin Routes
  {
    path: '/admin/homepage',
    name: 'AdminHome',
    component: () => import('../views/Admin/HomePage.vue'),
  },
  // Blog Routes
  {
    path: '/blogs/homepage',
    name: 'BlogsHome',
    component: () => import('../views/Blogs/HomePage.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: 'Không tìm thấy trang - NamThuEdu'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation guard for page titles
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'NamThuEdu - Nền tảng giáo dục trực tuyến'
  next()
})

export default router