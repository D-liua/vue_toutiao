<template>
  <div class="user-profile">
    <van-nav-bar title="个人信息" left-arrow @click-left="$router.back()" class="nav-bar-global" />
    <input type="file" hidden ref="file" @change="onFileChange" />
    <van-cell class="user-avatar-box" title="头像" is-link @click="$refs.file.click()">
      <van-image class="user-avatar" round :src="userProfile.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="userProfile.name"
      is-link
      @click="isUpdateNameShow = true"
    ></van-cell>
    <van-cell
      title="性别"
      :value="userProfile.gender === 0 ? '男' : '女'"
      is-link
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <van-cell
      @click="isUpdateBirthodayShow = true"
      title="生日"
      :value="userProfile.birthday"
      is-link
    ></van-cell>
    <!-- 编辑昵称 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
      class="popup-bgcolor"
    >
      <update-name
        v-if="isUpdateNameShow"
        :isShow.sync="isUpdateNameShow"
        :name.sync="userProfile.name"
      ></update-name>
    </van-popup>
    <!-- 修改性格 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom" class="popup-bgcolor">
      <update-gender
        :isGenterShow.sync="isUpdateGenderShow"
        :sex.sync="userProfile.gender"
      ></update-gender>
    </van-popup>
    <!-- 修改生日 -->
    <van-popup v-model="isUpdateBirthodayShow" position="bottom" class="popup-bgcolor">
      <update-birthday
        :birthday.sync="userProfile.birthday"
        :isBrithdayShow.sync="isUpdateBirthodayShow"
      ></update-birthday>
    </van-popup>
    <!-- 编辑头像 -->
    <van-popup v-model="isUpdatePhotoShow" style="height: 100%" position="bottom">
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        :photo.sync="userProfile.photo"
        :isPhotoShow.sync="isUpdatePhotoShow"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-brithday'
import UpdatePhoto from './components/update-photo'
export default {
  name: 'UserProfile',
  porps: {},
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data() {
    return {
      userProfile: {}, // 个人信息
      isUpdateNameShow: false,
      isUpdateGenderShow: false, // 控制性别弹框的显示和隐藏
      isUpdateBirthodayShow: false,
      isUpdatePhotoShow: false,
      // img: this.userProfile.photo || null
      img: null
    }
  },
  watch: {},
  created() {
    this.loadUserProfile()
  },
  mounted() {},
  methods: {
    async loadUserProfile() {
      try {
        // 请求用户资料
        const { data: res } = await getUserProfile()
        console.log(res)
        this.userProfile = res.data
      } catch (err) {
        this.$toast('请求用户资料失败')
      }
    },
    onFileChange() {
      // console.log(this.$ref.file)
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取bolb数据
      const bolb = URL.createObjectURL(file)
      this.img = bolb
      this.isUpdatePhotoShow = true
      // file-input 如果选了同一张图片, 就不会触发change事件
      // 解决办法, 就是每次使用完之后, 就将值清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang='less' scoped>
.user-profile {
  .user-avatar {
    vertical-align: middle;
  }
  .user-avatar-box {
    align-items: center;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
  }
  .popup-bgcolor {
    background-color: #f5f7f9;
  }
}
</style>
