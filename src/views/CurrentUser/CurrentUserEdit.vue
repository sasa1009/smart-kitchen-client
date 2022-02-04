<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
import { authData } from '@/modules/auth';
import { getPresignedUrl } from '@/modules/presignedUrl';
import { CurrentUserApi, Configuration, CurrentUserResponseUser } from '@/api';
import axios from 'axios';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';

interface ImageData {
  imageDataUrl: string | ArrayBuffer | null;
  file: File | null;
}

const mq = useMq();

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
const imageData = reactive<ImageData>({
  imageDataUrl: null,
  file: null
});

/**
 * アップロードされた画像ファイルに対して以下の処理を行う
 * ・画像ファイルのバリデーション処理
 * ・BASE64形式への変換
 * ・各情報のimageDataオブジェクトへの格納
 */
function handleFile(event: any) {
  try {
    const file = event.target.files[0] as unknown as File;
    if (!file) return;

    // ファイルのバリデーションを行う
    // ファイルのサイズは5MBまで
    if (file.size > 5000000) {
      ElMessage({
        showClose: true,
        message: '5MB以下のサイズの画像を指定してください。',
        type: 'error',
      })
      return;
    }

    // ファイルの形式はJPEGまたはPNGのみ
    if (file.type != 'image/jpeg' && file.type != 'image/png') {
      ElMessage({
        showClose: true,
        message: 'JPEGまたはPNG形式のファイルを指定してください。',
        type: 'error',
      })
      return;
    }

    // imageDataオブジェクトに画像データを格納
    const reader = new FileReader();
    reader.onload = e => {
      imageData.imageDataUrl = e.target.result;
    };
    reader.readAsDataURL(file);
    imageData.file = file;
  } catch (error) {
    console.error(error);
    ElMessage({
      showClose: true,
      message: 'ファイルの取り込みに失敗しました。',
      type: 'error',
    })
    throw new Error();
  }
}

/**
 * アップロードされた画像ファイルを削除する
 */
function deleteFile() {
  imageData.imageDataUrl = null;
  imageData.file = null;
}

/**
 * 画像ファイルをS3にアップロードする
 */
async function uploadImageFileToS3(file: File) {
  // ファイルの署名付きURLを取得する
  const presignedUrl = await getPresignedUrl(file.name);
  if (!presignedUrl) throw new Error('署名付きURLの取得に失敗しました。');

  // S3にファイルをアップロード
  const updateResponse = await axios.put(presignedUrl.url, file);

  if (updateResponse.status === 200) {
    return {
      imageUrl: presignedUrl.url.split('?')[0],
      key: presignedUrl.key
    };
  } else {
    throw new Error('ファイルのアップロードに失敗しました。');
  }
}

/**
 * ログイン中のユーザー情報を取得する
 */
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
  <div :class="'user-data-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="formData"
      :rules="rules"
      class="login-form"
    >
      <div :class="'user-data-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <div
          v-if="!!formData.image_url || !!imageData.imageDataUrl"
          :class="'user-image-wrapper'"
        >
          <el-image
            :class="'user-image'"
            :src="imageData.imageDataUrl ? imageData.imageDataUrl : formData.image_url"
            fit="cover"
          />
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
        <div class="upload-wrapper">
          <label class="upload">
            画像を変更
            <input
              type="file"
              @change="handleFile"
              />
          </label>
          <span class="upload-tips">5MB以下で、JPEGまたはPNG形式の画像を指定してください。</span>
          <div
            class="image-name-wrapper"
            v-if="imageData.imageDataUrl"
          >
            <div class="image-name">
              {{ imageData.file?.name }}
            </div>
            <span
              class="delete-button"
              @click="deleteFile"
            >
              <font-awesome-icon
                :icon="['far', 'times-circle']"
              />
            </span>
          </div>
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
/* 画像アップローダー */
.upload-wrapper {
  margin: 10px 0;
}
.upload {
  background-color: #409eff;
  color: white;
  font-size: 14px;
  display: block;
  width: 140px;
  height: 25px;
  text-align: center;
  padding-top: 3px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 5px;
}
.upload:hover {
  opacity: 0.8;
}
.upload > input {
  display: none;
}
.upload-tips {
  font-size: 12px;
  color: #606266;
}
/* アップロードされた画像の名前 */
.image-name-wrapper {
  height: 27px;
}
.image-name-wrapper::after {
  content: "";
  display: block;
  clear: both;
}
.image-name {
  font-size: 14px;
  font-weight: bold;
  text-decoration: underline;
  width: 200px;
  margin-top: 3px;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delete-button {
  font-size: 20px;
  color: #F56C6C;
  cursor: pointer;
}
.delete-button:hover {
  opacity: 0.8;
}
</style>
