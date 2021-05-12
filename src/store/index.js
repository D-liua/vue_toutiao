import Vue from 'vue'
import Vuex from 'vuex'

import { setItem, getItem } from '@/utils/storage'

Vue.use(Vuex)

const TOKEY_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    user: getItem(TOKEY_KEY)
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // 为了数据刷新丢失, 我们需要把数据备份到本地存储
      setItem(TOKEY_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
