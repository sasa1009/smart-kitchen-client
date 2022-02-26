<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import dayjs from 'dayjs';
import { FoodLogsApi, Configuration, GetFoodLogsResponseFoodLogs, CurrentUserApi, CurrentUserResponseUser } from '@/api';
import { isLogin, authData } from '@/modules/auth';
import { LineChart } from 'vue-chart-3';
import { Chart, registerables, ChartData } from "chart.js";

interface FoodLogData extends GetFoodLogsResponseFoodLogs {
  date: Date;
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
  return dayjs(date).format('H:m');
});

/**
 * 1日の合計カロリーを計算する
 */
const calculateTotalCalorie = computed(() => (index: number) => {
  return foodLogDataList[index].reduce((total, foodLog) => {
    return Math.ceil((total += (foodLog.calorie * foodLog.amount)));
  }, 0);
});

const emptyFoodLogData = reactive([
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
]);

const foodLogDataList: Array<Array<FoodLogData>> = reactive([...emptyFoodLogData]);

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

      // 食事記録を食事時間でソート
      foodLogData.sort((a, b) => {
        return a.date.getTime() - b.date.getTime();
      })

      // データを格納
      foodLogDataList.push(foodLogData);
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
    foodLogDataList[date].splice(index, 1);
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

// ユーザー情報
const userData = reactive<CurrentUserResponseUser>({
  id: 0,
  name: '',
  comment: '',
  image_url: '',
  following_count: 0,
  follower_count: 0,
  is_set_weight_loss_target: false,
  height: 0,
  weight: 0,
  sex: '',
  age: 0,
  activity_amount: 0,
  weight_loss_target: 0
});

/**
 * ログイン中のユーザー情報を取得する
 */
async function getUserData() {
  try {
    const response = await new CurrentUserApi(configuration).getCurrentUser(authData.value.uid, authData.value.accessToken, authData.value.client);
    if (response.status !== 200) throw new Error('ユーザー情報の取得に失敗しました。');
    Object.assign(userData, response.data.user)
  } catch (error) {
    console.error(error);
  }
}

// チャートを描画するためのデータ
const calorieData = reactive({
  total_metabolism_list: [0, 0, 0, 0, 0, 0, 0],
  calorie_intake_target_list: [0, 0, 0, 0, 0, 0, 0],
  actual_calorie_intake_list: [0, 0, 0, 0, 0, 0, 0],
});

// チャート用の食事記録情報を取得するための日付情報
const dates = reactive({
  startOfWeek: dayjs().startOf('week'),
  endOfWeek: dayjs().endOf('week'),
});

// チャートに表示する日付をフォーマットする
const formatMonthDate = computed(() => (date: dayjs.Dayjs) => {
  return date.format('M/D');
});

/**
 * チャート用の食事記録情報を取得するための日付情報を変更する
 */
function changeWeek(status: 'previous' | 'next') {
  if (status === 'previous') {
    dates.startOfWeek = dates.startOfWeek.subtract(7, 'd')
    dates.endOfWeek = dates.endOfWeek.subtract(7, 'd')
  } else {
    dates.startOfWeek = dates.startOfWeek.add(7, 'd')
    dates.endOfWeek = dates.endOfWeek.add(7, 'd')
  }
}

/**
 * チャート用の食事記録情報を取得する
 */
async function getFoodLogsForChart(status?: 'previous' | 'next') {
  if (status) changeWeek(status);
  // 食事記録情報を取得
  const response = await new FoodLogsApi(configuration).getFoodLogs(authData.value.uid, authData.value.accessToken, authData.value.client, dates.startOfWeek.toISOString(), dates.endOfWeek.toISOString());
  if (response.status !== 200) throw new Error('食事記録情報の取得に失敗しました。');

  // レスポンスのISOString形式の日付文字列からDateオブジェクトを作成する
  const foodLogWithDate = response.data.food_logs.map((foodLog) => {
    return ({
      ...foodLog,
      date: new Date(foodLog.meal_date_time)
    });
  });

  const sumCalorieList = [];
  let sumCalorie = 0;
  for (let i = 0; i <= 6 ; i++) {
    // 該当の日付に摂取したカロリーを合算
    sumCalorie += foodLogWithDate.reduce((totalCalorie, foodLog) => {
      if (foodLog.date >= dates.startOfWeek.add(i, 'd').startOf('date').toDate() && foodLog.date <= dates.startOfWeek.add(i, 'd').endOf('date').toDate()) {
        totalCalorie += Math.ceil(foodLog.calorie * foodLog.amount);
      }
      return totalCalorie;
    }, 0);

    // データを格納
    sumCalorieList.push(sumCalorie);
  }

  calorieData.actual_calorie_intake_list = sumCalorieList;
}

/**
 * ユーザーの1日の代謝量とカロリー摂取量の目標値を計算する
 */
function calculateMetabolism() {
  let total_metabolism = 0;
  let calorie_intake_target = 0;

  if (!userData.weight || !userData.height || !userData.age || !userData.sex || !userData.activity_amount || !userData.weight_loss_target) return { total_metabolism, calorie_intake_target };

  // 総代謝量を計算
  if (userData.sex === 'male') {
    total_metabolism = Math.floor((66.47 + (userData.weight * 13.75) + (userData.height * 5) - (userData.age * 6.76)) * userData.activity_amount);
  } else {
    total_metabolism = Math.floor((665.1 + (userData.weight * 9.56) + (userData.height * 1.85) - (userData.age * 4.68)) * userData.activity_amount);
  }

  // カロリーの摂取目標を計算
  calorie_intake_target = total_metabolism - Math.floor((7000 * Number(userData.weight_loss_target) / 30));

  return { total_metabolism, calorie_intake_target };
}

Chart.register(...registerables);

// LineChart 用のデータ
const lineData = reactive<ChartData<"line">>({
  labels: ["日", "月", "火", "水", "木", "金", "土"],
  datasets: [],
});

/**
 * 「前／次の週を表示」ボタンが押された時に新たなデータを取得してチャートを更新する
 */
async function updateChart(status: 'previous' | 'next') {
  try {
    await getFoodLogsForChart(status);
    lineData.datasets.splice(0, 1);
    lineData.datasets.unshift({
      label: "今週のカロリー摂取量(kcal)",
      data: calorieData.actual_calorie_intake_list,
      fill: false,
      borderColor: "rgb(255, 127, 80)",
      tension: 0.1,
    });
  } catch (error) {
    console.error(error);
  }
}

// チャートの描画に必要なデータを取得してlineDataに格納する
(async function initChart() {
  try {
    // ユーザーデータを取得する
    await getUserData();

    // 食事記録データを取得して摂取したカロリーのデータをcalorieDataに格納する
    await getFoodLogsForChart();

    if (userData.is_set_weight_loss_target) {
      // ユーザーデータからチャートの描画に必要なデータを計算する
      const metabolismData = calculateMetabolism();

      // ダミーデータを削除
      calorieData.total_metabolism_list.splice(0);
      calorieData.calorie_intake_target_list.splice(0);

      // 足し上げていく変数を定義
      let totalMetabolism = 0;
      let calorieIntakeTarget = 0;

      // 総消費カロリーとカロリー摂取目標をcalorieDataに格納する
      for (let i = 0; i <= 6; i++) {
        totalMetabolism += metabolismData.total_metabolism;
        calorieIntakeTarget += metabolismData.calorie_intake_target;
        calorieData.total_metabolism_list.push(totalMetabolism);
        calorieData.calorie_intake_target_list.push(calorieIntakeTarget);
      }

      lineData.datasets = [
        {
          label: "今週のカロリー摂取量(kcal)",
          data: calorieData.actual_calorie_intake_list,
          fill: false,
          borderColor: "rgb(255, 127, 80)",
          tension: 0.1,
        },
        {
          label: "摂取カロリーの目標値(kcal)",
          data: calorieData.calorie_intake_target_list,
          fill: false,
          borderColor: "rgb(255, 165, 0)",
          tension: 0.1,
        },
        {
          label: "総代謝量(kcal)",
          data: calorieData.total_metabolism_list,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ];
    } else {
      lineData.datasets = [
        {
          label: "今週のカロリー摂取量(kcal)",
          data: calorieData.actual_calorie_intake_list,
          fill: false,
          borderColor: "rgb(255, 127, 80)",
          tension: 0.1,
        }
      ];
    }
  } catch (error) {
    console.error(error);
  }
})();
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
    <h1
      :class="'chart-title-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
    >
      カロリー摂取量推移
    </h1>
    <div :class="'chart-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
      <div class="date-range"><span>表示期間</span>{{ formatMonthDate(dates.startOfWeek) }}(日)<span class="wave">〜</span>{{ formatMonthDate(dates.endOfWeek) }}(土)</div>
      <LineChart :chart-data="lineData" />
      <div class="sum-calorie">期間内の合計摂取カロリー<span>{{calorieData.actual_calorie_intake_list[6]}}</span>kcal</div>
      <div class="buttons">
        <el-button
          size="small"
          @click="updateChart('previous')"
          class="previous-button"
        >
          前の週を表示
        </el-button>
        <el-button
          size="small"
          @click="updateChart('next')"
          class="next-button"
        >
          次の週を表示
        </el-button>
      </div>
    </div>
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
      v-for="(foodLog, index) in foodLogDataList[(date.getDate() - 1)]"
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
  border: 1px solid #dcdfe6;
  margin: 10px auto 0 auto;
  padding: 10px;
  box-sizing: border-box;
}
/* コンテント小 */
.content-sm {
  width: 375px;
  background-color: white;
  border: 1px solid #dcdfe6;
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
  margin-top: 5px;
}
.sum-calorie span {
  margin: 0 5px;
  font-size: 18px;
  font-weight: bold;
  color: #0000cd;
}
/* チャート */
.chart-wrapper-sm {
  padding: 0 10px 10px;
  box-sizing: border-box;
}
/* チャートのタイトル */
.chart-title-mdlg {
  font-size: 18px;
  margin: 0 0 10px 0;
}
/* ページタイトル小 */
.chart-title-sm {
  font-size: 18px;
  margin: 0 0 10px 0;
  padding-left: 10px;
}
.date-range span:first-child {
  margin-right: 10px;
}
.wave {
  margin: 0 5px;
}
/* チャートの下のボタン */
.buttons {
  margin-top: 5px;
}
.buttons::after {
  content: "";
  display: block;
  clear: both;
}
.previous-button {
  float: left;
}
.next-button {
  float: right;
}
</style>
