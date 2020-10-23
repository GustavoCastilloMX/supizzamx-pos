import Vue from 'vue';
import VueRouter from 'vue-router';
import { ifAuthenticated } from '../libs/Auth';

//Vistas
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: ifAuthenticated,
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "inicio" */ '../views/Login.vue'),
  },
  {
    path: '/pedidos',
    name: 'Pedidos',
    component: () =>
      import(/* webpackChunkName: "pedidos" */ '../views/Pedidos.vue'),
    beforeEnter: ifAuthenticated,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
