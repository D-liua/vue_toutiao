<template>
  <div class="update-photo-container">
    <img :src="img" ref="img" />
    <div class="photo-btn">
      <span class="cancel" @click="$emit('update:isPhotoShow', false)">取消</span>
      <span class="confirm" @click="onConfirm">确定</span>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updatePhoto } from '@/api/user'
export default {
  name: 'UpdatePhoto',
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  components: {},
  data() {
    return {
      cropper: null
    }
  },
  watch: {},
  created() {},
  mounted() {
    const images = this.$refs.img
    this.cropper = new Cropper(images, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      // autoCropArea: 1
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
    console.log(this.cropper)
  },
  methods: {
    onConfirm() {
      // 得到图片裁切的位置对象
      // this.cropper.getData()
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto(blob) {
      try {
        this.$toast.loading({
          message: '修改中...',
          forbidClick: true,
          loadingType: 'spinner'
        })

        const forData = new FormData()
        forData.append('photo', blob)
        const { data: res } = await updatePhoto(forData)
        this.$emit('update:photo', res.data.photo)
        this.$emit('update:isPhotoShow', false)
        this.$toast('修改头像成功')
      } catch (err) {
        this.$toast('修改用户头像失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.update-photo-container {
  height: 100%;
  background-color: #000;
  img {
    display: block;
    max-width: 100%;
  }
  .photo-btn {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    font-size: 30px;
    .cancel,
    .confirm {
      width: 80px;
      height: 80px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
  }
}
</style>
