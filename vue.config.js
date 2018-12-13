module.exports = {
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'examples/index.html',
      filename: 'index.html',
      title: 'vue-slot-hooks Examples'
    }
  },

  baseUrl: process.env.NODE_ENV === 'production' ? '/vue-slot-hooks/' : '/'

  // chainWebpack: config => {
  //   config.module
  //     .rule('md')
  //     .test(/\.md/)
  //     .use('vue-loader')
  //     .loader('vue-loader')
  //     .end()
  //     .use('vue-markdown-loader')
  //     .loader('vue-markdown-loader/lib/markdown-compiler')
  //     .options({
  //       raw: true
  //     })
  // }
}
