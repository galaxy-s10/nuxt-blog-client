/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const tagApi = (request) => {
  return {
    list: (params) => {
      return request({
        url: `/tag/list`,
        method: 'get',
        params,
      });
    },
    articleList: ({ tagId, params }) =>
      request({
        url: `/tag/article_list/${tagId}`,
        method: 'get',
        params,
      }),
  };
};
