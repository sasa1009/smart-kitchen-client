<script setup lang="ts">
import { reactive, defineProps } from 'vue';
import { authData } from '@/modules/auth';
import { CurrentUserApi, Configuration, CurrentUserResponseUser } from '@/api';

const props = defineProps({
  mqCurrent: {
    type: String,
    default: 'lg'
  },
});
const userData = reactive<CurrentUserResponseUser>({
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
    Object.assign(userData, response.data.user)
  } catch (error) {
    console.error(error);
  }
})();
</script>

<template>
  <div :class="'user-data-wrapper-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
    <div :class="'user-data-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
      <div
        v-if="userData.image_url"
        :class="'user-image-wrapper'"
      >
        <el-image
          :class="'user-image'"
          :src="userData.image_url"
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
      <div :class="'user-name-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
        <div class="name">{{ userData.name }}</div>
      </div>
      <div :class="'edit-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
        <el-button
          type="text"
          @click="$router.push({ name: 'CurrentUserEdit' })"
        >
          ユーザー情報を編集する
        </el-button>
      </div>
    </div>
    <div
      v-if="userData.comment"
      :class="'comment-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
    >
      <h3>一言コメント</h3>
      <div>
        {{ userData.comment }}
      </div>
    </div>
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
/* ユーザーデータ大 */
.user-data-mdlg {
  width: 375px;
  height: 400px;
  float: left;
}
/* ユーザーデータ小 */
.user-data-sm {
  width: 375px;
  height: 400px;
  padding: 10px;
  box-sizing: border-box;
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
/* ユーザーネームを含むユーザー情報大 */
.user-name-mdlg {
  width: 100%;
  height: 180px;
  margin-top: 30px;
  padding-left: 10px;
  box-sizing: border-box;
}
/* ユーザーネームを含むユーザー情報小 */
.user-name-sm {
  width: 100%;
  height: 180px;
  margin-top: 30px;
}
.name {
  font-size: 25px;
  font-weight: bold;
}
.edit-mdlg {
  padding-left: 10px;
  box-sizing: border-box;
}
/* コメント大 */
.comment-mdlg {
  width: 375px;
  height: 400px;
  float: left;
  font-size: 14px;
}
/* コメント小 */
.comment-sm {
  width: 375px;
  height: 200px;
  font-size: 14px;
  padding: 10px;
  box-sizing: border-box;
}
</style>
