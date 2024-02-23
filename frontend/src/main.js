import { createApp } from 'vue'
import axios from 'axios'
import { emitter } from './emitter'
import store from '@/store/index.js'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import errorHandlingMixin from './errorHandlingMixin'
import $ from 'jquery'
window.$ = window.jQuery = $
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faStar,
  faPhone,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons'

library.add(faStar, faPhone, faChevronDown)
axios.defaults.baseURL =
  process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000'
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
            store.dispatch(
              'setErrorMessage',
              'Session has expired. Please log in.'
            )
            store.dispatch('logout')
            throw new Error('Token Expired')
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
app.config.globalProperties.emitter = emitter

// Listen for the session expired pop-up event
// emitter.on('sessionExpiredPopup', () => {
//   console.log('sessionExpiredPopup event received')
//   alert('Your session has expired. Please log in again.')
// })
app
  .use(router)
  .use(store)
  .use(VueCookies)
  .use(BootstrapVue3)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
