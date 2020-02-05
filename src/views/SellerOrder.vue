<template>
  <div>
    <b-button-group>
      <b-button @click="getPaidOrders()">待我发货</b-button>
      <b-button @click="getSentOrders()">待买家收货</b-button>
      <b-button @click="getFinishedOrders()">交易完成</b-button>
    </b-button-group>
    <div class="seller_order_model" v-for="order in this.sellerOrderList" v-bind:key="order.orderId">
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
      <div v-if="buttonStatus == 1">
        <b-button variant="outline-dark">发货</b-button>
      </div>
    </div>
  </div>
</template>

<script>
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
    userId: function() {
      return this.$parent.$store.state.userinfo.userId;
    },
    token: function() {
      return window.localStorage["token"];
    },
    sellerOrderList: function() {
      return this.$parent.$store.state.sellerOrderList;
    },
    buttonStatus: function() {
      return window.localStorage["sellerButtonStatus"];
    }
  },
  methods: {
    getPaidOrders() {
      window.localStorage["sellerButtonStatus"] = 1;
      this.$axios.get("/order/paid_seller", {
        body: "with body",
        params: {
          token: this.token,
          sellerId: this.userId
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateSellerOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    getSentOrders() {
      window.localStorage["sellerButtonStatus"] = 2;
      this.$axios.get("/order/sent_seller", {
        body: "with body",
        params: {
          token: this.token,
          sellerId: this.userId
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateSellerOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    getFinishedOrders() {
      window.localStorage["sellerButtonStatus"] = 3;
      this.$axios.get("/order/finished_seller", {
        body: "with body",
        params: {
          token: this.token,
          sellerId: this.userId
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateSellerOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    }
  }
};
</script>

<style lang="scss">
.seller_order_model {
  margin-top: 20px;
  margin-left: 100px;
  padding: 10px 20px 10px 20px;
  text-align: left;
  width: 600px;
  font-size: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>