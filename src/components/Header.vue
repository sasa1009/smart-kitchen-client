<script setup lang="ts">
import { ref } from 'vue';
const input = ref('');
</script>

<template>
  <div class="header-content">
    <el-button
      type="text"
      class="logo"
    >
      SMART KITCHEN
    </el-button>
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
    <div class="search">
      <el-button
        class="search-button"
        round
      >
        検索
      </el-button>
      <el-input
        class="search-bar"
        v-model="input"
        placeholder="レシピ名・食材で検索"
      />
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
  margin-top: 10px;
  padding: 0;
  color: black;
  font-size: 22px;
}
.search {
  float: right;
  height: 40px;
  width: 330px;
  margin-top: 10px;
}
.search-bar {
  float: right;
  width: 230px;
}
.search-button {
  float: right;
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
