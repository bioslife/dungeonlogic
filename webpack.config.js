const webpack           = require('webpack'); //to access built-in plugins
const path              = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Autoprefixer      = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
	entry: [
		// Activate HMR for React
		'react-hot-loader/patch',

		// Bundle the client for webpack-dev-server
		// and connect to the provided endpoint
		'webpack-dev-server/client?http://localhost:3000',

		// Bundle the client for hot reloading
		// only- means to only hot reload for successful updates
		'webpack/hot/only-dev-server',

		// The entry point of our app
		'./src/index.js',
	],

	output: {
		filename: 'static/js/bundle.[hash:8].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},

	devtool: 'inline-source-map',

	module: {
		rules: [
			// The rule for javascript files
			{
				test: /\.jsx?$/,
				use: [
					'babel-loader'
				],
				exclude: /node_modules/
			},
			// The rule for style files (sass, prefixing, create single file style)
			{
				test: /\.s?css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							plugins: () => [Autoprefixer],
							sourceMap: true
						}
					},
					'sass-loader?sourceMap'
				],
				exclude: /node_modules/
			},
			// "file" loader makes sure those assets end up in the `build` folder.
			// When you `import` an asset, you get its filename.
			{
				exclude: [
					/\.html$/,
					/\.(js|jsx)$/,
					/\.s?css$/,
					/\.json$/,
					/\.bmp$/,
					/\.gif$/,
					/\.jpe?g$/,
					/\.png$/,
				],
				loader: require.resolve('file-loader'),
				options: {
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			// "url" loader works just like "file" loader but it also embeds
			// assets smaller than specified size as data URLs to avoid requests.
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: require.resolve('url-loader'),
				options: {
					limit: 50000,
					name: 'static/images/[name].[ext]'
				}
			}

		]
	},
	plugins: [
		// Enable HMR globally
		new webpack.HotModuleReplacementPlugin(),

		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			favicon: 'public/favicon.ico',
			template: 'public/index.html'
		}),

		// Do not emit compiled assets that include errors
		new webpack.NoEmitOnErrorsPlugin()
	],
	devServer: {
		host: 'localhost',
		port: 3000,
		historyApiFallback: true,
		hot: true,
		//contentBase: '.',
		disableHostCheck: true,
		//headers: {'Access-Control-Allow-Origin': '*'}

	}
};

module.exports = config;
