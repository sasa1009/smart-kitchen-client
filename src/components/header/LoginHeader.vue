<script setup lang="ts">
import { ref, reactive } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useMq } from 'vue3-mq';
import dayjs from 'dayjs';

const input = ref('');
const mq = useMq();
const isDrawerOpen = ref(false);
const notifications = reactive([
  {
    imageUrl: '',
    message: 'お知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせ',
    date: dayjs().format('YYYY/MM/DD')
  },
  {
    imageUrl: '',
    message: 'お知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせ',
    date: dayjs().format('YYYY/MM/DD')
  },
  {
    imageUrl: '',
    message: 'お知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせ',
    date: dayjs().format('YYYY/MM/DD')
  },
  {
    imageUrl: '',
    message: 'お知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせお知らせ',
    date: dayjs().format('YYYY/MM/DD')
  },
])
function addNotification() {
  notifications.push(...notifications);
}
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
              :icon="['far', 'user']"
            />
          </el-button>
        </template>
        <el-menu text-color="#000000">
          <el-menu-item index="1">
            <span>レシピ作成</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span>ユーザー情報</span>
          </el-menu-item>
          <el-menu-item index="3">
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
          <ul style="padding: 0;">
            <li
              v-for="(notification, index) in notifications"
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
                <font-awesome-icon
                  :icon="['far', 'user']"
                  size="2x"
                />
              </div>
              <div style="width: 250px;
                          float: left;"
              >
                <p style="margin: 0;">
                  {{ notification.message }}
                </p>
                <span>
                  {{ notification.date }}
                </span>
              </div>
            </li>
          </ul>
          <div style="text-align: center;">
            <el-button
              type="text"
              class="next-button"
              @click="addNotification"
            >
              続きを読み込む
            </el-button>
          </div>
        </div>
      </el-popover>
      <el-button
        type="text"
        class="menu-item"
      >
        フード日誌
      </el-button>
      <el-button
        type="text"
        class="menu-item"
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
          <el-menu-item index="1">
            <span>レシピ一覧</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span>フード日誌</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span>レシピ作成</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span>ユーザー情報</span>
          </el-menu-item>
          <el-menu-item index="5">
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
          <ul style="padding: 0;">
            <li
              v-for="(notification, index) in notifications"
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
                <font-awesome-icon
                  :icon="['far', 'user']"
                  size="2x"
                />
              </div>
              <div style="width: 250px;
                          float: left;"
              >
                <p style="margin: 0;">
                  {{ notification.message }}
                </p>
                <span>
                  {{ notification.date }}
                </span>
              </div>
            </li>
          </ul>
          <div style="text-align: center;">
            <el-button
              type="text"
              class="next-button"
              @click="addNotification"
            >
              続きを読み込む
            </el-button>
          </div>
        </div>
      </el-popover>
      <el-button
        type="text"
        class="menu-icon"
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
        size="20%"
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
</style>
