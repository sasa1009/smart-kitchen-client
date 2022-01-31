import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { AuthData } from '@/modules/types';

export const authData = useLocalStorage<AuthData>('authData', {
  uid: '',
  accessToken: '',
  client: '',
  expirationDateTime: ''
});
export const isLogin = computed(() => {
  return !!authData.value.uid && !!authData.value.accessToken && !!authData.value.client && !!authData.value.expirationDateTime;
})
export const isExpired = computed(() => {
  return new Date() > new Date(authData.value.expirationDateTime);
})
