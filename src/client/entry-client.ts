import App from './App.vue';
import routes from './routes';
import viteSSR from 'vite-ssr/vue/entry-client';
import { ApiFactory } from './api/api-factory.client';
import { ApiClientFactory, API_REQUEST_TOKEN, API_CLIENT_TOKEN } from './api';
import { mainEntry } from './main';

export default viteSSR(App, { routes }, (hookParams) => {
  const { app } = hookParams;

  // init api
  const api = ApiFactory.createInstance();
  const apiClient = ApiClientFactory.createInstance(api);
  app.provide(API_REQUEST_TOKEN, api);
  app.provide(API_CLIENT_TOKEN, apiClient);

  return mainEntry({ ...hookParams, api, apiClient });
});
