<template>
    <h1>Dashboard</h1>
            <!-- Statistics Cards -->
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon">
                    <i class="bi bi-book"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Courses</h3>
                    <p class="stat-number">{{ courseList.length }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="bi bi-person-check"></i>
                </div>
                <div class="stat-info">
                    <h3>Active Students</h3>
                    <p class="stat-number">1,248</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="bi bi-graph-up"></i>
                </div>
                <div class="stat-info">
                    <h3>Completion Rate</h3>
                    <p class="stat-number">87%</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon">
                    <i class="bi bi-star"></i>
                </div>
                <div class="stat-info">
                    <h3>Avg. Rating</h3>
                    <p class="stat-number">4.8</p>
                </div>
            </div>
        </div>
</template>

<script setup></script>

<style scoped>
/* Statistics Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    padding: 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 16px;
    border: 1px solid #e5e7eb;
    transition: border-color 0.2s;
}

.stat-card:hover {
    border-color: #d1d5db;
}

.stat-icon {
    width: 48px;
    height: 48px;
    background-color: #f3f4f6;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-icon i {
    font-size: 24px;
    color: #6b7280;
}

.stat-info h3 {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 6px 0;
    font-weight: 500;
}

.stat-number {
    font-size: 28px;
    font-weight: 600;
    color: #111827;
    margin: 0;
}
</style>