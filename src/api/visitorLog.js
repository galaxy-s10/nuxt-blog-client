/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const visitorLogApi = (request) => {
  return {
    create: () => request.post('/visitor_log/create'),
    day: (params) => request.get('/visitor_log/day', { params }),
    history: () => request.get('/visitor_log/history'),
    list: () => request.get('/visitor_log/list'),
    // list2: request.get('/visitor_log/list2'),
  };
};
