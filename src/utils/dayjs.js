import Vue from 'vue'
import dayjs from 'dayjs'

// 加载中文语言包
import 'dayjs/locale/zh-cn'

// 配置使用处理相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// dayjs 默认设为中文, 我们这里配置为中文

// 配置全局使用
dayjs.locale('zh-cn')

// 定义一个全局过滤器就可以在全局中使用了
// 其实过滤器就相当于一个全局可用的方法(仅供模板使用)
// 参数1: 过略器的名称
// 参数2: 过滤函数
// 使用方式: {{ 表达式 | 过滤器名称 }}
// 管道符前面的表达式结果会作为参数传递到过滤器函数中
// 过滤的返回值会渲染到使用过滤器的模板位置
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})

Vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(value).format(format)
})

// dayjs() 获取当前最新时间
console.log(dayjs().format('YYYY-MM-DD'))

console.log(dayjs().from('1990'))
console.log(dayjs().fromNow(dayjs(), true))
console.log(dayjs().to(dayjs()))
console.log(dayjs().toNow())
