/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 * @param  {aaa} bbb
 */
export const articleApi = (request) => {
  return {
    list: (params) =>
      request({
        url: '/article/list',
        method: 'get',
        params,
      }),
    keywordList: (params) =>
      request({
        url: '/article/keyword_list',
        method: 'get',
        params,
      }),
    find: (id) => request.get(`/article/find/${id}`),
  };
};
