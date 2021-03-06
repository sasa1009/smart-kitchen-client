<script setup lang="ts">
import { ref, reactive } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useMq } from 'vue3-mq';
import axios from 'axios';
import { authData, isLogin } from '@/modules/auth';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { NotificationsApi, Configuration, GetNotificationsResponseNotifications } from '@/api';

const router = useRouter();
const input = ref('');
const mq = useMq();
const isDrawerOpen = ref(false);
function logout() {
  axios({
    method: 'delete',
    headers: {
      uid: authData.value.uid,
      'access-token': authData.value.accessToken,
      client: authData.value.client
    },
    url: process.env.VUE_APP_API_BASE_URL + '/auth/sign_out',
  })
    .then(function (response) {
      console.log(response);
      authData.value.userId = null;
      authData.value.uid = '';
      authData.value.accessToken = '';
      authData.value.client = '';
      authData.value.expiry = '';
      ElMessage({
        showClose: true,
        message: 'ログアウトしました。',
      })
      router.push({ name: 'Home' });
    })
    .catch(function (error) {
      console.log(error);
      authData.value.userId = null;
      authData.value.uid = '';
      authData.value.accessToken = '';
      authData.value.client = '';
      authData.value.expiry = '';
    });
}

// 通知情報を格納する
const notificationDataList = reactive<Array<GetNotificationsResponseNotifications>>([]);

// 通知情報のページングに使用するパラメーター
const pageData = reactive({
  limit: 5,
  offset: 0,
  total: 0
});

/**
 * 通知情報を一覧取得する
 */
async function getNotificasions() {
  if (!isLogin.value) return;
  try {
    const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });
    const response = await new NotificationsApi(configuration).getNotifications(authData.value.uid, authData.value.accessToken, authData.value.client, pageData.limit, pageData.offset);
    for (const notification of response.data.notifications) {
      notificationDataList.push(notification);
    }
    pageData.offset += response.data.notifications.length;
    pageData.total = response.data.meta.total;
  } catch (error) {
    console.error(error);
  }
}

getNotificasions();
</script>

<template>
  <div class="header-content">
    <el-button
      type="text"
      class="logo"
      @click="$router.push({ name: 'Home' })"
    >
      SMART KITCHEN
    </el-button>
    <div
      v-if="mq.current !== 'sm'"
      class="search"
    >
      <el-input
        class="search-bar"
        v-model="input"
        placeholder="レシピ名・食材で検索"
      />
      <el-button
        class="search-button"
        round
        @click="$router.push({ name: 'Recipes', params: { searchKeyword: input } });
                input = '';"
      >
        検索
      </el-button>
    </div>
    <div
      v-if="mq.current === 'lg'"
      class="menu-lg"
    >
      <el-popover
        placement="bottom-end"
        :width="200"
        trigger="click"
      >
        <template #reference>
          <el-button
            type="text"
            class="menu-icon"
          >
            <font-awesome-icon
              :icon="['far', 'user-circle']"
            />
          </el-button>
        </template>
        <el-menu text-color="#000000">
          <el-menu-item
            index="1"
            @click="$router.push({ name: 'PostRecipe' })"
          >
            <span>レシピ作成</span>
          </el-menu-item>
          <el-menu-item
            index="2"
            @click="$router.push({ name: 'CurrentUser' })"
          >
            <span>ユーザー情報</span>
          </el-menu-item>
          <el-menu-item
            index="3"
            @click="logout"
          >
            <span>ログアウト</span>
          </el-menu-item>
        </el-menu>
      </el-popover>
      <el-popover
        placement="bottom-end"
        :width="300"
        trigger="click"
      >
        <template #reference>
          <el-button
            type="text"
            class="menu-icon"
          >
            <font-awesome-icon
              :icon="['far', 'bell']"
            />
          </el-button>
        </template>
        <div class="notification">
          <ul
            style="padding: 0;
                   margin: 0;"
          >
            <li
              v-for="(notification, index) in notificationDataList"
              :key="index"
              style="list-style-type: none;
                     overflow: hidden;
                     margin-bottom: 10px;
                     padding-bottom: 5px;
                     border-bottom: solid 0.5px #c0c0c0;"
            >
              <div style="width: 50px;
                          float: left;"
              >
                <div
                  v-if="notification.sender_image_url"
                  class="sender-image-wrapper"
                  @click="router.push({ name: 'User', params: { id: notification.sender_id } })"
                >
                  <el-image
                    :src="notification.sender_image_url"
                    class="sender-image"
                    fit="cover"
                  />
                </div>
                <font-awesome-icon
                  v-else
                  :icon="['far', 'user-circle']"
                  size="2x"
                />
              </div>
              <div
                v-if="notification.recipe_id"
                style="width: 250px;
                       float: left;"
              >
                <p style="margin: 0;">
                  <span
                    class="sender-name"
                    @click="router.push({ name: 'User', params: { id: notification.sender_id } })"
                  >
                    {{ notification.sender_name }}
                  </span>
                  さんが
                  <span
                    class="sender-name"
                    @click="router.push({ name: 'Recipe', params: { id: notification.recipe_id } })"
                  >
                    {{ notification.recipe_title }}
                  </span>
                  をお気に入りに登録しました。
                </p>
              </div>
              <div
                v-else
                style="width: 250px;
                       float: left;"
              >
                <p style="margin: 0;">
                  <span
                    class="sender-name"
                    @click="router.push({ name: 'User', params: { id: notification.sender_id } })"
                  >
                    {{ notification.sender_name }}
                  </span>
                  さんにフォローされました。
                </p>
              </div>
            </li>
          </ul>
          <div
            style="text-align: center;"
          >
            <el-button
              v-if="pageData.total > pageData.offset"
              type="text"
              class="next-button"
              @click="getNotificasions"
            >
              続きを読み込む
            </el-button>
          </div>
        </div>
      </el-popover>
      <el-button
        type="text"
        class="menu-item"
        @click="$router.push({ name: 'FoodDiary' })"
      >
        フード日誌
      </el-button>
      <el-button
        type="text"
        class="menu-item"
        @click="$router.push({ name: 'FoodLog' })"
      >
        食事記録
      </el-button>
      <el-button
        type="text"
        class="menu-item"
        @click="$router.push({ name: 'Recipes' })"
      >
        レシピ一覧
      </el-button>
    </div>
    <div
      v-else
      class="menu-md"
    >
      <el-popover
        placement="bottom-end"
        :width="200"
        trigger="click"
      >
        <template #reference>
          <el-button
            type="text"
            class="menu-icon"
          >
            <font-awesome-icon
              :icon="['fas', 'bars']"
            />
          </el-button>
        </template>
        <el-menu text-color="#000000">
          <el-menu-item
            index="1"
            @click="$router.push({ name: 'Recipes' })"
          >
            <span>レシピ一覧</span>
          </el-menu-item>
          <el-menu-item
            index="2"
            @click="$router.push({ name: 'FoodDiary' })"
          >
            <span>フード日誌</span>
          </el-menu-item>
          <el-menu-item
            index="3"
            @click="$router.push({ name: 'PostRecipe' })"
          >
            <span>レシピ作成</span>
          </el-menu-item>
          <el-menu-item
            index="4"
            @click="$router.push({ name: 'CurrentUser' })"
          >
            <span>ユーザー情報</span>
          </el-menu-item>
          <el-menu-item
            index="5"
            @click='logout'
          >
            <span>ログアウト</span>
          </el-menu-item>
        </el-menu>
      </el-popover>
      <el-popover
        placement="bottom-end"
        :width="300"
        trigger="click"
      >
        <template #reference>
          <el-button
            type="text"
            class="menu-icon"
          >
            <font-awesome-icon
              :icon="['far', 'bell']"
            />
          </el-button>
        </template>
        <div class="notification">
          <ul
            style="padding: 0;
                   margin: 0;"
          >
            <li
              v-for="(notification, index) in notificationDataList"
              :key="index"
              style="list-style-type: none;
                     overflow: hidden;
                     margin-bottom: 10px;
                     padding-bottom: 5px;
                     border-bottom: solid 0.5px #c0c0c0;"
            >
              <div style="width: 50px;
                          float: left;"
              >
                <div
                  v-if="notification.sender_image_url"
                  class="sender-image-wrapper"
                  @click="router.push({ name: 'User', params: { id: notification.sender_id } })"
                >
                  <el-image
                    :src="notification.sender_image_url"
                    class="sender-image"
                    fit="cover"
                  />
                </div>
                <font-awesome-icon
                  v-else
                  :icon="['far', 'user-circle']"
                  size="2x"
                />
              </div>
              <div
                v-if="notification.recipe_id"
                style="width: 250px;
                       float: left;"
              >
                <p style="margin: 0;">
                  <span
                    class="sender-name"
                    @click="router.push({ name: 'User', params: { id: notification.sender_id } })"
                  >
                    {{ notification.sender_name }}
                  </span>
                  さんが
                  <span
                    class="sender-name"
                    @click="router.push({ name: 'Recipe', params: { id: notification.recipe_id } })"
                  >
                    {{ notification.recipe_title }}
                  </span>
                  をお気に入りに登録しました。
                </p>
              </div>
              <div
                v-else
                style="width: 250px;
                       float: left;"
              >
                <p style="margin: 0;">
                  <span
                    class="sender-name"
                    @click="router.push({ name: 'User', params: { id: notification.sender_id } })"
                  >
                    {{ notification.sender_name }}
                  </span>
                  さんにフォローされました。
                </p>
              </div>
            </li>
          </ul>
          <div
            style="text-align: center;"
          >
            <el-button
              v-if="pageData.total > pageData.offset"
              type="text"
              class="next-button"
              @click="getNotificasions"
            >
              続きを読み込む
            </el-button>
          </div>
        </div>
      </el-popover>
      <el-button
        type="text"
        class="menu-icon"
        @click="$router.push({ name: 'FoodLog' })"
      >
        <font-awesome-icon
          :icon="['fas', 'pencil-alt']"
        />
      </el-button>
      <el-button
        v-if="mq.current === 'sm'"
        @click="isDrawerOpen = true"
        type="text"
        class="menu-icon"
      >
        <font-awesome-icon
          :icon="['fas', 'search']"
        />
      </el-button>
      <el-drawer
        v-model="isDrawerOpen"
        direction="ttb"
        size="40%"
      >
        <div
          class="search"
        >
          <el-input
            class="search-bar"
            v-model="input"
            placeholder="レシピ名・食材で検索"
          />
          <el-button
            class="search-button"
            round
            @click="$router.push({ name: 'Recipes', params: { searchKeyword: input } });
                    input = '';"
          >
            検索
          </el-button>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<style scoped>
.header-content {
  height: 60px;
  max-width: 1200px;
  min-width: 365px;
  margin: 0 auto;
  padding: 0 5px;
}
.logo {
  float: left;
  margin-top: 10px;
  padding: 0;
  color: black;
  font-size: 22px;
}
.search {
  float: left;
  height: 40px;
  width: 315px;
  margin: 10px 0 0 20px;
}
.search-bar {
  width: 230px;
}
.search-button {
  color: black;
  font-size: 16px;
  height: 100%;
  margin-left: 5px;
}
.menu-lg {
  float: right;
  height: 40px;
  width: 400px;
  margin-top: 10px;
}
.menu-md {
  float: right;
  height: 40px;
  width: 165px;
  margin-top: 10px;
}
.menu-item {
  float: right;
  color: black;
  font-size: 16px;
  height: 100%;
  margin-left: 10px;
}
.next-button {
  color: black;
  font-size: 12px;
  padding: 0;
}
.menu-icon {
  float: right;
  color: black;
  font-size: 30px;
  padding: 0;
  margin-left: 10px;
}
.popover-menu {
  text-align: center;
}
.popover-item {
  color: black;
  font-size: 16px;
}
.el-menu {
  border-right: none;
}
/* お知らせ */
.sender-image-wrapper {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}
.user-image-wrapper:hover {
  opacity: 0.8;
}
.sender-image {
  width: 28px;
  height: 28px;
}
.sender-name {
  margin: 0 3px;
  font-weight: bold;
  cursor: pointer;
}
.sender-name:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>
