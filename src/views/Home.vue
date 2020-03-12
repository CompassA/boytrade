<template>
  <div>
    <div style="margin-bottom: 15%; margin-left: 20%;" v-for="views in categoryHomeView" :key="views.categoryId">
      <p style="font-size: 15px; text-align: left; ">{{getCategory(views.categoryId)}}</p>
      <div style="float: left; margin-right: 1%;" v-for="productVO in views.topFive" :key="productVO.productId">
        <img :src="productVO.iconUrl" height="150px" width="150px" />
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categoryHomeView: [],
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
    }
  }
}
</script>
