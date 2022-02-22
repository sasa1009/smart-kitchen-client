<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import RecipeCard from '@/components/RecipeCard.vue';
import { RecipesApi, Configuration } from '@/api';
import { recipeDataList } from '@/modules/data';
import { isLogin, authData } from '@/modules/auth';

const route = useRoute();
const mq = useMq();

/**
 * 現在のページの幅に応じて数値を返す
 */
const currentSpan = computed(() => {
  switch (mq.current) {
    case 'lg':
      return 6;
    case 'md':
      return 8;
    case 'sm':
      return 12;
    default: 
      return 6;
  }
});

/**
 * ページングに使用するデータ
 */
const pageData = reactive({
  limit: 12,
  current: 1,
  total: 0,
});

// レシピ情報の一覧を取得してrecipeDataListに格納する
async function getRecipes() {
  try {
    const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });
    let response;
    if (isLogin.value) {
      response = await new RecipesApi(configuration).getRecipes(authData.value.uid, authData.value.accessToken, authData.value.client, pageData.limit, pageData.limit * (pageData.current - 1), route.params.searchKeyword ? route.params.searchKeyword : '', route.params.category ? route.params.category : '', route.params.main_ingredient ? route.params.main_ingredient : '');
    } else {
      response = await new RecipesApi(configuration).getRecipes('', '', '', pageData.limit, pageData.limit * (pageData.current - 1), route.params.searchKeyword ? route.params.searchKeyword : '', route.params.category ? route.params.category : '', route.params.main_ingredient ? route.params.main_ingredient : '');
    }
    if (response.status !== 200) {
      ElMessage({
        showClose: true,
        message: 'レシピ情報の取得に失敗しました。',
        type: 'error',
      });
      throw new Error('レシピ情報の取得に失敗しました。')
    }
    recipeDataList.splice(0);
    Object.assign(recipeDataList, response.data.recipes);
    pageData.total = response.data.meta.total;
  } catch (error) {
    console.error(error);
  }
}

watch(
  () => route.params,
  async () => {
    if (route.name === 'Recipes') {
      await getRecipes();
    }
  }
);

/**
 * ページネーションのページ番号がクリックされた時に新たなレシピ情報の一覧を取得してrecipeDataListに格納する
 */
watch(
  () => pageData.current,
  async () => {
    await getRecipes();
  }
);

// コンポーネント作成時にレシピ情報を取得する
getRecipes();
</script>

<template>
  <el-row :class="'row row-' + mq.current">
    <el-col
      :span="currentSpan"
      v-for="(recipeCardData, index) in recipeDataList"
      :key="index"
      class="col"
    >
      <div :class="'recipe-card-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <RecipeCard
          :mq-current="mq.current"
          v-model:recipe-card-data="recipeDataList[index]"
          :is-login="true"
        />
      </div>
    </el-col>
  </el-row>
  <div class="pagination">
    <el-pagination
      layout="prev, pager, next"
      v-model:currentPage="pageData.current"
      :total="pageData.total"
      :page-size="pageData.limit"
      :pager-count="5"
      style="--el-pagination-background-color: #FFF4D6;
            --el-pagination-button-disabled-background-color: #FFF4D6;
            --el-pagination-hover-color: black;
            --el-pagination-font-color: silver;
            --el-pagination-font-size: 18px;"
    />
  </div>
</template>

<style scoped>
.row {
  margin: 10px auto 0 auto;
}
.row-lg {
  width: 960px;
}
.row-md {
  width: 750px;
}
.row-sm {
  width: 375px;
}
.col {
  margin-bottom: 10px;
}
.recipe-card-wrapper-mdlg {
  width: 200px;
  margin: 0 auto;
}
.recipe-card-wrapper-sm {
  width: 160px;
  margin: 0 auto;
}
.pagination {
  text-align: center;
}
</style>
