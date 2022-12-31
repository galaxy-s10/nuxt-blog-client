import { frontendApi } from '@/api/frontend';
import { visitorLogApi } from '@/api/visitorLog';

export const api = (service) => {
  return {
    frontendApi: frontendApi(service),
    visitorLogApi: visitorLogApi(service),
  };
};

export class Api {
  service = null;
  visitorLog;
  frontend;
  constructor(service) {
    this.service = service;
    this.visitorLog = visitorLogApi(service);
    this.frontend = frontendApi(service);
  }
}
