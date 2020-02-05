<template>
  <div>
    <div class="left_nav">
      <ul>
        <li @click="intoInfoEditor()">资料编辑</li>
        <li>发布商品</li> 
        <li @click="intoUserProduct()">商品管理</li>
        <li @click="intoOrder()">买方订单</li>
        <li @click="intoSellerOrder()">卖方订单</li>
      </ul>
    </div>
    <router-view class="right_block"></router-view>
  </div>
</template>

<script>
export default {
  methods: {
    intoInfoEditor() {
      this.$parent.$router.push("/about/info_editor");
    },
    intoUserProduct() {
      this.$parent.$router.push("/about/user_product");
    },
    intoOrder() {
      this.$parent.$router.push("/about/order");
    },
    intoSellerOrder() {
      this.$parent.$router.push("/about/seller_order");
    }
  }
};
</script>

<style lang="scss">
.left_nav {
  width: 200px;
  height: 1200px;
  margin: 0px 0px 0px 0px;
  background-color: rgb(207, 202, 202);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position: absolute;
  left: 0;
}

.left_nav > ul {
  margin: 20px 10px 10px 10px;
  height: 300px;
}

.left_nav > ul > li {
  width: 100px;
  height: 30px;
  font-size: 17px;
  text-align: left;
  list-style-type: none;
  font-family: YouYuan;
}

.left_nav > ul > li:hover {
  background: rgb(226, 223, 223);
  cursor: pointer;
}

.right_block {
  width: 1200px;
  height: 1150px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  left: 230px;
  top: 70px;
  position: absolute;
}
</style>