/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
// const productionGzipExtensions = ['js', 'css']

module.exports = {
  publicPath: '/',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['./node_modules', './src/assets'],
        },
      },
    },
  },
  configureWebpack: {
    optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 120000,
        maxSize: 250000,
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            name() {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              // const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)

              // npm package names are URL-safe, but some servers don't like @ symbols
              return 'ping.pub.chunks'
            },
          },
        },
      },
    },
    resolve: {
      alias: {
        '@themeConfig': path.resolve(__dirname, 'themeConfig.js'),
        '@core': path.resolve(__dirname, 'src/@core'),
        '@validations': path.resolve(__dirname, 'src/@core/utils/validations/validations.js'),
        '@axios': path.resolve(__dirname, 'src/libs/axios'),
      },
      extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
      new NodePolyfillPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'disabled',
        openAnalyzer: false,
      }),
      // new CompressionWebpackPlugin({
      //   test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
      //   threshold: 8192,
      //   minRatio: 0.8,
      // }),
    ],
  },
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // eslint-disable-next-line no-param-reassign
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src',
        }
        return options
      })
    config.module
      .rule('ts')
      .test(/\.tsx?$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({
        appendTsSuffixTo: [/\.vue$/],
      })
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://cosmos.api.ping.pub/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
}
