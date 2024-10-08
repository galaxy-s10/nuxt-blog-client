/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} service
 */
export const buryingPointApi = (service) => {
  return {
    create: (data) => service.post('/burying_point/create', data),
  };
};
