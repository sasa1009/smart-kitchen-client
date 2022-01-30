<script setup lang="ts">
import { reactive } from 'vue';
import axios from 'axios';

const userData = reactive([]);
interface UserData {
  id: number;
  email: string;
  name: string;
}
axios.get('http://localhost:3000/api/v1/users')
  .then(function (response) {
    console.log(response);
    userData.push(...response?.data)
  })
  .catch(function (error) {
    console.log(error);
  })
</script>

<template>
  <div style="height: 500px;">{{userData}}</div>
</template>

<style scoped>
</style>
