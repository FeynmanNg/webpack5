module.exports = {
  // 解析选项
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // 如果需要jsx（如 react）
    },
  },
  /**
   * 'off' 或 0 - 关闭
   * 'warn' 或 1 - 开启，警告级别
   * 'error' 或 2 - 开启，错误级别，会导致程序退出
   */
  rules: {
    'no-var': 2,
    semi: 'off', // 使用分号
    'default-case': [
      'warn', // 要求 switch 语句中有 default 分支，否则警告
      {
        commentPattern: `^no default$`, // 允许在最后注释 no default 来取消警告
      },
    ],
    eqeqeq: [
      'warn', // 使用 === 和 !==
      'smart', // 少数情况下允许不使用，比如等号的一方为字面量
    ],
  },
  // 继承其他规则，rules 自定义规则会覆盖这里继承的规则
  // 社区常用的规则，例如 eslint、vue-cli 等
  // 使用 eslint 规则，不用下载；如果是 vue-cli 的需要下载插件 plugin:vue/essential
  // extends: 'eslint:recommended',
  // extends: [],
  // ...

  // 其他配置，看官网 https://eslint.bootcss.com/docs/user-guide/configuring
};
