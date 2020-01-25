<template>
  <div>
    <div id="lists">
      <div class="cardBox" v-for="product in products" v-bind:key="product.productId">
        <div class="bodyBox">
          <img
            v-bind:src="product.iconUrl"
            width="150px"
            height="150px"
          />
          <dl>
            <dt>商品名：{{ product.productName }}</dt>
            <dd>简介： {{ product.description.substring(0, 10) + (product.description.length > 10 ? "....": "") }}</dd>
            <dd>价格：<b>{{ product.price }}</b>元</dd>
            <dd>库存：<b>{{ product.stock }}</b>件</dd>
          </dl>
          <b-button variant="dark" @click="intoProductDetail(product)">查看详情</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    products: function() {
      return this.$parent.$store.state.productList;
    }
  },
  methods: {
    intoProductDetail(productVO) {
      this.$axios
        .get("/user/part_info", {
          //坑！无body时，get请求的Content-Type会被去掉，后端无法接受请求
          body: "with body",
          params: { 
            userId: productVO.userId
          }
         })
        .then(response => {
          if (response.data.status === "success") {
            this.$parent.$store.commit("updateProductDetail", {
              userVO: response.data.body,
              productVO: productVO,
            });
            this.$parent.$router.push("/detail"); 
          }
        })
        .catch(response => {
          alert(response);
        });
    },
  }
};
</script>

<style lang="scss">
.cardBox {
  width: 230px;
  height: 340px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  float: left;
  margin: 10px 10px 10px 10px;
  padding: 5px;
  padding-top: 15px;
}

.bodyBox {
  padding: 10px;
}

.bodyBox dl dt {
  font-size: 14px;
}

.bodyBox dl dd {
  width: 200px;
  height: 20px;
  text-align: left;
  margin-left: 5px;
  font-size: 13px;
}
</style>