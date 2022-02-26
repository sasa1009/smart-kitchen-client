<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import { FoodLogsApi, FoodLogTemplatesApi, Configuration, GetFoodLogTemplatesResponseFoodLogTemplates, CreateFoodLogsRequest } from '@/api';
import { isLogin, authData } from '@/modules/auth';

interface FoodData {
  name: string;
  calorie: number;
  amount: number;
  recipe_id: number | null;
  is_create_template: boolean,
  is_show_error_message: boolean
}
interface FormData {
  meal_date_time: Date;
  food_data_list: Array<FoodData>;
}

const route = useRoute();
const router = useRouter();
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
  meal_date_time: [
    {
      required: true,
      message: '日時を入力してください。',
      trigger: 'blur',
    }
  ]
};

// 食事記録情報
const formData = reactive<FormData>({
  meal_date_time: new Date(),
  food_data_list: [
    {
      name: '',
      calorie: 0,
      amount: 1,
      recipe_id: null,
      is_create_template: false,
      is_show_error_message: false
    },
  ]
});

// 食事記録のテンプレート情報
const templates = reactive<Array<GetFoodLogTemplatesResponseFoodLogTemplates>>([]);

/**
 * 食事記録フォームに品目を追加する
 */
function addFoodData(food_data: GetFoodLogTemplatesResponseFoodLogTemplates | undefined) {
  if (food_data) {
    const food_data_json = JSON.stringify(food_data);
    const food_data_copy = JSON.parse(food_data_json);
    formData.food_data_list.push({
      name: food_data_copy.name,
      calorie: food_data_copy.calorie,
      amount: 1,
      recipe_id: food_data_copy.recipe_id,
      is_create_template: false,
      is_show_error_message: false
    });
  } else {
    formData.food_data_list.push({
      name: '',
      calorie: 0,
      amount: 1,
      recipe_id: null,
      is_create_template: false,
      is_show_error_message: false
    });
  }
}

/**
 * 食事記録フォームから品目を削除する
 */
function removeFoodData(index: number) {
  formData.food_data_list.splice(index, 1);
}

// 食事記録テンプレートダイアログの表示切り替え
const dialogVisible = ref(false);

// 食事記録テンプレートのページングに使用するパラメーター
const pageData = reactive({
  limit: 5,
  offset: 0,
  total: 0
});

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

/**
 * 食事記録のテンプレート情報を取得する
 */
async function getFoodLogTemplates() {
  try {
    const response = await new FoodLogTemplatesApi(configuration).getFoodLogTemplates(authData.value.uid, authData.value.accessToken, authData.value.client, pageData.limit, pageData.offset);
    if (response.status !== 200) throw new Error('テンプレート情報の取得に失敗しました。');
    templates.push(...response.data.food_log_templates);
    pageData.total = response.data.meta.total;
    pageData.offset += response.data.food_log_templates.length;
  } catch (error) {
    console.error(error);
  }
}

/**
 * 食事記録のテンプレート情報を削除する
 */
async function deleteFoodLogTemplate(index: number) {
  if (!isLogin.value) return;
  try {
    // 食事記録のテンプレート情報を削除するリクエストを送信
    const response = await new FoodLogTemplatesApi(configuration).deleteFoodLogTemplate(authData.value.uid, authData.value.accessToken, authData.value.client, String(templates[index].id));
    if (response.status !== 204) throw new Error('テンプレートの削除に失敗しました。');

    // templates内の該当のテンプレートを削除
    templates.splice(index, 1);
    ElMessage({
      showClose: true,
      message: 'テンプレートを削除しました。',
      type: 'success',
    });
  } catch (error) {
    console.error(error);
    ElMessage({
      showClose: true,
      message: error.message,
      type: 'error',
    });
  }
}

/**
 * 食事記録情報を登録する
 */
function postFoodLogs(formRef: InstanceType<typeof ElForm> | undefined) {
  if (!isLogin.value) return;
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      try {
        // 食事記録の品名が入力されているか確認する
        let isError = false;
        for (const food_data of formData.food_data_list) {
          if (food_data.name === '') {
            food_data.is_show_error_message = true
            isError = true;
          } else {
            food_data.is_show_error_message = false
          }
        }
        if (isError) throw new Error('未入力の項目があります。');

        // リクエストデータの作成
        const foodLogs: CreateFoodLogsRequest = {
          food_logs: formData.food_data_list.map(food_data => {
            return ({
              name: food_data.name,
              calorie: food_data.calorie,
              amount: food_data.amount,
              meal_date_time: formData.meal_date_time.toISOString(),
              recipe_id: food_data.recipe_id,
              is_create_template: food_data.is_create_template,
            });
          })
        };

        // 登録
        const response = await new FoodLogsApi(configuration).createFoodLogs(authData.value.uid, authData.value.accessToken, authData.value.client, foodLogs);
        if (response.status !== 201) throw new Error('食事記録の登録に失敗しました。');
        ElMessage({
          showClose: true,
          message: '食事記録を登録しました。',
          type: 'success',
        });
        router.push({ name: 'FoodDiary' });
      } catch (error) {
        console.error(error);
        ElMessage({
          showClose: true,
          message: error.message,
          type: 'error',
        });
      }
    } else {
      console.log('error submit!');
      ElMessage({
        showClose: true,
        message: '未入力の項目があります。',
        type: 'error',
      });
    }
  });
}

// コンポーネント作成時に食事記録のテンプレート情報を取得
getFoodLogTemplates();

// レシピ情報のリンクから遷移した場合はレシピ情報をformDataに格納する
if (route.params.name) {
  formData.food_data_list.splice(0);
  formData.food_data_list.push({
    name: String(route.params.name),
    calorie: Number(route.params.calorie),
    amount: 1,
    recipe_id: Number(route.params.recipe_id),
    is_create_template: false,
    is_show_error_message: false
  })
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
          prop="meal_date_time"
        >
          <el-date-picker
            v-model="formData.meal_date_time"
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
              />
              <span
                v-if="foodData.is_show_error_message"
                :class="'name-error-message-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
              >
                品名を入力してください。
              </span>
            </el-form-item>
            <el-row>
              <el-col :span="currentSpan">
                <el-form-item
                  label="カロリー(kcal)"
                  prop="calorie"
                >
                  <el-input-number
                    v-model="foodData.calorie"
                    :min="0"
                    :max="100000"
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
                    :min="0.1"
                    :max="100"
                    :precision="1"
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
            <el-checkbox v-model="foodData.is_create_template" label="テンプレートに登録する" size="large"></el-checkbox>
          </div>
        </div>
      </el-form>
      <div :class="'add-buttons add-buttons-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <div :class="'add-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
          <el-button
            @click="addFoodData(undefined)"
          >
            品目を追加
          </el-button>
        </div>
        <div :class="'template-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
          <el-button
            @click="dialogVisible = true"
          >
            テンプレートから選択
          </el-button>
        </div>
      </div>
      <div class="registration-button">
        <el-button
          type="primary"
          @click="postFoodLogs(formRef)"
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
          :class="'dialog-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
        >
          選択
        </el-button>
      </el-col>
      <el-col
        :span="10"
      >
        <el-popconfirm
          title="削除してもよろしいですか？"
          @confirm="deleteFoodLogTemplate(index)"
        >
          <template #reference>
            <el-button
              size="small"
              :class="'dialog-button-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
              type="danger"
            >
              削除
            </el-button>
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button
          v-if="pageData.total > pageData.offset"
          @click="getFoodLogTemplates"
        >
          テンプレートを読み込む
        </el-button>
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
  border: 1px solid #dcdfe6;
  margin: 10px auto 0 auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
/* フォームラッパー小 */
.form-wrapper-sm {
  width: 375px;
  background-color: white;
  border: 1px solid #dcdfe6;
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
  margin: 10px 0;
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
.add-button-mdlg {
  width: 50%;
  float: left;
}
.template-button-mdlg {
  width: 50%;
  float: left;
  text-align: right;
}
.add-button-sm {
  float: left;
  margin-right: 20px;
}
.template-button-sm {
  float: left;
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
.dialog-button-mdlg {
  width: 150px;
  text-align: center;
}
.dialog-button-sm {
  width: 120px;
  text-align: center;
}
</style>
