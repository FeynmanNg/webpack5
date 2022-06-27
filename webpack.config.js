const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  // 入口
  entry: './src/main.js', // 相对路径
  // 输出
  output: {
    path: path.resolve(__dirname, 'dist'), // 绝对路径
    filename: 'static/js/main.js',
    clean: true, // 自动清空上次打包的内容（即 output.path 的路径）
  },
  // 加载器
  module: {
    // loader 的配置
    rules: [
      {
        test: /\.css$/, // test 即检测文件，文件名由正则匹配
        // use 执行顺序，从右到左，即 css -> style
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|webp|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 10kb
          },
        },
        generator: {
          // 如果想要图片的名字短一点，[hash:10] 代表 hash 值只取 10 位
          filename: 'static/images/[hash:10][ext][query]',
        },
      },
      {
        test: /\.(ttf|woff2?)$/, // 这里可以处理多种资源：字体图标、mp3、mp4、avi 等
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[hash:10][ext][query]',
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // 下面这个配置可以另外在 babel.config.js 中配置
        // options: {
        //   presets: ['@babel/preset-env']
        // }
      },
    ],
  },
  // 插件
  plugins: [
    new ESLintWebpackPlugin({
      // 检测哪些文件
      context: path.resolve(__dirname, 'src'),
    }),
    new HtmlWebpackPlugin({
      // 模板，以指定的文件作为模板创建新的 html 文件
      // 模板中的结构保留，并自动引入 js
      template: path.resolve(__dirname, 'public/index.html'),
    }),
  ],
  // 模式
  mode: 'development',
  // 开发服务器，插件是 webpack-dev-server
  devServer: {
    host: 'localhost',
    port: 3000,
    open: true,
  },
};
