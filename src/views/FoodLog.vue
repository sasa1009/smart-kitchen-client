<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';

interface FoodData {
  name: string;
  calorie: number;
  amount: number;
  recipe_id: number | null;
  add_template: boolean,
  show_error_message: boolean
}
interface FormData {
  date_time: Date;
  food_data_list: Array<FoodData>;
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
  date_time: [
    {
      required: true,
      message: '日時を入力してください。',
      trigger: 'blur',
    }
  ]
};
const formData = reactive<FormData>({
  date_time: new Date(),
  food_data_list: [
    {
      name: '',
      calorie: 0,
      amount: 0,
      recipe_id: null,
      add_template: false,
      show_error_message: false
    },
  ]
});

const templates = reactive<Array<FoodData>>([
  {
    name: 'ご飯が進む！豚肉の生姜焼き',
    calorie: 374,
    amount: 1,
    recipe_id: 1,
    add_template: false,
    show_error_message: false
  },
  {
    name: 'ブロッコリーとツナのサラダ',
    calorie: 430,
    amount: 1,
    recipe_id: null,
    add_template: false,
    show_error_message: false
  },
  {
    name: '海老とブロッコリーのマカロニグラタン',
    calorie: 374,
    amount: 1,
    recipe_id: null,
    add_template: false,
    show_error_message: false
  }
]);

function addFoodData(food_data: FoodData | undefined) {
  if (food_data) {
    const food_data_copy = JSON.stringify(food_data);
    formData.food_data_list.push(JSON.parse(food_data_copy));
  } else {
    formData.food_data_list.push({
      name: '',
      calorie: 0,
      amount: 0,
      recipe_id: null,
      add_template: false,
      show_error_message: false
    });
  }
}

function removeFoodData(index: number) {
  formData.food_data_list.splice(index, 1);
}

const dialogVisible = ref(false);

/**
 * 情報を登録する
 */
function postFoodLog(formRef: InstanceType<typeof ElForm> | undefined) {
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      let isError = false;
      for (const food_data of formData.food_data_list) {
        if (food_data.name === '') {
          food_data.show_error_message = true
          isError = true;
        } else {
          food_data.show_error_message = false
        }
      }
      if (isError) {
        ElMessage({
          showClose: true,
          message: '未入力の項目があります。',
          type: 'error',
        });
        return;
      }
    } else {
      console.log('error submit!');
      ElMessage({
        showClose: true,
        message: '未入力の項目があります。',
        type: 'error',
      })
    }
  });
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
          prop="date_time"
        >
          <el-date-picker
            v-model="formData.date_time"
            type="datetime"
            format="YYYY-MM-DD HH:mm"
            placeholder="日時を選択してください。"
          />
        </el-form-item>
        <div
          v-for="(foodData, index) in formData.food_data_list"
          :key="index"
          class="form-row"
        >
          <div
            :class="'form-col-left-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
          >
            <el-form-item
              label="品名"
              prop="name"
              class="name"
            >
              <el-input
                v-model="foodData.name"
                :maxlength="30"
                :show-word-limit="true"
                :disabled="!!foodData.recipe_id"
              />
              <span
                v-if="foodData.show_error_message"
                :class="'name-error-message-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
              >
                品名を入力してください。
              </span>
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
              v-if="formData.food_data_list.length >= 2"
              :icon="['far', 'times-circle']"
              :class="'delete-button delete-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
              @click="removeFoodData(index)"
            />
          </div>
          <div>
            <el-checkbox v-model="foodData.add_template" label="テンプレートに登録する" size="large"></el-checkbox>
          </div>
        </div>
      </el-form>
      <div :class="'add-buttons add-buttons-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <div class="add-button">
          <el-button
            @click="addFoodData(undefined)"
          >
            品目を追加する
          </el-button>
        </div>
        <div class="template-button">
          <el-button
            @click="dialogVisible = true"
          >
            テンプレートを開く
          </el-button>
        </div>
      </div>
      <div class="registration-button">
        <el-button
          type="primary"
          @click="postFoodLog(formRef)"
        >
          食事記録を登録
        </el-button>
      </div>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="テンプレート"
    :width="(mq.current === 'sm' ? '350px' : '500px')"
  >
    <el-row class="dialog-row">
      <el-col
        :span="18"
      >
        品名
      </el-col>
      <el-col
        :span="6"
      >
        <span v-if="mq.current !== 'sm'">カロリー(kcal)</span>
        <span v-else>カロリー<br>(kcal)</span>
      </el-col>
    </el-row>
    <el-row
      v-for="(template, index) in templates"
      :key="index"
      class="dialog-row"
    >
      <el-col
        :span="18"
        class="inner-row"
      >
        {{ template.name }}
      </el-col>
      <el-col
        :span="6"
        class="inner-row"
      >
        {{ template.calorie }}
      </el-col>
      <el-col
        :span="10"
      >
        <el-button
          @click="addFoodData(template)"
          size="small"
          :class="'template-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
        >
          追加する
        </el-button>
      </el-col>
      <el-col
        :span="10"
      >
        <el-button
          size="small"
          :class="'template-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
          type="danger"
        >
          削除する
        </el-button>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">閉じる</el-button>
      </span>
    </template>
  </el-dialog>
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
/* 品名 */
.name {
  position: relative;
}
/* 品名のエラーメッセージ大 */
.name-error-message-mdlg {
  font-size: 12px;
  color: #F56C6C;
  position: absolute;
  bottom: -30px;
  right: 287px;
}
/* 品名のエラーメッセージ小 */
.name-error-message-sm {
  font-size: 12px;
  color: #F56C6C;
  position: absolute;
  bottom: -30px;
  right: 162px;
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
/* テンプレートのダイアログ */
.dialog-row {
  font-size: 16px;
  margin-bottom: 10px;
}
.inner-row {
  margin-bottom: 5px;
}
.template-button-mdlg {
  width: 150px;
  text-align: center;
}
.template-button-sm {
  width: 120px;
  text-align: center;
}
</style>
