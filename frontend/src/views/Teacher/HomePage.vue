<!-- src/views/Teacher/HomePage.vue -->
<template>
    <div class="teacher-section">
        <!-- Overlay for mobile/tablet -->
        <div 
            class="sidebar-overlay" 
            :class="{ active: isSidebarOpen && (isMobile || isTablet) }"
            @click="closeSidebar"
        ></div>

        <!-- Sidebar Wrapper -->
        <div class="sidebar-wrapper" :class="{ 
            'open': isSidebarOpen,
            'collapsed': isSidebarCollapsed && isDesktop
        }">
            <Sidebar 
                :isOpen="isSidebarOpen"
                :isCollapsed="isSidebarCollapsed"
                :isMobile="isMobile"
                :isTablet="isTablet"
                :isDesktop="isDesktop"
                @close="closeSidebar"
            />
            
            <!-- Toggle Button -->
            <button 
                class="sidebar-toggle" 
                :class="{ 
                    'collapsed': isSidebarCollapsed && isDesktop,
                    'mobile': isMobile || isTablet
                }"
                @click="toggleSidebar"
            >
                <i class="bi" :class="getToggleIcon()"></i>
            </button>
        </div>

        <!-- Main Content -->
        <div class="teacher-content" :class="{ 
            'sidebar-collapsed': isSidebarCollapsed && isDesktop,
            'no-sidebar': !isSidebarOpen && (isMobile || isTablet)
        }">
            <!-- Mobile/Tablet Menu Button -->
            <button 
                v-if="!isSidebarOpen && (isMobile || isTablet)" 
                class="mobile-menu-button"
                @click="toggleSidebar"
            >
                <i class="bi bi-list"></i>
                <span>Menu</span>
            </button>

            <!-- NavBar Component -->
            <NavBar />

            <!-- Router View - Hiển thị nội dung từ các route con -->
            <div class="content-inner">
                <router-view />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Sidebar from '../../components/Teachers/SideBar/SideBar.vue';
import NavBar from '../../components/Teachers/NavBar/NavBar.vue';

const isSidebarOpen = ref(true);
const isSidebarCollapsed = ref(false);
const isMobile = ref(false);
const isTablet = ref(false);
const isDesktop = ref(true);

// Check screen size with breakpoints
const checkScreenSize = () => {
    const width = window.innerWidth;
    
    // Mobile: < 768px
    isMobile.value = width < 768;
    
    // Tablet: 768px - 1024px
    isTablet.value = width >= 768 && width <= 1024;
    
    // Desktop: > 1024px
    isDesktop.value = width > 1024;
    
    // Set initial states based on screen size
    if (isMobile.value) {
        isSidebarOpen.value = false;
        isSidebarCollapsed.value = false;
    } else if (isTablet.value) {
        isSidebarOpen.value = false;
        isSidebarCollapsed.value = false;
    } else {
        // Desktop - restore last state or default to open
        if (!sessionStorage.getItem('sidebarState')) {
            isSidebarOpen.value = true;
            isSidebarCollapsed.value = false;
        }
    }
};

const toggleSidebar = () => {
    if (isMobile.value || isTablet.value) {
        isSidebarOpen.value = !isSidebarOpen.value;
    } else {
        // Desktop - toggle collapsed state
        isSidebarCollapsed.value = !isSidebarCollapsed.value;
        isSidebarOpen.value = true;
        
        // Save state
        sessionStorage.setItem('sidebarCollapsed', isSidebarCollapsed.value);
    }
};

const closeSidebar = () => {
    if (isMobile.value || isTablet.value) {
        isSidebarOpen.value = false;
    }
};

const getToggleIcon = () => {
    if (isMobile.value || isTablet.value) {
        return 'bi-x-lg';
    }
    return isSidebarCollapsed.value ? 'bi bi-justify' : 'bi bi-justify';
};

// Restore saved state on mount
onMounted(() => {
    checkScreenSize();
    
    // Restore desktop sidebar state
    if (isDesktop.value) {
        const savedCollapsed = sessionStorage.getItem('sidebarCollapsed');
        if (savedCollapsed !== null) {
            isSidebarCollapsed.value = savedCollapsed === 'true';
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>

<style scoped>
.teacher-section {
    display: flex;
    height: 100vh;
    position: relative;
    overflow: hidden;
}

/* Sidebar Wrapper */
.sidebar-wrapper {
    position: relative;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1100;
}

/* Toggle Button */
.sidebar-toggle {
    position: absolute;
    z-index: 1500;
    color: white;
    padding: 16px 16px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-toggle:active {
    transform: scale(0.95);
}

.sidebar-toggle i {
    pointer-events: none;
}

/* Mobile Menu Button in Content */
.mobile-menu-button {
    position: fixed;
    top: 15px;
    left: 15px;
    z-index: 100;
    color: white;
    border: none;
    padding: 16px 16px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
}

.mobile-menu-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.mobile-menu-button i {
    font-size: 20px;
}

/* Overlay */
.sidebar-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1001;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.sidebar-overlay.active {
    display: block;
    opacity: 1;
}

/* Main Content */
.teacher-content {
    flex: 1;
    background-color: #f5f5f5;
    overflow-y: auto;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    display: flex;
    flex-direction: column;
}

.content-inner {
    padding: 30px;
    flex: 1;
}

/* Desktop (> 1024px) */
@media (min-width: 1025px) {
    .sidebar-toggle {
        top: 20px;
        right: -17px;
        width: 34px;
        height: 34px;
    }

    .sidebar-toggle i {
        font-size: 24px;
    }

    .sidebar-wrapper.collapsed .sidebar-toggle {
        right: -17px;
    }

    .teacher-content {
        margin-left: 0;
    }
}

/* Laptop (1024px - 1440px) */
@media (min-width: 1025px) and (max-width: 1440px) {
    .content-inner {
        padding: 25px;
    }
}

/* Tablet (768px - 1024px) */
@media (min-width: 768px) and (max-width: 1024px) {
    .sidebar-wrapper {
        position: fixed;
        left: -280px;
        top: 0;
        height: 100vh;
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar-wrapper.open {
        left: 0;
    }

    .sidebar-toggle {
        top: 15px;
        right: -45px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .sidebar-toggle i {
        font-size: 20px;
    }

    .content-inner {
        padding: 20px;
    }
}

/* iPad Pro (1024px) */
@media (width: 1024px) {
    .sidebar-wrapper {
        position: fixed;
        left: -280px;
        top: 0;
        height: 100vh;
    }

    .sidebar-wrapper.open {
        left: 0;
    }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
    .sidebar-wrapper {
        position: fixed;
        left: -100%;
        top: 0;
        height: 100vh;
        transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .sidebar-wrapper.open {
        left: 0;
    }

    .sidebar-toggle {
        top: 12px;
        right: 12px;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        background-color: #dc3545;
    }

    .sidebar-toggle:hover {
        background-color: #c82333;
    }

    .sidebar-toggle i {
        font-size: 22px;
    }

    .content-inner {
        padding: 15px;
    }
}

/* Small Mobile (< 375px) */
@media (max-width: 374px) {
    .content-inner {
        padding: 12px;
    }
}
</style>