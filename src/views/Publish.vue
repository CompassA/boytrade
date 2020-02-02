<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" enctype="multipart/form-data" v-if="show">
      <b-form-group id="productName" label="商品名称" label-for="txtProductName">
        <b-form-input id="txtProductName" v-model="product.productName" required placeholder="请输入商品名称"></b-form-input>
      </b-form-group>

      <b-form-group id="productDescription" label="商品描述" label-for="txtAreaDescription">
        <b-form-textarea
          id="txtAreaDescription"
          v-model="product.description"
          rows="3"
          max-rows="6"
          required
          placeholder="请输入商品描述"
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="category" label="商品类型:" label-for="categoryType">
        <b-form-select
          id="categoryType"
          v-model="product.categoryId"
          :options="categories"
          value-field="value"
          text-field="text"
          required
        ></b-form-select>
      </b-form-group>

      <b-form-group id="productImage" label="商品图片:" label-for="productImageFile">
        <b-form-file
          id="productImageFile"
          v-model="product.imgFile"
          placeholder="请上传商品图片"
          accept=".jpg, .png"
          required
        ></b-form-file>
      </b-form-group>

      <b-form-group id="productStock">
        <label for="txtStock">商品库存：</label>
        <input
          type="number"
          id="txtStock"
          max="999999"
          min="1"
          maxlength="6"
          onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
          oninput="if(value.length>6)value=value.slice(0,6)"
          v-model="product.stock"
          required
          placeholder="请输入商品库存"
        />
        <label for="txtPrice">商品价格：</label>
        <input
          type="number"
          min="0.50"
          max="100000.00"
          step="0.01"
          v-model="product.price"
          required
          placeholder="请输入商品价格"
        />
      </b-form-group>

      <b-button type="submit" tvariant="primary" ref="submitButton">创建</b-button>
      <b-button type="reset" variant="danger">清空</b-button>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      product: {
        productName: "",
        description: "",
        categoryId: null,
        imgFile: null,
        stock: 1,
        price: 1.0,
        iconUrl: "",
        userId: -1,
      },
      categories: [
        { text: "书本", value: 1 },
        { text: "资料", value: 2 },
        { text: "电器", value: 3 },
        { text: "宿舍用品", value: 4 },
        { text: "化妆品", value: 5 },
        { text: "其他", value: 6 }
      ],
      show: true
    };
  },
  computed: {
    userId: function() {
      return this.$parent.$store.state.userinfo.userId;
    },
    token: function() {
      return this.$parent.$store.state.token;
    }
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();
      if (this.product.imgFile.size  > 2 * 1024 * 1024) {
        alert("上传的图片不能大于2M！");
        return;
      }
      if (this.userId !== -1) {
        this.product.userId = this.userId;
      } else {
        alert("登录失效");
        return;
      }
      await this.upLoadImage();

      this.$axios.put("/product/create?token=" + this.token, this.product)
        .then(response => {
          if (response.data.status === "success") {
            alert("创建商品成功!");
            this.$router.push("/about");
          } else {
            alert("商品创建失败!");
          }
        })
        .catch(response => {
          alert(response);
        });
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.product.description = "";
      this.product.name = "";
      this.product.category = null;
      this.product.imgFile = null;
      this.product.stock = 1;
      this.product.price = 0.5;
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
    async upLoadImage() {
      if (this.product.imgFile === null) {
        return;
      }
      this.$refs.submitButton.disabled = true;
      let imageData = new FormData();
      imageData.append("imgFile", this.product.imgFile);
      await this.$axios
        .post("/file/upload?token="+this.token, imageData)
        .then(response => {
          if (response.data.status === "success") {
            this.product.iconUrl = response.data.body;
            this.$refs.submitButton.disabled = false;
          } else {
            alert(response.data.body.message);
            this.product.imgFile = null;
          }
        })
        .catch(response => {
          alert(response);
        });
    }
  }
};
</script>