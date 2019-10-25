const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ["./_src/assets/es6/app.js"],
    output: {
        path: __dirname + "/_dist/assets/js",
        filename: 'app.min.js'
    },
    devtool: "sourcemap",
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/(?!bullets-js)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          'window.jQuery': "jquery"
      })
    ]
}
