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
  <div class="recipe-card">
    <div class="recipe-image-wrapper">
      <el-image
        :class="'recipe-image-' + (props.mqCurrent === 'sm' ? 'sm' : 'mdlg')"
        :src="require('@/assets/butaumadon.jpeg')"
        fit="cover"
      />
      <span class="calorie">{{ props.recipeCardData.calorie }}kcal</span>
    </div>
    <el-link
      :underline="false"
      href=""
      class="recipe-name"
    >
      {{ props.recipeCardData.name }}
    </el-link>
    <el-row
      class="user"
    >
      <el-col :span="4">
        <font-awesome-icon
          :icon="['far', 'user-circle']"
          class="icon"
        />
      </el-col>
      <el-col :span="20">
        <el-link
          :underline="false"
          href=""
          class="user-name"
        >
          {{ props.recipeCardData.userName }}
        </el-link>
      </el-col>
    </el-row>
    <el-row
      class="recipe-info"
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
              class="icon liked"
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
              class="icon"
            />
          </el-button>
        </div>
        <div class="liked-number">
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
            class="icon"
          />
        </el-button>
      </el-col>
      <el-col
        :span="14"
      >
        <el-link
          href=""
          class="category"
        >
          {{ props.recipeCardData.mainIngredient }}
        </el-link><br>
        <el-link
          href=""
          class="category"
        >
          {{ props.recipeCardData.category }}
        </el-link>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.recipe-card {
  width: 200px;
  height: 250px;
  border-radius: 10px;
  overflow: hidden;
  background-color: white;
}
.recipe-image-wrapper {
  position: relative;
  height: 115px;
}
.recipe-image-mdlg {
  width: 100%;
  height: 115px;
  border-radius: 10px;
}
.calorie {
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
.recipe-name {
  font-weight: bold;
  font-size: 14px;
}
.user {
  width: 200px;
  padding-left: 5px;
}
.user-name {
  font-size: 12px;
}
.icon {
  font-size: 25px;
}
.recipe-info {
  width: 200px;
  padding-left: 5px;
}
.liked {
  color: gold;
}
.liked-number {
  padding-left: 10px;
}
.category {
  font-size: 12px;
}
</style>
