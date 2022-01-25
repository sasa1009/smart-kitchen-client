<script setup lang="ts">
import LoginHeader from '@/components/header/LoginHeader.vue'
import LogoutHeader from '@/components/header/LogoutHeader.vue'
import { ref } from 'vue';

const isLogin = ref(true);
</script>

<template>
  <div v-if="isLogin">
    <LoginHeader />
  </div>
  <div v-else>
    <LogoutHeader />
  </div>
</template>
