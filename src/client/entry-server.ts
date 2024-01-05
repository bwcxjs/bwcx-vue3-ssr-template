import App from './App.vue';
import routes from './routes';
import viteSSR from 'vite-ssr/vue/entry-server';
import { ApiFactory } from './api/api-factory.server';
import { ApiClientFactory, API_REQUEST_TOKEN, API_CLIENT_TOKEN } from './api';
import { mainEntry } from './main';

export default viteSSR(App, { routes }, (hookParams) => {
  const { app, request } = hookParams;

  // init api
  const getIp = (req: typeof request): string => {
    const ssrIp = req.socket.remoteAddress === '127.0.0.1' ? (request.headers.server_render_ip as string) : '';
    let ip = ssrIp || (request.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
    if (ip.substr(0, 7) === '::ffff:') {
      ip = ip.substr(7);
    }
    return ip;
  };
  const api = ApiFactory.createInstance({
    cookie: request.headers.cookie,
    ip: getIp(request),
    ua: request.headers['user-agent'],
  });
  const apiClient = ApiClientFactory.createInstance(api);
  app.provide(API_REQUEST_TOKEN, api);
  app.provide(API_CLIENT_TOKEN, apiClient);

  return mainEntry({ ...hookParams, api, apiClient });
});
