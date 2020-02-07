<template>
  <div>
    <div class="order_model">
      <p>订单编号: {{order.orderId}}</p>
      <p>订单总金额: {{order.orderAmount}}</p>
      <p>创建时间: {{order.createTime}}</p>
      <p>买家姓名: {{order.userName}}</p>
      <p>手机号码: {{order.userPhone}}</p>
      <p>联系地址: {{order.userAddress}}</p>
      <p>订单详情：</p>
      <b-table
        style="width: 500px;"
        sticky-header
        small
        caption-top
        :items="order.orderDetails"
        :fields="fields"
      >
        <template v-slot:cell(iconUrl)="data">
          <img v-bind:src="data.item.iconUrl" style="width: 70px; height: 70px;" />
        </template>
      </b-table>
      <b-button variant="outline-dark" @click="pay(order)">立即付款</b-button>
      <b-button variant="outline-dark" @click="notPay()">暂不付款</b-button>
    </div>
  </div>
</template>

<script>
import utils from '../js/utils';

export default {
  data() {
    return {
      fields: [
        { key: "productName", label: "商品名称" },
        { key: "productAmount", label: "数量" },
        { key: "productPrice", label: "单价" },
        { key: "iconUrl", label: "图片" }
      ]
    }
  },
  computed: {
    order: function() {
      return this.$parent.$store.state.currentOrder;
    },
    token: function() {
      return window.localStorage["token"];
    }
  },
  methods: {
    pay(order) {
      const key = utils.randomKey();
      const serverRequest = {
        key: this.$store.state.jsencrypt.encrypt(key),
        encryptData: utils.encrypt(JSON.stringify(order), key),
      }
      this.$axios.post("/order/trade_pay?token=" + this.token, serverRequest).then(response => {
        if (response.data.status === "success") {
          alert("支付成功");
          this.$store.commit("updateBuyerButtonStatus", 2);
          this.$router.push("/about/order");
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    notPay() {
      this.$router.push("/goods");
    }
  }
}
</script>

<style lang="scss">
.order_model {
  margin-top: 20px;
  margin-left: 100px;
  padding: 10px 20px 10px 20px;
  text-align: left;
  width: 800px;
  font-size: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>