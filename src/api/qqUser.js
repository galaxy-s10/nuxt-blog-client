/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const qqUserApi = (request) => {
  return {
    login: (code) =>
      request({
        url: '/qq_user/login',
        method: 'post',
        data: { code },
      }),
  };
};
