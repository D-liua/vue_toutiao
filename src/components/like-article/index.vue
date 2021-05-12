<template>
  <van-icon
    :color="attitude === 1 ? 'hotpink' : '#777'"
    :name="attitude === 1 ? 'good-job' : 'good-job-o'"
    @click="onLike"
  />
</template>

<script>
import { addLike, deleteLike } from '@/api/article'

export default {
  name: 'LikeArticle',
  props: {
    attitude: {
      type: [Number],
      required: true
    },
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  components: {},
  data() {
    return {}
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onLike() {
      try {
        this.$toast.loading({
          message: '操作中...',
          forbidClick: true // 禁止背景点击
        })
        if (this.attitude === 1) {
          // 已点赞，取消点赞
          await deleteLike(this.articleId)
          this.$emit('update:_attitude', -1)
          // this.$toast.success('取消点赞成功')
        } else {
          // 没有点赞，添加点赞
          await addLike(this.articleId)
          this.$emit('update:_attitude', 1)
          // this.$toast.success('点赞成功')
        }
        setTimeout(
          function () {
            this.$toast.success(`${this.attitude === 1 ? '' : '取消'}点赞成功`)
          }.bind(this),
          0
        )
      } catch (err) {
        this.$toast('点赞或者取消点赞失败')
      }
    }
  }
}
</script>

<style lang='less' scoped></style>
