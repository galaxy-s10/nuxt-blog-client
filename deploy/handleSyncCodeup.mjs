// WARN 该文件只是方便我将当前项目复制一份到我电脑的另一个位置（gitee私有仓库的位置)，其他人不需要管这个文件~

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import semver from 'semver';
import trash from 'trash';

const allFile = [];
const ignore = ['.DS_Store', '.git', '.nuxt', 'node_modules'];
const localDir =
  '/Users/huangshuisheng/Desktop/hss/galaxy-s10/nuxt-blog-client';
const targetDir = '/Users/huangshuisheng/Desktop/hss/codeup/billd-blog';

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

const newPkgStr = fs.readFileSync(
  path.resolve(localDir, 'package.json'),
  'utf-8'
);
const oldPkgStr = fs.readFileSync(
  path.resolve(targetDir, 'package.json'),
  'utf-8'
);
const oldPkg = JSON.parse(oldPkgStr);
const newPkg = JSON.parse(newPkgStr);
const newVersion = semver.inc(oldPkg.version, 'patch');

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
        arr.push(path.resolve(targetDir, item));
      }
    });
    arr.forEach((item, index) => {
      // 数组的最后一个一定是文件，因此不需要判断它是不是目录
      if (index !== arr.length - 1) {
        const flag = fs.existsSync(item);

        !flag && fs.mkdirSync(item);
      }
    });
    fs.copyFileSync(
      file,
      path.join(targetDir, './', file.replace(localDir, ''))
    );
  }
}

async function clearOld() {
  const targetDirAllFile = fs.readdirSync(targetDir);
  const queue = [];
  targetDirAllFile.forEach((url) => {
    const fullurl = `${targetDir}/${url}`;
    if (!['node_modules', '.git'].includes(url)) {
      queue.push(trash(fullurl));
    }
  });
  await Promise.all(queue);
}

if (process.cwd().includes('codeup')) {
  console.log('当前目录错误');
} else {
  clearOld().then(() => {
    findFile(dir);
    putFile();
    const gitignoreArr = [
      'node_modules',
      'dist',
      'components.d.ts',
      '.eslintcache',
      '.DS_Store',
    ];
    const gitignoreTxt = gitignoreArr.join('\n');
    fs.writeFileSync(path.resolve(targetDir, './.gitignore'), gitignoreTxt);
    fs.writeFileSync(
      path.resolve(targetDir, 'package.json'),
      JSON.stringify({ ...newPkg, version: newVersion }, Object.create({}), 2)
    );
    execSync(`pnpm i`, { cwd: targetDir });
    execSync(`git rm -r --cached .`, { cwd: targetDir });
    execSync(`git add .`, { cwd: targetDir });
    execSync(`git commit -m 'feat: ${new Date().toLocaleString()}'`, {
      cwd: targetDir,
    });
    execSync(`git push`, { cwd: targetDir });
  });
}
