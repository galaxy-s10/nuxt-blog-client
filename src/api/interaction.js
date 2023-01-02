/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const interactionApi = (request) => {
  return {
    list: (params) =>
      request({
        url: `/interaction/list`,
        method: 'get',
        params,
      }),
  };
};
