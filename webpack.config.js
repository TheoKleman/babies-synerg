const path = require('path')
const NpmInstallPlugin = require('npm-install-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const webpack = require('webpack')
const precss = require('precss')
const autoprefixer = require('autoprefixer')

const pkg = require('./package.json');

const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'styles/master.scss'),
  images: path.join(__dirname, 'images'),
  fonts: path.join(__dirname, 'fonts')
}


const common = {
  entry: {
    app: PATHS.app,
    style: PATHS.style
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: [/\.js$/, /\.es6$/],
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      },
      { test: /\.js/, loader: 'imports?define=>false'},
      {
        test: /\.(jpg|png)$/,
        loader: 'file?name=[path][name].[ext]',
        include: PATHS.images
      },
      {
        test: /\.svg$/,
        loader: 'file?name=[path][name].[ext]',
        include: PATHS.images
      },
      {
        test: /\.ttf$|\.woff$|\.eot$/,
        loader: 'file',
        query: {
          prefix: 'font/',
          name: './fonts/[name].[ext]'
        },
        include: PATHS.fonts
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
}


if(TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    // devtool: 'eval-source-map',
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      stats: 'errors-only',

      host: process.env.HOST,
      port: process.env.PORT
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: "style-loader!css-loader!postcss-loader!sass-loader"
        }
      ]
    },
    postcss: function () {
      return [precss, autoprefixer];
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true
      })
    ]
  });
}

if(TARGET === 'build') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies)
    },
    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract("style-loader", ["css-loader", "postcss-loader", "sass-loader"])
        }
      ]
    },
    postcss: function () {
      return [precss, autoprefixer];
    },
    plugins: [
      new CleanWebpackPlugin([PATHS.build]),
      new ExtractTextPlugin('[name].[chunkhash].css'),
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}
