import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'

Vue.prototype.$axios = axios.create({
  baseURL: 'http://localhost:8090/',
  withCredentials: true,
  headers: {
    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    'Content-Type': 'application/json;charset=utf-8'
  },
  // transformRequest: [function (data) {
  //   let newData = '';
  //   for (let k in data) {
  //     if (data.hasOwnProperty(k) === true) {
  //       newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
  //     }
  //   }
  //   return newData;
  // }]
});

Vue.config.productionTip = false;
Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  BootstrapVue,
  render: h => h(App)
}).$mount('#app')