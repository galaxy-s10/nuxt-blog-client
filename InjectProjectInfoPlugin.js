import { execSync } from 'child_process';

import HtmlWebpackPlugin from 'html-webpack-plugin';

import pkg from './package.json';

let commitHash;
let commitUserName;
let commitDate;
let commitMessage;
try {
  // commit哈希
  commitHash = execSync('git show -s --format=%H').toString().trim();
  // commit用户名
  commitUserName = execSync('git show -s --format=%cn').toString().trim();
  // commit日期
  commitDate = new Date(
    execSync(`git show -s --format=%cd`).toString()
  ).toLocaleString();
  // commit消息
  commitMessage = execSync('git show -s --format=%s').toString().trim();
} catch (error) {
  console.log(error);
}

const templateStr = `
(function(){
var log = (title, value) => {
  console.log(
    '%c ' + title + ' %c ' + value + ' ' + '%c',
    'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
    'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
    'background:transparent'
  );
};

log('项目名称：', {pkgName});
log('项目版本：', {pkgVersion});
log('项目仓库：', {pkgRepository});
log('构建仓库：', {buildRepository});
log('最后构建：', {lastBuild});
log('构建仓库git提交用户：', {commitUserName});
log('构建仓库git提交日期：', {commitDate});
log('构建仓库git提交信息：', {commitMessage});
log('构建仓库git提交哈希：', {commitHash});
console.warn(
  '当前项目的代码是托管在github，但由于线上构建如果使用github的话，会因为github拉取代码太慢以及一些秘钥文件不方便处理等原因，'
);
console.warn(
  '因此目前的线上构建是将github的代码做一层处理，然后再复制到gitee的私有仓库，使用gitee的代码进行构建的，'
);
console.warn(
  '因为github和gitee提交的数据不一致，因此项目信息和git信息会对不上，大多数情况下github和gitee仓库代码都会尽量保持同步~'
);
})()
`;

const pkgName = pkg.name;
const pkgVersion = pkg.version;
const pkgRepository = pkg.repository.url;

const replaceKeyFromValue = (str, obj) => {
  let res = str;
  Object.keys(obj).forEach((v) => {
    res = res.replace(new RegExp(`{${v}}`, 'ig'), obj[v]);
  });
  return res;
};

class InjectProjectInfoPlugin {
  options;

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InjectProjectInfoPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InjectProjectInfoPlugin',
        (data, cb) => {
          // 获取原来内容
          const buildRepository = this.options.isProduction
            ? `https://gitee.com/galaxy-s10/${pkgName}`
            : pkgRepository;
          const info = replaceKeyFromValue(templateStr.toString(), {
            pkgName: JSON.stringify(pkgName),
            pkgVersion: JSON.stringify(pkgVersion),
            pkgRepository: JSON.stringify(pkgRepository),
            buildRepository: JSON.stringify(buildRepository),
            lastBuild: JSON.stringify(new Date().toLocaleString()),
            commitDate: JSON.stringify(commitDate),
            commitHash: JSON.stringify(commitHash),
            commitMessage: JSON.stringify(commitMessage),
            commitUserName: JSON.stringify(commitUserName),
          });
          data.html = data.html.replace(
            '</head>',
            `\n<script>\n${info}\n</script>\n</head>`
          );
          cb(null, data);
        }
      );
    });
  }
}

export default InjectProjectInfoPlugin;
