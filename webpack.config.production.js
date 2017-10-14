const webpack            = require('webpack'); //to access built-in plugins
const path               = require('path');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin  = require("extract-text-webpack-plugin");
const Autoprefixer       = require('autoprefixer')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const FileLoader         = require.resolve('file-loader')
const UrlLoader          = require.resolve('url-loader')
const CopyWebpackPlugin  = require('copy-webpack-plugin');


const config = {
	// The entry point of our app
	entry: './src/index.js',

	output: {
		filename: 'static/js/bundle.[hash:8].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: ''
	},

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
				use: ExtractTextPlugin.extract({
					// Loader that should be used when the CSS is not extracted
					// (i.e. in an additional chunk when allChunks: false)
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: () => [Autoprefixer]
							}
						},
						'sass-loader'
					]
				}),
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
				loader: FileLoader,
				options: {
					name: 'static/media/[name].[hash:8].[ext]',
				},
			},
			// "url" loader works just like "file" loader but it also embeds
			// assets smaller than specified size as data URLs to avoid requests.
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: UrlLoader,
				options: {
					limit: 50000,
					name: 'static/images/[name].[ext]'
				}
			}
		]
	},
	plugins: [

		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			favicon: 'public/favicon.ico',
			template: 'public/index.html'
		}),

		// Plain css file
		new ExtractTextPlugin("static/css/styles.[hash:8].css", {
			allChunks: true
		}),

		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false,
				// Disabled because of an issue with Uglify breaking seemingly valid code:
				// https://github.com/facebookincubator/create-react-app/issues/2376
				// Pending further investigation:
				// https://github.com/mishoo/UglifyJS2/issues/2011
				comparisons: false,
			},
			output: {
				comments: false,
				// Turned on because emoji and regex is not minified properly using default
				// https://github.com/facebookincubator/create-react-app/issues/2488
				ascii_only: true,
			},
			sourceMap: true,
		}),

		// Copy content of public folder to build
		new CopyWebpackPlugin([
			{from: 'public', to: ''}
		]),

		new CleanWebpackPlugin("dist/**/*"),
	]
};

module.exports = config;