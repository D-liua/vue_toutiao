<template>
  <!-- cell单元格的to属性和 VueRouter 中的 RouterLink 导航组件的to是一样的 用法餐卡链接: https:// router.vue.js.org/zh/api/#to :to=="/article/" + article.art_id :to = `/article/${article.art_id}` -->
  <van-cell class="article-item" :to="{ name: 'article', params: { articleId: article.art_id } }">
    <div slot="title" class="title van-multi-ellipsis--12">{{ article.title }}</div>
    <div slot="label" class="label">
      <div>
        <div v-if="article.cover.type === 3" class="cover-wrap">
          <div class="cover-item" v-for="(img, index) in article.cover.images" :key="index">
            <van-image fit="cover" :src="img" class="cover-item-image"></van-image>
          </div>
        </div>
        <div class="label-info-wrap">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}</span>
          <span>{{ article.pubdate | relativeTime }}</span>
        </div>
      </div>
    </div>
    <van-image
      v-if="article.cover.type === 1"
      slot="default"
      :src="article.cover.images[0]"
      class="right-cover"
      fit="cover"
    ></van-image>
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
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
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }

  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }

  .right-cover {
    width: 232px;
    height: 146px;
  }

  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 15px;
  }

  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item-image {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
