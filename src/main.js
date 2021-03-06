import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'

Vue.prototype.$axios = axios.create({
  baseURL: 'http://101.133.161.59:80/api',
  //baseURL: 'http://localhost:8090/api',
  withCredentials: true,
  headers: {
    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    'Content-Type': 'application/json;charset=utf-8'
  }
});

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  BootstrapVue,
  render: h => h(App)
}).$mount('#app')