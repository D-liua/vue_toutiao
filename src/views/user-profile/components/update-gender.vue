<template>
  <div class="update-genter-container">
    <van-picker
      title="标题"
      show-toolbar
      :default-index="currentVal"
      :columns="columns"
      @cancel="$emit('update:isGenterShow', false)"
      @confirm="editUserGender"
      @change="onChange"
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    sex: {
      type: [Number, String, Object],
      required: true
    }
  },
  components: {},
  data() {
    return {
      columns: ['男', '女'],
      currentVal: this.sex
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async editUserGender() {
      console.log('1')
      try {
        this.$toast.loading({
          message: '修改中...',
          forbidClick: true,
          loadingType: 'spinner'
        })
        const currentIdx = this.currentVal
        console.log(currentIdx)
        await editUserProfile({ gender: currentIdx })
        this.$toast.success('修改性别成功')
        this.$emit('update:isGenterShow', false)
        this.$emit('update:sex', currentIdx)
      } catch (err) {
        this.$toast('修改性格失败')
      }
    },
    onChange(obj, val, idx) {
      this.currentVal = idx
    }
  }
}
</script>

<style lang='less' scoped></style>
