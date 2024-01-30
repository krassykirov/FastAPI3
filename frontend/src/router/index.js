import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store/index.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
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
    props: () => ({
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites
    }),
    meta: { requiresAuth: true }
  },
  {
    path: '/favorites',
    name: 'ItemsInFavorites',
    component: () => import('../views/FavoritesVue.vue'),
    props: () => ({
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites
    }),
    meta: { requiresAuth: true }
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/Profile',
    name: 'Profile',
    component: () => import('../views/ProfileVue.vue'),
    props: () => ({ cart: store.state.cart, favorites: store.state.favorites }),
    meta: { requiresAuth: true }
  },
  {
    path: '/item/:itemId',
    name: 'Item',
    component: () => import('../views/MyItemLast.vue'),
    props: route => ({
      itemId: route.params.itemId,
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites
    }),
    meta: { requiresAuth: true },
    beforeEnter: async (to, from, next) => {
      try {
        const itemId = Number(to.params.itemId)
        await store.dispatch('getProduct', itemId)
        next()
      } catch (error) {
        next({ name: 'NotFound' })
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    props: route => ({
      itemId: route.params.itemId,
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites
    })
  }
  // {
  //   path: '/not-found',
  //   name: 'NotFound',
  //   component: () => import('../views/NotFound.vue'),
  //   props: route => ({
  //     itemId: route.params.itemId,
  //     cart: store.state.cart,
  //     profile: store.state.profile,
  //     favorites: store.state.favorites
  //   })
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.accessToken) {
      next('/login')
      throw new Error('Token Expired')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
