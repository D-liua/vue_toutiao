/**
 * postCss 配置文件
 * 基于node.js来写的 使用node.js 导出模块
 */

module.exports = {
  // 配置要使用的postCSS插件
  plugins: {
    // 配置使用autoperfixer
    // 作用: 生成浏览器 CSS 样式规则前缀
    // VueCLI  内部已经配置了 autoprefixer 插件
    // 又配置了一次, 所以产长冲突了
    // autoprefixer: {
    //   // autoprefixer 插件的配置
    //   // 配置要兼容的环境信息

    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },

    // 配置使用post-pxtorem 插件
    // 作用: 把px转为rem
    'postcss-pxtorem': {
      // lib-flexible 的Rem 适配方案: 把每一行分为10份, 每份就是10分之1
      // 所以 rootValue 应该设置为你设计稿宽度的10分之1
      // 但是 vant 建议设置为 37.5, 为什么? 因为vant是基于375写的
      // 所有必须是设置为37.5, 唯一的缺点就是我们的设计稿的尺寸否必须除以2
      // 有没有更好的办法?
      //    如果是Vant的样式, 就按照 37.5 来转换
      //    如果是我们自己的样式就按照75来转换
      // rootValue 支持两种类型 bumber|function
      //    数字: 固定的数值
      //    函数: 可以动态处理返回
      //       postcss-pxtorem 处理每个 css 文件的时候都会来调用这个函数
      //       他会把被处理的 css 文件相关信息通过参数传递给该函数
      rootValue: ({ file }) => {
        console.log('+++++++', file)
        return file.indexOf('vant') !== -1 ? '37.5' : 75
      },
      // 配置要转换的css属性
      // * 表示所有
      propList: ['*'],
      // 配置不要转换样式资源
      exclude: 'github-markdown'
    }
  }
}
