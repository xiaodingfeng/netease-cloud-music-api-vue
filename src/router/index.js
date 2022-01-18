import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/index/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/index/About.vue')
  },
  {
    path: '/music',
    name: 'music',
    component: () => import('../views/music/play.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
