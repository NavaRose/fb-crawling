import '@babel/polyfill'
import 'mutationobserver-shim'
import { createApp } from 'vue'
import App from './App.vue'
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import helper from "./assets/js/helper";
// Font awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)
const app = createApp(App)
app.config.globalProperties.bootstrap = require('bootstrap');
app.config.globalProperties.helper = helper;
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
