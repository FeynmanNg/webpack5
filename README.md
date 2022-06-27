#### 访问 public/index.html，看看控制台
报错：
Uncaught SyntaxError: Cannot use import statement outside a module
因为模块化没有被允许。
接下来我们使用 webpack 帮助我们编译模块化的语法。

#### 下载 webpack
```
yarn add -D webpack webpack-cli
```

#### npx 将 node_modules/.bin 的文件夹配为环境变量，就可以使用命令，如 webpack
```
npm webpack ./src/main.js --mode=development
```
查看 dist/main.js 文件，可以看到 webpack 仅是把模块化编译了，并没有把 ES6 语法编译，例如 sum 函数的“剩余参数符号”、箭头函数。

#### 将 public/index.html 的 /src/main.js 文件改为打包的 dist/main.js，访问成功！


# 基础配置
### 基本配置
#### 5 大核心概念
1. entry（入口）
指示 Webpack 从哪个文件开始打包
2. output（输出）
打包的文件输出到哪去
3. loader（加载器）
Webpack 本身只能处理 js、json 等资源，其他资源需借助 loader 才能解析
4. plugins（插件）
扩展功能
5. mode（模式）
主要有两种模式：开发（development）和生产（production）

#### 配置文件 webpack.config.js 放置在根目录
写上配置信息，然后打包，此时打包的命令就不需要指定参数了，它会读取配置文件，所以直接
```
npx webpack
```

#### 编译样式文件
我们新建 /src/css/main.css 文件，在 src/main.js 中引入
```
import './css/main.css'
```
然后编译
```
npx webpack
```
报错了！
```
ERROR in ./src/css/main.css 1:0
Module parse failed: Unexpected token (1:0)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
```
报错信息告诉我们，没有合适的 loader 去处理 css 文件，那么就需要我们去下载 loader 来处理这类文件了

```
yarn add --dev css-loader style-loader
```
增加 webpack 的配置 module 属性的子属性
```
  rules: [
    // 这里有其他 loader ...
    // 新增以下
    {
      test: /\.css$/,
      // 使用 use 属性而不是 loader 是因为 loader 只是单一的，而 use 可用多个
      // use 执行顺序，从右到左，即 css -> style
      use: ['style-loader', 'css-loader']
    }
  ]
```

###### 编译 less 文件
```
yarn add --dev less less-loader
// 注意：less-loader 要求 node 在 14.15 以上版本
```
增加 webpack 的配置 module 属性的子属性
```
  rules: [
    // 这里有其他 loader ...
    // 新增以下
    {
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']
    }
  ]
```

#### 处理图片资源
过去 Webpack4 时，处理图片资源通过 file-loader 和 url-loader 进行处理，现在 webpack5 已经将两个 loader 功能内置了，只需要简单配置即可。

**由于 webpack 会将图片 base64，所以这样就可以减少网络请求了**
**因为 base64 结果会使得比原来大约 1/3 左右，所以一般设置为 10kb 左右的图片资源才使用**

```
// 在 css/main.css 中
body {
  background: url('../assets/img/bg.jpeg');
}
// 然后打包
npx webpack
```
可以看到 dist/ xxx.jpeg 文件，因为已经内置功能了，所以还没配置都可编译过来，但他是原封不动地编译过来，可以看到大小还是一致的。
```
rules: [
  // 增加 loader
  {
    test: /\.(png|jpe?g|gif|webp|svg)$/,
    type: 'asset',
    parser: {
      dataUrlCondition: {
        maxSize: 200 * 1024, // 200kb 以下的图片，改为 base64（因为实例图片找得比较大），一般是 10kb 左右
      },
    },
  },
]

// 然后打包（需要先将旧的 dist 给干掉）
npx webpack
```

#### 修改输出目录（分类）
[官网参考](https://webpack.docschina.org/guides/asset-modules/#inlining-assets)
比如修改为输出目录是
dist
|__static
   |__js
   |__css
   |__assets
```
output: {
  // 这里的 path 是指定输出的路径
  path: path.resolve(__dirname, 'dist'), // 绝对路径
  // 这里才是放置 js 的地方
  filename: 'static/js',
},
// 图片
module: {
  rules: [
    // 图片的 loader
    {
      generator: {
          // 如果想要图片的名字短一点，[hash:10] 代表 hash 值只取 10 位
          filename: 'static/images/[hash:10][ext][query]',
        },
    }
  ],
},

```


#### 自动清空上次打包内容
```
output: {
  clean: true,
}
```

#### 处理其他资源：字体图标、mp3、mp4、avi 等
将资源编译到指定目录
```
// 通过加载器
module: {
  rules: [
    // ...
    {
      test: /\.(ttf|woff2?|mp3|mp4)$/, // 这里可以处理多种资源：字体图标、mp3、mp4、avi 等
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[hash:10][ext][query]',
        },
    },
  ],
}
```


#### ESLint
###### 配置文件
有两种配置方式：
+ .eslintrc.*：位于根目录。有多种格式文件可选：
  - .eslintrc
  - .eslintrc.js
  - .eslintrc.json
+ package.json 的 eslintConfig 可配置
区别在于配置格式不一样，文件决定语法格式。

[官网](https://eslint.bootcss.com/docs/user-guide/configuring)
以 .eslintrc.js 为例，详细查看该文件

下载依赖：eslint 和 eslint-webpack-plugin 插件
```
yarn add -D eslint-webpack-plugin eslint
```
在 webpack.config.js 中使用该插件


在 webpack4 是以 loader 来处理，在 webpack5 中是以 plugin 来处理。


#### Babel
```
yarn add -D babel-loader @babel/core @babel/preset-env
```

新建 babel.config.js
```
module.exports = {
  // 智能预设：能够编译 es6 语法
  presets: ['@babel/preset-env'],
};

```
在之前编译的 dist 文件中找到 js/main.js ，可以看到 sum 函数还是使用着 ... 参数的展开符，而配置完 babel 以后，再次编译
```
npx webpack
```
再次查看 main.js 的 sum 函数，它就被修改为使用 arguments 来接收参数

#### 处理 HTML 资源
当前在 public/html 中，还是使用着 script 标签把 dist/main.js 引入来使用。
那我希望它不要再叫 main，修改或者新增其他文件，手动操作就很麻烦，此时需要 webpack 的插件来实现自动引入。

下载依赖
```
yarn add -D html-webpack-plugin
```
引入到 webpack.config.js
```

```

#### 开发自动化
每次修改完代码都会重新编译，那么我希望一切自动化
```
yarn add -D webpack-dev-server
```

webpack.config.js
```
devServer: {
  host: 'localhost',
  port: 3000,
  open: true,
},
```

此时，执行的命令修改一下，增加 serve，才可以启动该配置。
```
npx webpack serve
```