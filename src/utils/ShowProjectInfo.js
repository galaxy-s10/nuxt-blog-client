export const showProjectInfo = () => {
  const prettierLog = (title, value) => {
    console.log(
      `%c ${title} %c ${value} %c`,
      'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      'background:#41b883 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
      'background:transparent'
    );
  };
  const { commitHash, commitDate, commitUserName, commitMessage } =
    process.env.NUXT_APP_RELEASE_PROJECT_GIT;
  const {
    NODE_ENV,
    NUXT_APP_RELEASE_PROJECT_LASTBUILD,
    NUXT_APP_RELEASE_PROJECT_PACKAGE,
  } = process.env;
  const buildRepository =
    NODE_ENV === 'development'
      ? NUXT_APP_RELEASE_PROJECT_PACKAGE.repository
      : `https://gitee.com/galaxy-s10/${NUXT_APP_RELEASE_PROJECT_PACKAGE.name}`;

  prettierLog('项目名称：', NUXT_APP_RELEASE_PROJECT_PACKAGE.name);
  prettierLog('项目版本：', NUXT_APP_RELEASE_PROJECT_PACKAGE.version);
  prettierLog('项目仓库：', NUXT_APP_RELEASE_PROJECT_PACKAGE.repository);
  prettierLog('构建仓库：', buildRepository);
  prettierLog('最后构建：', NUXT_APP_RELEASE_PROJECT_LASTBUILD);
  prettierLog('构建仓库git提交用户：', commitUserName);
  prettierLog('构建仓库git提交日期：', commitDate);
  prettierLog('构建仓库git提交信息：', commitMessage);
  prettierLog('构建仓库git提交哈希：', commitHash);
  console.warn(
    `当前项目的代码是在github，但是线上构建由于拉取github太慢以及一些秘钥文件不方便处理等原因，因此是将github的代码处理一层然后再复制提交到gitee的私有仓库进行构建的，github和gitee提交的数据不一致，因此项目信息和git信息会对不上~`
  );
};
