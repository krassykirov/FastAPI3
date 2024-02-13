import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import store from '@/store/index.js'
// import { jwtDecode } from 'jwt-decode'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    props: route => ({
      isIdle: route.params.isIdle,
      lastActiveDate: route.params.lastActiveDate,
      inactiveTime: route.params.inactiveTime
    }),
    beforeEnter: async (to, from, next) => {
      try {
        await store.dispatch('getProducts')
        await store.dispatch('getProfile')
        next()
      } catch (error) {
        console.log('error', error)
      }
    }
    // meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginVue.vue')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/SearchVue.vue'),
    props: () => ({
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites,
      searchResults: store.state.searchResults
    }),
    beforeEnter: async (to, from, next) => {
      try {
        await store.dispatch('getProfile')
        next()
      } catch (error) {
        console.log('error', error)
      }
    }
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
    beforeEnter: async (to, from, next) => {
      try {
        await store.dispatch('getProfile')
        next()
      } catch (error) {
        console.log('error', error)
      }
    }
    // meta: { requiresAuth: true }
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
    beforeEnter: async (to, from, next) => {
      try {
        await store.dispatch('getProfile')
        next()
      } catch (error) {
        console.log('error', error)
      }
    }
    // meta: { requiresAuth: true }
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
    props: () => ({
      cart: store.state.cart,
      favorites: store.state.favorites,
      profile: store.state.profile
    }),
    beforeEnter: async (to, from, next) => {
      try {
        await store.dispatch('getProfile')
        next()
      } catch (error) {
        console.log('error', error)
      }
    }
    // meta: { requiresAuth: true }
  },
  {
    path: '/item/:itemId',
    name: 'Item',
    component: () => import('../views/MyItemLast.vue'),
    props: route => ({
      itemId: route.params.itemId,
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites,
      user: store.state.user
    }),
    meta: { requiresAuth: true },
    beforeEnter: async (to, from, next) => {
      try {
        const itemId = Number(to.params.itemId)
        await store.dispatch('getProduct', itemId)
        await store.dispatch('getProfile')
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
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// router.beforeEach(async (to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     try {
//       await store.dispatch('initializeUser')
//       if (!store.state.accessToken) {
//         throw new Error('Token Expired')
//       }
//     } catch (error) {
//       next('/login')
//       throw new Error('Token Expired')
//     }
//   }
//   next()
// })
export default router
