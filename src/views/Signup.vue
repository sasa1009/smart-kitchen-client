<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { ElForm } from 'element-plus'
import axios from 'axios';
import { authData } from '@/modules/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

const router = useRouter();

const formRef = ref<InstanceType<typeof ElForm>>()
const rules = reactive({
  userName: [
    {
      required: true,
      message: 'ユーザー名を入力してください。',
      trigger: 'blur',
    },
    {
      min: 1,
      max: 20,
      message: '1文字以上20文字以下で入力して下さい。',
      trigger: ['blur'],
    },
  ],
  email: [
    {
      required: true,
      message: 'メールアドレスを入力してください。',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'メールアドレス形式で入力してください。',
      trigger: ['blur'],
    },
  ],
  password: [
    {
      required: true,
      message: 'パスワードを入力してください。',
      trigger: 'blur',
    },
    {
      min: 8,
      max: 20,
      message: '8文字以上20文字以下で入力して下さい。',
      trigger: ['blur'],
    },
  ]
});
const formData = reactive({
  userName: '',
  email: '',
  password: ''
});
function signUp(formEl: InstanceType<typeof ElForm> | undefined) {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      axios({
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        url:'http://localhost:3000/api/v1/auth',
        data: formData,
      })
        .then(function (response) {
          console.log(response);
          authData.value.userId = response.data.data.id;
          authData.value.uid = response.headers.uid;
          authData.value.accessToken = response.headers['access-token'];
          authData.value.client = response.headers.client;
          authData.value.expiry = dayjs.unix(Number(response.headers.expiry)).format();
          ElMessage({
            showClose: true,
            message: 'ユーザー登録が完了しました。',
            type: 'success'
          })
          router.push({ name: 'Home' })
        })
        .catch(function (error) {
          ElMessage({
            showClose: true,
            message: 'ユーザー登録に失敗しました。',
            type: 'error'
          })
          console.log(error);
        });
    } else {
      console.log('error submit!');
      return false
    }
  })
}
</script>

<template>
  <div class="login-form-wrapper">
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="formData"
      :rules="rules"
      class="login-form"
    >
      <h3>ユーザー登録</h3>
      <el-form-item
        label="ユーザー名"
        prop="userName"
      >
        <el-input v-model="formData.userName"></el-input>
      </el-form-item>
      <el-form-item
        label="メールアドレス"
        prop="email"
      >
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item
        label="パスワード"
        prop="password"
      >
        <el-input v-model="formData.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="signUp(formRef)"
        >
          ユーザー登録
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-form-wrapper {
  max-width: 750px;
  min-width: 375px;
  height: 600px;
  margin: 10px auto 0 auto;
  padding: 10px;
  box-sizing: border-box;
  background-color: white;
}
.login-form {
  max-width: 500px;
  margin: 0 auto;
}
</style>
