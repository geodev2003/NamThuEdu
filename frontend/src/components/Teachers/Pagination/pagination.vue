<template>
    <div class="pagination" v-if="totalPages > 0">
        <button 
            class="pagination-btn" 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
        >
            Previous
        </button>

        <button 
            v-for="page in totalPages" 
            :key="page"
            class="pagination-btn"
            :class="{ active: currentPage === page }"
            @click="changePage(page)"
        >
            {{ page }}
        </button>

        <button 
            class="pagination-btn" 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
        >
            Next
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    totalPages: {
        type: Number,
        required: true
    },
    currentPage: {
        type: Number,
        required: true
    }
})

const emit = defineEmits(['update:current-page'])

const changePage = (page) => {
    if (page >= 1 && page <= props.totalPages) {
        emit('update:current-page', page)
    }
}
</script>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
}

.pagination-btn {
    padding: 8px 16px;
    border: 1px solid #e0e0e0;
    background-color: white;
    color: #374151;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
    background-color: #f3f4f6;
    border-color: #d1d5db;
}

.pagination-btn.active {
    background-color: #111827;
    color: white;
    border-color: #111827;
}

.pagination-btn:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    color: #9ca3af;
}
</style>