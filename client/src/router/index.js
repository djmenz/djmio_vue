import Vue from 'vue';
import VueRouter from 'vue-router';
import Djm from '../views/Djm.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/graphs',
    name: 'Graphs',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Graphs.vue'),
  },
  {
    path: '/',
    name: 'Djm',
    component: Djm,
  },
  {
    path: '/summary',
    name: 'Summary',
    component: () => import(/* webpackChunkName: "about" */ '../views/Summary.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
