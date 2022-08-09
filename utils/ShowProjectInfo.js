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
    process.env.BLOG_PROJECT_GIT;
  prettierLog('提交用户：', commitUserName);
  prettierLog('提交日期：', commitDate);
  prettierLog('提交信息：', commitMessage);
  prettierLog('提交哈希：', commitHash);
  prettierLog('最后构建：', process.env.BLOG_PROJECT_LAST_BUILD);
};
