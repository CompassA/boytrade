<template>
  <div>
    <div class="lists">
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
            <dd>类别： {{ getCategory(product.categoryId) }} </dd>
          </dl>
          <b-button variant="dark" @click="intoProductDetail(product)">查看详情</b-button>
        </div>
      </div>
    </div>
    <div class="block">
      <b-pagination v-model="currentPage" total-rows="10000000" 
        per-page="12" hide-goto-end-buttons="true" size="lg" first-number
        @change="changeEvent()" @input="inputEvent()">
      </b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      prePageNo: 1,
      currentPage: 1,
      lastProductId: 0,
      products: [],
    }
  },
  created() {
    const requestParams = {
      "prePage": 0,
      "targetPage": 1,
      "preLastId": 0,
    };
    this.$axios.get("/product/page", { params: requestParams }).then(response => {
        if (response.data.status === "success") {
          this.products = response.data.body.views;
          if (this.products.length > 0) {
            this.lastProductId = this.products[this.products.length - 1].productId;
          } else {
            this.lastProductId = 0;
          }
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
        return false;
      });
  },
  methods: {
    changeEvent() {
      this.prePageNo = this.currentPage;
    },
    inputEvent() {
      //获取这一页、前一页、前一页最后一个商品id
      const passPreLastId = (this.currentPage <= this.prePageNo) ? 0 : this.lastProductId;
      const requestParams = {
        "prePage": this.prePageNo,
        "targetPage": this.currentPage,
        "preLastId": passPreLastId,
      };
      this.$axios.get("/product/page", { params: requestParams }).then(response => {
        if (response.data.status === "success") {
          this.products = response.data.body.views;
          //更新前一页最后商品id
          if (this.products.length > 0) {
            this.lastProductId = this.products[this.products.length - 1].productId;
          } else {
            this.lastProductId = 0;
          }
        } else {
          alert(response.data.body.message);
        }
      });
    },
    async intoProductDetail(productVO) {
      var productDetail = {};
      await this.$axios.get("/product/detail", {
        body: "with body",
        params: {
          productId: productVO.productId
        }
      }).then(response => {
        if (response.data.status === "success") {
          productDetail = response.data.body;
        }
      }).catch(response => {
        alert(response);
      });

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
              productVO: productDetail,
            });
            this.$parent.$router.push("/detail"); 
          }
        })
        .catch(response => {
          alert(response);
        });
    },
    getCategory(id) {
      switch (id) {
        case 0:
          return "其他";
        case 1: 
          return "书本资料";
        case 2: 
          return "电器";
        case 3:
          return "生活用品";
        case 4:
          return "化妆品";
        case 5:
          return "衣物";
        case 6:
          return "鞋子";
        case 7:
          return "游戏/玩具";
        default:
          return "未定义";
      }
    },
  }
};
</script>

<style lang="scss">
.lists {
  height: 750px;
}

.block {
  margin-top: 1%;
  margin-left: 35%;
  float: left;
}

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