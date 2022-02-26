<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
import { authData, isLogin } from '@/modules/auth';
import { getPresignedUrl } from '@/modules/presignedUrl';
import { CurrentUserApi, Configuration, UpdateCurrentUserRequest } from '@/api';
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
      max: 200,
      message: '200文字以下で入力して下さい。',
      trigger: ['blur'],
    },
  ],
  sex: [
    {
      required: true,
      message: '性別を入力して下さい。',
      trigger: ['change'],
    },
  ],
  activity_amount: [
    {
      required: true,
      message: '活動レベルを入力して下さい。',
      trigger: ['change'],
    },
  ],
});

const formData = reactive<UpdateCurrentUserRequest>({
  name: '',
  comment: '',
  image_url: null,
  is_set_weight_loss_target: false,
  height: 1,
  weight: 1,
  sex: null,
  age: 1,
  activity_amount: null,
  weight_loss_target: 1
});
const imageData = reactive<ImageData>({
  imageDataUrl: null,
  file: null
});
const activityAmountOptions = [
  {
    value: 1.3,
    label: '低い'
  },
  {
    value: 1.5,
    label: '普通'
  },
  {
    value: 1.7,
    label: '高い'
  },
  {
    value: 1.9,
    label: 'とても高い'
  },
]

// 基礎代謝量を計算する
const calculateBasalMetabolism = computed(() => {
  if (!formData.weight || !formData.height || !formData.age || !formData.sex) return;
  if (formData.sex === 'male') {
    return Math.floor(66.47 + (formData.weight * 13.75) + (formData.height * 5) - (formData.age * 6.76));
  } else {
    return Math.floor(665.1 + (formData.weight * 9.56) + (formData.height * 1.85) - (formData.age * 4.68));
  }
});

// 1日あたりの代謝量を計算する
const calculateMetabolismPerDay = computed(() => {
  if (!calculateBasalMetabolism.value || !formData.activity_amount) return;
  return Math.floor(calculateBasalMetabolism.value * formData.activity_amount);
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
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
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
      image_url: presignedUrl.url.split('?')[0],
      image_key: presignedUrl.key
    };
  } else {
    throw new Error('ファイルのアップロードに失敗しました。');
  }
}

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

/**
 * ユーザー情報を更新する
 */
function updateUser(formEl: InstanceType<typeof ElForm> | undefined) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (!authData.value.userId) throw new Error('未ログインです。');

        // 画像が投稿されている場合はS3にアップロード
        if (imageData.file) {
          const imageMetaData = await uploadImageFileToS3(imageData.file);
          Object.assign(formData, imageMetaData);
        }

        // ユーザー情報を更新
        const response = await new CurrentUserApi(configuration).updateCurrentUser(authData.value.uid, authData.value.accessToken, authData.value.client, authData.value.userId, formData)
        if (response.status === 200) {
          ElMessage({
            showClose: true,
            message: 'ユーザー情報を更新しました。',
            type: 'success',
          });
          router.push({ name: 'CurrentUser' })
        } else {
          throw new Error('ユーザー情報更新失敗。');
        }
      } catch (error) {
        console.error(error);
        ElMessage({
          showClose: true,
          message: 'ユーザー情報の更新に失敗しました。',
          type: 'error',
        });
      }
    } else {
      console.log('error submit!');
      return false
    }
  });
}

/**
 * ログイン中のユーザー情報を取得する
 */
(async function init() {
  try {
    const response = await new CurrentUserApi(configuration).getCurrentUser(authData.value.uid, authData.value.accessToken, authData.value.client);
    if (response.status !== 200) throw new Error('ユーザー情報の取得に失敗しました。');
    for (const key of Object.keys(formData)) {
      // eslint-disable-next-line
      // @ts-ignore
      if (response.data.user[key]) {
        // eslint-disable-next-line
        // @ts-ignore
        formData[key] = response.data.user[key];
      }
    }
  } catch (error) {
    console.error(error);
  }
})();

/**
 * ユーザー情報を削除する
 */
async function deleteUser() {
  try {
    if (!isLogin.value) return;
    await new CurrentUserApi(configuration).deleteCurrentUser(authData.value.uid, authData.value.accessToken, authData.value.client);
    authData.value.userId = null;
    authData.value.uid = '';
    authData.value.accessToken = '';
    authData.value.client = '';
    authData.value.expiry = '';
    ElMessage({
      showClose: true,
      message: '退会が完了しました。ご利用いただきありがとうございました。',
      type: 'success',
    });
    router.push({ name: 'Home' });
  } catch (error) {
    console.error(error);
    ElMessage({
      showClose: true,
      message: '退会処理に失敗しました。',
      type: 'error',
    });
  }
}
</script>

<template>
  <div :class="'user-data-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="formData"
      :rules="rules"
      :hide-required-asterisk="true"
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
              ref="inputRef"
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
            :maxlength="200"
            :show-word-limit="true"
          />
        </el-form-item>
        <el-form-item
          label="減量目標を設定する"
        >
          <el-switch
            v-model="formData.is_set_weight_loss_target"
            active-color="#049EFF"
          />
        </el-form-item>
        <div
          v-if="formData.is_set_weight_loss_target"
        >
          <el-form-item
            label="身長"
            prop="height"
          >
            <el-input-number
              v-model="formData.height"
              :min="1"
              :max="300"
            />
            <span class="unit">cm</span>
          </el-form-item>
          <el-form-item
            label="体重"
            prop="weight"
          >
            <el-input-number
              v-model="formData.weight"
              :min="1"
              :max="300"
            />
            <span class="unit">kg</span>
          </el-form-item>
          <el-form-item
            label="年齢"
            prop="age"
          >
            <el-input-number
              v-model="formData.age"
              :min="1"
              :max="150"
            />
            <span class="unit">歳</span>
          </el-form-item>
          <el-form-item
            label="性別"
            prop="sex"
            style="--el-color-primary: #409eff"
          >
            <el-radio-group v-model="formData.sex">
              <el-radio label="male" size="large">男性</el-radio>
              <el-radio label="female" size="large">女性</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="calculateBasalMetabolism"
            label="基礎代謝量(ハリス・ベネディクトの式による計算)"
          >
            あなたの基礎代謝量は<span class="number">{{ calculateBasalMetabolism }}</span>kcalです。
          </el-form-item>
          <el-form-item
            label="活動レベル"
            prop="activity_amount"
          >
            <el-row :class="'activity-amount-table-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
              <el-col
                :span="8"
                :class="'activity-amount-table-cell-left-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
              >
                <el-select
                  v-model="formData.activity_amount"
                  class="m-2 activity-amount-select"
                  placeholder="活動レベルを選択"
                >
                  <el-option
                    v-for="item in activityAmountOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    style="font-size: 12px;"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="16">
                <div class="activity-amount-table-cell-right-inner">
                  <p class="activity-amount-title">
                    低い: 1.3
                  </p>
                  <p class="activity-amount-description">
                    生活のほとんどが座位で活動が少ない。<br>
                    家事による立ち仕事もあまりなし。
                  </p>
                </div>
                <div class="activity-amount-table-cell-right-inner">
                  <p class="activity-amount-title">
                    普通: 1.5
                  </p>
                  <p class="activity-amount-description">
                    座位が中心の仕事だが、移動や立位での作業。<br>
                    接客などの仕事。
                  </p>
                </div>
                <div class="activity-amount-table-cell-right-inner">
                  <p class="activity-amount-title">
                    高い: 1.7
                  </p>
                  <p class="activity-amount-description">
                    １時間以上の運動を週５日以上行う。<br>
                    軽度の肉体労働。
                  </p>
                </div>
                <div class="activity-amount-table-cell-right-inner">
                  <p class="activity-amount-title">
                    とても高い: 1.9
                  </p>
                  <p class="activity-amount-description">
                    １時間以上の激しい運動を週５日以上行う。<br>
                    宅配業者や引越し業者などの重度の肉体労働。
                  </p>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item
            v-if="calculateMetabolismPerDay"
            label="代謝量"
          >
            あなたの１日の代謝量は<span class="number">{{ calculateMetabolismPerDay }}</span>kcalです。
          </el-form-item>
          <el-form-item
            label="１ヶ月あたりの減量目標"
            prop="weight_loss_target"
          >
            <el-input-number
              v-model="formData.weight_loss_target"
              :min="0.1"
              :max="10"
              :precision="1"
            />
            <span class="unit">kg</span>
          </el-form-item>
          <el-form-item
            v-if="calculateMetabolismPerDay"
            label="減量目標を達成するための１日の摂取カロリー"
          >
            <span class="number">{{ Number(calculateMetabolismPerDay) - Math.floor((7000 * Number(formData.weight_loss_target) / 30)) }}</span>kcalです。
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" @click="updateUser(formRef)">更新</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div :class="'withdrawal-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
      <el-popconfirm
        title="本当に退会してもよろしいですか？"
        @confirm="deleteUser"
      >
        <template #reference>
          <el-button
            type="danger"
          >
            退会する
          </el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<style scoped>
/* ユーザーデータラッパー大 */
.user-data-wrapper-mdlg {
  width: 750px;
  background-color: white;
  border: 1px solid #dcdfe6;
  margin: 10px auto 0 auto;
}
/* ユーザーデータラッパー小 */
.user-data-wrapper-sm {
  width: 375px;
  background-color: white;
  border: 1px solid #dcdfe6;
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
  /* height: 600px; */
  margin: 0 auto;
  padding: 10px 0;
}
/* ユーザーデータ小 */
.user-data-sm {
  width: 375px;
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
/* el-formのスタイル調整 */
.el-form-item {
  margin-bottom: 15px;
}
.el-form-item ::v-deep(.el-form-item__label) {
  line-height: 25px;
  padding-bottom: 5px;
}
.unit {
  margin-left: 10px;
}
.number {
  margin: 0 5px;
  font-size: 16px;
  font-weight: bold;
  color: #0000cd;
}
/* 活動量の選択欄 */
.activity-amount-table-mdlg {
  border: 1px solid #DCDFE6;
  height: 347px
}
.activity-amount-table-sm {
  border: 1px solid #DCDFE6;
  height: 422px
}
.activity-amount-table-cell-left-mdlg {
  border-right: 1px solid #DCDFE6;
  padding: 153.5px 3px;
  box-sizing: border-box;
}
.activity-amount-table-cell-left-sm {
  border-right: 1px solid #DCDFE6;
  padding: 191px 3px;
  box-sizing: border-box;
}
.activity-amount-select ::v-deep(.el-input__inner) {
  font-size: 12px;
}
.activity-amount-table-cell-right-inner {
  border-bottom: 1px solid #DCDFE6;
  padding: 3px 5px;
  box-sizing: border-box;
}
.activity-amount-table-cell-right-inner:last-child {
  border-bottom: none;
}
.activity-amount-title {
  font-size: 12px;
  font-weight: bold;
  line-height: 25px;
  margin: 0 0 5px 0;
}
.activity-amount-description {
  font-size: 12px;
  margin: 0;
  line-height: 25px;
}
/* 退会 */
.withdrawal-mdlg {
  text-align: right;
  width: 500px;
  margin: 30px auto 0;
  padding-bottom: 10px;
}
.withdrawal-sm {
  text-align: right;
  width: 375px;
  margin: 30px auto 0;
  padding: 0 10px 10px;
  box-sizing: border-box;
}
</style>
