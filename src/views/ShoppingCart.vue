<template>
  <div>
    <div 
      v-for="cartView in cartViews" :key=cartView.sellerId 
      style="width: 51%; margin: 2% 20% 2% 20%; background-color: ghostwhite;"
    >
      <hr style="height:3px;border:none;border-top:3px double red;" />
      <b style="font-size: 20px; align: left;">卖家名称: {{ cartView.sellerName }}</b>
      <b-table sticky-header :fields="fields" :items="cartView.cartDetails" caption-top>  
        <template v-slot:cell(selected)="data">
           <b-form-checkbox
            v-model="cartView.selectedIds"
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
          <b style="color: red;"> ￥{{ Math.round(Math.round(data.item.price * 100) * data.item.num) / 100 }} </b>
        </template>

        <template v-slot:cell(ops)="data">
          <div class="ops"><p @click="deleteFromCart(data)">删除</p></div>
        </template>
      </b-table> 
      <b-container>
        <b-row>
          <b-col md="5">
            <p>总金额：<b style="color: red;"> ￥{{ totalMoney(cartView) }}</b></p>
          </b-col>
          <b-col md="7">
            <button class="cart_button" @click="pay(cartView)">立即下单</button>
            <button @click="deleteCart(cartView)">删除</button>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import utils from '../js/utils';

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
    addressInfo: function() {
      return this.$parent.$store.state.defaultAddress;
    }   
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
        alert(response.data.body.message);
      }
    }).catch(response => {
      alert(response);
    });
    if (this.addressInfo === null) {
      this.$axios.get("/address/default", {
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateDefaultAddress", response.data.body);
        } else {
          if (confirm("您尚未设置收货地址,是否立即去设置?")) {
            this.$router.push("/about/info_editor");
          }
        }
      }).catch(response => {
        alert(response);
      })
    }
  },
  methods: {
    totalMoney(cartView) {
      const priceMap = new Map();
      cartView.cartDetails.forEach(detail => priceMap.set(
        detail.productId, detail.num * Math.round(detail.price * 100)));
      var sum = 0;
      cartView.selectedIds.forEach(id => sum += priceMap.get(id));
      return Math.round(sum) / 100.0;
    },
    pay(cartView) {
      if (!confirm("您确定要下单吗?")) {
        return;
      }
      if (this.addressInfo === null) {
        if (confirm("您尚未设置收货地址,是否立即去设置?")) {
          this.$router.push("/about/info_editor");
        }
        return;
      }
      const detailMap = new Map();
      cartView.cartDetails.forEach(detail => detailMap.set(detail.productId, detail));
      const orderDetails = new Array();
      cartView.selectedIds.forEach(id => {
        const cartDetail = detailMap.get(id);
        orderDetails.push({
          productId: id,
          ownerId: cartView.sellerId,
          productName: cartDetail.productName,
          productAmount: cartDetail.num,
          productPrice: cartDetail.price,
          iconUrl: cartDetail.iconUrl,
        })
      });
      const orderDTO = {
        userId: this.userId,
        userName: this.addressInfo.userName,
        userPhone: this.addressInfo.userPhone,
        userAddress: this.addressInfo.userAddress,
        productDetails: orderDetails,
      }

      const key = utils.randomKey();
      const encryptData = utils.encrypt(JSON.stringify(orderDTO), key);
      const serverRequst = {
        key: this.$store.state.jsencrypt.encrypt(key),
        encryptData: encryptData
      };
      this.$axios.post("/order/create", serverRequst, {
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          alert("下单成功!");
          this.$store.commit("updateCurrentOrder", response.data.body);
          this.$axios.delete("/cart/delete_all", {
            data: JSON.stringify(cartView.selectedIds),
            params: {
              userId: this.userId,
              token: this.token,
            }
          }).then(response => {
            if (response.data.status === "success") {
              this.$router.push('/currentOrder');
            } else {
              alert(response.data.body.message);
            }
          });
        } else {
          alert(response.data.body.message + "\n错误码：" + response.data.body.errorCode);
        }
      })
      .catch(response => {
        alert(response);
      });
    },
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
          this.$router.push("/shoppingcart");
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
    },
    deleteCart(cartView) {
      if (!confirm("您确定要删除该商家的所有商品吗?")) {
        return;
      }
      this.$axios.delete("/cart/delete_all", {
        data: cartView.selectedIds,
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$router.push("/shoppingcart");
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
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

.cart_button {
  border-radius: 8px;
  background-color: orangered;
  border: 2px solid orangered;
  color: white;
  margin: 1% 1% 1% 1%;
}
</style>