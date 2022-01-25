<script setup lang="ts">
import { computed } from 'vue';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
    class="search-pane"
  >
    <el-tab-pane
      label="食材から探す"
    >
      <div class="pane">
        <div
          v-for="(ingredient, i) in ingredients"
          :key="i"
        >
          <span class="ingredient-title">{{ ingredient.ingredientCategory }}</span>
          <el-row class="ingredient-row">
            <el-col
              v-for="(item, j) in ingredient.items"
              :key="j"
              :span="4"
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
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="カテゴリーから探す"
    >
      <el-row class="ingredient-row pane">
        <el-col
          v-for="(categorie, index) in categories"
          :key="index"
          :span="4"
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
  margin: 0 auto;
  width: 375px;
  height: 195px;
}
.top-image-sm {
  width: 375px;
  height: 195px;
}
.search-pane {
  width: 960px;
  margin: 10px auto 0;
}
.pane {
  width: 710px;
}
.ingredient-title {
  font-weight: bold;
}
.ingredient-row {
  margin: 10px 0;
}
.search-item {
  font-size: 14px;
}
.angle-right {
  font-size: 16px;
  color: silver;
}
</style>
