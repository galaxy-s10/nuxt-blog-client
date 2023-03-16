// WARN 该文件只是方便我将当前项目复制一份到我电脑的另一个位置（gitee私有仓库的位置)，其他人不需要管这个文件~
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const semver = require('semver');

const allFile = [];
const ignore = ['.DS_Store', '.git', '.nuxt', '.dockerignore', 'node_modules'];
const localDir = path.resolve(__dirname);
const giteeDir = path.resolve(__dirname, '../../jenkins/nuxt-blog-client');

const dir = fs.readdirSync(localDir).filter((item) => {
  if (ignore.includes(item)) {
    return false;
  }
  return true;
});

function findFile(inputDir) {
  for (let i = 0; i < inputDir.length; i += 1) {
    const file = inputDir[i];
    const filePath = `${localDir}/${file}`;
    const stat = fs.statSync(filePath);
    const isDir = stat.isDirectory();
    if (!isDir) {
      allFile.push(filePath);
    } else {
      findFile(fs.readdirSync(filePath).map((key) => `${file}/${key}`));
    }
  }
}

function putFile() {
  for (let i = 0; i < allFile.length; i += 1) {
    const file = allFile[i];
    const arr = [];
    const githubFile = file.replace(localDir, '');
    const githubFileArr = githubFile.split('/').filter((item) => item !== '');
    githubFileArr.forEach((item) => {
      if (arr.length) {
        arr.push(path.resolve(arr[arr.length - 1], item));
      } else {
        arr.push(path.resolve(giteeDir, item));
      }
    });
    arr.forEach((item, index) => {
      // 数组的最后一个一定是文件，因此不需要判断它是不是目录
      if (index !== arr.length - 1) {
        const flag = fs.existsSync(item);
        // eslint-disable-next-line
        !flag && fs.mkdirSync(item);
      }
    });
    fs.copyFileSync(
      file,
      path.join(giteeDir, './', file.replace(localDir, ''))
    );
  }
}

const newPkgStr = fs.readFileSync(
  path.resolve(__dirname, 'package.json'),
  'utf-8'
);
const oldPkgStr = fs.readFileSync(
  path.resolve(giteeDir, 'package.json'),
  'utf-8'
);
const oldPkg = JSON.parse(oldPkgStr);
const newPkg = JSON.parse(newPkgStr);
const newVersion = semver.inc(oldPkg.version, 'patch');

if (path.resolve(__dirname) === giteeDir) {
  // eslint-disable-next-line
  console.log('当前在gitee文件目录，直接退出！');
}
findFile(dir);
execSync(`rm -rf $(ls -A | grep -wv .git | xargs)`, { cwd: giteeDir });
putFile();
fs.writeFileSync(
  path.resolve(giteeDir, 'package.json'),
  JSON.stringify({ ...newPkg, version: newVersion }, {}, 2)
);
execSync(`pnpm i`, { cwd: giteeDir });
execSync(`git add .`, { cwd: giteeDir });
execSync(`git commit -m 'feat: ${new Date().toLocaleString()}'`, {
  cwd: giteeDir,
});
execSync(`git tag v${newVersion} -m 'chore(release): ${newVersion}'`, {
  cwd: giteeDir,
});
execSync(`git push`, { cwd: giteeDir });
execSync(`git push origin v${newVersion}`, { cwd: giteeDir });
