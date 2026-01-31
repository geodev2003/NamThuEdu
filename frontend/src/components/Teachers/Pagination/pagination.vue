<template>
 <!-- Pagination -->
            <div class="pagination">
                <button class="pagination-btn">Previous</button>
                <button class="pagination-btn active">1</button>
                <button class="pagination-btn">2</button>
                <button class="pagination-btn">3</button>
                <button class="pagination-btn">Next</button>
            </div>
</template>

<script setup>

</script>

<style scoped>
/* Pagination */
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
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s ease;
}

.pagination-btn:hover {
    background-color: #f5f5f5;
}

.pagination-btn.active {
    background-color: #007bff;
    color: white;
    border-color: #007bff;
}
</style>