/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const userApi = (request) => {
  return {
    find: (id) => request.get(`/user/find/${id}`),
    getUserInfo: () =>
      request({
        url: '/user/get_user_info',
        method: 'get',
      }),
  };
};
