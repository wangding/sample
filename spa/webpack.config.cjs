const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: {
    index: './src/main.js'
  },
  output: {
    filename: '[contenthash].js',
    clean: true
  },
  mode: 'production',
  module: {
    rules: [{
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader']
    }]    
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css'
    }),
    new CssMinimizerPlugin()
  ]
};
