<script setup lang="ts">
import RecipeCard from '@/components/RecipeCard.vue';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
// eslint-disable-next-line
// @ts-ignore
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { Configuration, RecipesApi } from '@/api'
import { ingredients, categories, recipeDataList, followingRecipeDataList, recipeRankingList } from '@/modules/data';
import { isLogin, authData } from '@/modules/auth';
import dayjs from 'dayjs';

const mq = useMq();

const carouselSetting = {
  itemsToShow: 2,
  snapAlign: 'start'
}
const breakpointSettings = {
  750: {
    itemsToShow: 3,
    snapAlign: 'center'
  },
  960: {
    itemsToShow: 4,
    snapAlign: 'start'
  },
}

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

/**
 * 新着レシピ情報の一覧を取得する
 */
async function getRecipeData() {
  try {
    let response;
    if (isLogin.value) {
      response = await new RecipesApi(configuration).getRecipes(authData.value.uid, authData.value.accessToken, authData.value.client, 10, 0, '', '', '');
    } else {
      response = await new RecipesApi(configuration).getRecipes('', '', '', 10, 0, '', '', '');
    }
    if (response.status !== 200) throw new Error('レシピ情報の取得に失敗しました。');
    recipeDataList.splice(0);
    Object.assign(recipeDataList, response.data.recipes);
  } catch (error) {
    console.error(error);
  }
}

/**
 * フォロー中のユーザーが作成したレシピ情報の一覧を取得する
 */
async function getFollowingRecipeData() {
  try {
    const response = await new RecipesApi(configuration).getFollowingRecipes(authData.value.uid, authData.value.accessToken, authData.value.client, Number(authData.value.userId), 10, 0);
    if (response.status !== 200) throw new Error('フォロー中のレシピ情報の取得に失敗しました。');
    followingRecipeDataList.splice(0);
    Object.assign(followingRecipeDataList, response.data.recipes);
  } catch (error) {
    console.error(error);
  }
}

/**
 * 直近1週間で最も多くお気に入りに登録されたレシピ情報の一覧を取得する
 */
async function getRecipeRankingData() {
  try {
    let response;
    if (isLogin.value) {
      response = await new RecipesApi(configuration).getRecipeRanking(authData.value.uid, authData.value.accessToken, authData.value.client, 10, 0, dayjs().subtract(7, 'd').toISOString(), dayjs().toISOString());
    } else {
      response = await new RecipesApi(configuration).getRecipeRanking('', '', '', 10, 0, dayjs().subtract(7, 'd').toISOString(), dayjs().toISOString());
    }
    if (response.status !== 200) throw new Error('レシピランキング情報の取得に失敗しました。');
    recipeRankingList.splice(0);
    Object.assign(recipeRankingList, response.data.recipes);
  } catch (error) {
    console.error(error);
  }
}

// レシピ情報の一覧を取得する
(function init() {
  getRecipeData();
  getRecipeRankingData();
  if (isLogin.value) {
    getFollowingRecipeData();
  }
})();
</script>

<template>
  <div :class="'top-image-wrapper-' + mq.current">
    <el-image
      :class="'top-image-' + mq.current"
      :src="require('@/assets/pasta.jpg')"
      fit="fill"
    ></el-image>
  </div>
  <el-tabs
    type="border-card"
    :class="'search-pane-' + mq.current"
  >
    <el-tab-pane
      label="食材から探す"
    >
      <div
        v-for="(ingredient, i) in ingredients"
        :key="i"
      >
        <span class="ingredient-title">{{ ingredient.ingredientCategory }}</span>
        <el-row :class="'ingredient-row-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
          <el-col
            v-for="(item, j) in ingredient.items"
            :key="j"
            :span="mq.current === 'sm' ? 6 : 4"
          >
            <span
              class="search-item"
              @click="$router.push({ name: 'Recipes', params: { main_ingredient: item } })"
            >
              <font-awesome-icon
                :icon="['fas', 'angle-right']"
                class="angle-right"
              />
              {{ item }}
            </span>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="カテゴリーから探す"
    >
      <el-row :class="'category-row-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <el-col
          v-for="(category, index) in categories"
          :key="index"
          :span="mq.current === 'sm' ? 6 : 4"
          class="category-item"
        >
          <span
            class="search-item"
            @click="$router.push({ name: 'Recipes', params: { category: category } })"
          >
            <font-awesome-icon
              :icon="['fas', 'angle-right']"
              class="angle-right"
            />
            {{ category }}
          </span>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
  <div :class="'carousel-wrapper-' + mq.current">
    <h3 style="margin: 10px 0 10px 0;">一週間の人気レシピランキング</h3>
    <Carousel
      :settings="carouselSetting"
      :breakpoints="breakpointSettings"
    >
      <Slide
        v-for="(recipeCardData, index) in recipeRankingList"
        :key="index"
      >
        <div>
          <span style="font-size: 18px; font-weight: bold;">
            {{ index + 1 }}
          </span>
          <RecipeCard
            :mq-current="mq.current"
            v-model:recipe-card-data="recipeRankingList[index]"
            :is-login="true"
          />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
  <div
    v-if="isLogin && followingRecipeDataList.length >= 1"
    :class="'carousel-wrapper-' + mq.current"
  >
    <h3 style="margin: 10px 0 10px 0;">フォロー中のユーザーの新着レシピ</h3>
    <Carousel
      :settings="carouselSetting"
      :breakpoints="breakpointSettings"
    >
      <Slide
        v-for="(recipeCardData, index) in followingRecipeDataList"
        :key="index"
      >
        <div>
          <RecipeCard
            :mq-current="mq.current"
            v-model:recipe-card-data="followingRecipeDataList[index]"
            :is-login="true"
          />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
  <div
    v-else
    :class="'carousel-wrapper-' + mq.current"
  >
    <h3 style="margin: 10px 0 10px 0;">新着レシピ</h3>
    <Carousel
      :settings="carouselSetting"
      :breakpoints="breakpointSettings"
    >
      <Slide
        v-for="(recipeCardData, index) in recipeDataList"
        :key="index"
      >
        <div>
          <span style="font-size: 18px; font-weight: bold;">
            {{ index + 1 }}
          </span>
          <RecipeCard
            :mq-current="mq.current"
            v-model:recipe-card-data="recipeDataList[index]"
            :is-login="true"
          />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<style scoped>
.top-image-wrapper-lg {
  margin: 10px auto 0;
  width: 960px;
  height: 500px;
}
.top-image-lg {
  width: 960px;
  height: 500px;
}
.top-image-wrapper-md {
  margin: 10px auto 0;
  width: 750px;
  height: 390px;
}
.top-image-md {
  width: 750px;
  height: 390px;
}
.top-image-wrapper-sm {
  margin: 10px auto 0;
  width: 375px;
  height: 195px;
}
.top-image-sm {
  width: 375px;
  height: 195px;
}
.search-pane-lg {
  width: 960px;
  margin: 10px auto 0;
}
.search-pane-md {
  width: 750px;
  margin: 10px auto 0;
}
.search-pane-sm {
  width: 375px;
  margin: 10px auto 0;
}
.ingredient-title {
  font-weight: bold;
}
.ingredient-row-mdlg {
  margin: 10px 0;
  width: 710px;
}
.ingredient-row-sm {
  margin: 10px 0;
  width: 345px;
}
.category-row-mdlg {
  width: 710px;
}
.category-row-sm {
  width: 345px;
}
.category-item {
  margin-bottom: 10px;
}
.search-item {
  font-size: 14px;
}
.search-item:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
.angle-right {
  font-size: 16px;
  color: silver;
}
/* カルーセル */

.carousel-wrapper-lg {
  width: 940px;
  margin: 0 auto;
}
.carousel-wrapper-md {
  width: 730px;
  margin: 0 auto;
}
.carousel-wrapper-sm {
  width: 350px;
  margin: 0 auto;
}
/* カテゴリータブの影を消す */
.el-tabs--border-card {
  box-shadow: none;
}
</style>
