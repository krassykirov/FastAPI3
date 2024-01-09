import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
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

import router from './router'

const app = createApp(App)

app
  .use(router)
  .use(VueCookies)
  .use(BootstrapVue3)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
