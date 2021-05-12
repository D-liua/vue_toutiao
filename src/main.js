import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// --host 192.168.2.103

import './style/global.less'
// 加载vant核心组件
import Vant from 'vant'
// 加载组件库全局样式
import 'vant/lib/index.css'

// 加载动态设置REM的基准值
import 'amfe-flexible'

// 加载 dayjs 初始化配置
import './utils/dayjs.js'

// import之间除了import 不能有其它代码

// 注册使用Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

// 创建 Vue 根实例，将 router、store 配置到根实例中
// 把 App 根组件渲染到 #app 节点
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
