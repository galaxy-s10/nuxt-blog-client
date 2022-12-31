// @ts-ignore
/** @typedef {import("axios/index.cjs")} Axios */

/**
 * @param  {Axios} service
 */
export const visitorLogApi = (service) => {
  return {
    list: service.get('/visitor_log/list'),
    list2: service.get('/visitor_log/list2'),
  };
};
