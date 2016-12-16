var config = require('./webpack.config.js')
var webpack = require('webpack')

config.devtool = 'cheap-module-source-map'
config.module.loaders[1].loader = "style-loader!css-loader?importLoaders=1!postcss-loader"


module.exports = config
