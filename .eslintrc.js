const chalk = require('chalk');

console.log(
  `${chalk.bgBlueBright.black(' INFO ')} ${chalk.blueBright(
    `读取了: ${__filename.slice(__dirname.length + 1)}`
  )}`
);

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['import'],
  // rules优先级最高，会覆盖上面的
  rules: {
    /**
     * 0 => off
     * 1 => warn
     * 2 => error
     */
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['sibling', 'parent'],
          'index',
          'object',
          'type',
        ],
        'newlines-between': 'always', // 强制或禁止导入组之间的新行：
        // 根据导入路径按字母顺序对每个组内的顺序进行排序
        alphabetize: {
          order: 'asc' /* 按升序排序。选项：['ignore', 'asc', 'desc'] */,
          caseInsensitive: false /* 忽略大小写。选项：[true, false] */,
        },
      },
    ],
    'no-console': 0, // 此规则不允许调用console对象的方法。
    'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }], // 该规则强制注释中 // 或 /* 后空格的一致性
    'no-var': 2, // 要求let或const代替var
    'no-shadow': 2, // 禁止变量声明与外层作用域的变量同名
    'no-param-reassign': 2, // 禁止对 function 的参数进行重新赋值
    'no-nested-ternary': 2, // 禁止嵌套三元
    'no-plusplus': 2, // 禁用一元操作符 ++ 和 --
    'no-unused-vars': 2, // 禁止出现未使用过的变量
    'vars-on-top': 2, // 要求所有的 var 声明出现在它们所在的作用域顶部
    'prefer-const': 2, // 要求使用 const 声明那些声明后不再被修改的变量
    'prefer-template': 2, // 要求使用模板字符串代替字符串连接
    'new-cap': 2, // 要求构造函数名称以大写字母开头
    'no-restricted-syntax': [
      // 禁用一些语法
      'error',
      // 'ForInStatement',
      // 'ForOfStatement',
      {
        selector: 'ForInStatement',
        /**
         * 用 map() / every() / filter() / find() / findIndex() / reduce() / some() / ... 遍历数组，
         * 和使用 Object.keys() / Object.values() / Object.entries() 迭代你的对象生成数组。
         * 拥有返回值得纯函数比这个更容易解释
         */
        message:
          'for in会迭代遍历原型链(__proto__)，建议使用map/every/filter等遍历数组，使用Object.{keys,values,entries}等遍历对象',
      },
      {
        selector: 'ForOfStatement',
        message:
          '建议使用map/every/filter等遍历数组，使用Object.{keys,values,entries}等遍历对象',
      },
    ], // https://github.com/BingKui/javascript-zh#%E8%BF%AD%E4%BB%A3%E5%99%A8%E5%92%8C%E5%8F%91%E7%94%9F%E5%99%A8
    'no-iterator': 2, // 禁止使用__iterator__迭代器
    'require-await': 2, // 禁止使用不带 await 表达式的 async 函数
    'no-empty': 2, // 禁止空块语句
    // 'class-methods-use-this': 0, // 类方法如果不使用this的话会报错

    // eslint-plugin-import插件
    // 'import/no-extraneous-dependencies': 2, // 禁止导入未在package.json中声明的外部模块。
    'import/prefer-default-export': 0, // 当模块只有一个导出时，更喜欢使用默认导出而不是命名导出。
    'import/extensions': 0, // 确保在导入路径中一致使用文件扩展名。在js/ts等文件里引其他文件都不能带后缀，这样就没办法引其他类型文件
    'import/no-unresolved': 0, // 不能解析带别名的路径的模块，但实际上是不影响代码运行的。找不到解决办法，暂时关掉。
    'import/no-named-as-default-member': 1, // import vue from 'vue';console.log(vue.version)，如果vue有导出version，会提示替换为import { version } from 'vue';
    'import/named': 2, // 如：import { version } from 'vuex'，会验证vuex有没有具名导出version

    // eslint-plugin-vue
    'vue/multi-word-component-names': 0,
  },
};
