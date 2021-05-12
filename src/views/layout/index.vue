<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <router-view></router-view>

    <!-- 标签导航栏 -->
    <van-tabbar route>
      <van-tabbar-item to="/">
        <span class="text">首页</span>
        <template #icon>
          <i class="toutiao toutiao-shouye"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <span class="text">问答</span>
        <template #icon>
          <i class="toutiao toutiao-wenda"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <span class="text">视频</span>
        <template #icon>
          <i class="toutiao toutiao-shipin"></i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span class="text">{{ $store.state.user ? '我的' : '未登录' }}</span>
        <template #icon>
          <i class="toutiao toutiao-wode"></i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang='less' scoped>
.layout-container {
  i.toutiao {
    font-size: 40px;
  }
  span.text {
    font-size: 20px;
  }
}
</style>
