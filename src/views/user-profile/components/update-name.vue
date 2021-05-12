<template>
  <div class="update-name-container">
    <!-- 导航栏 -->
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="完成"
      @click-right="edtiUserProfile"
      @click-left="$emit('update:isShow', false)"
    ></van-nav-bar>
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model="username"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入昵称"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    name: {
      type: [String],
      required: true,
      default: ''
    }
  },
  components: {},
  data() {
    return {
      username: this.name
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async edtiUserProfile() {
      this.$toast.loading({
        message: '修改中...',
        forbidClick: true,
        loadingType: 'spinner'
      })
      try {
        if (!this.username.length) {
          this.$toast('昵称不能为空')
          return
        }
        const { data: res } = await editUserProfile({
          name: this.username
        })
        console.log(res)
        this.$emit('update:isShow', false)
        this.$emit('update:name', this.username)

        this.$toast.success('修改成功')
      } catch (err) {
        this.$toast('修改用户资料失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.update-name-container {
  .field-wrap {
    margin-top: 20px;
  }
}
</style>
