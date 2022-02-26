import { reactive } from 'vue';
import { GetRecipesResponseRecipes } from '@/api'

// メイン食材
export const ingredients = [
  {
    ingredientCategory: 'お肉のおかず',
    items: [
      '豚肉',
      '鶏肉',
      '牛肉',
      'ひき肉',
      '加工肉'
    ]
  },
  {
    ingredientCategory: '野菜のおかず',
    items: [
      '葉物野菜',
      '根菜',
      '果菜',
      'きのこ',
      '豆類',
      'その他'
    ]
  },
  {
    ingredientCategory: '魚介のおかず',
    items: [
      '鮭',
      'サバ',
      'イワシ',
      'ブリ',
      'マグロ',
      'えび',
      'アジ',
      'イカ',
      'タコ',
      'いくら',
      'たらこ',
      '明太子',
      '貝類',
      'ツナ缶',
      'サバ缶',
      'しらす',
      'はんぺん',
      'その他魚介',
    ]
  },
  {
    ingredientCategory: 'その他',
    items: [
      '海藻',
      'チーズ',
      '豆腐',
      'こんにゃく',
    ]
  },
];

// カテゴリー
export const categories = [
  'お菓子',
  'スープ・汁物・シチュー',
  'カレー',
  '卵料理',
  'ごはんもの',
  'サラダ',
  '肉料理',
  '麺類',
  '炒め物',
  '煮物',
  '揚げ物',
  '野菜料理',
  'パン',
  '鍋料理',
  '豆腐料理',
  '魚介料理',
  '飲み物',
  'パイ・キッシュ',
  'パスタ',
  'グラタン・ドリア・ラザニア',
  '餃子・焼売・春巻き',
  '漬物',
  'コロッケ',
  '粉物',
  '天ぷら・かき揚げ',
  '調味料',
  '餅',
  '中華まん',
];

export const ingredientsForForm = {
  'お肉のおかず': [
    '豚肉',
    '鶏肉',
    '牛肉',
    'ひき肉',
    '加工肉'
  ],
  '野菜のおかず': [
    '葉物野菜',
    '根菜',
    '果菜',
    'きのこ',
    '豆類',
    'その他'
  ],
  '魚介のおかず': [
    '鮭',
    'サバ',
    'イワシ',
    'ブリ',
    'マグロ',
    'えび',
    'アジ',
    'イカ',
    'タコ',
    'いくら',
    'たらこ',
    '明太子',
    '貝類',
    'ツナ缶',
    'サバ缶',
    'しらす',
    'はんぺん',
    'その他魚介',
  ],
  'その他': [
    '海藻',
    'チーズ',
    '豆腐',
    'こんにゃく',
  ]
};

// レシピ情報の配列
export const recipeDataList = reactive<Array<GetRecipesResponseRecipes>>([
  {
    id: 0,
    title: '',
    calorie: 0,
    main_ingredient: '',
    category: '',
    image_url: '',
    is_favorited: false,
    favorited_count: 0,
    user: {
      id: 0,
      name: '',
      image_url: ''
    }
  },
]);

// ユーザーが作成したレシピ情報の配列
export const usersRecipeDataList = reactive<Array<GetRecipesResponseRecipes>>([
  {
    id: 0,
    title: '',
    calorie: 0,
    main_ingredient: '',
    category: '',
    image_url: '',
    is_favorited: false,
    favorited_count: 0,
    user: {
      id: 0,
      name: '',
      image_url: ''
    }
  },
]);

// ユーザーがお気に入りに登録したレシピ情報の配列
export const favoritedRecipeDataList = reactive<Array<GetRecipesResponseRecipes>>([
  {
    id: 0,
    title: '',
    calorie: 0,
    main_ingredient: '',
    category: '',
    image_url: '',
    is_favorited: false,
    favorited_count: 0,
    user: {
      id: 0,
      name: '',
      image_url: ''
    }
  },
]);

// フォロー中のユーザーが作成したレシピ情報の配列
export const followingRecipeDataList = reactive<Array<GetRecipesResponseRecipes>>([]);

// 直近1週間で最も多くお気に入りに登録されたレシピ情報の配列
export const recipeRankingList = reactive<Array<GetRecipesResponseRecipes>>([
  {
    id: 0,
    title: '',
    calorie: 0,
    main_ingredient: '',
    category: '',
    image_url: '',
    is_favorited: false,
    favorited_count: 0,
    user: {
      id: 0,
      name: '',
      image_url: ''
    }
  },
]);
