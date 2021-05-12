<template>
  <div class="my-container">
    <!-- 登录显示 -->
    <div v-if="user" class="header on-login">
      <div class="user-info">
        <div class="user-info_left">
          <van-image class="avatar" fit="cover" round :src="userInfo.photo" />
          <span class="text">{{ userInfo.intro }}</span>
        </div>
        <div class="user-info_right">
          <van-button round size="mini" block to="/profile">编辑资料</van-button>
        </div>
      </div>
      <!-- 数据项 -->
      <div class="data-stats">
        <div class="data-stats_item">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="bottom">头条</span>
        </div>
        <div class="data-stats_item">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="bottom">关注</span>
        </div>
        <div class="data-stats_item">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="bottom">粉丝</span>
        </div>
        <div class="data-stats_item">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="bottom">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录显示 -->
    <div v-else class="header not-login" @click="$router.push('/login')">
      <div class="login-btn">
        <img src="~@/assets/mobile.png" alt="" />
        <span class="text">登录 / 去注册</span>
      </div>
    </div>
    <!-- 页面导航 -->
    <van-grid class="grid-nav" clickable :column-num="2">
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
    </van-grid>

    <!-- 单元格 -->
    <van-cell-group class="group-box">
      <van-cell title="消息通知" is-link />
      <van-cell title="小智同学" is-link />
    </van-cell-group>
    <!-- 退出登录 -->
    <van-cell-group v-if="user" class="group-box group-exit" @click="onLayerOut" clickable>
      <van-cell class="group-exit_item" title="退出登录" />
    </van-cell-group>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '../../api/user'
export default {
  name: 'MyIndex',
  components: {},
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    if (this.user) {
      this.loadUserInfo()
    }
  },
  mounted() {},
  methods: {
    onLayerOut() {
      // 确认退出提示
      this.$dialog
        .confirm({
          title: '确认退出吗?'
        })
        .then(() => {
          // 确认执行这里的代码
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 取消执行这里的代码
        })
      // 确认退出: 清除登录状态(清除user里的token)
      console.log('退出')
    },
    // 加载用户信息
    async loadUserInfo() {
      try {
        const { data: res } = await getUserInfo()
        console.log(res)
        this.userInfo = res.data
        console.log('获取信息成功')
      } catch (err) {
        if (err.response.status === 401) {
          this.$toast('token无效')
        }
        console.log(err.response)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.header {
  height: 361px;
  background: url('~@/assets/banner.png') no-repeat;
  background-size: cover;
}
.not-login {
  display: flex;
  justify-content: center;
  align-items: center;
  .login-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 132px;
      height: 132px;
    }
    .text {
      margin: 15px;
      font-size: 28px;
      color: #fff;
    }
  }
}

.on-login {
  background: url('~@/assets/banner.png') no-repeat;
  .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: 231px;
    padding: 76px 32px 23px;
    .user-info_left {
      display: flex;
      align-items: center;
      .avatar {
        width: 132px;
        height: 132px;
        margin-right: 23px;
        border: 4px solid #fff;
      }
      .text {
        font-size: 30px;
        color: #fff;
      }
    }
  }
  .data-stats {
    display: flex;
    height: 130px;
    .data-stats_item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .bottom {
        font-size: 23px;
      }
    }
  }
}

.grid-nav {
  .grid-item {
    height: 141px;
    i.toutiao {
      font-size: 40px;
    }
    span.text {
      font-size: 28px;
    }
    .toutiao-lishi {
      color: #eb5253;
    }

    .toutiao-shoucang {
      color: #ff9d1d;
    }
  }
}

.group-box {
  margin-top: 10px;
}

.group-exit {
  text-align: center;
  .group-exit_item {
    color: rgb(224, 93, 93);
  }
}
</style>
