const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
      hot: true
    },
    entry: {
      app: './src/index.js',
    },
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['@babel/preset-env', '@babel/preset-react'] }
                    }
                ]
            },
            {
                test: /(\.scss|\.css)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: true,
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]'
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new UglifyJsPlugin({
          uglifyOptions: {
            compress : {
              dead_code: true,
              drop_console: true,
              unused: true
            }
          }
        }),
        new webpack.DefinePlugin({
          'process.env': {
              NODE_ENV: JSON.stringify('production')
          }
        })
      ]
};
