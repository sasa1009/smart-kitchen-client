<script setup lang="ts">
import { defineProps, defineEmits, PropType } from 'vue';
import { RecipeCardData } from '@/modules/types';

const props = defineProps({
  mqCurrent: {
    type: String,
    default: 'lg'
  },
  recipeCardData: {
    type: Object as PropType<RecipeCardData>,
    default: () => ({})
  },
  isLogin: {
    type: Boolean,
    default: false
  }
});
const emits = defineEmits(['update:recipeCardData']);
function updateLike() {
  const recipeCardData = props.recipeCardData;
  if (recipeCardData.liked) {
    recipeCardData.liked = !recipeCardData.liked;
    recipeCardData.likedNumber--;
    emits('update:recipeCardData', recipeCardData);
  } else {
    recipeCardData.liked = !recipeCardData.liked;
    recipeCardData.likedNumber++;
    emits('update:recipeCardData', recipeCardData);
  }
}
</script>

<template>
  <div :class="'recipe-card-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
    <div :class="'recipe-image-wrapper-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">
      <el-image
        :class="'recipe-image-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
        :src="require('@/assets/butaumadon.jpeg')"
        fit="cover"
      />
      <span :class="'calorie-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')">{{ props.recipeCardData.calorie }}kcal</span>
    </div>
    <el-link
      :underline="false"
      href=""
      :class="'recipe-name-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
    >
      {{ props.recipeCardData.name }}
    </el-link>
    <el-row
      :class="'user-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
    >
      <el-col :span="4">
        <font-awesome-icon
          :icon="['far', 'user-circle']"
          :class="'icon-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
        />
      </el-col>
      <el-col :span="20">
        <el-link
          :underline="false"
          href=""
          :class="'user-name-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
        >
          {{ props.recipeCardData.userName }}
        </el-link>
      </el-col>
    </el-row>
    <el-row
      :class="'recipe-info-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
    >
      <el-col :span="5">
        <div>
          <el-button
            type="text"
            v-if="props.recipeCardData.liked"
            @click="updateLike"
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
            @click="updateLike"
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
          {{ props.recipeCardData.likedNumber }}
        </div>
      </el-col>
      <el-col :span="5">
        <el-button
          type="text"
          style="padding: 0;"
          href=""
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
        <el-link
          href=""
          :class="'category-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
        >
          {{ props.recipeCardData.mainIngredient }}
        </el-link><br>
        <el-link
          href=""
          :class="'category-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
        >
          {{ props.recipeCardData.category }}
        </el-link>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
/* カード大 */
.recipe-card-mdlg {
  width: 200px;
  height: 250px;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
  text-align: left;
}
/* カード小 */
.recipe-card-sm {
  width: 160px;
  height: 220px;
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
/* アイコン大 */
.icon-mdlg {
  font-size: 25px;
}
/* アイコン小 */
.icon-sm {
  font-size: 22px;
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
