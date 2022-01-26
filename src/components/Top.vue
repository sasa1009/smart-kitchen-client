<script setup lang="ts">
import { reactive } from 'vue';
import RecipeCard from '@/components/RecipeCard.vue';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
const mq = useMq();

const ingredients = [
  {
    ingredientCategory: 'お肉のおかず',
    items: [
      '豚肉',
      '鶏肉',
      '牛肉',
      'ひき肉',
      '加工肉'
    ]
  },
  {
    ingredientCategory: '野菜のおかず',
    items: [
      '葉物野菜',
      '根菜',
      '果菜',
      'きのこ',
      '豆類',
      'その他'
    ]
  },
  {
    ingredientCategory: '魚介のおかず',
    items: [
      '鮭',
      'サバ',
      'イワシ',
      'ブリ',
      'マグロ',
      'えび',
      'アジ',
      'イカ',
      'タコ',
      'いくら',
      'たらこ',
      '明太子',
      '貝類',
      'ツナ缶',
      'サバ缶',
      'しらす',
      'はんぺん',
      'その他魚介',
    ]
  },
  {
    ingredientCategory: 'その他',
    items: [
      '海藻',
      'チーズ',
      '豆腐',
      'こんにゃく',
    ]
  },
];
const categories = [
  'お菓子',
  'スープ・汁物・シチュー',
  '卵料理',
  'ごはんもの',
  'サラダ',
  '肉料理',
  '麺類',
  '野菜料理',
  'パン',
  '鍋料理',
  '豆腐料理',
  '魚介料理',
  '飲み物',
  'パイ・キッシュ',
  'グラタン・ドリア・ラザニア',
  '餃子・焼売・春巻き',
  '漬物',
  'コロッケ',
  '粉物',
  '天ぷら・かき揚げ',
  '調味料',
  '餅',
  '中華まん',
];
const recipeCardDataList = reactive([
  {
    imageUrl: '',
    calorie: 350,
    name: '鶏胸肉と小松菜の味噌マヨ炒め',
    userName: 'ささくら1009',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
]);
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
  <RecipeCard
    :mq-current="mq.current"
    v-model:recipe-card-data="recipeCardDataList[0]"
    :is-login="true"
  />
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
</style>
