<script setup lang="ts">
import Header from '@/components/Header.vue';
</script>

<template>
  <el-container>
    <el-header
      style="padding: 0"
      class="header"
    >
      <Header />
    </el-header>
  </el-container>
</template>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  color: #2c3e50;
}
</style>

<style scoped>
.header {
  background-color: #EAD00D;
}
</style>
