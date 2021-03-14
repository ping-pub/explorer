/*
 * @Author: your name
 * @Date: 2020-02-29 02:01:23
 * @lastTime: 2021-02-19 11:07:36
 * @LastEditors: dingyi
 * @Description: In User Settings Edit
 * @FilePath: /look-web/vue.config.js
 */
module.exports = {
  css: {
    extract: false,
    sourceMap: false,
  },
  configureWebpack: config => {
    config.externals = {
      'vue': 'Vue',
      'element-ui' : 'ELEMENT',
    }
    config.optimization.splitChunks = false
  },
  productionSourceMap: false,
  outputDir: 'server/dist',
  devServer: {
    proxy: {
      '/api': {
        target: 'https://lcd-cosmos.cosmostation.io',
        changeOrigin: true,
        pathRewrite: { ['^/api']: '' },
        router: function (req) {
          console.log(req.headers.server)
          return req.headers.server;
        }
      },
      '/look': {
        target: 'https://look.ping.pub',
        changeOrigin: true,
        pathRewrite: { ['^/look']: 'look' }
      },
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
    m: {
      entry: 'src/entry-h5/main.js',
      template: 'src/entry-h5/index.html',
      filename: 'm.html',
    }
  }
}