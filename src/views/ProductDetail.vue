<template>
  <div>
    <div class="detail">
      <div id="productImg">
        <div>
          <img
            style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);"
            v-bind:src="productDetail.productVO.iconUrl"
            width="400px"
            height="400px"
          />
        </div>
        <div style="border:2px; width: 400px; height: auto">
          <p style="font-size: 18px;">商家描述：{{productDetail.productVO.description}}</p>
          <p>发布者: {{productDetail.userVO.name}}</p>
          <p>注册时间：{{productDetail.userVO.createTime}}</p>
        </div>
      </div>
      <div id="content">
        <div style="margin: 50px 10px 10px 10px;">
          <p style="font-size: 30px; text-align: center;">
            <b>商品名： {{productDetail.productVO.productName}}</b>
          </p>
          <p style="font-size: 13px; margin-left: 25px; margin-right: 20px;">
            价格：
            <b style="color: red; font-size: 30px;">{{productDetail.productVO.price}}</b>
            元
            销量：{{productDetail.productVO.sales}}件
          </p>
          <div style="height: 20px; margin-left: 15px; font-size: 15px;">
            数量
            <input
              style="margin-right: 20px;"
              type="number"
              id="txtStock"
              v-bind:max="productDetail.productVO.stock"
              min="0"
              maxlength="6"
              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              oninput="if(value.length>6)value=value.slice(0,6)"
              v-model="amount"
            />
            库存：
            <b>{{productDetail.productVO.stock}}</b>
          </div>
          <div>
            <b-button variant="dark" @click="buyAtOnce()">立即购买</b-button>
            <b-button variant="dark">加入购物车</b-button>
            <b-button variant="light" @click="goBack()">&lt;返回商品列表</b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "../js/utils.js";

export default {
  data() {
    return {
      amount: 0
    };
  },
  computed: {
    productDetail: function() {
      return this.$parent.$store.state.productDetail;
    },
  },
  methods: {
    goBack() {
      this.$parent.$router.go(-1);
    },
    buyAtOnce() {
      if (this.amount > this.productDetail.productVO.stock || this.amount < 1) {
        alert("数量不合法");
        return;
      }
      const orderDetail = new Array();
      orderDetail.push({
        "productId": this.productDetail.productVO.productId,
        "productName": this.productDetail.productVO.productName,
        "productAmount": this.amount,
        "productPrice": this.productDetail.productVO.price,
        "iconUrl": this.productDetail.productVO.iconUrl,
      });
      const orderDTO = {
        "userId": this.productDetail.userVO.userId,
        "userName": this.productDetail.userVO.name,
        "userPhone": "",
        "userAddress": "",
        "productDetails": orderDetail,
      };
      const key = utils.randomKey();
      const encryptData = utils.encrypt(JSON.stringify(orderDTO), key);
      const serverRequst = {
        key: this.$store.state.jsencrypt.encrypt(key),
        encryptData: encryptData
      };
      this.$axios.post("/order/create", serverRequst).then(response => {
        if (response.data.status === "success") {
          alert("下单成功");
          this.$store.state.currentOrder = response.data.body;
          this.$router.push('/currentOrder');
        } else {
          alert(response.data.body.message + "\n错误码：" + response.data.body.errorCode);
        }
      })
      .catch(response => {
        alert(response);
      });
    }
  }
};
</script>

<style lang="scss">
.detail {
  margin: 10px;
}

.detail div {
  margin: 10px 20px 20px 10px;
  padding: 10px 10px 10px 10px;
  text-align: left;
  width: 400px;
  height: 400px;
  float: left;
}
</style>