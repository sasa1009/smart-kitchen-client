import { useLocalStorage } from '@vueuse/core';
import { AuthData } from '@/modules/types';

export const authData = useLocalStorage<AuthData>('authData', {
  uid: '',
  accessToken: '',
  client: '',
  expiry: ''
});
