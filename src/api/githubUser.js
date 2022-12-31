/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const githubUserApi = (request) => {
  return {
    login: (code) =>
      request({
        url: '/github_user/login',
        method: 'post',
        data: { code },
      }),
  };
};
