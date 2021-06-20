import '@babel/polyfill'
import 'mutationobserver-shim'
import { createApp } from 'vue'
import App from './App.vue'
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
const bootstrap = require('bootstrap')


const app = createApp(App)
app.config.globalProperties.bootstrap = bootstrap
app.mount('#app');
