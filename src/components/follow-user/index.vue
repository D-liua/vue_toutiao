<template>
  <van-button
    round
    size="small"
    :type="isFollowed ? 'default' : 'info'"
    :icon="isFollowed ? '' : 'plus'"
    :loading="isFollowLoading"
    @click="onFollow"
    >{{ isFollowed ? '已关注' : '关注' }}</van-button
  >
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user'
export default {
  name: 'FollowUser',
  props: {
    isFollowed: {
      type: [Number, String, Object, Boolean],
      required: true
    },
    authorId: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  model: {
    prop: 'isFollowed', // 默认是value
    event: 'update-is_followed' // 默认是input
  },
  data() {
    return {
      isFollowLoading: false // 关注用户按钮的 loading 状态
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onFollow() {
      try {
        this.isFollowLoading = true
        if (this.isFollowed) {
          // 已关注，取消关注
          await deleteFollow(this.authorId)
          // this.article.is_followed = false
        } else {
          // 没有关注，添加关注
          await addFollow(this.authorId)
          // this.article.is_followed = true
        }
        this.$emit('update-is_followed', !this.isFollowed)
        // this.article.is_followed = !this.article.is_followed
        // this.isFollowLoading = false
      } catch (err) {
        let message = '操作失败,请重试'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.isFollowLoading = false
    }
  }
}
</script>

<style lang='less' scoped></style>
