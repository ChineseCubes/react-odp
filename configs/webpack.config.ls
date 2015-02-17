require! webpack

module.exports =
  entry: './main'
  output:
    filename: 'build.js'
  plugins:
    * new webpack.optimize.UglifyJsPlugin
    * new webpack.NoErrorsPlugin
  module:
    loaders:
      * test: /\.css$/, loader: 'style!css'
      ...
  resolve:
    alias:
      request: 'browser-request'

