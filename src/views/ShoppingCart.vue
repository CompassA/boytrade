<template>
  <div>
    <div v-for="cartView in cartViews" :key=cartView.sellerId>
      <b-table :fields="fields" :items="cartView.cartDetails" caption-top>
        <template v-slot:table-caption>卖家名称: {{ cartView.sellerName }}</template>
        <template v-slot:cell(selected)="data">
           <b-form-checkbox
            :value="data.item.productId"
            unchecked-value="not_accepted"
          ></b-form-checkbox>
        </template>

        <template v-slot:cell(iconUrl)="data">
          <img :src="data.item.iconUrl" style="width: 60px; height: 60px;">
        </template>

        <template v-slot:cell(price)="data">
          <b> ￥{{ data.item.price }} </b>
        </template>
        
        <template v-slot:cell(sum)="data">
          <b style="color: red;"> ￥{{ data.item.price * data.item.num }} </b>
        </template>

        <template v-slot:cell(ops)="data">
          <div class="ops"><p @click="addToFavourites(data)">加入收藏夹</p></div>
          <div class="ops"><p @click="deleteFromCart(data)">删除</p></div>
        </template>
      </b-table>
      <b-button-group >
        <b-button>立即付款</b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartViews: null,
      fields: [
        { key: 'selected', label: ''},
        { key: 'productName', label: '商品名称' },
        { key: 'iconUrl', label: '商品图片' },
        { key: 'description', label: '描述' },
        { key: 'price', label: '单价' },
        { key: 'num', label: '数量' },
        { key: 'sum', label: '金额' },
        { key: 'ops', label: '操作' },
      ],
    }
  },
  computed: {
    token: function() {
      return window.localStorage["token"];
    },
    userId: function() {
      return this.$parent.$store.state.userinfo.userId;
    },
  },
  created() {
    this.$axios.get("/cart/get", {
      body: "with body",
      params: {
        token: this.token,
        userId: this.userId,
      }
    }).then(response => {
      if (response.data.status === "success") {
        this.cartViews = response.data.body;
      } else {
        this.alert(response.data.body.message);
      }
    }).catch(response => {
      alert(response);
    });
  },
  methods: {
    deleteFromCart(data) {
      if (!confirm("确实要将此商品从购物车中删除吗?")) {
        return;
      }
      const cartDTO = {
        userId: this.userId,
        productId: data.item.productId,
        num: data.item.num,
      }; 
      this.$axios.delete("/cart/delete", {
        data: cartDTO,
        params: {
          token: this.token,
          userId: this.userId,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$router.go(0);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
    },
    addToFavourites(data) {
      alert(JSON.stringify(data));
    }
  },
}
</script>

<style lang="scss">
.ops {
  font-size: 14px;
}
.ops:hover {
  cursor: pointer;
}
</style>