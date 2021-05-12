<template>
  <div class="channel-edit">
    <van-cell title="我的频道" center :border="false">
      <van-button
        class="cell-btn"
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <van-grid class="my-grid" square gutter="14">
      <van-grid-item
        :icon="isEdit && !fiexChannels.includes(value.id) ? 'clear' : ''"
        class="grid-item"
        v-for="(value, index) in myChannels"
        :key="value.id"
        @click="toChannel(value, index)"
      >
        <span class="text" :class="{ active: index === active }" slot="text">{{ value.name }}</span>
      </van-grid-item>
    </van-grid>
    <van-cell title="频道推荐" :border="false"> </van-cell>
    <van-grid class="recommend-grid" square gutter="14">
      <van-grid-item
        icon="plus"
        class="grid-item"
        v-for="(value, index) in recommenChannels"
        :key="index"
        :text="value.name"
        @click="onAddChannel(value)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, removeUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  components: {},
  data() {
    return {
      allChannelsList: [], // 全部频道数据
      isEdit: false, // 控制编辑状态的显示
      fiexChannels: [0] // 固定频道, 不允许删除
    }
  },
  // 计算属性会观测内部依赖属性的变化
  // 如果依赖属性发生变化, 则计算属性会发生重新计算
  computed: {
    recommenChannels() {
      // 数组的filter方法: 遍历数组, 把符合条件的元素储存到新数组
      return this.allChannelsList.filter(item => {
        // 数组的 find 方法: 遍历数组, 把符合条件的第一个元素返回
        return !this.myChannels.find(item1 => {
          return item.id === item1.id
        })
      })
    },
    ...mapState(['user'])
  },
  watch: {},
  created() {
    this.loadAllChannels()
  },
  mounted() {},
  methods: {
    async loadAllChannels() {
      try {
        const { data: res } = await getAllChannels()
        this.allChannelsList = res.data.channels
      } catch (err) {
        this.$toast('请求所有频道数据失败')
      }
    },
    async onAddChannel(item) {
      this.myChannels.push(item)
      // 数据持久化处理
      if (this.user) {
        // 已登录, 把数据请求接口放到线上
        try {
          const res = await addUserChannel({
            id: item.id, // 频道id
            seq: this.myChannels.length // 序号
          })
          console.log(res)
        } catch (err) {
          this.$toast('添加频道失败')
        }
      } else {
        // 未登录, 把数据储存到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },
    toChannel(item, index) {
      if (this.isEdit) {
        // 编辑状态,执行删除频道

        // 如果是固定频道, 就不删除
        if (this.fiexChannels.includes(item.id)) {
          return false
        }
        // 如是删除频道是激活频道之前的, 则更新频道项
        if (index <= this.active) {
          // 让激活频道的索引 -1
          this.$emit('toChannel', this.active - 1)
        }
        this.myChannels.splice(index, 1)

        // 处理持久化
        this.removeUserChannel(item.id)
      } else {
        // 非编辑状态执行切换频道
        this.$emit('toChannel', index, false)
      }
    },
    async removeUserChannel(id) {
      try {
        if (this.user) {
          const res = await removeUserChannel(id)
          console.log(res)
        } else {
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除频道失败')
      }
    }
  }
}
</script>

<style lang='less' scoped>
.channel-edit {
  margin-top: 80px;
  .cell-btn {
    // margin-bottom: 10px;
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border-color: #f85959;
  }

  /deep/.grid-item {
    padding-top: 12.5% !important;
    .van-grid-item__content {
      white-space: nowrap; // 文字不折行
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
      }
      .active {
        color: #f85959;
      }
    }
  }

  /deep/.my-grid {
    .van-icon-clear {
      position: absolute;
      top: 0;
      right: 0;
      margin: -10px -10px 0 0;
      font-size: 15px;
      color: #cacaca;
      z-index: 2;
    }
    .van-grid-item__text {
      margin-top: 0;
    }
  }
  /deep/.recommend-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          font-weight: 900;
          margin-right: 6px;
        }
        .van-grid-item__text {
          margin-top: 0;
        }
      }
    }
  }
}
</style>
