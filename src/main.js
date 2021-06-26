import '@babel/polyfill'
import 'mutationobserver-shim'
import { createApp } from 'vue'
import App from './App.vue'
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import helper from "./assets/js/helper";

const app = createApp(App)
app.config.globalProperties.bootstrap = require('bootstrap');
app.config.globalProperties.helper = helper;
app.mount('#app');
