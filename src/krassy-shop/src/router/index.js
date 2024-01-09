import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/item/:itemId',
    name: 'Item',
    component: () => import('../views/MyItem.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
