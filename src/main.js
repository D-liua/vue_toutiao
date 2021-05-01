import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './style/global.less'
// 加载vant核心组件
import Vant from 'vant'
// 加载组件库全局样式
import 'vant/lib/index.css'

// import之间除了import 不能有其它代码

// 注册使用Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
