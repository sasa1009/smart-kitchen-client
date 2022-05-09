<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
import { FoodLogsApi, Configuration, ImportFoodLogsRequest } from '@/api';
import { isLogin, authData } from '@/modules/auth';
import dayjs from 'dayjs';
// eslint-disable-next-line
// @ts-ignore
import { Parser } from 'json2csv';
import { parse } from 'csv-parse';

const exportFoodLogFormRef = ref<InstanceType<typeof ElForm>>();

// 食事記録のCSVエクスポートフォームのバリデーションルール
const rules = {
  start_date_time: [
    {
      required: true,
      message: '日時を入力してください。',
      trigger: 'blur',
    }
  ],
  end_date_time: [
    {
      required: true,
      message: '日時を入力してください。',
      trigger: 'blur',
    }
  ],
};

// 食事記録のCSVエクスポートフォームのデータ
const exportFoodLogFormData = reactive({
  start_date_time: dayjs().startOf('month').toDate(),
  end_date_time: dayjs().endOf('month').toDate(),
});

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

/**
 * 食事記録データをエクスポートする
 */
function exportFoodLogData(formRef: InstanceType<typeof ElForm> | undefined) {
  if (!isLogin.value) return;
  if (!formRef) return;
  formRef.validate(async (valid) => {
    if (valid) {
      try {

        // 食事記録データを取得
        const response = await new FoodLogsApi(configuration).exportFoodLogs(authData.value.uid, authData.value.accessToken, authData.value.client, exportFoodLogFormData.start_date_time.toISOString(), exportFoodLogFormData.end_date_time.toISOString());
        if (response.status !== 200) throw new Error('食事記録の登録に失敗しました。');

        // JSONからCSVに変換
        const json2csvParser = new Parser({ withBOM: true });
        const csv = json2csvParser.parse(response.data.food_logs);

        // BLOBに変換
        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        // anchorを生成してclickイベントを呼び出す。
        var link = document.createElement("a");
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "food_log_data.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();

        // オブジェクト URL を解放
        URL.revokeObjectURL(link.href);

        // anchorを削除
        document.body.removeChild(link);
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

/**
 * 食事記録データをインポートする
 */
function handleFile(event: any) {
  const file = event.target.files[0] as unknown as File;
  if (!file) return;

  // ファイルの形式はJPEGまたはPNGのみ
  if (file.type !== 'text/csv') {
    ElMessage({
      showClose: true,
      message: 'CSV形式のファイルを指定してください。',
      type: 'error',
    });
    return;
  }

  const reader = new FileReader();

  // 取り込んだCSVファイルをオブジェクト形式に変換
  reader.onload = e => {
    if (!e.target) return;
    if (typeof e.target.result !== 'string') return;
    parse(e.target.result, { columns: true }, async function(err, records) {
      // リクエストに使用するデータを定義
      const foodLogObjectData: ImportFoodLogsRequest = {
        food_logs: []
      };
      foodLogObjectData.food_logs.push(...records.map(foodLog => {
        const {id, ...updatedFoodLog} = foodLog;
        return updatedFoodLog;
      }));
      try {
        // 食事記録データを登録
        const response = await new FoodLogsApi(configuration).importFoodLogs(authData.value.uid, authData.value.accessToken, authData.value.client, foodLogObjectData);
        if (response.status !== 201) throw new Error('食事記録の登録に失敗しました。');
        ElMessage({
          showClose: true,
          message: '食事記録を登録しました。',
          type: 'success',
        });
      } catch (error) {
        console.error(error);
        ElMessage({
          showClose: true,
          message: '食事記録の登録に失敗しました。',
          type: 'error',
        });
      }
    });
  };
  reader.readAsText(file);
}
</script>

<template>
  <div class="wrapper">
    <h1 class="title">食事記録のCSVエクスポート</h1>
    <el-form
      ref="exportFoodLogFormRef"
      label-position="top"
      :model="exportFoodLogFormData"
      :rules="rules"
      :hide-required-asterisk="true"
      class="form"
    >
      <el-form-item
        label="食事記録の取得開始日時"
        prop="start_date_time"
      >
        <el-date-picker
          v-model="exportFoodLogFormData.start_date_time"
          type="datetime"
          format="YYYY-MM-DD HH:mm"
          placeholder="日時を選択してください。"
        />
      </el-form-item>
      <el-form-item
        label="食事記録の取得終了日時"
        prop="end_date_time"
      >
        <el-date-picker
          v-model="exportFoodLogFormData.end_date_time"
          type="datetime"
          format="YYYY-MM-DD HH:mm"
          placeholder="日時を選択してください。"
        />
      </el-form-item>
      <el-form-item
      >
        <el-button
          type="primary"
          @click="exportFoodLogData(exportFoodLogFormRef)"
        >
          食事記録をエクスポート
        </el-button>
      </el-form-item>
    </el-form>
    <h1 class="title">食事記録のCSVインポート</h1>
    <label class="upload">
      CSVファイルをインポート
      <input
        type="file"
        @change="handleFile"
      />
    </label>
  </div>
</template>

<style scoped>
/* ラッパー */
.wrapper {
  width: 750px;
  min-height: 500px;
  background-color: white;
  border: 1px solid #dcdfe6;
  margin: 10px auto 0 auto;
  padding: 10px;
  box-sizing: border-box;
}
/* タイトル */
.title {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}
/* フォーム */
.form {
  margin-bottom: 30px;
}
/* アップロードボタン */
.upload {
  background-color: #409eff;
  color: white;
  font-size: 14px;
  display: block;
  width: 195px;
  height: 40px;
  text-align: center;
  padding-top: 9px;
  margin-top: 10px;
  box-sizing: border-box;
  cursor: pointer;
  border-radius: 5px;
}
.upload:hover {
  opacity: 0.8;
}
.upload > input {
  display: none;
}
</style>
