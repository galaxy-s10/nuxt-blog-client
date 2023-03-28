/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const commentApi = (request) => {
  return {
    delete: (id) =>
      request({
        url: `/comment/delete/${id}`,
        method: 'delete',
      }),
    create: (data) =>
      request({
        url: `/comment/create`,
        method: 'post',
        data,
      }),
    comment: (params) =>
      request({
        url: `/comment/comment`,
        method: 'get',
        params,
      }),
    commentChildren: (params) =>
      request({
        // url: '/comment/comment_children',
        url: '/comment/child_comment',
        method: 'get',
        params,
      }),
  };
};
