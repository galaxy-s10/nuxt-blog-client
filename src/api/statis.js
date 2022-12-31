/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const statisApi = (request) => {
  return {
    detail: (params) =>
      request({
        url: '/statis/detail',
        method: 'get',
        params,
      }),
  };
};
