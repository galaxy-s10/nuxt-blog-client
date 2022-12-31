/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const starApi = (request) => {
  return {
    create: (data) =>
      request({
        url: '/star/create',
        method: 'post',
        data,
      }),
    delete: (id) => request.delete(`/star/delete/${id}`),
  };
};
