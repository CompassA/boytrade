<template>
  <div>
    <div>
      <b-button size="lg" variant="primary" @click="addNewInfo()">添加新的地址信息</b-button>
    </div>
    <div v-if="addressInfoList.length !== 0">
      <div v-for="addressInfo in this.addressInfoList" v-bind:key="addressInfo.infoId">
        <b-card
          :border-variant="addressInfo.selected === 1 ? 'dark' : 'light'"
          :header="addressInfo.selected === 1 ? '当前收货地址' : '地址信息'"
          class="text-left"
          style="margin: 10px 10px 10px 10px"
        >
          <b-card-text>
            <b>姓名:  </b>{{addressInfo.userName}} 
            <b>地址:  </b>{{addressInfo.userAddress}} 
            <b>性别:  </b>{{addressInfo.gender === 1 ? "男": "女"}} 
            <b>手机号: </b> {{addressInfo.userPhone}}</b-card-text>
          <b-button variant="outline-dark" @click="updateCurrentAddressInfo(addressInfo)">编辑</b-button>
          <b-button variant="outline-dark" @click="deleteAddressInfo(addressInfo.infoId, addressInfo.selected)">删除</b-button>
          <b-button v-if="addressInfo.selected === 0" 
            variant="outline-dark" 
            @click="setDefault(addressInfo)"
          >设为收货地址</b-button>
        </b-card>
        
      </div>
    </div>
    <div v-else>
      <p>您还未填写地址信息</p>
    </div>

    <b-modal id="infoForm" title="填写信息" hide-footer="true">
      <b-form @submit="onSubmit" @reset="onReset" enctype="multipart/form-data">
        <b-form-group>
          <b-form-input type="text" maxlength="12" v-model="addressInfo.userName" placeholder="请输入您的姓名" required></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            type="text"
            maxlength="62"
            v-model="addressInfo.userAddress"
            placeholder="请输入您的地址"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group>
          <b-form-input
            minlength="11"
            maxlength="11"
            type="text"
            v-model="addressInfo.userPhone"
            placeholder="请输入手机号"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group label="请选择您的性别">
          <b-form-radio name="genderRadio" v-model="addressInfo.gender" value=1>男</b-form-radio>
          <b-form-radio name="genderRadio" v-model="addressInfo.gender" value=2>女</b-form-radio>
        </b-form-group>
        <b-button type="submit" tvariant="primary" ref="submitButton">创建</b-button>
        <b-button type="reset" variant="danger">清空</b-button>
      </b-form>
    </b-modal>

    <b-modal id="editForm" title="编辑地址信息" hide-footer="true">
      <b-form @submit="editSubmit" @reset="editReset" enctype="multipart/form-data">
        <b-form-group label="姓名">
          <b-form-input type="text" v-model="editAddressInfo.userName"></b-form-input>
        </b-form-group>
        <b-form-group label="手机号">
          <b-form-input type="text"
            v-model="editAddressInfo.userPhone"
            minlength="11"
            maxlength="11"></b-form-input>
        </b-form-group>
        <b-form-group label="地址">
          <b-form-input type="text" v-model="editAddressInfo.userAddress"></b-form-input>
        </b-form-group>
        <b-form-group label="性别">
          <b-form-radio name="editGenderRadio" v-model="editAddressInfo.gender" value=1>男</b-form-radio>
          <b-form-radio name="editGenderRadio" v-model="editAddressInfo.gender" value=2>女</b-form-radio>
        </b-form-group>
      
        <b-button type="submit" tvariant="primary" ref="submitButton">编辑</b-button>
        <b-button type="reset" variant="danger">取消修改</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      addressInfo: {
        userId: this.userId,
        userName: "",
        userPhone: "",
        userAddress: "",
        gender: 1,
        selected: 0
      },
      currentAddressInfo: {
        infoId: -1,
        userId: this.userId,
        userName: "",
        userPhone: "",
        userAddress: "",
        gender: 1,
        selected: 0
      },
      editAddressInfo: {
        infoId: -1,
        userId: this.userId,
        userName: "",
        userPhone: "",
        userAddress: "",
        gender: 1,
      }
    };
  },
  created() {
    this.$axios
      .get("/address/get", {
        body: "with body",
        params: {
          userId: this.userId,
          token: this.token
        }
      })
      .then(response => {
        if (response.data.status === "success") {
          this.$store.commit(
            "updateAddressInfoList",
            response.data.body.userAddressInfo
          );
        } else {
          alert(response.data.body.message);
        }
      })
      .catch(response => {
        alert(response);
      });
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.$axios.put("/address/insert", this.addressInfo, {
        params: {
          token: this.token,
          userId: this.userId,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateAddressInfoList", response.data.body.userAddressInfo);
          alert("添加成功！");
          this.$bvModal.hide("infoForm");
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
    },
    onReset(evt) {
      evt.preventDefault();
      this.addressInfo.userName = "";
      this.addressInfo.userPhone = "";
      this.addressInfo.userAddress = "";
      this.addressInfo.gender = 1;
    },
    updateCurrentAddressInfo(addressInfo) {
      this.currentAddressInfo.userName = addressInfo.userName;
      this.currentAddressInfo.userPhone = addressInfo.userPhone;
      this.currentAddressInfo.userAddress = addressInfo.userAddress;
      this.currentAddressInfo.gender = addressInfo.gender;
      this.currentAddressInfo.infoId = addressInfo.infoId;

      this.editAddressInfo.userName = addressInfo.userName;
      this.editAddressInfo.userPhone = addressInfo.userPhone;
      this.editAddressInfo.userAddress = addressInfo.userAddress;
      this.editAddressInfo.gender = addressInfo.gender;
      this.editAddressInfo.infoId = addressInfo.infoId;

      this.$bvModal.show("editForm");
    },
    editSubmit(evt) {
      evt.preventDefault();
      if (this.editAddressInfo.userName === this.currentAddressInfo.userName &&
          this.editAddressInfo.userPhone === this.currentAddressInfo.userPhone &&
          this.editAddressInfo.userAddress === this.currentAddressInfo.userAddress &&
          this.editAddressInfo.gender === this.currentAddressInfo.gender)
      {
        alert("未修改任何信息！");
        return;      
      }
      this.$axios.post("/address/update", this.editAddressInfo, {
        params: {
          userId: this.userId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateAddressInfoList", response.data.body.userAddressInfo);
          alert("编辑成功！");
          this.$bvModal.hide("editForm");
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    editReset(evt) {
      evt.preventDefault();
      this.editAddressInfo.userName = this.currentAddressInfo.userName;
      this.editAddressInfo.userPhone = this.currentAddressInfo.userPhone;
      this.editAddressInfo.userAddress = this.currentAddressInfo.userAddress;
      this.editAddressInfo.gender = this.currentAddressInfo.gender;
      this.editAddressInfo.infoId = this.currentAddressInfo.infoId;
    },
    setDefault(addressInfo) {
      this.$axios.post("/address/reset", {}, {
        params: {
          userId: this.userId,
          infoId: addressInfo.infoId,
          token: this.token,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateAddressInfoList", response.data.body.userAddressInfo);
          alert("设置成功！");
          addressInfo.selected = 1;
          this.$store.commit("updateDefaultAddress", addressInfo);
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      });
    },
    deleteAddressInfo(addressInfoId, selected) {
      if (!confirm("您确定要删除当前地址信息吗？")) {
        return;
      }
      this.$axios.delete("/address/delete", {
        body: "with body",
        params: {
          userId: this.userId,
          token: this.token,
          infoId: addressInfoId,
        }
      }).then(response => {
        if (response.data.status === "success") {
          this.$store.commit("updateAddressInfoList", response.data.body.userAddressInfo);
          alert("删除成功！");
          if (selected) {
            this.$store.commit("updateDefaultAddress", null);
          }
        } else {
          alert(response.data.body.message);
        }
      }).catch(response => {
        alert(response);
      })
    },
    addNewInfo() {
      if (this.addressInfoList.length >= 7) {
        alert("地址信息已达上限!");
        return;
      }
      this.$bvModal.show("infoForm");
    }
  },
  computed: {
    addressInfoList: function(params) {
      return this.$parent.$store.state.addressInfoList;
    },
    token: function() {
      return window.localStorage["token"];
    },
    userId: function() {
      return this.$parent.$store.state.userinfo.userId;
    }
  }
};
</script>

<style lang="scss">
</style>