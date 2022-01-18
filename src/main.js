import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store/index'
axios.defaults.allowCredentials = true
axios.defaults.baseUrl = 'http://121.37.30.8:3000'
Vue.config.productionTip = false

Vue.use(ElementUI);
Vue.use(VueRouter)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
