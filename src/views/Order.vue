<template>
  <div>
    <b-button-group>
      <b-button @click="getCreatedOrders()">待我付款</b-button>
      <b-button @click="getPaidOrders()">待卖家发货</b-button>
      <b-button @click="getSentOrders()">待我收货</b-button>
      <b-button @click="getFinishedOrders()">交易完成</b-button>
    </b-button-group>
    <div class="order_model" v-for="order in orderList" v-bind:key="order.orderId">
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
      <div v-if="selectButtonStatus === 1">
        <b-button variant="outline-dark" @click="pay(order)">立即付款</b-button>
        <b-button variant="outline-dark" @click="cancel(order)">取消订单</b-button>
      </div>
      <div v-else-if="selectButtonStatus === 2">

      </div>
      <div v-else-if="selectButtonStatus === 3">
        <b-button variant="outline-dark" @click="receive(order)">确认收货</b-button>
      </div>
      <div v-else-if="selectButtonStatus === 4">

      </div>      
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    orderList: function() {
      return this.$parent.$store.state.orderList;
    },
    token: function() {
      return window.localStorage["token"];
    },
    userId: function() {
      return this.$parent.$store.state.userinfo.userId;
    },
    selectButtonStatus: function() {
      return this.$parent.$store.state.buyerOrderButtionStatus;
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
      this.$store.state.currentOrder = order;
      this.$router.push('/currentOrder');
    },
    cancel(order) {
      this.$axios.get("/order/status_cancel", {
        body: "with body",
        params: {
          token: this.token,
          userId: this.userId,
          orderId: order.orderId
        }
      }).then(response => {
        if (response.data.status === "success") {
          alert("订单取消成功");
          this.$router.go(0);
        } else {
          alert("订单取消失败\n" + response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
    },
    receive(order) {
      this.$axios.get("/order/status_received", {
        body: "with body",
        params: {
          token: this.token,
          userId: this.userId,
          orderId: order.orderId
        }
      }).then(response => {
        if (response.data.status === "success") {
          alert("确认收货成功！");
          this.$router.go(0);
        } else {
          alert("确认收货失败！\n" + response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
    },
    getCreatedOrders() {
      this.$axios.get("/order/created_buyer", {
        body: "with body",
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateBuyerButtonStatus", 1);
          this.$store.commit("updateOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      })
    },
    getPaidOrders() {
      this.$axios.get("/order/paid_buyer", {
        body: "with body",
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateBuyerButtonStatus", 2);
          this.$store.commit("updateOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      })
    },
    getSentOrders() {
      this.$axios.get("/order/sent_buyer", {
        body: "with body",
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateBuyerButtonStatus", 3);
          this.$store.commit("updateOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      })
    },
    getFinishedOrders() {
      this.$axios.get("/order/finished_buyer", {
        body: "with body",
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateBuyerButtonStatus", 4);
          this.$store.commit("updateOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      })
    },
  },
  created() {
    switch(this.selectButtonStatus) {
      case 1:
        this.getCreatedOrders();
        break;
      case 2:
        this.getPaidOrders();
        break;
      case 3:
        this.getSentOrders();
        break;
      case 4:
        this.getFinishedOrders();
        break;
    }
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