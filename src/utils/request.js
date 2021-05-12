/**
 *  请求模块
 */
import axios from 'axios'
import store from '@/store'

import JSONBig from 'json-bigint'
// JSONBig 可以处理数据中超出 JavaScript 安全证书范围的问题
// JSONBig.parse() 把JSON格式的字符串转我javescript对象
// JSONBig.stringify() 把Jjavascript对象, 转化为JSON格式的字符串

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 基础路径

  // 自定义后端返回的原始数据
  transformResponse: [
    function(data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
      //   // axios 默认会在内部这样来处理后端返回来的数据
      //   return JSON.parse(data)
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  function(config) {
    console.log(config)
    const { user } = store.state
    if (user) {
      config.headers.common.Authorization = 'Bearer ' + user.token
    }
    // 这里一定要返回config
    return config
  },
  function(error) {
    // 如果请求出错了(还没有发出去)会进入这里
    return Promise.reject(error)
  }
)

// 响应拦截器

export default request
