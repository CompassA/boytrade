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
    orderList: [
      {
        "orderId": "2019010100010102",
        "userId": "3",
        "userName": "番茄",
        "userPhone": "15623451234",
        "userAddress": "南京市浦口区江浦街道",
        "payStatus": "0",
        "orderAmount": "234.53",
        "orderDetails": [
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          },
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          },
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          },
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          }
        ],
        "createTime": "2019/10/31 12:23:12",
      },
      {
        "orderId": "2019010100010102",
        "userId": "3",
        "userName": "番茄",
        "userPhone": "15623451234",
        "userAddress": "南京市浦口区江浦街道",
        "payStatus": "0",
        "orderAmount": "",
        "orderDetails": [
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          },
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          },
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          },
          {
            productName: "小番茄",
            productAmount: 1,
            productPrice: 12.0,
            iconUrl:
              "http://47.103.146.40:8888/image/3/3a97ef4fb-3273-455c-897c-57fc9485211a.jpg"
          }
        ],
        "createTime": "",
      },
      
    ],
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
    }
  },
  actions: {
  },
  modules: {
  },
})
