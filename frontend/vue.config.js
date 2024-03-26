const webpack = require('webpack')

module.exports = {
  publicPath: '',
  transpileDependencies: true,
  productionSourceMap: false,
  outputDir: 'dist',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'true'
      })
    ]
  }
}
