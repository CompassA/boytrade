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
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
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
    path: '/publish',
    name: 'publish',
    component: () => import(/* webpackChunkName: "publish" */ '../views/Publish.vue')
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import(/* webpackChunkName: "detail" */ '../views/ProductDetail.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
