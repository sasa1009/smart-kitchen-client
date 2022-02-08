<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { RecipesApi, Configuration, GetRecipeResponseRecipe } from '@/api';

const route = useRoute();

// レシピ情報
const recipeData = reactive<GetRecipeResponseRecipe>({
  id: 1,
  title: '',
  comment: '',
  amount: 0,
  calorie: 0,
  main_ingredient: '',
  category: '',
  tips: '',
  image_url: null,
  user: {
    id: 0,
    name: '',
    comment: '',
    image_url: null
  },
  ingredients: [
      {
          index: 0,
          name: '',
          amount: '',
      }
  ],
  procedures: [
      {
          index: 0,
          description: '',
          image_url: null,
      }
  ]
});

const toggle = ref(true);

/**
 * 単一のレシピ情報を取得
 */
(async function init() {
  const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });
  try {
    const response = await new RecipesApi(configuration).getRecipe(Number(route.params.id));
    if (response.status !== 200) throw new Error('ユーザー情報の取得に失敗しました。');
    Object.assign(recipeData, response.data.recipe)
  } catch (error) {
    console.error(error);
  }
})()
</script>

<template>
  <div class="recipe-data-wrapper-mdlg">
    <div class="upper-mdlg clearfix">
      <div class="upper-left-mdlg">
        <h3 class="title">{{ recipeData.title }}</h3>
        <el-image
          class="main-image-mdlg"
          :src="recipeData.image_url ? recipeData.image_url : require('@/assets/noimage.png')"
          fit="cover"
        />
        <div class="calorie">
          一人分のカロリー<span class="calorie-number">{{ recipeData.calorie }}</span>kcal
        </div>
        <div class="user">
          <div class="user-image-wrapper">
            <el-image
              v-if="recipeData.user.image_url"
              class="user-image"
              :src="recipeData.user.image_url"
              fit="cover"
            />
            <font-awesome-icon
              v-else
              :icon="['far', 'user-circle']"
              class="user-icon"
            />
          </div>
          <div class="user-name">
            <el-link
              :underline="false"
              class="user-name-link"
              href=""
            >
              {{ recipeData.user.name }}
            </el-link>
          </div>
        </div>
        <div class="buttons">
          <div class="button-wrapper">
            <el-button
              v-if="toggle"
              round
              size="small"
              class="follow-button"
            >
              フォローする
            </el-button>
            <el-button
              v-else
              round
              size="small"
              type="info"
              class="follow-button"
            >
              フォロー解除
            </el-button>
          </div>
          <div class="button-wrapper">
            <el-button
              v-if="toggle"
              round
              size="small"
              class="favorite-button"
            >
              <font-awesome-icon
                :icon="['far', 'star']"
                class="button-icon"
              />
              お気に入りに登録
            </el-button>
            <el-button
              v-else
              round
              size="small"
              class="favorite-button"
            >
              <font-awesome-icon
                :icon="['fas', 'star']"
                class="button-icon favorited"
              />
              お気に入りを解除
            </el-button>
            <el-button
              round
              size="small"
              class="food-log-button"
            >
              <font-awesome-icon
                :icon="['fas', 'pencil-alt']"
                class="button-icon"
              />
              食事記録
            </el-button>
          </div>
          <div class="button-wrapper">
            <el-button
              round
              size="small"
              type="warning"
              plain
              class="food-log-button"
            >
              レシピを編集する
            </el-button>
          </div>
        </div>
      </div>
      <div class="upper-right-mdlg">
        <h3 class="title">コメント</h3>
        <div
          v-html="recipeData.comment.replace(/\n/g, '<br>')"
          class="comment"
        />
        <h3 class="title">材料（{{ recipeData.amount }}人分）</h3>
        <el-row
          v-for="(ingredient, index) in recipeData.ingredients"
          :key="index"
          class="ingredient-row"
        >
          <el-col
            :span="16"
          >
            {{ ingredient.name }}
          </el-col>
          <el-col
            :span="8"
            class="ingredient-amount"
          >
            {{ ingredient.amount }}
          </el-col>
        </el-row>
        <div class="main-ingredient">
          <el-link
            :underline="false"
            class="category-link"
            href=""
          >
            {{ recipeData.main_ingredient }}
          </el-link>
        </div>
        <div>
          <el-link
            :underline="false"
            class="category-link"
            href=""
          >
            {{ recipeData.category }}
          </el-link>
        </div>
      </div>
    </div>
    <div class="middle-mdlg">
      <h3 class="title">作り方</h3>
      <el-row>
        <el-col
          v-for="(procedure, index) in recipeData.procedures"
          :key="index"
          :span="6"
          class="procedure-wrapper-mdlg"
        >
          <div class="procedure-index">{{ index + 1 }}</div>
          <el-image
            v-if="procedure.image_url"
            class="procedure-image-mdlg"
            :src="procedure.image_url"
            fit="cover"
          />
          <div
            class="procedure"
          >
            {{ procedure.description }}
          </div>
        </el-col>
      </el-row>
      <h3 class="title tips-title">コツ・ポイント</h3>
      <div
        v-html="recipeData.tips.replace(/\n/g, '<br>')"
        class="tips"
      />
    </div>
  </div>
</template>

<style scoped>
/* レシピデータラッパー大 */
.recipe-data-wrapper-mdlg {
  width: 750px;
  background-color: white;
  margin: 10px auto 0 auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
/* レシピ画面上部大 */
.upper-mdlg {
  width: 750px;
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
}
/* クリアフィックス */
.clearfix::after {
   content: "";
   display: block;
   clear: both;
}
/* レシピ画面上部左側 */
.upper-left-mdlg {
  width: 355px;
  height: 600px;
  padding: 5px;
  box-sizing: border-box;
  float: left;
}
.title {
  margin: 0;
  margin-bottom: 10px;
}
/* メイン画像大 */
.main-image-mdlg {
  width: 345px;
  height: 345px;
}
/* カロリー */
.calorie {
  width: 300px;
  text-align: right;
  margin: 0 0 0 auto;
}
.calorie-number {
  margin: 0 5px 0 10px;
  font-size: 20px;
  font-weight: bold;
}
/* ユーザー情報 */
.user {
  width: 345px;
  height: 40px;
}
/* ユーザー画像 */
.user-image-wrapper {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  float: left;
}
.user-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.user-icon {
  font-size: 40px;
}
.user-name {
  width: 295px;
  height: 40px;
  padding-top: 7px;
  box-sizing: border-box;
  float: left;
}
.user-name-link {
  font-size: 16px;
}
/* ボタン群 */
.buttons {
  width: 345px;
  height: 140px;
  margin-top: 3px;
}
.button-wrapper {
  height: 40px;
}
.button-wrapper:nth-child(n + 2) {
  margin-top: 8px;
}
.follow-button {
  height: 30px;
  width: 160px;
}
.favorite-button {
  height: 30px;
  width: 160px;
}
.favorited {
  color: gold;
}
.button-icon {
  font-size: 13px;
}
.food-log-button {
  height: 30px;
  width: 160px;
}
.edit-recipe {
  font-size: 14px;
}
/* レシピ画面上部右側 */
.upper-right-mdlg {
  width: 355px;
  min-height: 600px;
  padding: 5px 0 5px 15px;
  box-sizing: border-box;
  float: left;
}
/* コメント */
.comment {
  min-height: 100px;
}
/* 材料 */
.ingredient-row {
  border-bottom: solid 0.5px #c0c0c0;
  margin-bottom: 5px;
}
.ingredient-amount {
  text-align: right;
}
/* メイン食材 */
.main-ingredient {
  margin-top: 30px;
}
.category-link {
  text-decoration: underline;
}
/* レシピ画面中央部大 */
.middle-mdlg {
  width: 750px;
  margin-top: 30px;
  padding: 0 20px 0 25px;
  box-sizing: border-box;
}
/* 作り方 */
.procedure-wrapper-mdlg {
  margin-bottom: 10px;
}
.procedure-index {
  width: 160px;
  margin: 0 auto;
  font-size: 20px;
  font-weight: bold;
}
.procedure {
  width: 160px;
  margin: 0 auto;
}
.procedure-image-mdlg {
  width: 160px;
  height: 160px;
  margin: 0 auto;
  display: block;
}
/* コツ・ポイント */
.tips-title {
  margin-top: 20px;
}
.tips {
  margin-bottom: 20px;
}
</style>
