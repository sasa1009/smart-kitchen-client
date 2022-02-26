<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import RecipeCard from '@/components/RecipeCard.vue';
import { authData, isLogin } from '@/modules/auth';
import { UsersApi, RecipesApi, RelationshipsApi, Configuration, GetUserResponseUser } from '@/api';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import { usersRecipeDataList, favoritedRecipeDataList } from '@/modules/data';

const mq = useMq();
const route = useRoute();
const router = useRouter();

/**
 * 現在のページの幅に応じて数値を返す
 */
const currentSpan = computed(() => {
  switch (mq.current) {
    case 'lg':
      return 8;
    case 'md':
      return 8;
    case 'sm':
      return 12;
    default: 
      return 8;
  }
});

// ユーザー情報
const userData = reactive<GetUserResponseUser>({
  id: 0,
  name: '',
  comment: '',
  image_url: '',
  is_following: false,
  is_followed: false,
  following_count: 0,
  follower_count: 0
});

const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });

/**
 * ユーザー情報を取得する
 */
async function getUserData() {
  try {
    let response;
    if (isLogin.value) {
      response = await new UsersApi(configuration).getUser(authData.value.uid, authData.value.accessToken, authData.value.client, Number(route.params.id));
    } else {
      response = await new UsersApi(configuration).getUser('', '', '', Number(route.params.id));
    }
    if (response.status !== 200) throw new Error('ユーザー情報の取得に失敗しました。');
    Object.assign(userData, response.data.user)
  } catch (error) {
    console.error(error);
  }
}

// ユーザーをフォローする
async function follow() {
  if (isLogin.value) {
    try {
      const response = await new RelationshipsApi(configuration).createRelationship(authData.value.uid, authData.value.accessToken, authData.value.client, userData.id);
      if (response.status !== 201) {
        throw new Error('ユーザーのフォローに失敗しました。')
      }
      userData.is_following = !userData.is_following;
      userData.follower_count++;
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
async function unfollow() {
  try {
    const response = await new RelationshipsApi(configuration).deleteRelationship(authData.value.uid, authData.value.accessToken, authData.value.client, userData.id);
    if (response.status !== 204) {
      throw new Error('フォローの解除に失敗しました。')
    }
    userData.is_following = !userData.is_following;
    userData.follower_count--;
    ElMessage({
      showClose: true,
      message: 'フォローを解除しました。',
    });
  } catch (error) {
    console.error(error);
  }
}

/**
 * ユーザーが作成したレシピ情報一覧のページングに使用するデータ
 */
const usersRecipePageData = reactive({
  limit: 6,
  current: 1,
  total: 0,
});

/**
 * ユーザーが投稿したレシピのページネーションのページ番号がクリックされた時に新たなレシピ情報の一覧を取得してusersRecipeDataListに格納する
 */
watch(
  () => usersRecipePageData.current,
  async () => {
    await getUsersRecipeData();
  }
);

/**
 * ユーザーが作成したレシピ情報の一覧を取得する
 */
async function getUsersRecipeData() {
  try {
    let response;
    if (isLogin.value) {
      response = await new RecipesApi(configuration).getUsersRecipes(authData.value.uid, authData.value.accessToken, authData.value.client, Number(route.params.id), usersRecipePageData.limit, usersRecipePageData.limit * (usersRecipePageData.current - 1));
    } else {
      response = await new RecipesApi(configuration).getUsersRecipes('', '', '', Number(route.params.id), usersRecipePageData.limit, usersRecipePageData.limit * (usersRecipePageData.current - 1));
    }
    if (response.status !== 200) throw new Error('レシピ情報の取得に失敗しました。');
    usersRecipeDataList.splice(0);
    Object.assign(usersRecipeDataList, response.data.recipes);
    usersRecipePageData.total = response.data.meta.total;
  } catch (error) {
    console.error(error);
  }
}

/**
 * お気に入りレシピ情報一覧のページングに使用するデータ
 */
const favoritedRecipePageData = reactive({
  limit: 6,
  current: 1,
  total: 0,
});

/**
 * お気に入りレシピのページネーションのページ番号がクリックされた時に新たなレシピ情報の一覧を取得してfavoritedRecipeDataListに格納する
 */
watch(
  () => favoritedRecipePageData.current,
  async () => {
    await getFavoritedRecipeData();
  }
);

/**
 * お気に入りレシピ情報の一覧を取得する
 */
async function getFavoritedRecipeData() {
  try {
    let response;
    if (isLogin.value) {
      response = await new RecipesApi(configuration).getFavoritedRecipes(authData.value.uid, authData.value.accessToken, authData.value.client, Number(route.params.id), favoritedRecipePageData.limit, favoritedRecipePageData.limit * (favoritedRecipePageData.current - 1));
    } else {
      response = await new RecipesApi(configuration).getFavoritedRecipes('', '', '', Number(route.params.id), favoritedRecipePageData.limit, favoritedRecipePageData.limit * (favoritedRecipePageData.current - 1));
    }
    if (response.status !== 200) throw new Error('レシピ情報の取得に失敗しました。');
    favoritedRecipeDataList.splice(0);
    Object.assign(favoritedRecipeDataList, response.data.recipes);
    favoritedRecipePageData.total = response.data.meta.total;
  } catch (error) {
    console.error(error);
  }
}

// 選択中のレシピ情報のタブを格納する
const currentTab = ref('');

/**
 * 選択されたタブに応じてレシピ情報を取得する
 */
watch(
  currentTab,
  async (tabIndex) => {
    switch (tabIndex) {
      case '0':
        break;
      case '1':
        await getFavoritedRecipeData();
    }
  }
);

/**
 * パスパラメータのIDが変わった時にユーザー情報を再度読み込む
 */
watch(() => route.path, async () => {
  if (route.name === 'User') {
    currentTab.value = '0';
    await getUserData();
    await getUsersRecipeData();
  }
});

// コンポーネント作成時にユーザー情報を読み込む
getUserData();
getUsersRecipeData();
</script>

<template>
  <div :class="'user-data-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
    <div :class="'user-data-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
      <div
        v-if="userData.image_url"
        :class="'user-image-wrapper'"
      >
        <el-image
          :class="'user-image'"
          :src="userData.image_url"
          fit="cover"
        ></el-image>
      </div>
      <div
        v-else
        class="user-icon-wrapper"
      >
        <font-awesome-icon
          :icon="['far', 'user-circle']"
          class="user-icon"
        />
      </div>
      <div :class="'user-name-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <div
          v-if="userData.is_followed"
          class="followed"
        >
          <span>フォローされています</span>
        </div>
        <div class="name">{{ userData.name }}</div>
        <div
          class="follow-wrapper"
        >
          <div class="follow">
            <el-button
              type="text"
              class="follow-title"
              @click="$router.push({ name: 'Followings', params: { id: userData.id } })"
            >
              フォロー
            </el-button>
            <span class="follow-count">
              {{ userData.following_count }}
            </span>
          </div>
          <div class="follow">
            <el-button
              type="text"
              class="follow-title"
              @click="$router.push({ name: 'Followers', params: { id: userData.id } })"
            >
              フォロワー
            </el-button>
            <span class="follow-count">
              {{ userData.follower_count }}
            </span>
          </div>
        </div>
        <div
          v-if="userData.id !== authData.userId"
          class="button-wrapper"
        >
          <el-button
            v-if="userData.is_following"
            round
            size="small"
            type="info"
            class="follow-button"
            @click="unfollow()"
          >
            フォロー解除
          </el-button>
          <el-button
            v-else
            round
            size="small"
            class="follow-button"
            @click="follow()"
          >
            フォローする
          </el-button>
        </div>
      </div>
    </div>
    <div
      v-if="userData.comment"
      :class="'comment-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
    >
      <h3>一言コメント</h3>
      <div v-html="userData.comment.replace(/\n/g, '<br>')" />
    </div>
  </div>
  <el-tabs
    type="border-card"
    v-model="currentTab"
    :class="'recipe-pane-' + (mq.current === 'sm' ? 'sm' : 'mdlg')"
  >
    <el-tab-pane
      label="投稿したレシピ"
    >
      <el-row :class="'row-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <el-col
          :span="currentSpan"
          v-for="(recipeCardData, index) in usersRecipeDataList"
          :key="index"
          class="col"
        >
          <div :class="'recipe-card-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
            <RecipeCard
              :mq-current="mq.current"
              v-model:recipe-card-data="usersRecipeDataList[index]"
              :is-login="true"
            />
          </div>
        </el-col>
      </el-row>
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          v-model:currentPage="usersRecipePageData.current"
          :total="usersRecipePageData.total"
          :page-size="usersRecipePageData.limit"
          :pager-count="5"
          style="--el-pagination-hover-color: black;
                --el-pagination-font-color: silver;
                --el-pagination-font-size: 18px;"
        />
      </div>
    </el-tab-pane>
    <el-tab-pane
      label="お気に入りレシピ"
      :tab-click="getFavoritedRecipeData"
    >
      <el-row :class="'row-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <el-col
          :span="currentSpan"
          v-for="(recipeCardData, index) in favoritedRecipeDataList"
          :key="index"
          class="col"
        >
          <div :class="'recipe-card-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
            <RecipeCard
              :mq-current="mq.current"
              v-model:recipe-card-data="favoritedRecipeDataList[index]"
              :is-login="true"
            />
          </div>
        </el-col>
      </el-row>
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          v-model:currentPage="favoritedRecipePageData.current"
          :total="favoritedRecipePageData.total"
          :page-size="favoritedRecipePageData.limit"
          :pager-count="5"
          style="--el-pagination-hover-color: black;
                --el-pagination-font-color: silver;
                --el-pagination-font-size: 18px;"
        />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
/* ユーザーデータラッパー大 */
.user-data-wrapper-mdlg {
  width: 750px;
  height: 400px;
  background-color: white;
  border: 1px solid #dcdfe6;
  margin: 10px auto 0 auto;
}
/* ユーザーデータラッパー小 */
.user-data-wrapper-sm {
  width: 375px;
  background-color: white;
  border: 1px solid #dcdfe6;
  margin: 10px auto 0 auto;
}
/* ユーザーデータ大 */
.user-data-mdlg {
  width: 374px;
  height: 400px;
  float: left;
}
/* ユーザーデータ小 */
.user-data-sm {
  width: 374px;
  height: 380px;
  padding: 10px;
  box-sizing: border-box;
}
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
.user-icon-wrapper {
  width: 150px;
  height: 150px;
  margin: 10px auto 0 auto; 
}
.user-icon {
  font-size: 150px;
}
/* ユーザーネームを含むユーザー情報大 */
.user-name-mdlg {
  width: 100%;
  height: 170px;
  margin-top: 30px;
  padding-left: 10px;
  box-sizing: border-box;
}
/* ユーザーネームを含むユーザー情報小 */
.user-name-sm {
  width: 100%;
  height: 170px;
  margin-top: 30px;
}
.name {
  font-size: 25px;
  font-weight: bold;
}
/* フォロー関連 */
.followed > span {
  display: block;
  width: 130px;
  font-size: 12px;
  text-align: center;
  color: white;
  background-color: #909399;
  border-radius: 5px;
}
.follow-wrapper {
  margin-top: 10px;
}
.follow-wrapper::after {
  content: "";
  display: block;
  clear: both;
}
.follow {
  width: 120px;
  float: left;
}
.follow > .el-button {
  min-height: 25px;
}
.follow-title {
  padding: 0;
  height: 25px;
}
.follow-count {
  margin-left: 8px;
  font-size: 18px;
  font-weight: bold;
}
/* フォローボタン関連 */
.button-wrapper {
  margin-top: 10px;
}
/* コメント大 */
.comment-mdlg {
  width: 374px;
  height: 400px;
  float: left;
  font-size: 14px;
}
/* コメント小 */
.comment-sm {
  width: 374px;
  height: 200px;
  font-size: 14px;
  padding: 10px;
  box-sizing: border-box;
}
/* レシピタブ大 */
.recipe-pane-mdlg {
  width: 750px;
  min-height: 400px;
  margin: 10px auto 0 auto;
}
/* レシピタブ小 */
.recipe-pane-sm {
  width: 375px;
  min-height: 400px;
  margin: 10px auto 0 auto;
}
/* カテゴリータブの影を消す */
.el-tabs--border-card {
  box-shadow: none;
}
/* レシピ一覧の行大 */
.row-mdlg {
  width: 720px;
}
/* レシピ一覧の行小 */
.row-sm {
  width: 345px;
}
/* レシピ一覧のカラム */
.col {
  margin-bottom: 10px;
}
/* レシピカードラッパー大 */
.recipe-card-wrapper-mdlg {
  width: 200px;
  margin: 0 auto;
}
/* レシピカードラッパー小 */
.recipe-card-wrapper-sm {
  width: 160px;
  margin: 0 auto;
}
/* ページネーション */
.pagination {
  width: 100%;
  text-align: center;
}

</style>
