<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar nav-bar-global" fixed>
      <van-button
        class="search-btn"
        slot="title"
        round
        type="info"
        size="small"
        icon="search"
        to="search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 标签栏 -->
    <van-tabs class="page-bar" v-model="active" animated swipeable>
      <van-tab :key="channel.id" v-for="channel in userChannels" :title="channel.name">
        <article-list :channel="channel"></article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="showPopup">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      v-model="isShow"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      class="my-popup"
    >
      <channel-edit
        :my-channels="userChannels"
        :active="active"
        @toChannel="toChannel"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '../../api/user.js'
import ArticleList from './components/articleList'
import ChannelEdit from './components/channelEdit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

// 这个方法可以快速找到是那是元素发生了滚动
// function findScroller(element) {
//   element.onscroll = function() { console.log(element) }
//   Array.from(element.children).forEach(findScroller)
// }
// findScroller(document.body)

export default {
  name: 'HomeIndex',
  components: {
    'article-list': ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      userChannels: [],
      // 控制弹出层是否显示
      isShow: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadUserChannels()
  },
  mounted() {},
  methods: {
    async loadUserChannels() {
      try {
        var channels = []
        if (this.user) {
          // 已登录, 请求用户频道列表
          const { data: res } = await getUserChannels()
          channels = res.data.channels
        } else {
          // 未登录, 判断是否有本地的频道列表数据
          const data = getItem('TOUTIAO_CHANNELS')
          //  有, 拿来使用
          if (data) {
            channels = data
          } else {
            //  没有, 请求获取默认列表
            const { data: res } = await getUserChannels()
            channels = res.data.channels
          }
        }
        this.userChannels = channels
      } catch (err) {
        this.$toast('获取频道列表数据失败')
      }
    },
    // 显示弹出层
    showPopup() {
      console.log('222')
      this.isShow = true
    },
    toChannel(index, isChannelsShow = true) {
      console.log(index)
      this.active = index
      this.isShow = isChannelsShow
    }
  }
}
</script>

<style lang='less' scoped>
.home-container {
  padding-top: 174px;
  /deep/.van-nav-bar__title {
    max-width: unset;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #47a1fb;
    border: none;
  }

  /deep/.page-bar {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      height: 82px;
      width: 100%;
      z-index: 2;
    }
    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      border-top: none;
      border-bottom: none;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 30px;
      background-color: #4d97f3;
    }
    .van-tabs__nav--complete {
      padding: 0;
      // padding-right: 200px;
    }
    .placeholder {
      flex-shrink: 0;
      width: 64px;
      height: 82px;
    }
    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: rgba(255, 255, 255, 0.795);
      i.toutiao {
        font-size: 33px;
      }
      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background: url(~@/assets/gradient-gray-line.png) no-repeat center;
        background-size: 100% 80%;
      }
    }
  }

  /deep/.van-popup__close-icon {
    left: 32px;
  }
}
</style>
