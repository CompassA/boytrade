<template>
  <div>
    <div v-if="productDetails === null">
      <b-spinner class="m-5" label="Busy"></b-spinner>
    </div>
    <div v-else class="detail">
      <div id="productImg">
        <div>
          <div style="float: none;">
            <img
              style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5), 0 6px 20px 0 rgba(0, 0, 0, 0.27); border-radius: 30px;"
              v-bind:src="productDetails.iconUrl"
              width="400px"
              height="400px"
            />  
          </div>
          <div>
            <b-button variant="light" @click="goBack()">&lt;返回商品列表</b-button>
          </div>
        </div>
      </div>
      <div id="content">
        <div style="margin: 50px 10px 10px 10px;">
          <p style="font-size: 30px; text-align: center;">
            <b>{{productDetails.productName}}</b>
          </p>
          <p style="font-size: 14px; text-align: center;">
            <b>卖家</b>: {{sellerVO.name}} | <b>描述</b>: {{productDetails.description}}
          </p>
          <p style="font-size: 15px; margin-left: 25px; margin-right: 20px;">
            <b>价格</b>：
            <b style="color: red; font-size: 30px;">{{productDetails.price}}</b>
            <b>元</b>  |  

            <b>销量</b>：{{productDetails.sales}} <b>件</b>  |  

            <b>已付款:</b>  {{productDetails.paidNum}} <b>件</b>
          </p>
          <div style="height: 20px; margin-left: 15px; font-size: 15px;">
            <b>数量</b>:
            <input
              style="margin-right: 20px;"
              type="number"
              id="txtStock"
              v-bind:max="productDetails.stock"
              min="0"
              maxlength="6"
              onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
              oninput="if(value.length>6)value=value.slice(0,6)"
              v-model="amount"
            />
            <b>库存</b>:
            <b>{{productDetails.stock}}</b>
          </div>
          <div v-if="productDetails.payStatus !== 0">
            <b style="color: red;">商品已售罄</b>
          </div>
        </div>
        <div style="float: none; margin-left: 10%;">
          <b-button class="my_button" :disabled="productDetails.payStatus !== 0 ? true : false" pill @click="buyAtOnce()">立即下单</b-button>
          <b-button class="my_button" :disabled="productDetails.payStatus !== 0 ? true : false" pill @click="addToCart()">加入购物车</b-button>
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
      productDetails: null,
      sellerVO: null,
      amount: 0,
    }
  },
  computed: {
    currentUserInfo: function() {
      return this.$parent.$store.state.userinfo;
    },
    token: function() {
      return window.localStorage["token"];
    },
    defaultAddress: function() {
      return this.$store.state.defaultAddress;
    },
    userId: function() {
      return window.localStorage["boytrade:userId"];
    },
  },
  async created() {
    await this.$axios.get("/product/detail", {
      params: {
        productId: this.$route.params.id,
      }
    }).then(response => {
      if (response.data.status === "success") {
        this.productDetails = response.data.body;
      }
    }).catch(response => {
      alert(response);
    });

    this.$axios.get("/user/part_info", {
      params: {
        userId: this.productDetails.userId,
      }
    }).then(response => {
      if (response.data.status === "success") {
        this.sellerVO = response.data.body;
      }
    }).catch(response => {
      alert(response);
    });
    if (this.userId == -1 || this.userId === undefined) {
      return;
    }
    if (this.defaultAddress === null) {
      this.$axios.get("/address/default", {
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateDefaultAddress", response.data.body);
        } else {
          if (confirm("您尚未设置收货地址,是否立即去设置?")) {
            this.$router.push("/about/info_editor");
          }
        }
      }).catch(response => {
        alert(response);
      })
    }
  },
  methods: {
    goBack() {
      this.$parent.$router.go(-1);
    },
    buyAtOnce() {
      if (this.userId === undefined || this.userId == -1) {
        alert("请登录");
        return;
      }
      if (this.defaultAddress === null) {
        this.$Toast.top("tp");
        alert("地址信息缺失");
        return;
      }
      if (this.amount > this.productDetails.stock || this.amount < 1) {
        alert("数量不合法！");
        return;
      }
      if (this.productDetails.userId === this.currentUserInfo.userId) {
        alert("您不能购买自己发布的商品！");
        return;
      }
      if (!confirm("您确定要下单吗?")) {
        return;
      }
      const orderDetail = new Array();
      orderDetail.push({
        "ownerId": this.productDetails.userId,
        "productId": this.productDetails.productId,
        "productName": this.productDetails.productName,
        "productAmount": this.amount,
        "productPrice": this.productDetails.price,
        "iconUrl": this.productDetails.iconUrl,
      });
      const orderDTO = {
        "userId": this.currentUserInfo.userId,
        "userName": this.defaultAddress.userName,
        "userPhone": this.defaultAddress.userPhone,
        "userAddress": this.defaultAddress.userAddress,
        "productDetails": orderDetail,
      };
      const key = utils.randomKey();
      const encryptData = utils.encrypt(JSON.stringify(orderDTO), key);
      const serverRequst = {
        key: this.$store.state.jsencrypt.encrypt(key),
        encryptData: encryptData
      };
      this.$axios.post("/order/create", serverRequst, {
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          alert("下单成功!");
          this.$store.commit("updateCurrentOrder", response.data.body);
          this.$router.push('/currentOrder');
        } else {
          alert(response.data.body.message + "\n错误码：" + response.data.body.errorCode);
        }
      })
      .catch(response => {
        alert(response);
      });
    },
    addToCart() {
      if (this.userId === undefined || this.userId == -1) {
        alert("请登录");
        return;
      }
      if (this.amount > this.productDetails.stock || this.amount < 1) {
        alert("数量不合法！");
        return;
      }
      if (this.productDetails.userId === this.currentUserInfo.userId) {
        alert("您不能购买自己发布的商品！");
        return;
      }
      const cartDTO = {
        userId: this.userId,
        productId: this.productDetails.productId,
        num: this.amount,
      };
      this.$axios.post("/cart/add", cartDTO, {
        params: {
          token: this.token,
          userId: this.userId,
        }
      }).then(response => {
        if (response.data.status === "success") {
          alert("添加成功!");
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
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
  height: auto;
  float: left;
}

.my_button {
  border-radius: 8px;
  background-color: orangered;
  border: 2px solid orangered;
  margin: 1% 1% 1% 1%;
}
</style>