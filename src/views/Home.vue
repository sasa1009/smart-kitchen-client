<script setup lang="ts">
import RecipeCard from '@/components/RecipeCard.vue';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
// eslint-disable-next-line
// @ts-ignore
import { Carousel, Navigation, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { ingredients, categories, recipeCardDataList } from '@/modules/data';

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
            <el-link
              :underline="false"
              href=""
              class="search-item"
            >
              <font-awesome-icon
                :icon="['fas', 'angle-right']"
                class="angle-right"
              />
              {{ item }}
            </el-link>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="カテゴリーから探す"
    >
      <el-row :class="'category-row-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <el-col
          v-for="(categorie, index) in categories"
          :key="index"
          :span="mq.current === 'sm' ? 6 : 4"
          class="category-item"
        >
          <el-link
            :underline="false"
            href=""
            class="search-item"
          >
            <font-awesome-icon
              :icon="['fas', 'angle-right']"
              class="angle-right"
            />
            {{ categorie }}
          </el-link>
        </el-col>
      </el-row>
    </el-tab-pane>
  </el-tabs>
  <div :class="'carousel-wrapper-' + mq.current">
    <h3 style="margin: 10px 0 10px 0;">今週の人気レシピランキング</h3>
    <Carousel
      :settings="carouselSetting"
      :breakpoints="breakpointSettings"
    >
      <Slide
        v-for="(recipeCardData, index) in recipeCardDataList"
        :key="index"
      >
        <div>
          <span style="font-size: 18px; font-weight: bold;">
            {{ index + 1 }}
          </span>
          <RecipeCard
            :mq-current="mq.current"
            v-model:recipe-card-data="recipeCardDataList[index]"
            :is-login="true"
          />
        </div>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
  <div :class="'carousel-wrapper-' + mq.current">
    <h3 style="margin: 10px 0 10px 0;">フォロー中のユーザーの新着レシピ</h3>
    <Carousel
      :settings="carouselSetting"
      :breakpoints="breakpointSettings"
    >
      <Slide
        v-for="(recipeCardData, index) in recipeCardDataList"
        :key="index"
      >
        <div>
          <RecipeCard
            :mq-current="mq.current"
            v-model:recipe-card-data="recipeCardDataList[index]"
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
</style>
