<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar nav-bar-global"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <div v-if="loading" class="loading-wrap">
      <van-loading color="#3296fa" vertival>加载中</van-loading>
    </div>

    <div v-else-if="article.title" class="article-wrap">
      <h1 class="title">{{ article.title }}</h1>
      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image slot="icon" class="avatar" round fit="cover" :src="article.aut_photo" />
        <div slot="label" class="pubdate">{{ article.pubdate | relativeTime }}</div>
        <!-- 模板中的 $event 是时间参数
        当我们传递给子组件的数据既要使用还要修改
          传递: props
            :isFollowed="article.is_followed"
          修改: 自定义事件
            @update-is_followed="article.is_followed = $event"
        简写方式: 在组件上使用 v-model
          value="artocle.is_followed"
          @input="article.is_followed = $event"
          如果需要修改 v-modelde 的规则名称, 可以通过 model属性来配置

          一个组件只能使用一次 v-model,
          如果有多个数据需要实现类似于 v-model 的效果, 咋办?
          可以使用属性的 .sync 修饰符-->
        <follow-user
          class="follow-btn"
          v-model="article.is_followed"
          :authorId="article.aut_id"
        ></follow-user>
      </van-cell>
      <div class="markdown-body" v-html="article.content" ref="article-content"></div>
      <!-- 文章评论列表 -->
      <!-- <comment-list
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
        @reply-click="onReplyClick"
      /> -->

      <comment-items
        :list="commentList"
        :source="articleId"
        v-bind:total_count.sync="totalCommentCount"
        @reply-click="onReplyClick"
      ></comment-items>
      <!-- /文章评论列表 -->

      <!-- 底部区域 -->
      <div class="article-bottom">
        <van-button class="comment-btn" type="default" round size="small" @click="isPostShow = true"
          >写评论</van-button
        >
        <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
        <!-- <van-icon
        :color="article.is_collected ? 'orange' : '#777'"
        :name="article.is_collected ? 'star' : 'star-o'"
        @click="onCollect"
      /> -->
        <collect-article
          :isCollected="article.is_collected"
          :articleId="articleId"
          v-bind:is_collected.sync="article.is_collected"
        ></collect-article>
        <!-- <van-icon
          :color="article.attitude === 1 ? 'hotpink' : '#777'"
          :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
          @click="onLike"
        /> -->
        <like-article
          :attitude="article.attitude"
          :articleId="articleId"
          v-bind:_attitude.sync="article.attitude"
        ></like-article>
        <van-icon name="share" color="#777777"></van-icon>
      </div>
      <!-- /底部区域 -->
    </div>

    <!-- 加载失败: 404 -->
    <div v-else-if="errStatus === 404" class="error-wrap">
      <van-icon name="photo-fail" size="100" color="#b4b4b4" />
      <p style="color: #b4b4b4">该资源不存在或已删除</p>
    </div>

    <!-- 加载失败: 其它位置错误 -->
    <div v-else class="error-wrap">
      <van-icon name="photo-fail" size="100" color="#b4b4b4" />
      <p style="color: #b4b4b4">该资源不存在或已删除</p>
      <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
    </div>

    <!-- 发布评论 -->
    <van-popup v-model="isPostShow" position="bottom">
      <post-comment :target="articleId" @post-success="onPostSuccess" />
    </van-popup>
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 80%">
      <!--popup是懒渲染的: 只有在第一次展示的时候才会渲染里面的内容, 之后的只会改变其中的内容, 不会重新渲染 -->
      <!-- 这里使用 v-if 的目的是让组件随着弹出层的显示进行渲染和销毁，防止加载过的组件不重新渲染导致数据不会重新加载的问题 -->
      <comment-reply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      />
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'

// import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentItems from './components/comment-items'

export default {
  name: 'ArticleIndex',
  components: {
    // CommentList,
    PostComment,
    CommentReply,
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentItems
  },
  // 在组件中获取动态路由参数：
  //    方式一：this.$route.params.articleId
  //    方式二：props 传参，推荐
  //      this.articleId
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      loading: true, // 控制是否加载loading
      errStatus: 0, // 失败的状态码
      article: {}, // 文章数据对象
      isCollectLoading: false, // 收藏的 loading 状态
      isPostShow: false, // 控制发布评论的显示状态
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论总数据量
      isReplyShow: false, // 控制回复的显示状态
      replyComment: {} // 当前回复评论对象
    }
  },
  computed: {},
  watch: {},
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // if (Math.random() > 0.5) {
        //   JSON.parse('sadadadadadda')
        // }
        this.article = data.data
        console.log(data)
        // 请求成功关闭loading
        // this.loading = false
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        // this.loading = false
        console.log(err)
        this.$toast('请求文章列表失败')
      }
      // 无论成功或者事变, 否要关闭loading
      this.loading = false

      // 数据改变影响视图更新（DOM数据）不是立即的
      // 所以如果需要在修改数据之后马上操作被该数据影响的视图 DOM，需要把这个代码放到 $nextTick 中

      // this.$nextTick 是 Vue 提供的一个方法
      // 参考文档：
      this.$nextTick(() => {
        this.handlePerviewImage()
      })
    },

    handlePerviewImage() {
      // 1. 获取文章内容 DOM 容器
      const articleContent = this.$refs['article-content']

      // 2. 得到所有的 img 标签
      const imgs = articleContent.querySelectorAll('img')

      const imgPaths = [] // 收集所有的图片路径

      // 3. 循环 img 列表，给 img 注册点击事件
      imgs.forEach((img, index) => {
        imgPaths.push(img.src)
        img.onclick = function () {
          // 4. 在事件处理函数中调用 ImagePreview() 预览
          ImagePreview({
            images: imgPaths, // 预览图片路径列表
            startPosition: index // 起始位置
          })
        }
      })
    },

    onPostSuccess(comment) {
      // 把发布成功的评论数据对象放到评论列表顶部
      this.commentList.unshift(comment)

      // 更新评论的总数量
      this.totalCommentCount++

      // 关闭发布评论弹出层
      this.isPostShow = false
    },

    onReplyClick(comment) {
      console.log('onReplyClick', comment)
      this.replyComment = comment

      // 展示回复内容
      this.isReplyShow = true
    }
  }
}
</script>

<style lang='less' scoped>
.loading-wrap,
.error-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
}

.error-wrap {
  flex-direction: column;
}

.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 92px;
  bottom: 88px;
  overflow-y: auto;
}
.title {
  font-size: 40px;
  color: #3a3a3a;
  padding: 24px 20px 18px;
  background-color: #fff;
  margin: 0;
}

.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 12px;
    color: #333333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 170px;
    height: 58px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}

.article-bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-sizing: border-box;
  height: 88px;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 282px;
    height: 46px;
    border: 1px solid #eeeeee;
    font-size: 30px;
    line-height: 46px;
    color: #a7a7a7;
  }
  /deep/.van-icon {
    font-size: 40px;
    .van-info {
      font-size: 22px;
      background-color: #e22829;
    }
  }
}
</style>
