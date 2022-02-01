import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Recipes from '../views/Recipes.vue';
import CurrentUser from '../views/CurrentUser.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';

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
    path: '/sign-up',
    name: 'Signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
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
  // ルーティング先の認証の必須有無を取得
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // 認証が不要なページにアクセスする場合
  if (!requiresAuth) {
    next();
    return;
  }

  // ログイン済みの場合
  if (isLogin.value) {
    // 認証情報が期限切れの場合
    if (isExpired.value) {
      authData.value.uid = '';
      authData.value.accessToken = '';
      authData.value.client = '';
      authData.value.expirationDateTime = '';
      next({ name: 'Login', query: { redirect: to.fullPath } });
    // 認証情報が期限内の場合
    } else {
      next();
    }
  // 未ログインの場合
  } else {
    next({ name: 'Login', query: { redirect: to.fullPath } });
  }

});

export default router
