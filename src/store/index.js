import Vue from 'vue'
import Vuex from 'vuex'
import { JSEncrypt } from 'jsencrypt'

Vue.use(Vuex)
let base64 = require('js-base64').Base64;
let jsencrypt = new JSEncrypt();

export default new Vuex.Store({
  state: {
    base64,
    userinfo: {
      id: -1,
      name: "",
      account: "",
      iconUrl: "",
    },
    isLogin: false,
    jsencrypt,
  },
  mutations: {
    login(state, value) {
      state.isLogin = true;
      state.userinfo = value.userinfo;
    },
    logout(state) {
      state.isLogin = false;
    },
    setPublicKey(state, value) {
      state.jsencrypt.setPublicKey(value.public_key);
    }
  },
  actions: {
  },
  modules: {
  },
})
