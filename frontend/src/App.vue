<template>
  <div id="app">


    <!-- Main content -->
    <main class="app-content">
      <RouterView />
    </main>


  </div>
</template>

<script setup>
import { RouterView } from "vue-router";

</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f8f9fa;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}


/* ===================== CONTENT ===================== */
.app-content {
  flex: 1;
  width: 100%;
  margin: 0 auto;
}



</style>
