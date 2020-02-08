import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      {
        path: '/about/user_product',
        name: 'user_product',
        component: () => import(/* webpackChunkName: "detail" */ '../views/UserProduct.vue')
      },
      {
        path: '/about/order',
        name: 'order',
        component: () => import(/* webpackChunkName: order" */ '../views/Order.vue')
      },
      {
        path: '/about/info_editor',
        name: 'editor',
        component: () => import(/* webpackChunkName: order" */ '../views/InfoEditor.vue')
      },
      {
        path: '/about/seller_order',
        name: 'seller_order',
        component: () => import(/* webpackChunkName: order" */ '../views/SellerOrder.vue')
      },
      {
        path: '/about/publish',
        name: 'publish',
        component: () => import(/* webpackChunkName: "publish" */ '../views/Publish.vue')
      },
    ]
  },
  {
    path: '/goods',
    name: 'goods',
    component: () => import(/* webpackChunkName: "goods" */ '../views/Goods.vue')
  },
  {
    path: '/shoppingcart',
    name: 'shoppingcart',
    component: () => import(/* webpackChunkName: "shoppingcart" */ '../views/ShoppingCart.vue')
  },
  {
    path: '/favourites',
    name: 'favourites',
    component: () => import(/* webpackChunkName: "favourites" */ '../views/Favourites.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */ '../views/ProductDetail.vue')
  },
  {
    path: '/currentOrder',
    name: 'currentOrder',
    component: () => import(/* webpackChunkName: "currentOrder" */ '../views/CurrentOrder.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
