import { createApp } from 'vue'
import App from './App.vue'
import $ from 'jquery'
window.$ = window.jQuery = $
import 'bootstrap'
import 'bootstrap-vue'
// import './registerServiceWorker'
import router from './router'
// import store from './store'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { BootstrapVue } from 'bootstrap'
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

createApp(App).use(router).use(BootstrapVue3).mount('#app')
