<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col col lg="1">
          <div>
            <div>
              <b-button variant="info" @click="intoInfoEditor()">资料编辑</b-button>
            </div>
            <div>
              <b-button variant="info" @click="intoPublish()">发布商品</b-button>
            </div>
            <div>
              <b-button variant="info" @click="intoUserProduct()">商品状态</b-button>
            </div>
            <div>
              <b-button variant="info" @click="intoOrder()">我买到的</b-button>
            </div>
            <div>
              <b-button variant="info" @click="intoSellerOrder()">我卖出的</b-button>
            </div>
          </div>
        </b-col>
        <b-col col lg="11">
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  created() {
    this.$parent.$router.push("/about/info_editor");
  },
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
    },
    intoPublish() {
      this.$router.push("/about/publish");
    }
  }
};
</script>

<style lang="scss">
</style>