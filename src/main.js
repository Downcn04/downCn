import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import * as echarts from 'echarts';
import '@/assets/css/global.less'
import '@/assets/font/iconfont.css'
import SocketService from './utils/socket_service'
SocketService.Instance.connect()
Vue.prototype.$socket=SocketService.Instance
//请求基准路径的配置
axios.defaults.baseURL='http://127.0.0.1:8080/api'
//将axios挂载到Vue原型对象
Vue.prototype.$http=axios
Vue.prototype.$echarts = echarts;
//将全局的echart挂载到Vue原型对象
// Vue.prototype.$echarts=window.echarts
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
