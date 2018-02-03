const WebpackShellPlugin = require('webpack-shell-plugin');
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');


const path = require('path');

// Typescript errors will be silenced if we do not add this plugin
const { CheckerPlugin } = require('awesome-typescript-loader')

const isVendorModule = (module) => {
  // returns true for everything in node_modules
  return module.context && module.context.indexOf('node_modules') !== -1;
}

module.exports = {
	entry: {
		main: './src/client/index.tsx'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'static')
	},
	module: {
		rules: [
			// All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			},
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader',
				exclude: /node_modules/
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				use: [{
					loader: 'style-loader' // creates style nodes from JS strings
				}, {
					loader: 'css-loader',
					options: {
						sourceMap: true
					}
				}, {
					loader: 'sass-loader',
					options: {
						sourceMap: true
					}
				}]
			}]
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.json', '.scss'],
		plugins: [
			new TsConfigPathsPlugin({
				tsconfig: __dirname + '/tsconfig.json',
				compiler: 'typescript'
			})
		],
		modules: [
			path.resolve('./node_modules'),
			path.resolve('./src/client')
		]
	},
	devtool: 'inline-source-map',
	plugins: [
		new WebpackShellPlugin({
			onBuildExit: [
				'rs' // Restart the server
			]
		}),
		new CheckerPlugin(),
		// Set to true to see bundle sizes
		false ? new BundleAnalyzerPlugin({ analyzerMode: 'static' }) : null,
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: isVendorModule
		})
	].filter(p => p)
};