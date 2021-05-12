<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.aut_name" /> -->
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
      ></comment-item>
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentItems',
  props: {
    list: {
      type: [Object, Array],
      // 数组或者是对象默认值必须由函数返回
      default: () => []
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      // Array.prototype.includes() 判断一个数组是否包含某一个指定值, 如果包含返回true, 否则返回false
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a'
    },
    source: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {
    CommentItem
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limit: 10 // 获取每页评论的条数
    }
  },
  watch: {},
  created() {
    // 当你手动初始 onload 的话, 它不会自动开始初始的 loading
    // 所以我们要手动的开启初始 loading
    this.loading = true
    this.onLoad()
  },
  mounted() {},
  methods: {
    async onLoad() {
      console.log(this.source)
      try {
        // 1. 请求评论列表数据
        const { data: res } = await getComments({
          type: this.type,
          source: this.source.toString(),
          offset: this.offset,
          limit: this.limit
        })
        // 2. 将数据放到列表中
        console.log(res)
        this.list.push(...res.data.results)
        // 2.1 将评论的总数量传递给父组件
        this.$emit('update:total_count', res.data.total_count)
        // 3. 将loading的状态变更为false
        this.loading = false
        // 4. 判断是否还有数据
        //    如果有, 更新下一页数据的页码
        //    没有, 将 finished 的值更改为true, 不在加载更多了
        if (res.data.results.length) {
          this.offset = res.data.last_id
        } else {
          this.finished = true
        }
      } catch (err) {
        this.$toast('请求评论列表失败')
      }
    }
  }
}
</script>

<style lang='less' scoped></style>
