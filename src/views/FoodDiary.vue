<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import dayjs from 'dayjs';
import { FoodLogsApi, Configuration, GetFoodLogsResponseFoodLogs } from '@/api';
import { isLogin, authData } from '@/modules/auth';

interface FoodLogData extends GetFoodLogsResponseFoodLogs {
  date: Date;
}
interface FoodLogDataWithTotalCalorie {
  total_calorie: number,
  food_log_data: Array<FoodLogData>
}

// メディアクエリ
const mq = useMq();

// カレンダーにv-modelで与える日付情報
const date = ref(new Date());

/**
 * YYYY-MM-DDの日付の文字列から日付の数字だけを取り出す
 */
const dateNumber = computed(() => (date: string) => {
  const dateString = date.split('-').slice(2)[0];
  return dateString[0] === '0' ? dateString[1] : dateString;
});

/**
 * ISOStringを時間にフォーマットする
 */
const formatDate = computed(() => (date: string) => {
  return dayjs(date).format('HH:mm');
});

/**
 * 1日の合計カロリーを計算する
 */
const calculateTotalCalorie = computed(() => (index: number) => {
  return foodLogDataList[index].food_log_data.reduce((total, foodLog) => {
    return (total += (foodLog.calorie * foodLog.amount));
  }, 0);
});

const emptyFoodLogData = reactive([
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
  { total_calorie: 0, food_log_data: [] },
]);

const foodLogDataList: Array<FoodLogDataWithTotalCalorie> = reactive([...emptyFoodLogData]);

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

/**
 * 食事記録情報を一覧取得する
 */
async function getFoodLogs() {
  if (!isLogin.value) return;
  try {
    // 食事記録情報を取得
    const response = await new FoodLogsApi(configuration).getFoodLogs(authData.value.uid, authData.value.accessToken, authData.value.client, dayjs(date.value).startOf('month').toDate().toISOString(), dayjs(date.value).endOf('month').toDate().toISOString());
    if (response.status !== 200) throw new Error('食事記録情報の取得に失敗しました。');

    // レスポンスのISOString形式の日付文字列からDateオブジェクトを作成する
    const foodLogWithDate = response.data.food_logs.map((foodLog) => {
      return ({
        ...foodLog,
        date: new Date(foodLog.meal_date_time)
      });
    });

    // ダミーデータを削除
    foodLogDataList.splice(0);

    // レスポンスから1日毎に食事記録を取得してfoodLogDataListに格納する
    for (let dateNumber = 1; dateNumber <= dayjs(date.value).endOf('month').date(); dateNumber++) {

      // 該当の日付の食事記録を取得
      const foodLogData = foodLogWithDate.reduce((array, foodLog) => {
        if (foodLog.date >= dayjs(date.value).date(dateNumber).startOf('date').toDate() && foodLog.date <= dayjs(date.value).date(dateNumber).endOf('date').toDate()) {
          array.push(foodLog);
        }
        return array;
      }, [] as Array<FoodLogData>);

      // 食事記録を時間でソート
      foodLogData.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      })

      // 1日のカロリーを集計
      const totalCalorie = foodLogData.reduce((total, foodLog) => {
        return (total += foodLog.calorie);
      }, 0);

      // データを格納
      foodLogDataList.push({
        total_calorie: totalCalorie,
        food_log_data: foodLogData
      });
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * 食事記録データを削除する
 */
async function deleteFoodData(id: number, date: number, index: number) {
  if (!isLogin.value) return;
  try {
    // 食事記録情報を削除するリクエストを送信
    const response = await new FoodLogsApi(configuration).deleteFoodLog(authData.value.uid, authData.value.accessToken, authData.value.client, String(id));
    if (response.status !== 204) throw new Error('食事記録の削除に失敗しました。');

    // 該当の食事記録を削除
    foodLogDataList[date].food_log_data.splice(index, 1);
    ElMessage({
      showClose: true,
      message: '食事記録を削除しました。',
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

// コンポーネント作成時に食事記録情報を取得する
getFoodLogs();

// 食事記録ダイアログを表示する
const dialogVisible = ref(false);

// カレンダーの月が変わったら新たなデータを取得、日が選択されたら食事記録一覧ダイアログを表示する
watch(
  () => date.value,
  async (newDate, oldDate) => {
    if (newDate.getMonth() !== oldDate.getMonth()) {
      foodLogDataList.splice(0);
      foodLogDataList.push(...emptyFoodLogData);
      await getFoodLogs();
    } else {
      dialogVisible.value = true;
    }
  }
)
</script>

<template>
  <div :class="'content-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
    <h1
      :class="'page-title-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
    >
      フード日誌
    </h1>
    <el-calendar v-model="date">
      <template
        #dateCell="{ data }"
      >
        <div
          class="calendar-cell"
        >
          <span :class="'date-number-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">{{ dateNumber(data.day) }}</span>
          <div
            v-if="data.date.getMonth() === date.getMonth()"
          >
            <div class="calorie">
              <span class="calorie-number">{{ calculateTotalCalorie(Number(dateNumber(data.day)) - 1) }}</span>
              <br v-if="mq.current === 'sm'">
              <span class="kcal">kcal</span>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
  </div>
  <el-dialog
    v-model="dialogVisible"
    :title="'食事記録 (' + date.getMonth() + '月' + date.getDate() + '日)'"
    :width="(mq.current === 'sm' ? '350px' : '500px')"
  >
    <el-row class="row">
      <el-col
       :span="4"
      >
        <span>時間</span>
      </el-col>
      <el-col
       :span="9"
      >
        <span>品名</span>
      </el-col>
      <el-col
       :span="6"
      >
        <span>カロリー<br v-if="mq.current === 'sm'">(kcal)</span>
      </el-col>
      <el-col
       :span="3"
      >
        <span>数量</span>
      </el-col>
      <el-col
       :span="2"
      >
      </el-col>
    </el-row>
    <el-row
      v-for="(foodLog, index) in foodLogDataList[(date.getDate() - 1)].food_log_data"
      :key="index"
      class="row"
    >
      <el-col
       :span="4"
      >
        <span>{{ formatDate(foodLog.meal_date_time) }}</span>
      </el-col>
      <el-col
       :span="9"
      >
        <span>{{ foodLog.name }}</span>
      </el-col>
      <el-col
       :span="6"
      >
        <span>{{ foodLog.calorie }}</span>
      </el-col>
      <el-col
       :span="3"
      >
        <span>{{ foodLog.amount }}</span>
      </el-col>
      <el-col
       :span="2"
      >
        <el-popconfirm
          title="削除してもよろしいですか？"
          @confirm="deleteFoodData(foodLog.id, (date.getDate() - 1), index)"
        >
          <template #reference>
            <font-awesome-icon
              :icon="['far', 'times-circle']"
              class="delete-button"
            />
          </template>
        </el-popconfirm>
      </el-col>
    </el-row>
    <div class="sum-calorie">
      合計カロリー
      <span>{{ calculateTotalCalorie((date.getDate() - 1)) }}</span>
      kcal
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">閉じる</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
/* コンテント大 */
.content-mdlg {
  width: 750px;
  background-color: white;
  margin: 10px auto 0 auto;
  padding: 10px;
  box-sizing: border-box;
}
/* コンテント小 */
.content-sm {
  width: 375px;
  background-color: white;
  margin: 10px auto 0 auto;
  padding-top: 10px;
  box-sizing: border-box;
}
/* カレンダーの日付の中身 */
.calendar-cell {
  width: 100%;
  height: 100%;
}
.date-number-mdlg {
  font-size: 18px;
}
.date-number-sm {
  font-size: 16px;
}
/* カロリー表示 */
.calorie {
  margin-top: 5px;
  text-align: right;
}
/* カロリーの数字 */
.calorie-number {
  font-size: 16px;
  font-weight: bold;
  color: #0000cd;
}
.kcal {
  margin-left: 5px;
}
/* ページタイトル大 */
.page-title-mdlg {
  font-size: 18px;
  margin: 10px 0;
}
/* ページタイトル小 */
.page-title-sm {
  font-size: 18px;
  margin: 10px 0;
  padding-left: 10px;
}
/* ダイアログ内の要素 */
.row {
  font-size: 16px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-bottom: 1px solid lightgray;
}
.row:first-child {
  border-top: 1px solid lightgray;
}
/* ダイアログ内の削除ボタン */
.delete-button {
  font-size: 20px;
  color: #F56C6C;
  cursor: pointer;
  display: block;
  width: 20px;
  height: 20px;
  margin-top: 2px;
}
.delete-button:hover {
  opacity: 0.8;
}
/* 合計カロリー */
.sum-calorie {
  font-size: 16px;
  text-align: right;
  margin-top: 10px;
}
.sum-calorie span {
  margin: 0 5px;
  font-size: 18px;
  font-weight: bold;
  color: #0000cd;
}
</style>
