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
        ユーザー登録
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
        ログイン
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
  margin-top: 10px;
  padding: 0;
  color: black;
  font-size: 22px;
}
.menu {
  float: right;
  height: 40px;
  margin-top: 10px;
}
.menu-item {
  color: black;
  font-size: 18px;
  height: 100%;
}
</style>
