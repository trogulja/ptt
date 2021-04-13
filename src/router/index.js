import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: {
      layout: 'auth',
    },
  },
  {
    path: '/time',
    name: 'time',
    component: () => import('@/pages/TimePage.vue'),
  },
  {
    path: '*',
    name: 'error',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      layout: 'error',
    },
  },
];

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL || '/',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    return { x: 0, y: 0 };
  },
  routes,
});

export default router;
