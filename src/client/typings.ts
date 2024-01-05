import type { HookParams } from 'vite-ssr/vue/types';
import type { RouteLocationNormalized } from 'vue-router';
import type { ApiType, ApiClientType } from './api';

export interface AsyncDataOptions {
  app: HookParams['app'];
  router: HookParams['router'];
  initialState: HookParams['initialState'];
  to: RouteLocationNormalized;
  from: RouteLocationNormalized;
  api: ApiType;
  apiClient: ApiClientType;
}
