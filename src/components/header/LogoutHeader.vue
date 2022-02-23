<script setup lang="ts">
import { ref } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useMq } from "vue3-mq";
const input = ref('');
const mq = useMq();
const isDrawerOpen = ref(false);
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
      <el-button
        type="text"
        class="menu-item"
        @click="$router.push({ name: 'Login' })"
      >
        ログイン
      </el-button>
      <el-button
        type="text"
        class="menu-item"
      >
        ゲストログイン
      </el-button>
      <el-button
        type="text"
        class="menu-item"
        @click="$router.push({ name: 'Signup' })"
      >
        ユーザー登録
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
            @click="$router.push({ name: 'Signup' })"
          >
            <span>ユーザー登録</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span>ゲストログイン</span>
          </el-menu-item>
          <el-menu-item
            index="4"
            @click="$router.push({ name: 'Login' })"
          >
            <span>ログイン</span>
          </el-menu-item>
        </el-menu>
      </el-popover>
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
  width: 100px;
  margin-top: 10px;
}
.menu-item {
  float: right;
  color: black;
  font-size: 16px;
  height: 100%;
  margin-left: 10px;
}
.menu-icon {
  float: right;
  color: black;
  font-size: 30px;
  padding: 0;
  margin-left: 15px;
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
