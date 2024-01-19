/* eslint-disable @typescript-eslint/no-require-imports */

import { Provide } from 'bwcx-core';
import type { RequestContext } from 'bwcx-ljsm';
import type { Renderer, Rendered } from 'vite-ssr/utils/types';
import { IPageRenderer } from './page-renderer.interface';

@Provide({ id: IPageRenderer, when: 'production' })
export default class PageRendererProd implements IPageRenderer {
  private manifest: Record<string, string[]>;
  private renderPage: Renderer;

  public constructor() {
    const dist = `${process.cwd()}/dist`;

    // The manifest is required for preloading assets
    this.manifest = require(`${dist}/client/ssr-manifest.json`);

    // This is the server renderer we just built
    const { default: renderPage } = require(`${dist}/server`);
    this.renderPage = renderPage;
  }

  public async render(mode: 'ssr' | 'csr', ctx: RequestContext) {
    ctx.info(`${mode} ${ctx.url}`);
    const url = `${ctx.protocol}://${ctx.host}${ctx.originalUrl}`;
    let res: Rendered;
    try {
      res = (await this.renderPage(url, {
        skip: mode !== 'ssr',
        manifest: this.manifest,
        preload: true,
        // Anything passed here will be available in the main hook
        request: ctx.req,
        response: ctx.res,
        // initialState: { ... } // <- This would also be available
      })) as Rendered;
    } catch (e) {
      ctx.error?.(`Render ${ctx.url} failed, retry with csr mode. Error:`, e);
      res = (await this.renderPage(url, {
        skip: true,
      })) as Rendered;
    }
    if (!res) {
      throw new Error(`Render failed for ${ctx.url}`);
    }
    const { html, status = 200, headers } = res;
    ctx.status = status;
    ctx.set(headers);
    return html;
  }
}
