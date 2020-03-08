<template>
  <div>
    <div v-for="productView in productViewList" v-bind:key="productView.productId">
      <b-card 
        :header="productView.productName" 
        border-variant="light"
        style="float: left; width: 300px; height: 300px; margin: 10px 10px 10px 10px;"
        >
        <b-card-text>
          <img :src="productView.iconUrl" width="30%" height="30%"/><br/>
          <b>销量: {{productView.sales}}</b><br/>
          <b>库存: {{productView.stock}}</b><br/>
          <b>状态: {{ getStatus(productView.payStatus) }}</b><br/>
        </b-card-text>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productViewList: null,
    }
  },
  created() {
    this.$axios.get("/product/list", {
      body: "with body",
      params: {
        userId: this.userId,
        token: this.token,
      }
    }).then(response => {
      if (response.data.status === "success") {
        this.productViewList = response.data.body;
      } else {
        alert(response.data.body.message);
      }
    }).catch(response => {
      alert(response);
    })
  },
  computed: {
    token: function() {
      return window.localStorage["token"];
    },
    userId: function() {
      return this.$parent.$store.state.userinfo.userId;
    },
  },
  methods: {
    getStatus(payStatus) {
      switch (payStatus) {
        case 0:
          return "售卖中";
        case 1:
          return "售罄";
        case 2:
          return "下架";
      }
    }
  }
}
</script>