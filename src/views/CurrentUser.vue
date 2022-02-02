<script setup lang="ts">
import { reactive } from 'vue';
import { authData } from '@/modules/auth';
import { CurrentUserApi, Configuration, CurrentUserResponseUser } from '@/api';

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
  <div class="user-data-wrapper">
    <div class="user-data">
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
      <div class="user-name">
        <div class="name">{{ userData.name }}</div>
      </div>
      <div class="edit">
        <el-button
          type="text"
          @click="$router.push({ name: '' })"
        >
          ユーザー情報を編集する
        </el-button>
      </div>
    </div>
    <div
      v-if="userData.comment"
      class="comment"
    >
      <h3>一言コメント</h3>
      <div>
        {{ userData.comment }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-data-wrapper {
  width: 750px;
  height: 600px;
  background-color: white;
  margin: 10px auto 0 auto;
}
.user-data {
  width: 375px;
  height: 400px;
  float: left;
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
.user-name {
  width: 100%;
  height: 180px;
  margin-top: 30px;
  padding-left: 10px;
  box-sizing: border-box;
}
.name {
  font-size: 25px;
  font-weight: bold;
}
.edit {
  padding-left: 10px;
  box-sizing: border-box;
}
.comment {
  width: 375px;
  height: 400px;
  float: left;
}
</style>
