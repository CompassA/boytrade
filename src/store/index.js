import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    isLogin: false,
  },
  mutations: {
    login(state, value) {
      state.isLogin = true
      state.username = value.username
    },
    logout(state) {
      state.isLogin = false
    }
  },
  actions: {
  },
  modules: {
  }
})
