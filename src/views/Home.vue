<template>
  <div>
    <div v-if="categoryHomeView===null">
      <b-spinner style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
    </div>
    <div v-else 
         style="margin-bottom: 3%; margin-left: 20%; margin-right: 20%;"
         v-for="views in categoryHomeView" :key="views.categoryId"
    >
      <b-card :header="getCategory(views.categoryId)" class="text-left">
        <div 
          class="show_body" 
          @click="intoDetail(productVO.productId)"
          v-for="productVO in views.topFive" :key="productVO.productId"
        >
          <img :src="productVO.iconUrl" height="150px" width="150px" />
          <b><p align="center" style="margin: 0%; color: red; font-size: 18px;">￥{{productVO.price}}</p></b>
          <p align="center" style="margin: 0%;">{{productVO.productName}}</p>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryHomeView: null,
    }
  },
  created() {
    this.$axios.get("/product/home").then(response => {
      if (response.data.status === "success") {
        this.categoryHomeView = response.data.body.categoryHomeView;
      }
    }).catch(response => {
      alert(response);
    });
  },
  methods: {
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
    intoDetail(id) {
      this.$router.push(`/detail/${id}`);
    }
  }
}
</script>

<style lang="scss">
.show_body {
  float: left;
  margin-left: 1%;
  padding-left: 1%;
  cursor: pointer;
  border: 2px solid whitesmoke;
}
</style>
