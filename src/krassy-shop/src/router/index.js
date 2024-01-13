import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store/index.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginVue.vue')
  },
  {
    path: '/cart',
    name: 'ItemsInCart',
    component: () => import('../views/CartVueNew.vue'),
    props: () => ({ cart: store.state.cart })
  },
  {
    path: '/item/:itemId',
    name: 'item',
    component: () => import('../views/MyItemNew.vue'),
    props: route => ({ itemId: route.params.itemId, cart: store.state.cart })
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUp.vue')
  }
  // {
  //   path: '/item/:itemId',
  //   name: 'Item',
  //   component: () => import('../views/MyItem.vue'),
  //   props: route => ({ itemId: route.params.itemId, cart: store.state.cart })
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
