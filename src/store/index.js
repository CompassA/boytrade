import Vue from 'vue'
import Vuex from 'vuex'
import { JSEncrypt } from 'jsencrypt'

Vue.use(Vuex)
let base64 = require('js-base64').Base64;
let jsencrypt = new JSEncrypt();

export default new Vuex.Store({
  state: {
    base64,
    sellerOrderButtionStatus: 1,
    buyerOrderButtionStatus: 1,
    userinfo: {
      userId: -1,
      name: "",
      account: "",
      iconUrl: "",
    },
    isLogin: false,
    productList: [],
    currentOrder: null,
    productDetail: {
      productVO: null,
      userVO: null,
    },
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
      state.productDetail = {
        productVO: null,
        userVO: null,
      };
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
    updateProductList(state, value) {
      state.productList = value;
    },
    updateProductDetail(state, value) {
      state.productDetail.productVO = value.productVO;
      state.productDetail.userVO = value.userVO;
    },
    updateOrderList(state, value) {
      state.orderList = value;
    },
    updateSellerOrderList(state, value) {
      state.sellerOrderList = value;
    },
    updateBuyerButtonStatus(state, value) {
      state.buyerOrderButtionStatus = value;
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
    }
  },
  actions: {
  },
  modules: {
  },
})
