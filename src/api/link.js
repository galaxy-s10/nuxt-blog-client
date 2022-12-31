/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const linkApi = (request) => {
  return {
    list: (params) =>
      request({
        url: `/link/list`,
        method: 'get',
        params,
      }),
    create: (data) =>
      request({
        url: '/link/create',
        method: 'post',
        data,
      }),
  };
};
