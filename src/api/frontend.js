/** @typedef {import("axios").AxiosInstance} AxiosInstance */

/**
 * @param  {AxiosInstance} service
 */
export const frontendApi = (service) => {
  return {
    detail: () => service.get('/frontend/detail'),
  };
};
