<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import type { ElForm } from 'element-plus';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';

interface FoodData {
  name: string;
  calorie: number;
  amount: number;
  recipe_id: number | null;
  recipe_name: number | null;
}
interface FormData {
  dateTime: Date;
  foodDataList: Array<FoodData>;
}

const mq = useMq();
const formRef = ref<InstanceType<typeof ElForm>>();

/**
 * 現在のページの幅に応じて数値を返す
 */
const currentSpan = computed(() => {
  switch (mq.current) {
    case 'lg':
      return 12;
    case 'md':
      return 12;
    case 'sm':
      return 24;
    default: 
      return 12;
  }
});

// フォームのバリデーションルール
const rules = {
  // title: [
  //   {
  //     required: true,
  //     message: 'タイトルを入力してください。',
  //     trigger: 'blur',
  //   }
  // ],
  // main_ingredient: [
  //   {
  //     required: true,
  //     message: 'メイン食材を選択してください。',
  //     trigger: 'change',
  //   },
  // ],
  // category: [
  //   {
  //     required: true,
  //     message: 'カテゴリーを入力してください。',
  //     trigger: 'change',
  //   },
  // ],
};
const formData = reactive<FormData>({
  dateTime: new Date(),
  foodDataList: [
    {
      name: '',
      calorie: 0,
      amount: 0,
      recipe_id: null,
      recipe_name: null
    },
  ]
});

function addFoodData() {
  formData.foodDataList.push({
    name: '',
    calorie: 0,
    amount: 0,
    recipe_id: null,
    recipe_name: null
  });
}

function removeFoodData(index: number) {
  formData.foodDataList.splice(index, 1);
}
</script>

<template>
  <div :class="'form-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
    <div :class="'form-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
      <h1>食事記録</h1>
      <el-form
        ref="formRef"
        label-position="top"
        label-width="100px"
        :model="formData"
        :rules="rules"
        :hide-required-asterisk="true"
      >
        <el-form-item
          label="日時"
          prop="dateTime"
        >
          <el-date-picker
            v-model="formData.dateTime"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            placeholder="日時を選択してください。"
          />
        </el-form-item>
        <div
          v-for="(foodData, index) in formData.foodDataList"
          :key="index"
          class="form-row"
        >
          <div
            :class="'form-col-left-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
          >
            <el-form-item
              label="品名"
              prop="name"
            >
              <el-input
                v-model="foodData.name"
                :maxlength="30"
                :show-word-limit="true"
                :disabled="!!foodData.recipe_id"
              />
            </el-form-item>
            <el-row>
              <el-col :span="currentSpan">
                <el-form-item
                  label="カロリー"
                  prop="calorie"
                >
                  <el-input-number
                    v-model="foodData.calorie"
                    :min="0"
                    :max="100000"
                    :disabled="!!foodData.recipe_id"
                    class="input-number"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="currentSpan">
                <el-form-item
                  label="数量"
                  prop="amount"
                >
                  <el-input-number
                    v-model="foodData.amount"
                    :min="1"
                    :max="100"
                    class="input-number"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div
            :class="'form-col-right-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
          >
            <font-awesome-icon
              v-if="formData.foodDataList.length >= 2"
              :icon="['far', 'times-circle']"
              :class="'delete-button delete-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
              @click="removeFoodData(index)"
            />
          </div>
        </div>
      </el-form>
      <div :class="'add-buttons add-buttons-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <div class="add-button">
          <el-button
            @click="addFoodData"
          >
            品目を追加する
          </el-button>
        </div>
        <div class="template-button">
          <el-button
          >
            テンプレートを開く
          </el-button>
        </div>
      </div>
      <div class="registration-button">
        <el-button
          type="primary"
        >
          食事記録を登録
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* フォームラッパー大 */
.form-wrapper-mdlg {
  width: 750px;
  background-color: white;
  margin: 10px auto 0 auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
/* フォームラッパー小 */
.form-wrapper-sm {
  width: 375px;
  background-color: white;
  margin: 10px auto 0 auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
/* フォーム大 */
.form-mdlg {
  width: 500px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
}
/* フォーム小 */
.form-sm {
  width: 375px;
  padding: 10px;
  box-sizing: border-box;
}
/* el-formのスタイル調整 */
.el-form-item {
  margin-bottom: 15px;
}
.el-form-item ::v-deep(.el-form-item__label) {
  line-height: 25px;
  padding-bottom: 5px;
}
/* ページタイトル */
h1 {
  font-size: 18px;
}
/* フォームの行 */
.form-row {
  margin-bottom: 10px;
}
.form-row::after {
  content: "";
  display: block;
  clear: both;
}
/* フォームの左側大 */
.form-col-left-mdlg {
  width: 430px;
  float: left;
}
/* フォームの左側小 */
.form-col-left-sm {
  width: 305px;
  float: left;
}
/* フォームの右側大 */
.form-col-right-mdlg {
  width: 50px;
  height: 172px;
  float: left;
}
/* フォームの右側小 */
.form-col-right-sm {
  width: 50px;
  height: 258px;
  float: left;
}
/* 品目の削除ボタン大 */
.delete-button-mdlg {
  font-size: 25px;
  color: #F56C6C;
  cursor: pointer;
  display: block;
  margin: 74px auto 0 auto;
}
/* 品目の削除ボタン小 */
.delete-button-sm {
  font-size: 25px;
  color: #F56C6C;
  cursor: pointer;
  display: block;
  margin: 117px auto 0 auto;
}
.delete-button:hover {
  opacity: 0.8;
}
/* ボタン類 */
.add-buttons-mdlg {
  width: 430px;
  margin-top: 10px;
}
.add-buttons-sm {
  width: 355px;
  margin-top: 10px;
}
.add-buttons::after {
  content: "";
  display: block;
  clear: both;
}
.add-button {
  width: 50%;
  float: left;
}
.template-button {
  width: 50%;
  float: left;
  text-align: right;
}
.registration-button {
  margin-top: 30px;
}
</style>
