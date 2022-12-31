// eslint-disable-next-line
import { Axios } from 'axios';

/**
 * @param  {Axios} service
 */

export const frontendApi = (service) => {
  return {
    detail: service.get('/frontend/detail'),
  };
};
