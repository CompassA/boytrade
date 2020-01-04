<template>
  <div id="app">
    <b-navbar type="light" variant="light">
      <b-navbar-brand>校园二手物品交易平台</b-navbar-brand>
      <b-navbar-nav tabs class="ml-auto">
        <b-nav-item @click="intoGoods()">最新发布</b-nav-item>
        <b-nav-item @click="intoGoods()">书本</b-nav-item>
        <b-nav-item @click="intoGoods()">资料</b-nav-item>
        <b-nav-item @click="intoGoods()">电器</b-nav-item>
        <b-nav-item @click="intoGoods()">宿舍用品</b-nav-item>
        <b-nav-item @click="intoGoods()">化妆品</b-nav-item>
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
                <img src="https://placekitten.com/g/30/30" alt="Kitten" />
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

    <!--登录模态框-->
    <b-modal id="login" title="登录" hide-footer="true">
      <div align="center">
        <label for="txtAccount">账号:</label>
        <input type="text" name="account" id="txtAccount" maxlength="16" title="请输入账号" />
      </div>
      <div align="center">
        <label for="txtPassword">密码:</label>
        <input type="password" name="password" id="txtPassword" maxlength="16" title="请输入密码" />
      </div>
      <div align="center">
        <b-button variant="outline-primary" @click="login()">登录</b-button>
      </div>
    </b-modal>

    <!--注册模态框-->
    <b-modal id="signup" title="注册" hide-footer="true"></b-modal>
  </div>
</template>

<script>
import store from "./store";

export default {
  name: "main",
  computed: {
    isLogin: function() {
      return this.$store.state.isLogin;
    },
    username: function() {
      return this.$store.state.username;
    }
  },
  methods: {
    login() {
      console.log("login");
      this.$store.commit("login", {
        username: "番茄"
      });
      this.$bvModal.hide("login");
    },
    logout() {
      this.$store.commit("logout");
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
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "幼圆", Helvetica, Arial, sans-serif;
  font-size: 18px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding: 0;
  margin: 0;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
