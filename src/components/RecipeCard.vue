<script setup lang="ts">
import { defineProps, PropType, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { GetRecipesResponseRecipes, Configuration, FavoritesApi } from '@/api';
import { useRouter } from 'vue-router';
import { isLogin, authData } from '@/modules/auth';

const router = useRouter();

const props = defineProps({
  mqCurrent: {
    type: String,
    default: 'lg'
  },
  recipeCardData: {
    type: Object as PropType<GetRecipesResponseRecipes>,
    default: () => ({})
  },
  isLogin: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['update:recipeCardData']);

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

async function updateFavorite() {
  const recipeCardData = props.recipeCardData;
  if (recipeCardData.is_favorited) {
    const response = await new FavoritesApi(configuration).deleteFavorite(authData.value.uid, authData.value.accessToken, authData.value.client, props.recipeCardData.id);
    if (response.status === 204) {
      ElMessage({
        showClose: true,
        message: 'お気に入りを解除しました。',
      });
      recipeCardData.is_favorited = !recipeCardData.is_favorited;
      recipeCardData.favorited_count--;
      emits('update:recipeCardData', recipeCardData);
    }
  } else {
    if (isLogin.value) {
      const response = await new FavoritesApi(configuration).createFavorite(authData.value.uid, authData.value.accessToken, authData.value.client, props.recipeCardData.id);
      if (response.status === 201) {
        ElMessage({
          showClose: true,
          message: 'お気に入りに登録しました。',
          type: 'success'
        });
        recipeCardData.is_favorited = !recipeCardData.is_favorited;
        recipeCardData.favorited_count++;
        emits('update:recipeCardData', recipeCardData);
      }
    } else {
      ElMessage({
        showClose: true,
        message: 'レシピをお気に入りに登録するにはログインしてください。',
      });
      router.push({name: 'Login'})
    }
  }
}
</script>

<template>
  <div :class="'recipe-card recipe-card-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
    <div
      :class="'recipe-image-wrapper-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
      @click="router.push({ path: `/recipe/${props.recipeCardData.id}` })"
    >
      <el-image
        :class="'recipe-image-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
        :src="props.recipeCardData.image_url ? props.recipeCardData.image_url : require('@/assets/noimage.png')"
        fit="cover"
      />
      <span :class="'calorie-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">{{ props.recipeCardData.calorie }}kcal</span>
    </div>
    <span
      :class="'recipe-name recipe-name-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
      @click="router.push({ path: `/recipe/${props.recipeCardData.id}` })"
    >
      {{ props.recipeCardData.title }}
    </span>
    <el-row
      :class="'user-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
    >
      <el-col :span="4">
        <div
          v-if="props.recipeCardData.user.image_url"
          :class="'user-image-wrapper-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
          @click="router.push({ path: `/user/${props.recipeCardData.user.id}` })"
        >
          <el-image
            :src="props.recipeCardData.user.image_url"
            :class="'user-image-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
            fit="cover"
          />
        </div>
        <font-awesome-icon
          v-else
          :icon="['far', 'user-circle']"
          :class="'icon-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
          @click="router.push({ path: `/user/${props.recipeCardData.user.id}` })"
        />
      </el-col>
      <el-col :span="20">
        <span
          :class="'user-name user-name-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
          @click="router.push({ path: `/user/${props.recipeCardData.user.id}` })"
        >
          {{ props.recipeCardData.user.name }}
        </span>
      </el-col>
    </el-row>
    <el-row
      :class="'recipe-info-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
    >
      <el-col :span="5">
        <div>
          <el-button
            type="text"
            v-if="props.recipeCardData.is_favorited"
            @click="updateFavorite"
            style="padding: 0;"
            href=""
          >
            <font-awesome-icon
              :icon="['fas', 'star']"
              :class="'liked icon-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
            />
          </el-button>
          <el-button
            type="text"
            v-else
            @click="updateFavorite"
            style="padding: 0;"
            href=""
          >
            <font-awesome-icon
              :icon="['far', 'star']"
              :class="'icon-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
            />
          </el-button>
        </div>
        <div :class="'liked-number-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
          {{ props.recipeCardData.favorited_count }}
        </div>
      </el-col>
      <el-col :span="5">
        <el-button
          type="text"
          style="padding: 0;"
          @click="$router.push({
            name: 'FoodLog',
            params: {
              name: props.recipeCardData.title,
              calorie: props.recipeCardData.calorie,
              recipe_id: props.recipeCardData.id,
            }
          })"
        >
          <font-awesome-icon
            :icon="['fas', 'pencil-alt']"
            :class="'icon-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
          />
        </el-button>
      </el-col>
      <el-col
        :span="14"
      >
        <span
          :class="'category category-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
          @click="router.push({ name: 'Recipes', params: { main_ingredient: props.recipeCardData.main_ingredient } })"
        >
          {{ props.recipeCardData.main_ingredient }}
        </span><br>
        <span
          href=""
          :class="'category category-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
          @click="router.push({ name: 'Recipes', params: { category: props.recipeCardData.category } })"
        >
          {{ props.recipeCardData.category }}
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* カード共通 */
.recipe-card {
  border: 1px solid #dcdfe6;
}
/* カード大 */
.recipe-card-mdlg {
  width: 200px;
  height: 255px;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  text-align: left;
}
/* カード小 */
.recipe-card-sm {
  width: 160px;
  height: 230px;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  text-align: left;
}
/* イメージ大 */
.recipe-image-wrapper-mdlg {
  position: relative;
  height: 115px;
}
.recipe-image-wrapper-mdlg:hover {
  opacity: 0.8;
  cursor: pointer;
}
.recipe-image-mdlg {
  width: 100%;
  height: 115px;
  border-radius: 10px;
}
/* イメージ小 */
.recipe-image-wrapper-sm {
  position: relative;
  height: 92px;
}
.recipe-image-wrapper-sm:hover {
  opacity: 0.8;
  cursor: pointer;
}
.recipe-image-sm {
  width: 100%;
  height: 92px;
  border-radius: 10px;
}
/* カロリー大 */
.calorie-mdlg {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 80px;
  height: 21px;
  background-color: #129A6B;
  text-align: center;
  border-radius: 5px;
  color: white;
  font-weight: bold;
}
/* カロリー小 */
.calorie-sm {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 70px;
  height: 18px;
  background-color: #129A6B;
  text-align: center;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}
/* レシピ名共通 */
.recipe-name:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
/* レシピ名大 */
.recipe-name-mdlg {
  font-weight: bold;
  font-size: 14px;
}
/* レシピ名小 */
.recipe-name-sm {
  font-weight: bold;
  font-size: 11px;
}
/* ユーザー名共通 */
.user-name:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
/* ユーザー情報大 */
.user-mdlg {
  width: 200px;
  padding-left: 5px;
}
.user-name-mdlg {
  font-size: 12px;
  margin-left: 2px;
}
/* ユーザー情報小 */
.user-sm {
  width: 160px;
  padding-left: 5px;
}
.user-name-sm {
  font-size: 11px;
  margin-left: 2px;
}
/* ユーザー画像大 */
.user-image-wrapper-mdlg {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  overflow: hidden;
}
.user-image-wrapper-mdlg:hover {
  opacity: 0.8;
  cursor: pointer;
}
.user-image-mdlg {
  width: 25px;
  height: 25px;
}
/* ユーザー画像小 */
.user-image-wrapper-sm {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  overflow: hidden;
}
.user-image-wrapper-sm:hover {
  opacity: 0.8;
  cursor: pointer;
}
.user-image-sm {
  width: 22px;
  height: 22px;
}
/* アイコン大 */
.icon-mdlg {
  font-size: 25px;
}
.icon-mdlg:hover {
  opacity: 0.8;
  cursor: pointer;
}
/* アイコン小 */
.icon-sm {
  font-size: 22px;
}
.icon-sm:hover {
  opacity: 0.8;
  cursor: pointer;
}
/* レシピ情報大 */
.recipe-info-mdlg {
  width: 200px;
  padding-left: 5px;
}
.liked {
  color: gold;
}
.liked-number-mdlg {
  padding-left: 11px;
}
.category:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
.category-mdlg {
  font-size: 12px;
}
/* レシピ情報小 */
.recipe-info-sm {
  width: 160px;
  padding-left: 3px;
}
.liked-number-sm {
  padding-left: 9px;
}
.category-sm {
  font-size: 11px;
}
</style>
