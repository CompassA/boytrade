import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userinfo: {
      id: -1,
      name: "",
      account: "",
      iconUrl: "",
    },
    isLogin: false,
  },
  mutations: {
    login(state, value) {
      state.isLogin = true;
      state.userinfo = value.userinfo;
    },
    logout(state) {
      state.isLogin = false;
    }
  },
  actions: {
  },
  modules: {
  },
})
