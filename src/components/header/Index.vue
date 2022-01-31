<script setup lang="ts">
import LoginHeader from '@/components/header/LoginHeader.vue'
import LogoutHeader from '@/components/header/LogoutHeader.vue'
import { computed } from 'vue';
import { authData } from '@/modules/auth';

const isLogin = computed(() => {
  return !!authData.value.uid && !!authData.value.accessToken && !!authData.value.client && !!authData.value.expiry;
})
</script>

<template>
  <div v-if="isLogin">
    <LoginHeader />
  </div>
  <div v-else>
    <LogoutHeader />
  </div>
</template>
