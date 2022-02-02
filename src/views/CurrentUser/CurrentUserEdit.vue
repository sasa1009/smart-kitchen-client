<script setup lang="ts">
import { ref, reactive, defineProps } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
import type { UploadFile } from 'element-plus/lib/el-upload/src/upload.type';
import { authData } from '@/modules/auth';
import { CurrentUserApi, Configuration, CurrentUserResponseUser } from '@/api';

const props = defineProps({
  mqCurrent: {
    type: String,
    default: 'lg'
  },
});

const router = useRouter();
const route = useRoute();

const formRef = ref<InstanceType<typeof ElForm>>()

const rules = reactive({
  name: [
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
  comment: [
    {
      min: 1,
      max: 100,
      message: '100文字以下で入力して下さい。',
      trigger: ['blur'],
    },
  ],
});
const formData = reactive<CurrentUserResponseUser>({
  id: 0,
  name: '',
  comment: '',
  image_url: ''
});


(async function init() {
  const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });
  try {
    const response = await new CurrentUserApi(configuration).getCurrentUser(authData.value.uid, authData.value.accessToken, authData.value.client);
    if (response.status !== 200) throw new Error('ユーザー情報の取得に失敗しました。');
    Object.assign(formData, response.data.user)
  } catch (error) {
    console.error(error);
  }
})();
</script>

<template>
  <div :class="'user-data-wrapper-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="formData"
      :rules="rules"
      class="login-form"
    >
      <div :class="'user-data-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
        <div
          v-if="formData.image_url"
          :class="'user-image-wrapper'"
        >
          <el-image
            :class="'user-image'"
            :src="formData.image_url"
            fit="cover"
          ></el-image>
        </div>
        <div
          v-else
          class="user-icon-wrapper"
        >
          <font-awesome-icon
            :icon="['far', 'user-circle']"
            class="user-icon"
          />
        </div>
        <el-form-item
          label="ユーザー名"
          prop="name"
        >
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item
          label="一言コメント"
          prop="comment"
        >
          <el-input
            v-model="formData.comment"
            type="textarea"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
/* ユーザーデータラッパー大 */
.user-data-wrapper-mdlg {
  width: 750px;
  height: 600px;
  background-color: white;
  margin: 10px auto 0 auto;
}
/* ユーザーデータラッパー小 */
.user-data-wrapper-sm {
  width: 375px;
  height: 600px;
  background-color: white;
  margin: 10px auto 0 auto;
}
.user-image-wrapper {
  width: 150px;
  height: 150px;
  margin: 10px auto 0 auto;
  border-radius: 50%;
  overflow: hidden;
}
.user-image {
  width: 150px;
  height: 150px;
}
.user-icon-wrapper {
  width: 150px;
  height: 150px;
  margin: 10px auto 0 auto; 
}
.user-icon {
  font-size: 150px;
}

/* ユーザーデータ大 */
.user-data-mdlg {
  width: 500px;
  height: 600px;
  margin: 0 auto;
  padding-top: 10px;
}
/* ユーザーデータ小 */
.user-data-sm {
  width: 375px;
  height: 400px;
  padding: 10px;
  box-sizing: border-box;
}
</style>
