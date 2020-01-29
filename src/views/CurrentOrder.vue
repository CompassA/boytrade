<template>
  <div>
    <div class="order_model">
      <p>订单编号: {{order.orderId}}</p>
      <p>订单总金额: {{order.orderAmount}}</p>
      <p>创建时间: {{order.createTime}}</p>
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
export default {
  computed: {
    order: function() {
      return this.$parent.$store.state.currentOrder;
    }
  },
  methods: {
    pay(order) {
      alert(JSON.stringify(order));
    },
    notPay() {
      this.$router.push("/");
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
  width: 600px;
  font-size: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>