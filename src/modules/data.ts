import { reactive } from 'vue';
import { RecipeCardData } from '@/modules/types';

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
  '卵料理',
  'ごはんもの',
  'サラダ',
  '肉料理',
  '麺類',
  '野菜料理',
  'パン',
  '鍋料理',
  '豆腐料理',
  '魚介料理',
  '飲み物',
  'パイ・キッシュ',
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

export const recipeCardDataList = reactive<Array<RecipeCardData>>([
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
  {
    imageUrl: '鶏胸肉と小松菜の味噌マヨ炒め',
    calorie: 350,
    name: '鶏胸肉と小松菜',
    userName: 'sasakurasan',
    userImageUrl: '',
    liked: false,
    likedNumber: 5,
    mainIngredient: '鶏肉',
    category: '肉料理'
  },
]);
