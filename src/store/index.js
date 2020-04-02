import Vue from 'vue'
import Vuex from 'vuex'
import { JSEncrypt } from 'jsencrypt'

Vue.use(Vuex)
let base64 = require('js-base64').Base64;
let jsencrypt = new JSEncrypt();

export default new Vuex.Store({
  state: {
    base64,
    buyerButtonStatus: 1,
    sellerOrderButtionStatus: 1,
    userinfo: {
      userId: -1,
      name: "",
      account: "",
      iconUrl: "",
    },
    isLogin: false,
    currentOrder: null,
    orderList: [],
    sellerOrderList: [],
    addressInfoList: [],
    jsencrypt,
    defaultAddress: null,
  },
  mutations: {
    login(state, value) {
      state.isLogin = true;
      state.userinfo = value.userinfo;
    },
    logout(state) {
      state.isLogin = false;
      state.userinfo = {
        userId: -1,
        name: "",
        account: "",
        iconUrl: "",
      };
      state.productList = [];
      state.currentOrder = null;
      state.orderList = [];
      state.defaultAddress = null;
      state.sellerOrderButtionStatus = 1;
      state.buyerOrderButtionStatus = 1;
      state.addressInfoList = [];
      state.sellerOrderList = [];
    },
    setPublicKey(state, value) {
      state.jsencrypt.setPublicKey(value.public_key);
    },
    updateOrderList(state, value) {
      state.buyerButtonStatus = value.selectButtonStatus;
      state.orderList = value.orderList;
    },
    updateSellerOrderList(state, value) {
      state.sellerOrderList = value;
    },
    updateSellerButtonStatus(state, value) {
      state.sellerOrderButtionStatus = value;
    },
    updateAddressInfoList(state, value) {
      state.addressInfoList = value;
    },
    updateDefaultAddress(state, value) {
      state.defaultAddress = value;     
    },
    updateCurrentOrder(state, value) {
      state.currentOrder = value;
    },
  },
  actions: {
  },
  modules: {
  },
})
