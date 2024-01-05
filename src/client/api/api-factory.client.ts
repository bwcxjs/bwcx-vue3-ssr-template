import Axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { ApiType } from '.';

interface IApiRequestConfig extends AxiosRequestConfig {
  noQuery?: boolean;
}

export class ApiFactory {
  static createInstance(): ApiType {
    // 客户端渲染下不需要 cookie
    const axios = Axios.create({
      baseURL: '/api/',
      timeout: 30000,
    });

    axios.interceptors.request.use((config: IApiRequestConfig) => {
      if (config.noQuery) {
        return config;
      }

      config.params = {
        ...config.params,
        random: Math.random(),
      };

      return config;
    });
    return axios;
  }
}
