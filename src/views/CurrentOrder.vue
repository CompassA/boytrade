<template>
  <div>
    <div class="order_model">  
      <div>
        <h3>当前订单：</h3>
      </div>
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
      <p><b>订单编号</b>: {{order.orderId}}</p>
      <p><b>订单总金额</b>: <b style="color: red;">￥{{order.orderAmount}}</b></p>
      <p><b>创建时间</b>: {{order.createTime}}</p>
      <p><b>买家姓名</b>: {{order.userName}}</p>
      <p><b>手机号码</b>: {{order.userPhone}}</p>
      <p><b>联系地址</b>: {{order.userAddress}}</p>
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
</style>