<!-- src/components/Teachers/NavBar/NavBar.vue -->
<template>
    <div class="teacher-navbar">
        <div class="navbar-left">
            <h1 class="page-title">{{ pageTitle }}</h1>
            <p class="page-breadcrumb" v-if="breadcrumb">{{ breadcrumb }}</p>
        </div>
        
        <div class="navbar-right">
            <!-- Search Bar -->
            <div class="search-box">
                <i class="bi bi-search"></i>
                <input type="text" placeholder="Search..." />
            </div>
            
            <!-- Notifications -->
            <button class="icon-button" title="Notifications">
                <i class="bi bi-bell"></i>
                <span class="badge">3</span>
            </button>
            
            <!-- Messages -->
            <button class="icon-button" title="Messages">
                <i class="bi bi-chat-dots"></i>
                <span class="badge">5</span>
            </button>
            
            <!-- Profile Dropdown -->
            <div class="profile-dropdown">
                <img src="@/assets/profile-placeholder.png" alt="Profile" class="profile-avatar" />
                <div class="profile-info">
                    <span class="profile-name">{{ user.uName }}</span>
                    <span class="profile-role" style="text-transform: capitalize;">{{ user.uRole }}</span>
                </div>
                <i class="bi bi-chevron-down"></i>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';

const route = useRoute();
const router = useRouter(); // Khởi tạo router

// Mapping routes to titles
const routeTitles = {
    'TeacherHome': 'Dashboard',
    'TeacherDashboard': 'Dashboard',
    'TeacherCourses': 'Course Managements',
    'TeacherStudents': 'Student Managements',
    'TeacherStudentManagements': 'Student Managements',
    'TeacherScoresManagements': 'Student Managements',
    'TeacherCheckInManagements': 'Student Managements',
    'TeacherClasses': 'Class Managements',
    'TeacherTests': 'Test Managements',
    'TeacherBlogs': 'Blog Managements',
    'TeacherSettings': 'Settings'
};

// Mapping routes to breadcrumbs
const routeBreadcrumbs = {
    'TeacherHome': 'Home / Dashboard',
    'TeacherDashboard': 'Home / Dashboard',
    'TeacherCourses': 'Home / Course Managements',
    'TeacherStudents': 'Home / Student Managements',
    'TeacherStudentManagements': 'Home / Student Managements / Students',
    'TeacherScoresManagements' : 'Home / Student Managements / Scores',
    'TeacherCheckInManagements': 'Home / Student Managements / Check-in',
    'TeacherClasses': 'Home / Class Managements',
    'TeacherTests': 'Home / Test Managements',
    'TeacherBlogs': 'Home / Blog Managements',
    'TeacherSettings': 'Home / Settings'
};

const pageTitle = computed(() => {
    return routeTitles[route.name] || 'Teacher Portal';
});

const breadcrumb = computed(() => {
    return routeBreadcrumbs[route.name] || '';
});
const user = ref({
    uName: '', // Giá trị mặc định
    uRole: ''
});

onMounted(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            // Cập nhật key 'name' và 'role' từ dữ liệu đăng nhập thực tế
            user.value.uName = userData.name || 'Người dùng'; 
            user.value.uRole = userData.role || 'Guest';
        } catch (e) {
            console.error("Lỗi parse user:", e);
        }
    }
});

</script>

<style scoped>
.teacher-navbar {
    background-color: white;
    padding: 16px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 0;
    z-index: 100;
}

/* Left Section */
.navbar-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.page-title {
    font-size: 24px;
    font-weight: 700;
    color: #333;
    margin: 0;
}

.page-breadcrumb {
    font-size: 13px;
    color: #888;
    margin: 0;
}

.page-breadcrumb::before {
    content: '📍 ';
}

/* Right Section */
.navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

/* Search Box */
.search-box {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 8px 14px;
    gap: 8px;
    transition: all 0.2s ease;
}

.search-box:focus-within {
    background-color: #e9ecef;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
}

.search-box i {
    color: #888;
    font-size: 16px;
}

.search-box input {
    border: none;
    background: transparent;
    outline: none;
    font-size: 14px;
    color: #333;
    width: 200px;
}

.search-box input::placeholder {
    color: #aaa;
}

/* Icon Buttons */
.icon-button {
    position: relative;
    background-color: #f5f5f5;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.icon-button:hover {
    background-color: #e9ecef;
}

.icon-button i {
    font-size: 18px;
    color: #555;
}

.icon-button .badge {
    position: absolute;
    top: -2px;
    right: -2px;
    background-color: #dc3545;
    color: white;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
}

/* Profile Dropdown */
.profile-dropdown {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.profile-dropdown:hover {
    background-color: #f5f5f5;
}

.profile-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e0e0e0;
}

.profile-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.profile-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.profile-role {
    font-size: 12px;
    color: #888;
}

.profile-dropdown > i {
    font-size: 12px;
    color: #888;
}

/* Responsive Styles */

/* Laptop (1024px - 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
    .teacher-navbar {
        padding: 14px 25px;
    }

    .page-title {
        font-size: 22px;
    }

    .search-box input {
        width: 160px;
    }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
    .teacher-navbar {
        padding: 12px 20px;
    }

    .page-title {
        font-size: 20px;
    }

    .search-box {
        display: none;
    }

    .navbar-right {
        gap: 12px;
    }

    .profile-info {
        display: none;
    }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
    .teacher-navbar {
        padding: 12px 15px;
        flex-wrap: wrap;
    }

    .navbar-left {
        width: 100%;
        margin-bottom: 8px;
    }

    .page-title {
        font-size: 18px;
    }

    .page-breadcrumb {
        font-size: 12px;
    }

    .navbar-right {
        width: 100%;
        justify-content: flex-end;
        gap: 10px;
    }

    .search-box {
        display: none;
    }

    .icon-button {
        width: 36px;
        height: 36px;
    }

    .icon-button i {
        font-size: 16px;
    }

    .profile-info {
        display: none;
    }

    .profile-dropdown > i {
        display: none;
    }
}

/* Small Mobile (< 375px) */
@media (max-width: 374px) {
    .page-title {
        font-size: 16px;
    }

    .icon-button {
        width: 34px;
        height: 34px;
    }

    .profile-avatar {
        width: 34px;
        height: 34px;
    }
}
</style>