<script setup lang="ts">
import { reactive, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import { UsersApi, RelationshipsApi, Configuration, GetUsersResponseUsers } from '@/api';
import { isLogin, authData } from '@/modules/auth';

const route = useRoute();
const router = useRouter();
const mq = useMq();

/**
 * 現在のページの幅に応じて数値を返す
 */
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

const userDataList = reactive<Array<GetUsersResponseUsers>>([
  {
    id: 0,
    name: '',
    image_url: '',
    is_following: false
  }
])

/**
 * ページングに使用するデータ
 */
const pageData = reactive({
  limit: 12,
  current: 1,
  total: 0,
});

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

// ユーザーがフォローしているユーザーの情報を一覧取得してuserDataListに格納する
async function getFollowings() {
  try {
    let response;
    if (isLogin.value) {
      response = await new UsersApi(configuration).getFollowings(authData.value.uid, authData.value.accessToken, authData.value.client, Number(route.params.id), pageData.limit, pageData.limit * (pageData.current - 1));
    } else {
      response = await new UsersApi(configuration).getFollowings('', '', '', Number(route.params.id), pageData.limit, pageData.limit * (pageData.current - 1));
    }
    if (response.status !== 200) {
      ElMessage({
        showClose: true,
        message: 'ユーザー情報の取得に失敗しました。',
        type: 'error',
      });
      throw new Error('ユーザー情報の取得に失敗しました。')
    }
    userDataList.splice(0);
    Object.assign(userDataList, response.data.users);
    pageData.total = response.data.meta.total;
  } catch (error) {
    console.error(error);
  }
}

// ユーザーをフォローしているユーザーの情報を一覧取得してuserDataListに格納する
async function getFollowers() {
  try {
    let response;
    if (isLogin.value) {
      response = await new UsersApi(configuration).getFollowers(authData.value.uid, authData.value.accessToken, authData.value.client, Number(route.params.id), pageData.limit, pageData.limit * (pageData.current - 1));
    } else {
      response = await new UsersApi(configuration).getFollowers('', '', '', Number(route.params.id), pageData.limit, pageData.limit * (pageData.current - 1));
    }
    if (response.status !== 200) {
      ElMessage({
        showClose: true,
        message: 'ユーザー情報の取得に失敗しました。',
        type: 'error',
      });
      throw new Error('ユーザー情報の取得に失敗しました。')
    }
    userDataList.splice(0);
    Object.assign(userDataList, response.data.users);
    pageData.total = response.data.meta.total;
  } catch (error) {
    console.error(error);
  }
}

/**
 * ページネーションのページ番号がクリックされた時に新たなユーザー情報の一覧を取得してuserDataListに格納する
 */
watch(
  () => pageData.current,
  async () => {
    if (route.meta.status === 'followings') {
      await getFollowings();
    } else if (route.meta.status === 'followers') {
      await getFollowers();
    }
  }
);

// ユーザーをフォローする
async function follow(index: number) {
  if (isLogin.value) {
    try {
      const response = await new RelationshipsApi(configuration).createRelationship(authData.value.uid, authData.value.accessToken, authData.value.client, userDataList[index].id);
      if (response.status !== 201) {
        throw new Error('ユーザーのフォローに失敗しました。')
      }
      userDataList[index].is_following = !userDataList[index].is_following;
      ElMessage({
        showClose: true,
        message: 'ユーザーをフォローしました。',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
    }
  } else {
    ElMessage({
      showClose: true,
      message: 'ユーザーをフォローするにはログインしてください。',
    });
    router.push({ name: 'Login' });
  }
}

// ユーザーのフォローを解除する
async function unfollow(index: number) {
  try {
    const response = await new RelationshipsApi(configuration).deleteRelationship(authData.value.uid, authData.value.accessToken, authData.value.client, userDataList[index].id);
    if (response.status !== 204) {
      throw new Error('フォローの解除に失敗しました。')
    }
    userDataList[index].is_following = !userDataList[index].is_following;
    ElMessage({
      showClose: true,
      message: 'フォローを解除しました。',
    });
  } catch (error) {
    console.error(error);
  }
}

// コンポーネント作成時にユーザー情報を取得する
if (route.meta.status === 'followings') {
  getFollowings();
} else if (route.meta.status === 'followers') {
  getFollowers();
}
</script>

<template>
  <el-row :class="'row row-' + mq.current">
    <el-col
      :span="currentSpan"
      v-for="(userData, index) in userDataList"
      :key="index"
      class="col"
    >
      <div :class="'user-card-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <div
          v-if="userData.image_url"
          class="user-image-wrapper"
        >
          <el-image
            class="user-image"
            :src="userData.image_url ? userData.image_url : require('@/assets/noimage.png')"
            fit="cover"
          />
        </div>
        <font-awesome-icon
          v-else
          :icon="['far', 'user-circle']"
          class="user-icon"
        />
        <div
          class="user-name"
          @click="$router.push({ name: 'User', params: { id: userData.id } })"
        >
          {{ userData.name }}
        </div>
        <div class="button-wrapper">
          <el-button
            v-if="userData.is_following"
            round
            size="small"
            type="info"
            class="follow-button"
            @click="unfollow(index)"
          >
            フォロー解除
          </el-button>
          <el-button
            v-else
            round
            size="small"
            class="follow-button"
            @click="follow(index)"
          >
            フォローする
          </el-button>
        </div>
      </div>
    </el-col>
  </el-row>
  <div class="pagination">
    <el-pagination
      layout="prev, pager, next"
      v-model:currentPage="pageData.current"
      :total="pageData.total"
      :page-size="pageData.limit"
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
/* ユーザーカード */
.user-card-mdlg {
  width: 200px;
  height: 250px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #dcdfe6;
}
.user-card-sm {
  width: 160px;
  height: 250px;
  margin: 0 auto;
  background-color: white;
  border: 1px solid #dcdfe6;
}
/* ユーザー画像 */
.user-image-wrapper {
  width: 150px;
  height: 150px;
  margin: 10px auto 0 auto;
  border-radius: 50%;
  overflow: hidden;
}
.user-image {
  width: 150px;
  height: 150px;
}
/* ユーザーアイコン */
.user-icon {
  font-size: 150px;
  display: block;
  margin: 10px auto 0 auto;
}
/* ユーザー名 */
.user-name:hover {
  opacity: 0.8;
  cursor: pointer;
  text-decoration: underline;
}
.user-name {
  font-weight: bold;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
/* フォローボタン */
.button-wrapper {
  margin: 10px 0;
}
.follow-button {
  display: block;
  margin: 0 auto;
}
.pagination {
  text-align: center;
}
</style>
