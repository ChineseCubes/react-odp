require! webpack

module.exports =
  entry:
    * ''
    * 'webpack/hot/only-dev-server'
    * './main'
  devtool: 'source-map'
  output:
    path: __dirname
    filename: 'build.js'
    publicPath: '/'
  plugins:
    * new webpack.HotModuleReplacementPlugin
    * new webpack.optimize.UglifyJsPlugin
    * new webpack.NoErrorsPlugin
  module:
    loaders:
      * test: /\.css$/, loader: 'style!css'
      * test: /\.js$/, loader: 'react-hot', exclude: /node_modules/
  resolve:
    alias:
      request: 'browser-request'

