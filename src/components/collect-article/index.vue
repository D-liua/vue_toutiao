<template>
  <van-icon
    :color="isCollected ? 'orange' : '#777'"
    :name="isCollected ? 'star' : 'star-o'"
    @click="onCollect"
  />
</template>

<script>
import { addCollect, deleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: {
    isCollected: {
      type: Boolean,
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
    async onCollect() {
      try {
        this.$toast.loading({
          message: '操作中...',
          forbidClick: true // 禁止背景点击
        })
        if (this.isCollected) {
          // 已收藏，取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 没有收藏，添加收藏
          await addCollect(this.articleId)
        }
        this.$emit('update:is_collected', !this.isCollected)
        // this.article.is_collected = !this.article.is_collected
        this.$toast.success(`${this.isCollected ? '' : '取消'}收藏成功`)
      } catch (err) {
        this.$toast('添加收藏或者取消收藏失败')
      }
    }
  }
}
</script>

<style lang='less' scoped></style>
