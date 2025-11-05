module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'taro/react', // Taro React相关的规则
    'eslint:recommended', // ESLint推荐的规则
    'plugin:@typescript-eslint/recommended', // TypeScript相关的规则
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // 需要类型检查的TypeScript相关的规则
    'plugin:react-hooks/recommended', // React Hooks相关的规则
    'prettier', // Prettier格式化工具的规则
  ],
  parser: '@typescript-eslint/parser', // 表示使用了TypeScript语言，并且指定了解析器来解析TypeScript代码
  parserOptions: {
    ecmaVersion: 'latest', // 使用最新的ECMAScript版本
    sourceType: 'module', // 使用模块化的代码风格
    project: true, // 启用项目级别的类型检查
    tsconfigRootDir: __dirname, // 指定TypeScript配置文件所在的目录
  },
  plugins: ['react-refresh', 'prettier'], // 表示代码使用了第三方插件，react-refresh（用于实现React组件的热更新），prettier（用于格式化代码）
  rules: {
    // 警告不要导出非组件的常量
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    '@typescript-eslint/no-non-null-assertion': 'off', // 关闭对非空断言操作符的检查
    // 将Prettier格式化不符合要求的代码视为错误，并且使用Prettier配置文件中的选项
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettierrc: true,
        fileInfoOptions: {},
      },
    ],
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
  },
};
