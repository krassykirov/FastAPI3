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
      const hasRefreshToken = store.state.refreshToken !== null

      // Check if the access token is expired
      if (
        store.state.accessTokenExpiration &&
        store.state.accessTokenExpiration < Date.now()
      ) {
        console.log('Access token has expired. Logging out...')
        store.dispatch('logout')
        return Promise.reject(new Error('Token Expired'))
      }

      if (hasRefreshToken && !isRefreshing) {
        isRefreshing = true

        try {
          const newAccessToken = await store.dispatch('refreshAccessToken')
          store.commit('setAccessToken', {
            accessToken: newAccessToken,
            refreshToken: store.state.refreshToken
          })
          error.config.headers.Authorization = `Bearer ${newAccessToken}`
          return axios.request(error.config)
        } catch (refreshError) {
          console.error('Error refreshing token', refreshError)
          store.dispatch(
            'setErrorMessage',
            'Session has expired. Please log in.'
          )
          store.dispatch('logout')
          return Promise.reject(refreshError) // Reject the promise with the original error
        } finally {
          isRefreshing = false
        }
      } else {
        console.log('No refresh token available. Redirecting to login page.')
        store.dispatch('setErrorMessage', 'Session has expired. Please log in.')
        store.dispatch('logout')
        console.log('Redirected to login page.')
        return Promise.reject(error) // Reject the promise with the original error
      }
    }

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
