import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Recipes from '../views/Recipes.vue';
import CurrentUser from '../views/CurrentUser/CurrentUser.vue';
import CurrentUserEdit from '../views/CurrentUser/CurrentUserEdit.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import User from '../views/User.vue';
import Users from '../views/Users.vue';
import PostRecipe from '../views/Recipe/PostRecipe.vue';
import Recipe from '../views/Recipe/Recipe.vue';
import FoodLog from '../views/FoodLog.vue';
import FoodDiary from '../views/FoodDiary.vue';
import Csv from '../views/Csv.vue';

import { authData, isLogin, isExpired } from '@/modules/auth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: Recipes
  },
  {
    path: '/current-user',
    name: 'CurrentUser',
    component: CurrentUser,
    meta: { requiresAuth: true },
  },
  {
    path: '/current-user/edit',
    name: 'CurrentUserEdit',
    component: CurrentUserEdit,
    meta: { requiresAuth: true },
  },
  {
    path: '/sign-up',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/user/:id',
    name: 'User',
    component: User
  },
  {
    path: '/followings/:id',
    name: 'Followings',
    component: Users,
    meta: { status: 'followings' },
  },
  {
    path: '/followers/:id',
    name: 'Followers',
    component: Users,
    meta: { status: 'followers' },
  },
  {
    path: '/recipe/:id',
    name: 'Recipe',
    component: Recipe,
  },
  {
    path: '/recipe/post',
    name: 'PostRecipe',
    component: PostRecipe,
    meta: { requiresAuth: true },
  },
  {
    path: '/recipe/edit/:id',
    name: 'EditRecipe',
    component: PostRecipe,
    meta: { requiresAuth: true },
  },
  {
    path: '/food-log',
    name: 'FoodLog',
    component: FoodLog,
    meta: { requiresAuth: true },
  },
  {
    path: '/food-diary',
    name: 'FoodDiary',
    component: FoodDiary,
    meta: { requiresAuth: true },
  },
  {
    path: '/csv',
    name: 'Csv',
    component: Csv,
    meta: { requiresAuth: true },
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  // ??????????????????????????????????????????????????????
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // ??????????????????????????????????????????????????????
  if (!requiresAuth) {
    next();
    return;
  }

  // ???????????????????????????
  if (isLogin.value) {
    // ????????????????????????????????????
    if (isExpired.value) {
      authData.value.userId = null;
      authData.value.uid = '';
      authData.value.accessToken = '';
      authData.value.client = '';
      authData.value.expiry = '';
      next({ name: 'Login', query: { redirect: to.fullPath } });
    // ?????????????????????????????????
    } else {
      next();
    }
  // ????????????????????????
  } else {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  }

});

export default router
