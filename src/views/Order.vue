<template>
  <div>
    <b-button-group>
      <b-button>待付款</b-button>
      <b-button>待发货</b-button>
      <b-button>待收货</b-button>
      <b-button>已完成</b-button>
    </b-button-group>
    <div class="order_model" v-for="order in orderList" v-bind:key="order.orderId">
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
      <b-button variant="outline-dark" @click="cancel(order)">取消订单</b-button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    orderList: function() {
      return this.$parent.$store.state.orderList;
    }
  },
  data() {
    return {
      fields: [
        { key: "productName", label: "商品名称" },
        { key: "productAmount", label: "数量" },
        { key: "productPrice", label: "单价" },
        { key: "iconUrl", label: "图片" }
      ]
    };
  },
  methods: {
    pay(order) {
      alert(JSON.stringify(order));
    },
    cancel(order) {
      alert(JSON.stringify(order));
    }
  },
  created() {
    this.$axios
      .get("/order/query_user", {
        body: "with body",
        params: {
          userId: this.$store.state.userinfo.userId
        }
      })
      .then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateOrderList", response.data.body);
        }
      });
  }
};
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