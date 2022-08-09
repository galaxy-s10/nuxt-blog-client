const chalk = require('chalk');

console.log(
  `${chalk.bgBlueBright.black(' INFO ')} ${chalk.blueBright(
    `读取了: ${__filename.slice(__dirname.length + 1)}`
  )}`
);

module.exports = {
  bracketSpacing: true, // 默认为true,即{ foo: bar }；可改为false，即{foo: bar}
  singleQuote: true, // 默认为false,即{foo:"bar"}，可改为true，即{foo:'bar'}
  bracketSameLine: false, // https://prettier.io/blog/2021/09/09/2.4.0.html
  // jsxBracketSameLine: false, // true：将多行JSX元素的 > 放在最后一行的末尾。false：将多行JSX元素的 > 单独放在下一行
  trailingComma: 'es5', // 默认"es5"：在ES5中有效的尾随逗号（对象、数组等）。可选："none"：没有尾随逗号；"all"：尽可能尾随逗号
  printWidth: 80, // 默认80,printWidth不是硬性的允许行长度上限，不要试图将 printWidth 当作 ESLint 的max-len 来使用——它们不一样
  // parser: 'babel',
};
// prettier默认1个缩进4个空格，即换行后，前面要有四个空格
