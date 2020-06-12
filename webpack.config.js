/* eslint-disable sort-keys */

const path = require('path');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  return {
    devServer: {
      compress: true,
      contentBase: path.join(__dirname, 'src'),
      overlay: true,
      port: 8080
    },
    devtool: argv.mode === 'development' ? 'inline-source-map' : 'none',
    entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/app/app.js'],
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/fonts/'
            }
          }]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/webfonts/'
            }
          }]
        },
        {
          exclude: /node_modules/,
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              "presets": [
                ["@babel/preset-env", {
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'src/assets',
          to: 'assets',
          ignore: ['*.scss']
        },
        {
          from: 'src/data',
          to: 'data'
        }
      ]),
      new HtmlWebpackPlugin({
        hash: false,
        template: './src/index.html',
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      })
    ]
  };
};
