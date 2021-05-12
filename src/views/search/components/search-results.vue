<template>
  <div class="search-results">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(article, index) in list" :key="index" :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResults',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      per_page: 20
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data: res } = await getSearchResult({
          page: this.page, // 页码值
          per_page: this.per_page, // 每页的数量
          q: this.searchText
        })
        console.log(res)
        // 2. 将数据添加到数组列表中
        this.list.push(...res.data.results)
        // 3. 将本次加载中的loading关闭
        this.loading = false
        // 4. 判断是否还有数据
        if (res.data.results.length) {
          //    如果有, 则更新获取下一个数据的页码
          this.page++
        } else {
          //    如果没有 ,则加载状态 finished 设置为true
          this.finished = true
        }
      } catch (err) {
        this.$toast('获取查询结果数据失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.search-results {
  box-sizing: border-box;
  height: 92vh;
  overflow-y: auto;
  // padding-bottom: 200px;
}
</style>
