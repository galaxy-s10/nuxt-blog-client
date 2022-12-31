/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const positionApi = (request) => {
  const res = {
    get: (params) =>
      request({
        url: '/position/get',
        method: 'get',
        params,
      }),
  };

  return res;
};
