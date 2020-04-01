<template>
  <div id="app">
    <b-navbar type="light" variant="light">
      <b-navbar-brand href="#" @click="intoHome()">校园物品交易平台</b-navbar-brand>
      <b-navbar-nav tabs class="mr-auto">
        <b-nav-item @click="intoGoods()">全部商品</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input class="mr-sm-2" placeholder="Search"></b-form-input>
          <b-button variant="secondary" class="my-2 my-sm-0">搜索</b-button>
        </b-nav-form>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="!this.isLogin">
          <b-button v-b-modal.login variant="light">登录</b-button>
          <b-button v-b-modal.signup variant="light">注册</b-button>
        </div>
        <div v-else>
          <b-nav small>
            <b-nav-item-dropdown v-bind:text="this.username" right>
              <b-dropdown-item @click="intoAbout()">
                <img v-bind:src="this.iconUrl" alt="Kitten" />
                个人中心
              </b-dropdown-item>
              <b-dropdown-divider></b-dropdown-divider>
              <b-dropdown-item @click="logout()">退出登录</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item @click="intoShoppingcart()">购物车</b-nav-item>
            <b-nav-item @click="intoFavourites()">收藏夹</b-nav-item>
          </b-nav>
        </div>
      </b-navbar-nav>
    </b-navbar>

    <router-view></router-view>
    <!-- <b-container class="bv-example-row">
      <b-row class="justify-content-md-center">
        <b-col col lg="11">
          <router-view></router-view>
        </b-col>
      </b-row>
    </b-container> -->

    <!--登录模态框-->
    <b-modal id="login" title="登录" hide-footer="true">
      <div align="center">
        <label for="txtAccount">账号:</label>
        <input
          type="text"
          v-model="account"
          name="account"
          id="txtAccount"
          maxlength="16"
          title="请输入账号"
        />
      </div>
      <div align="center">
        <label for="txtPassword">密码:</label>
        <input
          type="password"
          v-model="password"
          name="password"
          id="txtPassword"
          maxlength="16"
          title="请输入密码"
        />
      </div>
      <div align="center">
        <b-button variant="outline-primary" @click="login()">登录</b-button>
      </div>
    </b-modal>

    <!--注册模态框-->
    <b-modal id="signup" title="注册" hide-footer="true">
      <div>
        <label for="txtUserName">用户名:</label>
        <input
          type="text"
          v-model="signup_username"
          name="account"
          id="txtUserName"
          maxlength="16"
          title="请输入用户名"
        />
      </div>
      <div>
        <label for="txtPassword">密码:</label>
        <input
          type="password"
          v-model="signup_password"
          name="password"
          id="txtPassword"
          maxlength="16"
          title="请输入密码"
        />
      </div>
      <div>
        <label for="txtValidator">确认密码:</label>
        <input
          type="password"
          v-model="signup_validator"
          name="password"
          id="txtValidator"
          maxlength="16"
          title="请输入密码"
        />
      </div>
      <div>
        <b-button variant="outline-primary" @click="registry()">注册</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import store from "./store";
import utils from "./js/utils.js";

export default {
  name: "main",
  data() {
    return {
      account: "",
      password: "",
      signup_password: "",
      signup_username: "",
      signup_validator: ""
    };
  },
  created() {
    this.getPublicKey();
    this.$axios.get("/user/session_status", {
      body: "with body",
      params: {
        token: window.localStorage["token"],
      }
    }).then(response => {
      if (response.data.status === "success") {
        if (response.data.body !== null) {
          this.$store.commit("login", { userinfo: response.data.body });
        } 
      }
    }).catch(response => {
      alert(response);
    });
  },
  computed: {
    isLogin: function() {
      return this.$store.state.isLogin;
    },
    username: function() {
      return this.$store.state.userinfo.name;
    },
    iconUrl: function() {
      return this.$store.state.userinfo.iconUrl;
    },
    token: function() {
      return this.$store.state.token;
    }
  },
  methods: {
    login() {
      if (this.account === "") {
        alert("请输入账号");
        return;
      } else if (this.password === "") {
        alert("请输入密码");
        return;
      }
      const LOGIN_URL = "/user/login";

      const loginDTO = {
        account: this.account,
        password: this.password
      };
      const key = utils.randomKey();
      const encryptData = utils.encrypt(JSON.stringify(loginDTO), key);
      const serverRequst = {
        key: this.$store.state.jsencrypt.encrypt(key),
        encryptData: encryptData
      };
      this.$axios
        .post(LOGIN_URL, serverRequst)
        .then(response => {
          if (response.data.status === "success") {
            this.$store.commit("login", {
              userinfo: response.data.body
            });
            window.localStorage["token"] = response.data.body.token;
            this.$bvModal.hide("login");
          } else {
            alert("登录失败, 原因： " + response.data.body.message);
          }
        })
        .catch(response => {
          alert(response);
        });
    },
    logout() {
      this.$axios.get("/user/logout", {
        body: "with body",
        params: {
          token: this.token
        }
      });
      this.$store.commit("logout");
      window.localStorage["token"] = "";
      this.$router.push("/");
    },
    intoShoppingcart() {
      this.$router.push("/shoppingcart");
    },
    intoFavourites() {
      this.$router.push("/favourites");
    },
    intoGoods() {
      this.$router.push("/goods");
    },
    intoAbout() {
      this.$router.push("/about");
    },
    intoHome() {
      this.$router.push("/");
    },
    registry() {
      if (
        this.signup_password === "" ||
        this.signup_username === "" ||
        this.signup_validator === ""
      ) {
        alert("信息不足, 无法注册");
        return;
      }
      if (this.signup_password !== this.signup_validator) {
        alert("校验密码错误");
        return;
      }
      const userinfo = {
        name: this.signup_username,
        password: this.signup_password
      };
      const key = utils.randomKey();
      const encryptData = utils.encrypt(JSON.stringify(userinfo), key);
      const encryptKey = this.$store.state.jsencrypt.encrypt(key);
      const serverRequest = {
        key: encryptKey,
        encryptData: encryptData
      };
      this.$axios
        .post("/user/registry", serverRequest)
        .then(response => {
          if (response.data.status === "success") {
            alert("注册成功！账号为: " + response.data.body.account);
            this.$store.commit("login", {
              userinfo: response.data.body
            });
            window.localStorage["token"] = response.data.body.token;
            this.$bvModal.hide("signup");
          } else {
            alert("注册失败！" + response.data.body.message);
          }
        })
        .catch(response => {
          alert(response);
        });
    },
    getPublicKey() {
      const PUBLIC_KEY_URL = "/encrypt/public";
      this.$axios(PUBLIC_KEY_URL)
        .then(response => {
          if (response.data.status === "success") {
            this.$store.commit("setPublicKey", {
              public_key: response.data.body
            });
          } else {
            alert(response.data.body.message);
          }
        })
        .catch(response => {
          alert(response);
        });
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: sans-serif;
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}
</style>
