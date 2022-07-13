/* global __dirname */
const webpack = require("webpack");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const entry = require("webpack-glob-entry");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

function recursiveIssuer(m) {

	if (m.issuer) {
		return recursiveIssuer(m.issuer);
	} else if (m.name) {
		return m.name;
	} else {
		return false;
	}
}

/** Variables */
let mode = (process.env.NODE_ENV) ? process.env.NODE_ENV : "production";
let theme = "build";

/** Bundled Files */
let bundles = glob.sync("./_src/js/_templates/*.js").reduce((acc, path) => {

	const entry = path.replace(/^.*[\\\/]/, "").replace(".js", "");

	acc[entry] = {};
	acc[entry].filename = `../${theme}/assets/bundle.${entry}.js`;
	acc[entry].import = path;

	return acc;
}, {});


bundles.main = {
	filename: `../${theme}/assets/_main.js`,
	import: "./_src/js/_global/index.js"
};

bundles.global = "./_src/css/main.scss";

module.exports = {
	mode: mode,
	entry: bundles,
	output: {
		path: path.resolve(__dirname, `compiled/`),
		filename: "[name]",
		clean: false,
		chunkFilename: "[id].chunk"
	},
	devtool: "eval-cheap-source-map",
	resolve: {
		alias: {
			Comp: path.resolve(__dirname, "_src/js/_components"),
			Ext: path.resolve(__dirname, "_src/js/_extensions"),
			Game: path.resolve(__dirname, "_src/js/_game"),
			Global: path.resolve(__dirname, "_src/js/_global"),
			Helpers: path.resolve(__dirname, "_src/js/_helpers/index"),
			Plugins: path.resolve(__dirname, "_src/js/_plugins"),
			Styles: path.resolve(__dirname, "_src/css")
		},
		extensions: [".webpack.js", ".web.js", ".js", ".jsx"]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				global: {
					type: "css/mini-extract",
					name: path.resolve(__dirname, `${theme}/assets/_global.css`),
					test: (m,c,entry = "global") => m.constructor.name === "CssModule" && recursiveIssuer(m) === entry,
					chunks: "initial",
					enforce: true
				},
				default: false
			}
		},
		minimizer: [
			new TerserPlugin({
				test: [
					/\.js$/i,
				],
				terserOptions: { 
					ecma: 8,
					compress: {
						warnings: false
					}
				}
			}),
			new CssMinimizerPlugin({
				test: /\.css$/i,
				minimizerOptions: {
					preset: [
						"advanced",
						{
							reduceIdents: false,
							zindex: {
								exclude: false
							}
						}
					]
				}
			})
		]
	},
	module: {
 		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader",
						options: {
							presets: [
								[
									"@babel/preset-env"
								]
							],
							plugins: [
								[
									"@babel/plugin-proposal-decorators", {
										"legacy": true
									}
								],
								[
									"@babel/plugin-proposal-private-methods", {
										"loose": true
									}
								],
								[
									"@babel/plugin-proposal-private-property-in-object", {
										"loose": true
									}
								],
								[
									"@babel/plugin-syntax-dynamic-import"
								],
								[
									"@babel/plugin-proposal-class-properties", {
										"loose": true
									}
								],
								[
									"@babel/plugin-transform-runtime", {
										"regenerator": true
									}
								]
							]
						}
					}
		        ]
			},
			{ 
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 100000,
						}
					}
				]
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					},
					{
						loader: "postcss-loader"
					},
					{
						loader: "sass-loader"
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanStaleWebpackAssets: false,
			cleanAfterEveryBuildPatterns: [
				path.join(__dirname, "compiled")
			]
		}),
		new Dotenv({
			path: `./.env`
		}),
		new MiniCssExtractPlugin({
			filename: ({ chunk }) => (chunk.name == "global") ? `../${theme}/assets/_${chunk.name}.css` : `../${theme}/assets/bundle.${chunk.name}.css`,
			chunkFilename: "[id].css"
		}),
		new ESLintPlugin(),
		new webpack.IgnorePlugin({
			resourceRegExp: /^\.\/locale$/,
			contextRegExp: /moment$/
		}),
		new HtmlWebpackPlugin({
			filename: path.resolve(__dirname, `${theme}/index.html`),
			inject: false,
			template: "./_src/templates/index.ejs",
			hash: false
		})
	]
};