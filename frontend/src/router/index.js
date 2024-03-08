import { createRouter, createWebHistory } from 'vue-router'
import ProductsView from '@/views/ProductsView.vue'
import CategoryComponent from '@/views/CategoryComponent.vue'
import MyItem from '@/views/MyItemLast.vue'
import Search from '@/views/SearchVue.vue'
import CartVueNew from '@/views/CartVueNew.vue'
import FavoritesVue from '@/views/FavoritesVue.vue'
import store from '@/store/index.js'
import NotFound from '@/views/NotFound.vue'
// import VueCookies from 'vue-cookies'
// import { jwtDecode } from 'jwt-decode'

const routes = [
  {
    path: '/products',
    name: 'home',
    component: ProductsView,
    props: route => ({
      isIdle: route.params.isIdle,
      lastActiveDate: route.params.lastActiveDate,
      inactiveTime: route.params.inactiveTime
    })
  },
  {
    path: '/',
    name: 'NewHome',
    component: () => import('../views/HomeViewNew.vue'),
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginVue.vue')
  },
  {
    path: '/category/:category',
    name: 'category',
    component: CategoryComponent,
    props: true,
    beforeEnter: async (to, from, next) => {
      try {
        await store.dispatch('getProducts')
        await store.dispatch('getProfile')
        next()
      } catch (error) {
        // console.log('error', error)
      }
    }
  },
  {
    path: '/search',
    name: 'search',
    component: Search,
    props: () => ({
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites,
      searchResults: store.state.searchResults
    })
  },
  {
    path: '/cart',
    name: 'ItemsInCart',
    component: CartVueNew,
    props: () => ({
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites
    })
  },
  {
    path: '/favorites',
    name: 'ItemsInFavorites',
    component: FavoritesVue,
    props: () => ({
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites
    })
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
    })
  },
  {
    path: '/item/:itemId',
    name: 'Item',
    component: MyItem,
    props: route => ({
      itemId: route.params.itemId,
      cart: store.state.cart,
      profile: store.state.profile,
      favorites: store.state.favorites,
      user: store.state.user
    })
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
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
//   if (to.matched.some(record => record.meta.requiresProfile)) {
//     try {
//       await store.dispatch('getProfile')
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
// router.beforeEach(async (to, from, next) => {
//   const accessToken = VueCookies.get('access_token')
//   if (accessToken) {
//     const user = jwtDecode(accessToken).user
//     const user_id = jwtDecode(accessToken).user_id
//     store.commit('UPDATE_USER', user)
//     store.commit('UPDATE_USER_ID', user_id)
//   } else {
//     router.push('/login')
//   }
//   next()
// })
export default router
