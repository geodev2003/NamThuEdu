<script setup>
import { ref, onMounted } from 'vue';
import http from '@/api/http'; // Giả sử bạn dùng axios instance đã tạo

// Khởi tạo là mảng rỗng để courseList.length không bị lỗi
const courseList = ref([]); 

const fetchCourses = async () => {
    try {
        const response = await http.get('/api/teacher/courses');
        // Gán dữ liệu từ API vào ref
        courseList.value = response.data.data || []; 
    } catch (error) {
        console.error("Lỗi khi tải danh sách khóa học:", error);
    }
};

onMounted(() => {
    fetchCourses();
});
</script>

<template>
  <div>
    <p v-if="courseList && courseList.length > 0">
        Bạn đang có {{ courseList.length }} khóa học.
    </p>
    <p v-else>Hiện chưa có khóa học nào.</p>
    
    <div v-for="course in courseList" :key="course.id">
        {{ course.name }}
    </div>
  </div>
</template>