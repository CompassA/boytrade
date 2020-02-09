<template>
  <div>
    <b-button-group>
      <b-button @click="getCreatedOrders()">未付款订单</b-button>
      <b-button @click="getPaidOrders()">待我发货</b-button>
      <b-button @click="getSentOrders()">待买家收货</b-button>
      <b-button @click="getFinishedOrders()">交易完成</b-button>
    </b-button-group>
    <div class="seller_order_model" v-for="order in this.sellerOrderList" v-bind:key="order.orderId">
      <p>订单编号: {{order.orderId}}</p>
      <p>订单总金额: {{order.orderAmount}}</p>
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
      </b-table>
      <div v-if="buttonStatus == 1">

      </div>      
      <div v-else-if="buttonStatus == 2">
        <b-button variant="outline-dark" @click="sendProducts(order)">发货</b-button>
      </div>
      <div v-else-if="buttonStatus == 3">

      </div>
      <div v-else-if="buttonStatus == 4">

      </div>      
    </div>
  </div>
</template>

<script>
export default {
  created() {
    switch(this.buttonStatus) {
      case 0:
        this.getCreatedOrders();
        break;
      case 1:
        this.getPaidOrders()
        break;
      case 2:
        this.getSentOrders()
        break;
      case 3:
        this.getFinishedOrders()
        break;
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
      return this.$parent.$store.state.sellerOrderButtionStatus;
    }
  },
  methods: {
    sendProducts(order) {
      this.$axios.get("/order/status_sent", {
        body: "with body",
        params: {
          token: this.token,
          userId: this.userId,
          orderId: order.orderId,
        }
      }).then(response => {
        if (response.data.status === "success") {
          alert("订单已经更改为发送状态！");
          this.getSentOrders();
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
    },
    getCreatedOrders() {
      this.$axios.get("/order/created_seller", {
        body: "with body",
        params: {
          token: this.token,
          sellerId: this.userId
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateSellerButtonStatus", 1);
          this.$store.commit("updateSellerOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    getPaidOrders() {
      this.$axios.get("/order/paid_seller", {
        body: "with body",
        params: {
          token: this.token,
          sellerId: this.userId
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateSellerButtonStatus", 2);
          this.$store.commit("updateSellerOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    getSentOrders() {
      this.$axios.get("/order/sent_seller", {
        body: "with body",
        params: {
          token: this.token,
          sellerId: this.userId
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateSellerButtonStatus", 3);
          this.$store.commit("updateSellerOrderList", response.data.body);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    getFinishedOrders() {
      this.$axios.get("/order/finished_seller", {
        body: "with body",
        params: {
          token: this.token,
          sellerId: this.userId
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateSellerButtonStatus", 4);
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
  font-size: 15px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>