/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const typeApi = (request) => {
  return {
    list: (params) =>
      request({
        url: '/type/list',
        method: 'get',
        params,
      }),
  };
};
