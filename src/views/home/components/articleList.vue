<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      animation-duration="600"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败, 点击重新加载"
      >
        <article-item :key="index" v-for="(item, index) in list" :article="item"></article-item>
        <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.title" /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/api/article.js'
import ArticleItem from '../../../components/article-item'
export default {
  name: 'articleList',
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    'article-item': ArticleItem
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      // 请求获取下一页数据的时间戳
      timestamp: null,
      error: false,
      // 是否在刷新
      refreshing: false,
      // 刷新成功提示文本
      refreshSuccessText: '刷新成功'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      try {
        const { data: res } = await getArticleList({
          channel_id: this.channel.id, // 频道id
          // 请求数据的页码
          // 请求第一页, 请求当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now(),
          with_top: 1
        })
        console.log(res)
        const { results } = res.data

        // 2. 把请求结果方法放到list数组中
        this.list.push(...results)
        // 3. 本次数据加载结束之后, 要把加载状态设置为结束
        this.loading = false
        // 4. 判断是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = res.data.pre_timestamp
        } else {
          // 没有数据了, 将 finshed 设置为 true, 不在load 加载更多了
          this.finished = true
        }
      } catch (err) {
        // this.$toast('请求文章列表失败')
        // 展示错误提示状态
        this.error = true
        // 请求失败了, loading也需要关闭
        this.loading = false
      }
    },
    async onRefresh() {
      // 1. 获取最新的文章数据
      try {
        const { data: res } = await getArticleList({
          channel_id: this.channel.id, // 频道id
          // 请求数据的页码
          // 请求第一页, 请求当前最新时间戳
          // 用于请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: Date.now(),
          with_top: 1
        })
        console.log(res)
        const { results } = res.data
        // 2. 从list列表最前面插入文章数据
        this.list.unshift(...results)
        // 3. 刷新结束
        this.refreshing = false
        this.refreshSuccessText = `刷新成功, 更新了 ${results.length} 条数据`
      } catch (err) {
        this.refreshing = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang='less' scoped>
.article-list {
  padding-bottom: 100px;
  height: 79vh;
  overflow-y: auto;
}
</style>
