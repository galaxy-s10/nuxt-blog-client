/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const themeApi = (request) => {
  return {
    list: (params) =>
      request({
        url: '/theme/list',
        method: 'get',
        params,
      }),
  };
};
