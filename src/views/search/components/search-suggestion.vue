<template>
  <div class="search-suggestion">
    <van-cell
      :key="index"
      v-for="(item, index) in searchSuggestionList"
      icon="search"
      @click="$emit('search', item)"
    >
      <div slot="title" v-html="highlight(item)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/api/search'

// 按需加载有好处: 只会把使用到的成员打包到输出结果中
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      searchSuggestionList: []
    }
  },
  watch: {
    searchText: {
      // 当 searchText 发生变化的时候就会调用handler 函数
      // 注意 handler 函数的名称是固定的
      // handler(val) {
      //   console.log(val)
      //   this.loadSearchSuggestion(val)
      // },

      // debounce 函数
      // 第一个参数: function
      // 第二个参数: 延迟事件
      // 返回值: 防抖之后的函数
      handler: debounce(function (val) {
        this.loadSearchSuggestion(val)
      }, 200),
      immediate: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    async loadSearchSuggestion(val) {
      try {
        const { data: res } = await getSearchSuggestion(val)
        this.searchSuggestionList = res.data.options
      } catch (err) {
        this.$toast('查询建议数据失败')
      }
    },
    highlight(strItem) {
      const str = `<span style="color:red">${this.searchText}</span>`
      // 正则表达式中间的内容 会被当做匹配字符串来使用, 而不是数据变量
      // 如果需要根据数据变量创建正则表达式, 则手动 new RegExp
      // RegExp 正则表达式函数
      //    参数1: 匹配模式字符串, 它会根据这个字符串创建正则对象
      //    参数2: 匹配模式, 要写在字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return strItem.replace(reg, str)
    }
  }
}
</script>

<style lang='less' scoped></style>
