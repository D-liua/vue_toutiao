<template>
  <div class="update-birthday-container">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('update:isBrithdayShow', false)"
      @confirm="editBirthday"
    />
  </div>
</template>

<script>
import { editUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  name: 'UpdateBirthday',
  props: {
    birthday: {
      type: String,
      required: true
    }
  },
  components: {},
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(this.birthday)
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async editBirthday() {
      try {
        this.$toast.loading({
          message: '修改中...',
          forbidClick: true,
          loadingType: 'spinner'
        })
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
        console.log(currentDate)
        await editUserProfile({
          birthday: currentDate
        })
        this.$emit('update:isBrithdayShow', false)
        this.$emit('update:birthday', currentDate)
        this.$toast.success('修改生日成功')
      } catch (err) {
        this.$toast('修改生日失败')
      }
    }
  }
}
</script>

<style lang='less' scoped></style>
