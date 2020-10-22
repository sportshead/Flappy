const path = require('path');
const webpack = require('webpack');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * We've enabled TerserPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/terser-webpack-plugin
 *
 */

const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	plugins: [new webpack.ProgressPlugin(), new CopyPlugin({
		patterns: ["src/index.html"]
	})],

	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				loader: 'ts-loader',
				include: [path.resolve(__dirname, 'src')],
				exclude: [/node_modules/],
			},
			{
				test: /.css$/,

				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',

						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: "[path]/[contenthash].[ext]"
						}
					},
				],
			},
		],
	},

	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},

	optimization: {
		minimizer: [new TerserPlugin()],
	},
};
