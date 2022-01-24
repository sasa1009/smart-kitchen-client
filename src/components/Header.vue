<script setup lang="ts">
import { ref } from 'vue';
// @ts-ignore
import { useMq } from "vue3-mq";
const input = ref('');
const mq = useMq();
</script>

<template>
  <div class="header-content">
    <el-button
      type="text"
      class="logo"
    >
      SMART KITCHEN
    </el-button>
    <div class="search">
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
    <div class="menu">
      <el-button
        type="text"
        class="menu-item"
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
      >
        ユーザー登録
      </el-button>
      <el-button
        type="text"
        class="menu-item"
      >
        レシピ一覧
      </el-button>
    </div>
  </div>
</template>

<style scoped>
.header-content {
  height: 60px;
  max-width: 1200px;
  margin: 0 auto;
  vertical-align: middle;
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
.menu {
  float: right;
  height: 40px;
  width: 400px;
  margin-top: 10px;
}
.menu-item {
  float: right;
  color: black;
  font-size: 16px;
  height: 100%;
  margin-left: 10px;
}
</style>
