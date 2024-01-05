import '@vue/runtime-core';
import type { AsyncDataOptions } from './typings';
import type { ApiClientType } from './api';

declare module '@vue/runtime-core' {
  export interface ComponentCustomOptions {
    asyncData?: (opts: AsyncDataOptions) => any | Promise<any>;
  }

  export interface ComponentCustomProperties {
    $api: ApiClientType;
  }
}
