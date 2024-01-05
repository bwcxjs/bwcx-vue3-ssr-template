/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */

// forked from vite-ssr `src/dev/server.ts`

import { Provide } from 'bwcx-core';
import type { RequestContext } from 'bwcx-ljsm';
import type { ViteDevServer, InlineConfig } from 'vite';
import type { SsrOptions } from 'vite-ssr/dev';
import { getEntryPoint, getPluginOptions } from 'vite-ssr/config';
import type { ViteSsrPluginOptions } from 'vite-ssr/config';
import type { WriteResponse } from 'vite-ssr/utils/types';
import c2k from 'koa-connect';
import path from 'path';
import { promises as fs } from 'fs';
import chalk from 'chalk';
import { IPageRenderer } from './page-renderer.interface';

@Provide({ id: IPageRenderer, when: 'development' })
export default class PageRendererDev implements IPageRenderer {
  private server: ViteDevServer;
  private pluginOptions: ViteSsrPluginOptions;
  private options: SsrOptions;

  public async init() {
    if (!this.server) {
      this.server = await this.createSsrServer({
        server: { middlewareMode: 'ssr' },
        // @ts-ignore
        ssr: 'src/client/entry-server.ts',
      });
    }
    this.pluginOptions = getPluginOptions(this.server.config);
    // @ts-ignore
    this.options = {
      ...this.server.config.inlineConfig, // CLI flags
      ...this.pluginOptions,
    };
    return c2k(this.server.middlewares);
  }

  public async render(mode: 'ssr' | 'csr', ctx: RequestContext) {
    if (mode === 'ssr') {
      return this.handleSsrRequest(ctx);
    }
    return this.getIndexTemplate(ctx.originalUrl);
  }

  public async destory() {
    await this.server?.close();
  }

  private async createSsrServer(options: InlineConfig & { polyfills?: boolean } = {}) {
    const createViteServer = await import('vite').then((m) => m.createServer);
    const viteServer = await createViteServer({
      ...options,
      server: options.server || { ...options },
    });

    if (options.polyfills !== false) {
      if (!globalThis.fetch) {
        const fetch = await import('node-fetch');
        // @ts-ignore
        globalThis.fetch = fetch.default || fetch;
      }
    }

    const isMiddlewareMode =
      // @ts-ignore
      options?.middlewareMode || options?.server?.middlewareMode;

    const printServerInfo = (server: ViteDevServer) => {
      const { info } = server.config.logger;

      let ssrReadyMessage = '\n -- SSR mode';

      // eslint-disable-next-line prefer-object-has-own
      if (Object.prototype.hasOwnProperty.call(server, 'printUrls')) {
        info(
          chalk.cyan(`\n  vite v${require('vite/package.json').version}`) + chalk.green(` dev server running at:\n`),
          {
            clear: !server.config.logger.hasWarned,
          },
        );

        // @ts-ignore
        server.printUrls();

        // @ts-ignore
        if (globalThis.__ssr_start_time) {
          ssrReadyMessage += chalk.cyan(
            ` ready in ${Math.round(
              // @ts-ignore
              performance.now() - globalThis.__ssr_start_time,
            )}ms.`,
          );
        }
      }

      info(`${ssrReadyMessage}\n`);
    };

    return new Proxy(viteServer, {
      get(target, prop, receiver) {
        if (prop === 'listen') {
          return async (port?: number) => {
            const server = await target.listen(port);

            if (!isMiddlewareMode) {
              printServerInfo(server);
            }

            return server;
          };
        }

        return Reflect.get(target, prop, receiver);
      },
    });
  }

  // This cannot be imported from utils due to ESM <> CJS issues
  private isRedirect({ status = 0 } = {}) {
    return status >= 300 && status < 400;
  }

  private fixEntryPoint() {
    // The plugin is redirecting to the entry-client for the SPA,
    // but we need to reach the entry-server here. This trick
    // replaces the plugin behavior in the config and seems
    // to keep the entry-client for the SPA.
    for (const alias of this.server.config.resolve.alias || []) {
      // @ts-ignore
      if (alias._viteSSR === true) {
        alias.replacement = alias.replacement.replace('client', 'server');
      }
    }
  }

  private resolve(p: string) {
    return path.resolve(this.server.config.root, p);
  }

  private async getIndexTemplate(url: string) {
    // Template should be fresh in every request
    const indexHtml = await fs.readFile(this.pluginOptions.input || this.resolve('index.html'), 'utf-8');
    return await this.server.transformIndexHtml(url, indexHtml);
  }

  private writeHead(ctx: RequestContext, params: WriteResponse = {}) {
    if (params.status) {
      ctx.status = params.status;
    }

    if (params.statusText) {
      ctx.res.statusMessage = params.statusText;
    }

    if (params.headers) {
      for (const [key, value] of Object.entries(params.headers)) {
        ctx.set(key, value);
      }
    }
  }

  private async handleSsrRequest(ctx: RequestContext): Promise<string> {
    this.fixEntryPoint();

    let template: string;

    try {
      template = await this.getIndexTemplate(ctx.originalUrl);
    } catch (error) {
      this.server.ssrFixStacktrace(error as Error);
      throw error;
    }

    try {
      const entryPoint = this.options.ssr || (await getEntryPoint(this.server.config, template));

      let resolvedEntryPoint = await this.server.ssrLoadModule(this.resolve(entryPoint));
      resolvedEntryPoint = resolvedEntryPoint.default || resolvedEntryPoint;
      const render = resolvedEntryPoint.render || resolvedEntryPoint;

      const protocol = ctx.protocol || (ctx.headers.referer || '').split(':')[0] || 'http';

      const url = `${protocol}://${ctx.headers.host}${ctx.originalUrl}`;

      // This context might contain initialState provided by other plugins
      const context =
        (this.options.getRenderContext &&
          (await this.options.getRenderContext({
            url,
            request: ctx.req,
            response: ctx.res,
            resolvedEntryPoint,
          }))) ||
        {};

      // This is used by Vitedge
      this.writeHead(ctx, context);
      if (this.isRedirect(context)) {
        return;
      }

      const result = await render(url, {
        request: ctx.req,
        response: ctx.res,
        template,
        ...context,
      });

      this.writeHead(ctx, result);
      if (this.isRedirect(result)) {
        return;
      }

      return result.html;
    } catch (e) {
      ctx.error?.(`Render ${ctx.url} failed, retry with csr mode. Error:`, e);
      this.server.ssrFixStacktrace(e as Error);

      // Send back template HTML to inject ViteErrorOverlay
      return template;
    }
  }
}
