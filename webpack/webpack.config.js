var path = require("path")
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
const output = path.join(__dirname, '../build');

module.exports = {
    context: path.resolve(__dirname, '..'),
	devServer: {
		inline: true,
		hot: true,
		historyApiFallback: true,
	},
    resolve: {
        extensions : ["", ".js", ".jsx", ".ts", ".tsx"]
    },
    entry: [
        './src/index.ts'
    ],
    output: {
        path: output,
        filename: 'bundle.js',
		publicPath: '/',
    },
    plugins: [],
    progress: true,
    module: {
		loaders: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
			{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract("style-loader", "css-loader?importLoaders=1", "postcss-loader")
			}
		],

		preLoaders: [
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{ test: /\.js$/, loader: "source-map-loader" }
		]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            inject : 'body',
            hash : true,
        }),
        new ExtractTextPlugin("bundle.css"),
		new CleanWebpackPlugin(
			["build"], {
				verbose: true
			}
		)
	],
	postcss: function () {
		return [require('postcss-cssnext')];
	}
};
