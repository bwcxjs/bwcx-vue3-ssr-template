import type { ApiClientType } from '@client/api';
import type { App } from 'vue';

export class ApiClientPlugin {
  public static install(app: App, options: { apiClient: ApiClientType }) {
    app.config.globalProperties.$api = options.apiClient;
  }
}
