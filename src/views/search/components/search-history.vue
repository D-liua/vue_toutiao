<template>
  <div class="search-history">
    <van-cell title="搜索历史" center>
      <div v-if="isDeleteShow">
        <span class="removeAll" @click="$emit('remove-search-all')">全部删除</span>
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
    </van-cell>
    <van-cell
      :title="item"
      :key="index"
      v-for="(item, index) in searchHistories"
      @click="onSearchItemClick(item, index)"
    >
      <van-icon v-show="isDeleteShow" name="close"></van-icon>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    // prop 数据
    // prop 是受父组件数据影响的
    //  如果是普通数据 (数字, 字符串, 布尔值) 绝对不能修改
    //  即使修改了, 也不会传导给父组件
    //
    //  如果是引用类型数据 (数组, 对象)
    //    可以修改, 例如 [].push
    //    不能重新赋值, xxx = []
    searchHistories: {
      type: Array,
      required: true
    }
  },
  components: {},
  data() {
    return {
      isDeleteShow: false
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSearchItemClick(item, idx) {
      if (this.isDeleteShow) {
        // 如果是删除模式, 删除历史记录
        this.searchHistories.splice(idx, 1)
      } else {
        // 非删除模式, 搜索历史记录
        this.$emit('toSearch', item)
      }
    }
  }
}
</script>

<style lang='less' scoped>
.search-history {
  .removeAll {
    margin-right: 10px;
    color: rgb(231, 124, 124);
  }
}
</style>
