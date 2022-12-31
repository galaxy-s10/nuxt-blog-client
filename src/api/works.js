/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const worksApi = (request) => {
  return {
    list: (params) =>
      request({
        url: `/works/list`,
        method: 'get',
        params,
      }),
  };
};
