<script setup lang="ts">
import { reactive, computed } from 'vue';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import RecipeCard from '@/components/RecipeCard.vue';
import { recipeCardDataList } from '@/modules/data';

const mq = useMq();
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
</script>

<template>
  <el-row :class="'row row-' + mq.current">
    <el-col
      :span="currentSpan"
      v-for="(recipeCardData, index) in recipeCardDataList"
      :key="index"
      class="col"
    >
      <div :class="'recipe-card-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <RecipeCard
          :mq-current="mq.current"
          v-model:recipe-card-data="recipeCardDataList[index]"
          :is-login="true"
        />
      </div>
    </el-col>
  </el-row>
  <div class="pagination">
    <el-pagination
      layout="prev, pager, next"
      :total="1000"
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
