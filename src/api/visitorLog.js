/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} request
 */
export const visitorLogApi = (request) => {
  return {
    create: ({ pageUrl }) =>
      request.post('/visitor_log/create', { page_url: pageUrl }),
    day: (params) => request.get('/visitor_log/day', { params }),
    history: () => request.get('/visitor_log/history'),
    list: () => request.get('/visitor_log/list'),
    // list2: request.get('/visitor_log/list2'),
  };
};
