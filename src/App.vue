<script setup lang="ts">
import Header from '@/components/header/Index.vue';
// import Home from '@/views/Home.vue';
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
      <router-view />
    </el-main>
    <el-footer
      class="footer"
    >
      <div class="footer-content">
        <span>Copyright © 2022 SMART KITCHEN All Rights Reserved.</span>
      </div>
    </el-footer>
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
  padding: 0 0 10px 0;
}
.footer {
  background-color: #EAD00D;
  padding: 0;
}
.footer-content {
  height: 60px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  box-sizing: border-box;
  padding-top: 20px;
}
</style>
