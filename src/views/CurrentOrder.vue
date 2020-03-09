<template>
  <div>
    <div class="order_model">
      <p>订单编号: {{order.orderId}}</p>
      <p>订单总金额: <b style="color: red;">￥{{order.orderAmount}}</b></p>
      <p>创建时间: {{order.createTime}}</p>
      <p>买家姓名: {{order.userName}}</p>
      <p>手机号码: {{order.userPhone}}</p>
      <p>联系地址: {{order.userAddress}}</p>
      <p>订单详情：</p>
      <b-table
        sticky-header
        small
        caption-top
        :items="order.orderDetails"
        :fields="fields"
      >
        <template v-slot:cell(iconUrl)="data">
          <img v-bind:src="data.item.iconUrl" style="width: 70px; height: 70px;" />
        </template>
        <template v-slot:cell(sum)="data">
          <b style="color: red;">￥{{ Math.round(Math.round(data.item.productPrice * 100) * data.item.productAmount) / 100 }}</b>
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
        { key: "sum", label: "总价" },
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
    },
    userId: function() {
      return this.$parent.$store.state.userinfo.userId;
    },
  },
  methods: {
    pay(order) {
      const key = utils.randomKey();
      const serverRequest = {
        key: this.$store.state.jsencrypt.encrypt(key),
        encryptData: utils.encrypt(JSON.stringify(order), key),
      }
      this.$axios.post("/trade/pay", serverRequest, {
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        var newwindow = window.open("#","_blank");
        newwindow.document.write(response.data);
        this.$router.push("/");
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
  padding: 10px 20px 10px 20px;
  text-align: left;
  font-size: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>