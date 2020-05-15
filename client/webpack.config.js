const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    bundle: ['./src/index.js', './src/index.scss']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].[contenthash].js",
  },
  devServer: {
    compress: true,
    port: 8000,
    open: true,
    overlay: true,
    historyApiFallback: true,
  },
  module: {
    rules: [{
        test: /\.(tsx|js|ts)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|svg|jpg)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            esModule: false,
          },
        }, ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    // new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      minify: true,
      chunks: ["bundle"],
      template: './src/index.html'
    })
  ]
};
