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
  // Teacher Routes với nested routing
  {
    path: '/teacher',
    component: () => import('../views/Teacher/HomePage.vue'),
    children: [
      {
        path: '',
        redirect: '/teacher/homepage'
      },
      {
        path: 'homepage',
        name: 'TeacherHome',
        component: () => import('../views/Teacher/Dashboard/dashboard.vue'),
        meta: {
          title: 'Teacher Home - NamThuEdu'
        }
      },
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: () => import('../views/Teacher/Dashboard/dashboard.vue'),
        meta: {
          title: 'Dashboard - NamThuEdu'
        }
      },
      {
        path: 'courses',
        name: 'TeacherCourses',
        component: () => import('../views/Teacher/CourseManagements/index.vue'),
        meta: {
          title: 'Course Management - NamThuEdu'
        }
      },
      {
        path: 'studentmanagements',
        name: 'StudentDashboard',
        component: () => import('../views/Teacher/StudentManagements/HomePage.vue'),
        meta: {
          title: 'Student Management - NamThuEdu'
        }
      },
      {
        path: 'studentmanagements/students',
        name: 'StudentManagements',
        component: () => import('../views/Teacher/StudentManagements/Students/index.vue'),
        meta: {
          title: 'Student Management - NamThuEdu'
        }
      },
            {
        path: 'studentmanagements/scores',
        name: 'StudentScores',
        component: () => import('../views/Teacher/StudentManagements/Scores/index.vue'),
        meta: {
          title: 'Student Management - NamThuEdu'
        }
      },
      {
        path: 'classes',
        name: 'TeacherClasses',
        component: () => import('../views/Teacher/ClassManagements/index.vue'),
        meta: {
          title: 'Class Management - NamThuEdu'
        }
      },
      {
        path: 'tests',
        name: 'TeacherTests',
        component: () => import('../views/Teacher/TestManagements/index.vue'),
        meta: {
          title: 'Test Management - NamThuEdu'
        }
      }
    ]
  },
  // Student Routes
  {
    path: '/students/children/homepage',
    name: 'ChildrenHome',
    component: () => import('../views/Students/Children/HomePage.vue'),
  },
    {
    path: '/students/pre-teens/homepage',
    name: 'PreteensHome',
    component: () => import('../views/Students/Pre-teens/HomePage.vue'),
  },
    {
    path: '/students/teenagers/homepage',
    name: 'TeenagersHome',
    component: () => import('../views/Students/Teenagers/HomePage.vue'),
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
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('uRole');

  // Kiểm tra nếu route yêu cầu quyền teacher
  if (to.path.startsWith('/teacher') && (!token || userRole !== 'teacher')) {
    next('/login');
  } 
  else {
    document.title = to.meta.title || 'NamThuEdu';
    next();
  }
});

export default router
