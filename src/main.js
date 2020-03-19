import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)
import 'ant-design-vue/dist/antd.css';
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')