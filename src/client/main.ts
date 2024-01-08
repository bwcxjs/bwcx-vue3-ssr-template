import './index.less';
import { ClientOnly } from 'vite-ssr';
import { createHead, Head } from '@vueuse/head';
import type { HookParams } from 'vite-ssr/vue/types';
import { Vue } from 'vue-class-component';
import { BwcxClientRouterPlugin } from 'bwcx-client-vue3';
import { clientRoutesMap } from '@common/router/client-routes';
import { ApiClientPlugin } from './plugins/api-client.plugin';
import type { ApiType, ApiClientType } from './api';

Vue.registerHooks(['setup', 'beforeRouteEnter', 'beforeRouteUpdate', 'beforeRouteLeave', 'asyncData']);

export function mainEntry({
  app,
  router,
  isClient,
  initialState,
  api,
  apiClient,
}: HookParams & { api: ApiType; apiClient: ApiClientType }) {
  const head = createHead();
  app.use(head);
  app.use(BwcxClientRouterPlugin, {
    routesMap: clientRoutesMap,
  });
  app.use(ApiClientPlugin, {
    apiClient,
  });
  app.component(Head.name, Head);
  app.component(ClientOnly.name, ClientOnly);

  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue error:', err, vm, info);
    if (isClient) {
      // 可以在此展示全局错误提示
    }
  };

  router.onError((err) => {
    console.error('Vue Router error:', err);
    if (isClient) {
      // 可以在此展示全局错误提示
    }
  });

  router.beforeResolve(async (to, from, next) => {
    const component = to.matched[0].components.default;
    // const instance = to.matched[0].instances.default;

    // @ts-ignore
    if (!component.asyncData || !component) {
      return next();
    }

    // @ts-ignore
    if (isClient && !from.href && to.meta.state && Object.keys(to.meta.state).length > 0) {
      return next();
    }

    // 可以在这里加入全局 loading 进度条。或改写这个钩子实现 Route-Update-First 的导航
    try {
      // @ts-ignore
      const result = await component.asyncData({ app, router, initialState, to, from, api, apiClient });
      // eslint-disable-next-line no-param-reassign
      to.meta.state = result;
      return next();
    } catch (e) {
      console.error(`[asyncData] failed to run while navigating to ${to.fullPath}`);
      throw e;
    }
  });

  return { head };
}
