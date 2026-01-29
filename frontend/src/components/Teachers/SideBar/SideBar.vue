<template>
    <div class="teacher-sidebar" :class="{ 
        'collapsed': isCollapsed && isDesktop
    }">
        <!-- Logo and Name -->
        <div class="logo-section">
            <img src="@/assets/logo.png" alt="Logo" class="logo" />
            <h2 class="teacher-name" v-show="!isCollapsed || !isDesktop">NamThuEdu</h2>
        </div>

        <!-- Navigation Links -->
        <nav class="navigation-links">
            <ul>
                <li>
                    <a href="#dashboard" :title="isCollapsed && isDesktop ? 'Dashboard' : ''">
                        <i class="bi bi-speedometer2"></i>
                        <span v-show="!isCollapsed || !isDesktop">Dashboard</span>
                    </a>
                </li>

                <li>
                    <a href="#courses" :title="isCollapsed && isDesktop ? 'Course Managements' : ''">
                        <i class="bi bi-book"></i>
                        <span v-show="!isCollapsed || !isDesktop">Course Managements</span>
                    </a>
                </li>
                
                <li class="has-submenu">
                    <div 
                        class="menu-item" 
                        @click="toggleSubmenu('class')"
                        :title="isCollapsed && isDesktop ? 'Class Managements' : ''"
                    >
                        <div class="menu-item-left">
                            <i class="bi bi-door-open"></i>
                            <span v-show="!isCollapsed || !isDesktop">Class Managements</span>
                        </div>
                        <i 
                            v-show="(!isCollapsed || !isDesktop)" 
                            :class="['bi', openMenus.class ? 'bi-chevron-down' : 'bi-chevron-right']"
                        ></i>
                    </div>
                    <ul class="submenu" v-show="openMenus.class && (!isCollapsed || !isDesktop)">
                        <li><a href="#create-class">Create Class</a></li>
                        <li><a href="#list-class">List Class</a></li>
                        <li><a href="#assignments">Assignments</a></li>
                    </ul>
                </li>

                <li class="has-submenu">
                    <div 
                        class="menu-item" 
                        @click="toggleSubmenu('student')"
                        :title="isCollapsed && isDesktop ? 'Student Managements' : ''"
                    >
                        <div class="menu-item-left">
                            <i class="bi bi-people"></i>
                            <span v-show="!isCollapsed || !isDesktop">Student Managements</span>
                        </div>
                        <i 
                            v-show="(!isCollapsed || !isDesktop)" 
                            :class="['bi', openMenus.student ? 'bi-chevron-down' : 'bi-chevron-right']"
                        ></i>
                    </div>
                    <ul class="submenu" v-show="openMenus.student && (!isCollapsed || !isDesktop)">
                        <li><a href="#students">Students</a></li>
                        <li><a href="#scores">Scores</a></li>
                    </ul>
                </li>

                <li class="has-submenu">
                    <div 
                        class="menu-item" 
                        @click="toggleSubmenu('test')"
                        :title="isCollapsed && isDesktop ? 'Test Managements' : ''"
                    >
                        <div class="menu-item-left">
                            <i class="bi bi-clipboard-check"></i>
                            <span v-show="!isCollapsed || !isDesktop">Test Managements</span>
                        </div>
                        <i 
                            v-show="(!isCollapsed || !isDesktop)" 
                            :class="['bi', openMenus.test ? 'bi-chevron-down' : 'bi-chevron-right']"
                        ></i>
                    </div>
                    <ul class="submenu" v-show="openMenus.test && (!isCollapsed || !isDesktop)">
                        <li><a href="#create-test">Create Test</a></li>
                        <li><a href="#assessment">Assessment Test</a></li>
                        <li><a href="#list-test">List Test</a></li>
                    </ul>
                </li>

                <li class="has-submenu">
                    <div 
                        class="menu-item" 
                        @click="toggleSubmenu('blog')"
                        :title="isCollapsed && isDesktop ? 'Blog Managements' : ''"
                    >
                        <div class="menu-item-left">
                            <i class="bi bi-pencil-square"></i>
                            <span v-show="!isCollapsed || !isDesktop">Blog Managements</span>
                        </div>
                        <i 
                            v-show="(!isCollapsed || !isDesktop)" 
                            :class="['bi', openMenus.blog ? 'bi-chevron-down' : 'bi-chevron-right']"
                        ></i>
                    </div>
                    <ul class="submenu" v-show="openMenus.blog && (!isCollapsed || !isDesktop)">
                        <li><a href="#create-blog">Create Blog</a></li>
                        <li><a href="#list-blog">List Blog</a></li>
                    </ul>
                </li>

                <li>
                    <a href="#settings" :title="isCollapsed && isDesktop ? 'Settings' : ''">
                        <i class="bi bi-gear"></i>
                        <span v-show="!isCollapsed || !isDesktop">Settings</span>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Theme Toggle -->
        <div class="theme-toggle-section" v-show="!isCollapsed || !isDesktop">
            <span class="theme-label">Theme</span>
            <div class="theme-switch">
                <i class="bi bi-sun-fill"></i>
                <label class="switch">
                    <input type="checkbox" v-model="isDarkMode" @change="toggleTheme">
                    <span class="slider"></span>
                </label>
                <i class="bi bi-moon-fill"></i>
            </div>
        </div>

        <!-- Collapsed Theme Toggle (Desktop only) -->
        <div 
            class="theme-toggle-collapsed" 
            v-show="isCollapsed && isDesktop"
            @click="toggleTheme"
            :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
            <i class="bi" :class="isDarkMode ? 'bi-moon-fill' : 'bi-sun-fill'"></i>
        </div>

        <!-- Profile -->
        <div class="profile-section">
            <div class="profile-left">
                <img src="@/assets/profile-placeholder.png" alt="Profile Picture" class="profile-picture" />
                <div class="profile-info" v-show="!isCollapsed || !isDesktop">
                    <h3 class="profile-name">John Doe</h3>
                    <p class="profile-role">Teacher</p>
                </div>
            </div>

            <!-- Logout Button -->
            <button 
                class="logout-button" 
                v-show="!isCollapsed || !isDesktop"
                :title="isCollapsed && isDesktop ? 'Logout' : ''"
            >
                <i class="bi bi-box-arrow-right"></i>
            </button>
        </div>

        <!-- Collapsed Logout Button (Desktop only) -->
        <button 
            class="logout-button-collapsed" 
            v-show="isCollapsed && isDesktop"
            title="Logout"
        >
            <i class="bi bi-box-arrow-right"></i>
        </button>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: true
    },
    isCollapsed: {
        type: Boolean,
        default: false
    },
    isMobile: {
        type: Boolean,
        default: false
    },
    isTablet: {
        type: Boolean,
        default: false
    },
    isDesktop: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['close']);

const openMenus = ref({
    class: false,
    student: false,
    blog: false,
    test: false
});

const isDarkMode = ref(false);

const toggleSubmenu = (menu) => {
    if (!props.isCollapsed || !props.isDesktop) {
        openMenus.value[menu] = !openMenus.value[menu];
    }
};

const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value;
    if (isDarkMode.value) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
};
</script>

<style scoped>
.teacher-sidebar {
    width: 260px;
    background-color: #f8f9fa;
    display: flex;
    flex-direction: column;
    height: 100vh;
    padding: 12px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.08);
    border-right: 1px solid #e0e0e0;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
}

/* Scrollbar Styling */
.teacher-sidebar::-webkit-scrollbar {
    width: 6px;
}

.teacher-sidebar::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}

.teacher-sidebar::-webkit-scrollbar-track {
    background-color: transparent;
}

/* Logo Section */
.logo-section {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 12px 8px;
    margin-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
    transition: all 0.3s ease;
}

.logo {
    width: 50px;
    height: 50px;
    min-width: 50px;
    border-radius: 8px;
    object-fit: cover;
    transition: all 0.3s ease;
}

.teacher-name {
    font-size: 20px;
    color: #333;
    font-weight: 700;
    margin: 0 0 0 12px;
    white-space: nowrap;
    transition: all 0.3s ease;
}

/* Navigation Links */
.navigation-links {
    flex: 1;
    margin: 8px 0;
}

.navigation-links ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.navigation-links > ul > li {
    margin: 4px 0;
}

.navigation-links > ul > li > a {
    text-decoration: none;
    color: #444;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 12px;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.navigation-links > ul > li > a i {
    font-size: 19px;
    min-width: 20px;
    color: #666;
    transition: color 0.2s ease;
}

.navigation-links > ul > li > a:hover {
    background-color: #e9ecef;
}

.navigation-links > ul > li > a:hover i {
    color: #007bff;
}

/* Menu with Submenu */
.has-submenu .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px 12px;
    cursor: pointer;
    color: #444;
    font-size: 15px;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.menu-item-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
}

.menu-item-left i {
    font-size: 19px;
    min-width: 20px;
    color: #666;
    transition: color 0.2s ease;
}

.has-submenu .menu-item:hover {
    background-color: #e9ecef;
}

.has-submenu .menu-item:hover i {
    color: #007bff;
}

.has-submenu .menu-item > i {
    font-size: 13px;
    color: #888;
    transition: transform 0.3s ease;
}

/* Submenu */
.submenu {
    list-style: none;
    padding: 4px 0 8px 0;
    margin: 0;
}

.submenu li {
    padding: 0;
}

.submenu li a {
    display: block;
    padding: 9px 12px 9px 44px;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    border-radius: 8px;
    margin: 2px 0;
    transition: all 0.2s ease;
}

.submenu li a:hover {
    background-color: #e9ecef;
    color: #007bff;
}

/* Theme Toggle Section */
.theme-toggle-section {
    padding: 12px;
    margin: 0px 0;
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.theme-label {
    font-size: 14px;
    color: #555;
    font-weight: 600;
}

.theme-switch {
    display: flex;
    align-items: center;
    gap: 8px;
}

.theme-switch i {
    font-size: 16px;
}

.theme-switch i.bi-sun-fill {
    color: #ffa500;
}

.theme-switch i.bi-moon-fill {
    color: #4169e1;
}

/* Toggle Switch */
.switch {
    position: relative;
    display: inline-block;
    width: 42px;
    height: 22px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 22px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #007bff;
}

input:checked + .slider:before {
    transform: translateX(20px);
}

/* Collapsed Theme Toggle */
.theme-toggle-collapsed {
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s ease;
    margin: 8px 0;
}

.theme-toggle-collapsed:hover {
    background-color: #e9ecef;
}

.theme-toggle-collapsed i {
    font-size: 20px;
}

.theme-toggle-collapsed i.bi-sun-fill {
    color: #ffa500;
}

.theme-toggle-collapsed i.bi-moon-fill {
    color: #4169e1;
}

/* Profile Section */
.profile-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-top: 1px solid #e0e0e0;
    margin-top: auto;
}

.profile-left {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
}

.profile-picture {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.profile-info {
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.profile-name {
    font-size: 15px;
    color: #333;
    margin: 0 0 2px 0;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.profile-role {
    font-size: 13px;
    color: #777;
    margin: 0;
}

/* Logout Button */
.logout-button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 8px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.logout-button:hover {
    background-color: #c82333;
    transform: translateY(-1px);
}

.logout-button:active {
    transform: translateY(0);
}

/* Collapsed Logout Button */
.logout-button-collapsed {
    width: 100%;
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    margin-top: 8px;
}

.logout-button-collapsed:hover {
    background-color: #c82333;
}

/* Collapsed State (Desktop) */
.teacher-sidebar.collapsed {
    width: 70px;
    padding: 12px 8px;
}

.teacher-sidebar.collapsed .logo-section {
    justify-content: center;
}

.teacher-sidebar.collapsed .logo {
    margin: 0;
}

.teacher-sidebar.collapsed .profile-left {
    justify-content: center;
}

.teacher-sidebar.collapsed .navigation-links > ul > li > a,
.teacher-sidebar.collapsed .has-submenu .menu-item {
    justify-content: center;
    padding: 11px 8px;
}

.teacher-sidebar.collapsed .menu-item-left {
    justify-content: center;
}

/* Tablet Specific Styles */
@media (min-width: 768px) and (max-width: 1024px) {
    .teacher-sidebar {
        width: 280px;
    }
}

/* Mobile Specific Styles */
@media (max-width: 767px) {
    .teacher-sidebar {
        width: 280px;
    }

    .logo-section {
        padding: 16px 12px;
    }

    .navigation-links > ul > li > a,
    .has-submenu .menu-item {
        padding: 13px 12px;
        font-size: 16px;
    }
}
</style>