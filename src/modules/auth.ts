import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { AuthData } from '@/modules/types';

export const authData = useLocalStorage<AuthData>('authData', {
  userId: null,
  uid: '',
  accessToken: '',
  client: '',
  expiry: ''
});
export const isLogin = computed(() => {
  return !!authData.value.userId && !!authData.value.uid && !!authData.value.accessToken && !!authData.value.client && !!authData.value.expiry;
})
export const isExpired = computed(() => {
  return new Date() > new Date(authData.value.expiry);
})
