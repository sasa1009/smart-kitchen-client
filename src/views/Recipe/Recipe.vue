<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { RecipesApi, Configuration, GetRecipeResponseRecipe, FavoritesApi } from '@/api';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import { isLogin, authData } from '@/modules/auth';

const mq = useMq();
const route = useRoute();
const router = useRouter();

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
  image_key: null,
  is_favorited: false,
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
          image_key: null,
      }
  ]
});

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

async function updateFavorite() {
  try {
    if (recipeData.is_favorited) {
      const response = await new FavoritesApi(configuration).deleteFavorite(authData.value.uid, authData.value.accessToken, authData.value.client, recipeData.id);
      if (response.status === 204) {
        ElMessage({
          showClose: true,
          message: 'お気に入りを解除しました。',
        });
        recipeData.is_favorited = !recipeData.is_favorited;
      }
    } else {
      if (isLogin.value) {
        const response = await new FavoritesApi(configuration).createFavorite(authData.value.uid, authData.value.accessToken, authData.value.client, recipeData.id);
        if (response.status === 201) {
          ElMessage({
            showClose: true,
            message: 'お気に入りに登録しました。',
            type: 'success'
          });
          recipeData.is_favorited = !recipeData.is_favorited;
        }
      } else {
        ElMessage({
          showClose: true,
          message: 'レシピをお気に入りに登録するにはログインしてください。',
        });
        router.push({name: 'Login'});
      }
    }
  } catch (error) {
    console.error(error);
    const message = recipeData.is_favorited ? 'お気に入りの解除に失敗しました。' : 'お気に入りの登録に失敗しました。';
    ElMessage({
      showClose: true,
      message: message,
      type: 'success'
    });
  }
}

async function deleteRecipe() {
  try {
    if (isLogin.value) {
      await new RecipesApi(configuration).deleteRecipe(authData.value.uid, authData.value.accessToken, authData.value.client, Number(route.params.id));
      ElMessage({
        showClose: true,
        message: 'レシピを削除しました。',
        type: 'success',
      });
      router.push({name: 'CurrentUser' });
    }
  } catch (error) {
    ElMessage({
      showClose: true,
      message: 'レシピの削除に失敗しました。',
      type: 'error',
    });
  }
}

/**
 * 単一のレシピ情報を取得
 */
async function getRecipeData() {
  try {
    let response;
    if (isLogin.value) {
      response = await new RecipesApi(configuration).getRecipe(authData.value.uid, authData.value.accessToken, authData.value.client, Number(route.params.id));
    } else {
      response = await new RecipesApi(configuration).getRecipe('', '', '', Number(route.params.id));
    }
    if (response.status !== 200) {
      ElMessage({
        showClose: true,
        message: 'レシピ情報の取得に失敗しました。',
        type: 'error',
      });
      throw new Error('レシピ情報の取得に失敗しました。')
    }
    Object.assign(recipeData, response.data.recipe)
  } catch (error) {
    console.error(error);
  }
}

/**
 * パスパラメータのIDが変わった時にレシピ情報を再度読み込む
 */
watch(() => route.path, async () => {
  if (route.name === 'Recipe') {
    await getRecipeData();
  }
});

// コンポーネント作成時にレシピ情報を読み込む
getRecipeData();
</script>

<template>
  <div :class="'recipe-data-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
    <div :class="'clearfix upper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
      <div :class="'upper-left-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <h3 class="title">{{ recipeData.title }}</h3>
        <el-image
          :class="'main-image-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
          :src="recipeData.image_url ? recipeData.image_url : require('@/assets/noimage.png')"
          fit="contain"
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
            <span
              class="user-name-link"
              @click="$router.push({ path: `/user/${recipeData.user.id}` })"
            >
              {{ recipeData.user.name }}
            </span>
          </div>
        </div>
        <div class="buttons">
          <div class="button-wrapper">
            <el-button
              v-if="recipeData.is_favorited"
              round
              size="small"
              class="favorite-button"
              @click="updateFavorite"
            >
              <font-awesome-icon
                :icon="['fas', 'star']"
                class="button-icon favorited"
              />
              お気に入りを解除
            </el-button>
            <el-button
              v-else
              round
              size="small"
              class="favorite-button"
              @click="updateFavorite"
            >
              <font-awesome-icon
                :icon="['far', 'star']"
                class="button-icon"
              />
              お気に入りに登録
            </el-button>
            <el-button
              round
              size="small"
              class="food-log-button"
              @click="$router.push({
                name: 'FoodLog',
                params: {
                  name: recipeData.title,
                  calorie: recipeData.calorie,
                  recipe_id: recipeData.id,
                }
              })"
            >
              <font-awesome-icon
                :icon="['fas', 'pencil-alt']"
                class="button-icon"
              />
              食事記録
            </el-button>
          </div>
          <div
            v-if="recipeData.user.id === authData.userId"
            class="button-wrapper"
          >
            <el-button
              round
              size="small"
              type="warning"
              plain
              class="food-log-button"
              @click="$router.push({ name: 'EditRecipe', params: { id: recipeData.id } })"
            >
              レシピを編集する
            </el-button>
            <el-popconfirm
              title="削除してもよろしいですか？"
              @confirm="deleteRecipe"
            >
              <template #reference>
                <el-button
                  round
                  size="small"
                  type="danger"
                  plain
                  class="food-log-button"
                >
                  レシピを削除する
                </el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </div>
      <div :class="'upper-right-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <h3 class="title">コメント</h3>
        <div
          v-html="recipeData.comment.replace(/\n/g, '<br>')"
        />
        <h3 class="title ingredient-title">材料（{{ recipeData.amount }}人分）</h3>
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
          <span
            class="category-link"
            @click="$router.push({ name: 'Recipes', params: { main_ingredient: recipeData.main_ingredient } })"
          >
            {{ recipeData.main_ingredient }}
          </span>
        </div>
        <div>
          <span
            class="category-link"
            @click="$router.push({ name: 'Recipes', params: { category: recipeData.category } })"
          >
            {{ recipeData.category }}
          </span>
        </div>
      </div>
    </div>
    <div :class="'middle-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
      <h3 class="title">作り方</h3>
      <el-row>
        <el-col
          v-for="(procedure, index) in recipeData.procedures"
          :key="index"
          :span="mq.current === 'sm' ? 12 : 6"
          class="procedure-wrapper-mdlg"
        >
          <div class="procedure-index">{{ index + 1 }}</div>
          <el-image
            v-if="procedure.image_url"
            class="procedure-image-mdlg"
            :src="procedure.image_url"
            fit="contain"
          />
          <div
            v-html="procedure.description.replace(/\n/g, '<br>')"
            class="procedure"
          />
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
/* レシピデータラッパー小 */
.recipe-data-wrapper-sm {
  width: 375px;
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
/* レシピ画面上部小 */
.upper-sm {
  width: 375px;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;
}
/* クリアフィックス */
.clearfix::after {
   content: "";
   display: block;
   clear: both;
}
/* レシピ画面上部左側大 */
.upper-left-mdlg {
  width: 355px;
  height: 600px;
  padding: 5px;
  box-sizing: border-box;
  float: left;
}
/* レシピ画面上部左側小 */
.upper-left-sm {
  width: 355px;
  height: 600px;
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
/* メイン画像小 */
.main-image-sm {
  width: 355px;
  height: 355px;
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
  color: #0000cd;
}
/* ユーザー情報 */
.user {
  width: 345px;
  height: 40px;
  margin-top: 5px;
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
.user-name-link:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
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
.button-wrapper {
  margin-top: 10px;
  height: 35px;
}
.button-wrapper:nth-child(2) {
  margin-top: 20px;
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
/* レシピ画面上部右側大 */
.upper-right-mdlg {
  width: 355px;
  min-height: 600px;
  padding: 5px 0 5px 15px;
  box-sizing: border-box;
  float: left;
}
/* レシピ画面上部右側小 */
.upper-right-sm {
  width: 355px;
  min-height: 600px;
  padding: 0;
  margin-top: 20px;
  float: left;
}
/* 材料 */
.ingredient-title {
  margin-top: 20px;
}
.ingredient-row {
  border-bottom: solid 0.5px #c0c0c0;
  margin-bottom: 5px;
}
.ingredient-amount {
  text-align: right;
}
/* メイン食材 */
.main-ingredient {
  margin-top: 20px;
}
.category-link {
  font-size: 14px;
}
.category-link:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
/* レシピ画面中央部大 */
.middle-mdlg {
  width: 750px;
  margin-top: 30px;
  padding: 0 20px 0 25px;
  box-sizing: border-box;
}
/* レシピ画面中央部小 */
.middle-sm {
  width: 375px;
  margin-top: 30px;
  padding: 0 10px;
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
