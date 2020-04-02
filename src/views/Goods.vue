<template>
  <div>
    <div>
      <button class="type_button" @click="getTypeList(-1)">全部</button>
      <button class="type_button" @click="getTypeList(7)">游戏/玩具</button>
      <button class="type_button" @click="getTypeList(6)">鞋子</button>
      <button class="type_button" @click="getTypeList(5)">衣物</button>
      <button class="type_button" @click="getTypeList(4)">化妆品</button>
      <button class="type_button" @click="getTypeList(3)">生活用品</button>
      <button class="type_button" @click="getTypeList(2)">电器</button>
      <button class="type_button" @click="getTypeList(1)">书本资料</button>
      <button class="type_button" @click="getTypeList(0)">其他</button>
    </div>
    <div  v-if="products !== null" style="height: 800px;">
      <div
        class="my_card" v-for="product in products" :key="product.productId" 
        @click="intoProductDetail(product)" 
      >
        <div class="bodyBox">
          <img :src="product.iconUrl" width="200px" height="200px" style="border-radius: 10px;" />
          <dl>
            <b style="color: red; font-size: 20px; margin-left: 0%;">￥{{product.price}}</b>
            <dt>{{ product.productName }}</dt>
            <dd>简介： {{ product.description.substring(0, 10) + (product.description.length > 10 ? "....": "") }}</dd>
            <dd>类别： {{ getCategory(product.categoryId) }} </dd>
          </dl>
        </div>
      </div>
      <div class="block">
        <b-pagination v-model="currentPage" total-rows="10000000" 
          per-page="12" hide-goto-end-buttons="true" size="lg"
          @change="changeEvent()" @input="inputEvent()"
        >
        </b-pagination>
      </div>
    </div>
    <div v-else><b-spinner class="m-5" label="Busy"></b-spinner></div>
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
      currentTypeId: -1,
      dropMainText: "全部"
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
      if (this.currentTypeId !== -1) {
        requestParams.typeId = this.currentTypeId;
      }
      this.products = null;
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
    intoProductDetail(productVO) {
      this.$parent.$router.push(`/detail/${productVO.productId}`);
    },
    getCategory(id) {
      switch (id) {
        case -1:
          return "全部";
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
    //改变类别状态，获取类别第一页数据，更新lastId，页码数据
    getTypeList(typeId) {
      this.products = null;
      this.dropMainText = this.getCategory(typeId);
      this.currentTypeId = typeId;
      const requestParams = {
        "prePage": 0,
        "targetPage": 1,
        "preLastId": 0,
      };
      if (this.currentTypeId !== -1) {
        requestParams.typeId = this.currentTypeId;
      }
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
      });
      this.currentPage = 1;
    }
  }
};
</script>

<style lang="scss">

.block {
  clear: both;
  margin-top: 20%;
  margin-left: 35%;
}

.my_card {
  width: 230px;
  height: 340px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  text-align: center;
  float: left;
  background-color: #cdd3d6;
  border-radius: 30px;
  margin: 10px 10px 10px 10px;
}

.my_card :hover {
  cursor: pointer;
  background-color: grey;
  border-radius: 30px;
}

.bodyBox {
  height: 340px;
  padding: 4%;
}

.bodyBox dl dt {
  font-size: 15px;
}

.bodyBox dl dd {
  width: 200px;
  height: 20px;
  text-align: left;
  margin-left: 5px;
  font-size: 13px;
}

.type_button {
  border-radius: 8px;
  background-color: black;
  border: 2px solid black;
  color: white;
}
</style>