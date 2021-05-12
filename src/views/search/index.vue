<template>
  <div class="search-container">
    <form action="/">
      <van-search
        class="search"
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        background="#2892ff"
      />
    </form>
    <!-- 搜索结果 -->
    <search-results v-if="isResultShow" :searchText="searchText"></search-results>
    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :searchText="searchText"
      @search="onSearch"
    ></search-suggestion>
    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :searchHistories="searchHistories"
      @remove-search-all="searchHistories = []"
      @toSearch="onSearch"
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from './components/search-history'
import SearchResults from './components/search-results'
import SearchSuggestion from './components/search-suggestion'
import { setItem, getItem } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  props: {},
  components: {
    SearchHistory,
    SearchResults,
    SearchSuggestion
  },
  data() {
    return {
      searchText: '', // 搜索的文本
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [] // 搜索历史记录
    }
  },
  computed: {},
  watch: {
    searchHistories(value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    }
  },
  created() {},
  mounted() {},
  methods: {
    onCancel() {
      this.$router.back()
    },
    onSearch(val) {
      // 更新文本框内容
      this.searchText = val
      // 储存搜索历史记录
      // 要求: 不要有重复的历史记录, 最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)
      // 渲染搜索结果
      this.isResultShow = true
    },
    onFocus(val) {
      this.isResultShow = false
    }
  }
}
</script>

<style lang='less' scoped>
.search-container {
  padding-top: 108px;
  /deep/.search {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1;
    .van-search__action {
      color: #fff;
    }
  }
}
</style>
