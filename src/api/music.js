/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const musicApi = (request) => {
  return {
    list: (params) =>
      request({
        url: '/music/list',
        method: 'get',
        params,
      }),
  };
};
