<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import type { ElForm } from 'element-plus';
import { authData, isLogin } from '@/modules/auth';
import { ingredientsForForm, categories } from '@/modules/data';
import { uploadImageFileToS3 } from '@/modules/presignedUrl';
// eslint-disable-next-line
// @ts-ignore
import { useMq } from 'vue3-mq';
import { RecipesApi, Configuration, CreateRecipeRequest } from '@/api';

interface ImageData {
  imageDataUrl: string | ArrayBuffer | null;
  file: File | null;
}

const mq = useMq();
const router = useRouter();
const formRef = ref<InstanceType<typeof ElForm>>();

// フォームのバリデーションルール
const rules = reactive({
  title: [
    {
      required: true,
      message: 'タイトルを入力してください。',
      trigger: 'blur',
    }
  ],
  main_ingredient: [
    {
      required: true,
      message: 'メイン食材を選択してください。',
      trigger: 'change',
    },
  ],
  category: [
    {
      required: true,
      message: 'カテゴリーを入力してください。',
      trigger: 'change',
    },
  ],
});

// フォームで使用するデータを格納する
const recipeData = reactive({
  title: '',
  comment: '',
  amount: 1,
  calorie: 0,
  main_ingredient: '',
  category: '',
  tips: '',
  image_url: null,
  image_key: null
});
const ingredientData = reactive([
  {
    name: '',
    amount: '',
    showErrorMessage: false
  },
  {
    name: '',
    amount: '',
    showErrorMessage: false
  },
])
const procedureData = reactive([
  {
    description: '',
    imageDataUrl: null,
    file: null,
    showErrorMessage: false,
    image_url: null,
    image_key: null
  },
  {
    description: '',
    imageDataUrl: null,
    file: null,
    showErrorMessage: false,
    image_url: null,
    image_key: null
  },
])

// レシピのメイン画像データを格納する
const mainImageData = reactive<ImageData>({
  imageDataUrl: null,
  file: null
});

// ユーザーが選択した食材カテゴリーを格納する
const ingredientCategory = ref('');

/**
 * アップロードされた画像ファイルに対して以下の処理を行う
 * ・画像ファイルのバリデーション処理
 * ・BASE64形式への変換
 * ・各情報のimageDataオブジェクトへの格納
 */
function handleFile(event: any, index: number) {
  try {
    const file = event.target.files[0] as unknown as File;
    if (!file) return;

    // ファイルのバリデーションを行う
    // ファイルのサイズは5MBまで
    if (file.size > 5000000) {
      ElMessage({
        showClose: true,
        message: '5MB以下のサイズの画像を指定してください。',
        type: 'error',
      })
      return;
    }

    // ファイルの形式はJPEGまたはPNGのみ
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      ElMessage({
        showClose: true,
        message: 'JPEGまたはPNG形式のファイルを指定してください。',
        type: 'error',
      })
      return;
    }

    // imageDataオブジェクトに画像データを格納
    const reader = new FileReader();
    reader.onload = e => {
      if (index === -1) {
        mainImageData.imageDataUrl = e.target.result;
      } else {
        procedureData[index].imageDataUrl = e.target.result;
      }
    };
    reader.readAsDataURL(file);
    if (index === -1) {
      mainImageData.file = file;
    } else {
      procedureData[index].file = file;
    }
  } catch (error) {
    console.error(error);
    ElMessage({
      showClose: true,
      message: 'ファイルの取り込みに失敗しました。',
      type: 'error',
    })
    throw new Error();
  }
}

/**
 * アップロードされた画像ファイルを削除する
 */
function deleteFile(index: number) {
  if (index === -1) {
    mainImageData.imageDataUrl = null;
    mainImageData.file = null;
  } else {
    procedureData[index].imageDataUrl = null;
    procedureData[index].file = null;
  }
}

/**
 * 食材を削除する
 */
function deleteIngredient(index: number) {
  if (ingredientData.length >= 2) {
    ingredientData.splice(index, 1);
  }
}

/**
 * 食材を追加する
 */
function addIngredient() {
  ingredientData.push({
    name: '',
    amount: '',
    showErrorMessage: false
  });
}

/**
 * 手順を削除する
 */
function deleteProcedure(index: number) {
  if (procedureData.length >= 2) {
    procedureData.splice(index, 1);
  }
}

/**
 * 手順を追加する
 */
function addProcedure() {
  procedureData.push({
    description: '',
    imageDataUrl: null,
    file: null,
    showErrorMessage: false,
    image_url: null,
    image_key: null
  });
}

/**
 * レシピ情報を登録する
 */
function createRecipe(formEl: InstanceType<typeof ElForm> | undefined) {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      try {
        if (!isLogin.value) throw new Error('未ログインです。');

        // 食材と作り方の項目をバリデーション
        let isError = false;
        for (const ingredient of ingredientData) {
          // 未入力の項目があればエラーメッセージを表示
          if (!ingredient.name || !ingredient.amount) {
            ingredient.showErrorMessage = true;
            isError = true;
          }
          // 入力済みであればエラーメッセージを非表示
          if (!!ingredient.name && !!ingredient.amount) {
            ingredient.showErrorMessage = false;
          }
        }
        for (const procedure of procedureData) {
          // 未入力の項目があればエラーメッセージを表示
          if (!procedure.description) {
            procedure.showErrorMessage = true;
            isError = true;
          }
          // 入力済みであればエラーメッセージを非表示
          if (procedure.description) {
            procedure.showErrorMessage = false;
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

        // メイン画像が投稿されている場合はS3にアップロード
        if (mainImageData.file) {
          const imageMetaData = await uploadImageFileToS3(mainImageData.file);
          Object.assign(recipeData, imageMetaData);
        }

        // 手順の画像が投稿されている場合はS3にアップロード
        for (const procedure of procedureData) {
          if (procedure.file) {
            const imageMetaData = await uploadImageFileToS3(procedure.file);
            Object.assign(procedure, imageMetaData);
          }
        }

        const params: CreateRecipeRequest = {
          ...recipeData,
          ingredients: ingredientData.map((ingredient, index) => ({
            index,
            name: ingredient.name,
            amount: ingredient.amount
          })),
          procedures: procedureData.map((procedure, index) => ({
            index,
            description: procedure.description,
            image_url: procedure?.image_url,
            image_key: procedure?.image_key
          }))
        };

        // レシピ情報を登録
        const configuration = new Configuration({ basePath: process.env.VUE_APP_API_BASE_URL });
        const response = await new RecipesApi(configuration).createRecipe(authData.value.uid, authData.value.accessToken, authData.value.client, params);
        if (response.status === 201) {
          ElMessage({
            showClose: true,
            message: 'レシピを登録しました。',
            type: 'success',
          })
          router.push(`/recipe/${response.data.id}`)
        } else {
          throw new Error('レシピ登録失敗。');
        }
      } catch (error) {
        console.error(error);
        ElMessage({
          showClose: true,
          message: 'レシピの登録に失敗しました。',
          type: 'error',
        });
      }
    } else {
      console.log('error submit!');
      ElMessage({
        showClose: true,
        message: '未入力の項目があります。',
        type: 'error',
      })
      return false
    }
  });
}
</script>

<template>
  <div :class="'recipe-data-wrapper-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
    <el-form
      ref="formRef"
      label-position="top"
      label-width="100px"
      :model="recipeData"
      :rules="rules"
      :hide-required-asterisk="true"
    >
      <div :class="'recipe-data-' + (mq.current === 'sm' ? 'sm' : 'mdlg')">
        <h3>レシピ作成</h3>
        <div class="label">
          メイン画像
        </div>
        <div
          class="recipe-main-image-wrapper"
        >
          <el-image
            class="recipe-main-image"
            :src="mainImageData.imageDataUrl ? mainImageData.imageDataUrl : require('@/assets/noimage.png')"
            fit="cover"
          />
        </div>
        <div class="upload-wrapper">
          <label class="upload">
            画像を登録
            <input
              type="file"
              @change="(event) => { handleFile(event, -1) }"
              />
          </label>
          <span class="upload-tips">5MB以下で、JPEGまたはPNG形式の画像を指定してください。</span>
          <div
            class="image-name-wrapper"
            v-if="mainImageData.imageDataUrl"
          >
            <div class="image-name">
              {{ mainImageData.file?.name }}
            </div>
            <span
              class="delete-button"
              @click="deleteFile(-1)"
            >
              <font-awesome-icon
                :icon="['far', 'times-circle']"
              />
            </span>
          </div>
        </div>
        <el-form-item
          label="レシピタイトル"
          prop="title"
        >
          <el-input
            v-model="recipeData.title"
            :maxlength="30"
            :show-word-limit="true"
          />
        </el-form-item>
        <el-form-item
          label="コメント"
          prop="comment"
        >
          <el-input
            v-model="recipeData.comment"
            type="textarea"
            :maxlength="200"
            :show-word-limit="true"
          />
        </el-form-item>
        <el-form-item
          label="分量"
          prop="amount"
        >
          <el-input-number
            v-model="recipeData.amount"
            :min="1"
            :max="100"
            class="amount"
          />
          <span>人分</span>
        </el-form-item>
        <el-form-item
          label="一人分のカロリー"
          prop="amount"
        >
          <el-input-number
            v-model="recipeData.calorie"
            :min="0"
            :max="100000"
            class="amount"
          />
          <span>kcal</span>
        </el-form-item>
        <el-form-item
          label="メイン食材"
          prop="main_ingredient"
        >
          <el-select
            v-model="ingredientCategory"
            placeholder="食材カテゴリー"
            class="main-ingredient-selector"
          >
            <el-option
              v-for="(category, index) in Object.keys(ingredientsForForm)"
              :key="index"
              :label="category"
              :value="category"
            />
          </el-select>
          <el-select
            v-if="ingredientCategory"
            v-model="recipeData.main_ingredient"
            placeholder="メイン食材"
            class="main-ingredient-selector"
          >
            <el-option
              v-for="(ingredient, index) in ingredientsForForm[ingredientCategory]"
              :key="index"
              :label="ingredient"
              :value="ingredient"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="カテゴリー"
          prop="category"
        >
          <el-select
            v-model="recipeData.category"
            placeholder="カテゴリー"
            class="category-selector"
          >
            <el-option
              v-for="(category, index) in categories"
              :key="index"
              :label="category"
              :value="category"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="食材"
        >
          <el-row class="table-label">
            <el-col
             :span="14"
             class="ingredient-name"
            >
              食材名
            </el-col>
            <el-col :span="8">
              分量
            </el-col>
            <el-col :span="2">
            </el-col>
          </el-row>
          <el-row
            v-for="(ingredient, index) in ingredientData"
            :key="index"
            class="ingredient"
          >
            <el-col
              :span="14"
              class="ingredient-name"
            >
              <el-input
                v-model="ingredientData[index].name"
                :maxlength="20"
                :show-word-limit="true"
              />
            </el-col>
            <el-col :span="8">
              <el-input
                v-model="ingredientData[index].amount"
                :maxlength="20"
                :show-word-limit="true"
              />
            </el-col>
            <el-col
              :span="2"
              class="ingredient-delete-section"
            >
              <span
                v-if="ingredientData.length >= 2"
                class="ingredient-delete-button"
                @click="deleteIngredient(index)"
              >
                <font-awesome-icon
                  :icon="['far', 'times-circle']"
                />
              </span>
            </el-col>
            <span
              v-if="ingredientData[index].showErrorMessage"
              class="ingredient-error-message"
            >
              食材名と分量を入力してください。
            </span>
          </el-row>
          <el-button
            @click="addIngredient"
          >
            食材を追加する
          </el-button>
        </el-form-item>
        <el-form-item
          label="作り方"
        >
          <el-row class="table-label">
            <el-col
             :span="1"
             class="ingredient-name"
            >
            </el-col>
            <el-col :span="21">
              手順
            </el-col>
            <el-col :span="2">
            </el-col>
          </el-row>
          <el-row
            v-for="(ingredient, index) in procedureData"
            :key="index"
            class="procedure"
          >
            <el-col
              :span="1"
              class="procedure-index"
            >
              {{ index + 1 }}
            </el-col>
            <el-col
              :span="21"
              class="procedure-description"
            >
              <el-input
                v-model="procedureData[index].description"
                type="textarea"
                :maxlength="100"
                :show-word-limit="true"
              />
              <span
                v-if="procedureData[index].showErrorMessage"
                class="procedure-error-message"
              >
              手順を入力してください。
            </span>
            </el-col>
            <el-col
              :span="2"
              class="ingredient-delete-section"
            >
              <span
                v-if="procedureData.length >= 2"
                class="ingredient-delete-button"
                @click="deleteProcedure(index)"
              >
                <font-awesome-icon
                  :icon="['far', 'times-circle']"
                />
              </span>
            </el-col>
            <div class="procedure-upload-wrapper">
              <div class="procedure-upload-cover">
                <label class="procedure-upload">
                  <span>画像を登録</span>
                  <input
                    type="file"
                    @change="(event) => { handleFile(event, index) }"
                    />
                </label>
                <div
                  class="procedure-image-name-wrapper"
                  v-if="procedureData[index].file"
                >
                  <div class="procedure-image-name">
                    {{ procedureData[index].file?.name }}
                  </div>
                  <span
                    class="delete-button"
                    @click="deleteFile(index)"
                  >
                    <font-awesome-icon
                      :icon="['far', 'times-circle']"
                    />
                  </span>
                </div>
              </div>
              <div>
                <el-image
                  v-if="procedureData[index].imageDataUrl"
                  class="procedure-image"
                  :src="procedureData[index].imageDataUrl"
                  fit="cover"
                />
              </div>
            </div>
          </el-row>
          <el-button
            @click="addProcedure"
          >
            手順を追加する
          </el-button>
        </el-form-item>
        <el-form-item
          label="コツ・ポイント"
          prop="tips"
        >
          <el-input
            v-model="recipeData.tips"
            type="textarea"
            :maxlength="200"
            :show-word-limit="true"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createRecipe(formRef)">登録</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<style scoped>
/* レシピデータラッパー大 */
.recipe-data-wrapper-mdlg {
  width: 750px;
  background-color: white;
  margin: 10px auto 0 auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
/* レシピデータラッパー小 */
.recipe-data-wrapper-sm {
  width: 375px;
  background-color: white;
  margin: 10px auto 0 auto;
  padding-bottom: 10px;
  box-sizing: border-box;
}
/* ラベル */
.label {
  font-size: 14px;
  color: #606266;
  height: 30px;
  margin-bottom: 10px;
}
/* レシピ画像 */
.recipe-main-image-wrapper {
  width: 200px;
  height: 200px;
  margin-top: 10px;
}
.recipe-main-image {
  width: 200px;
  height: 200px;
}
/* レシピデータ大 */
.recipe-data-mdlg {
  width: 500px;
  margin: 0 auto;
  padding-top: 10px;
}
/* レシピデータ小 */
.recipe-data-sm {
  width: 375px;
  padding: 10px;
  box-sizing: border-box;
}
/* 画像アップローダー */
.upload-wrapper {
  margin: 10px 0;
}
.upload {
  background-color: #409eff;
  color: white;
  font-size: 14px;
  display: block;
  width: 140px;
  height: 25px;
  text-align: center;
  padding-top: 3px;
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
.upload-tips {
  font-size: 12px;
  color: #606266;
}
/* アップロードされた画像の名前 */
.image-name-wrapper {
  height: 27px;
}
.image-name-wrapper::after {
  content: "";
  display: block;
  clear: both;
}
.image-name {
  font-size: 14px;
  font-weight: bold;
  text-decoration: underline;
  width: 200px;
  margin-top: 3px;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.delete-button {
  font-size: 20px;
  color: #F56C6C;
  cursor: pointer;
}
.delete-button:hover {
  opacity: 0.8;
}
/* 量 */
.amount {
  width: 200px;
  margin-right: 10px;
}
/* メイン食材 */
.main-ingredient-selector:first-child {
  margin-bottom: 3px;
}
.main-ingredient-selector {
  display: block;
}
/* カテゴリー */
.category-selector {
  display: block;
}
/* 食材 */
.table-label {
  color: #606266;
}
.ingredient {
  color: #606266;
  margin-bottom: 12px;
  position: relative;
}
.ingredient-has-error {
  margin-bottom: 10px;
  position: relative;
}
.ingredient-name {
  padding-right: 5px;
}
.ingredient-delete-section {
  text-align: center;
  padding-top: 2px;
  box-sizing: border-box;
}
.ingredient-delete-button {
  font-size: 25px;
  color: #F56C6C;
  cursor: pointer;
}
.ingredient-error-message {
  font-size: 12px;
  color: #F56C6C;
  position: absolute;
  top: 30px;
}
.ingredient-delete-button:hover {
  opacity: 0.8;
}
/* 作り方 */
.procedure {
  color: #606266;
  margin-bottom: 10px;
}
.procedure-index {
  font-size: 16px;
}
.procedure-description {
  position: relative;
}
.procedure-error-message {
  font-size: 12px;
  color: #F56C6C;
  position: absolute;
  bottom: -29px;
  left: 0px;
}
.procedure-upload-wrapper {
  margin-top: 17px;
  width: 100%;
  padding-left: 21px;
}
.procedure-upload-cover {
  width: 180px;
  float: left;
}
.procedure-upload {
  background-color: #409eff;
  color: white;
  font-size: 14px;
  width: 140px;
  height: 25px;
  display: block;
  text-align: center;
  cursor: pointer;
  border-radius: 5px;
  position: relative;
}
.procedure-upload > span {
  position: absolute;
  top: -6px;
  left: 35px;
  height: 20px;
}
.procedure-upload:hover {
  opacity: 0.8;
}
.procedure-upload > input {
  display: none;
}
.procedure-image-name-wrapper {
  height: 27px;
}
.procedure-image-name-wrapper::after {
  content: "";
  display: block;
  clear: both;
}
.procedure-image-name {
  font-size: 12px;
  font-weight: bold;
  text-decoration: underline;
  width: 150px;
  height: 27px;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.procedure-image {
  width: 150px;
  height: 150px;
}
/* フォームのラベルのスタイル調整 */
.el-form-item ::v-deep(.el-form-item__label) {
  line-height: 25px;
  padding-bottom: 5px;
}
</style>
