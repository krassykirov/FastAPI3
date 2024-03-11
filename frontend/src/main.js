import { createApp } from 'vue'
import axios from 'axios'
import store from '@/store/index.js'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import errorHandlingMixin from './errorHandlingMixin'
import $ from 'jquery'
window.$ = window.jQuery = $
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL || 'localhost:8081'
import router from './router'

let isRefreshing = false

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      if (
        error.response.data.detail === 'Username or password are incorrect!'
      ) {
        store.dispatch('setErrorMessage', 'Username or password are incorrect!')
        return
      }
      const hasRefreshToken = store.state.refreshToken !== null
      if (hasRefreshToken) {
        if (!isRefreshing) {
          isRefreshing = true
          try {
            const newAccessToken = await store.dispatch('refreshAccessToken')
            error.config.headers.Authorization = `Bearer ${newAccessToken}`
            return axios.request(error.config)
          } catch (refreshError) {
            if (refreshError.response.data.detail === 'Token has expired') {
              store.dispatch(
                'setErrorMessage',
                'Session has expired. Please log in.'
              )
              store.dispatch('logout')
              router.push({ name: 'login' })
            } else {
              throw refreshError
            }
          } finally {
            isRefreshing = false
          }
        }
      }
    }
    // Pass other errors through without handling
    return Promise.reject(error)
  }
)

axios.interceptors.request.use(
  config => {
    if (store.state.accessToken !== null) {
      config.headers.Authorization = `Bearer ${store.state.accessToken}`
      config.headers.Accept = 'application/json'
      return config
    } else {
      router.push('/login')
      return config
    }
  },
  error => {
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.mixin(errorHandlingMixin)
app.use(router).use(store).use(VueCookies).mount('#app')
