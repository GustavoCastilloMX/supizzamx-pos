import Vue from 'vue';
import VueRouter from 'vue-router';
import { ifAuthenticated } from '../libs/Auth';
import Home from '../views/Home.vue';

//Vistas
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    // component: () =>
    //   import(/* webpackChunkName: "inicio" */ '../views/Home.vue'),
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
  {
    path: '/pedidos-app',
    name: 'PedidosApp',
    component: () =>
      import(/* webpackChunkName: "pedidosApp" */ '../views/PedidosApp.vue'),
    beforeEnter: ifAuthenticated,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
