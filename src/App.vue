<script setup lang="ts">
import Header from '@/components/header/Index.vue';
import Top from '@/components/Top.vue';
</script>

<template>
  <el-container>
    <el-header
      class="header"
    >
      <Header />
    </el-header>
    <el-main
      class="main"
    >
      <Top />
    </el-main>
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
  padding: 0;
}
.main {
  background-color: #FFF4D6;
  padding: 0;
}
</style>
