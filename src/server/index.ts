/* eslint-disable @typescript-eslint/no-require-imports */

const isProd = process.env.NODE_ENV === 'production';
const moduleAlias = require('module-alias');

moduleAlias.addAlias('@server', __dirname);
moduleAlias.addAlias('@common', require('path').join(__dirname, '../common'));

import { getDependency } from 'bwcx-core';
import type { IAppConfig, IAppWiredData } from 'bwcx-ljsm';
import { App } from 'bwcx-ljsm';
import BWCX_CONTAINER_KEY from 'bwcx-ljsm/container-key';
import { ApiClientGenerator } from 'bwcx-api-client/generator';
import path from 'path';
import favicon from 'koa-favicon';
import mount from 'koa-mount';
import koaStatic from 'koa-static';
import UtilityHeaderMiddleware from './middlewares/utility-header.middleware';
import LoggerMiddleware from './middlewares/logger.middleware';
import DefaultResponseHandler from '@server/response-handlers/default.response-handler';
import { IPageRenderer } from './lib/page-renderer.interface';
import { BwcxClientVueClientRoutesMapId } from 'bwcx-client-vue/server';
import { clientRoutesMap } from '@common/router/client-routes';

export default class OurApp extends App {
  protected baseDir = path.join(__dirname, '..');

  protected scanGlobs = [
    './server/**/*.(j|t)s',
    '!./server/**/*.d.ts',
    './common/**/*.(j|t)s',
    '!./common/**/*.d.ts',
    '!./common/api/**',
  ];

  protected hostname = '127.0.0.1';

  protected port = 3000;

  protected exitTimeout = 5000;

  protected globalMiddlewares = [UtilityHeaderMiddleware, LoggerMiddleware];

  protected responseHandler = DefaultResponseHandler;

  protected validation: IAppConfig['validation'] = isProd
    ? {
        skipRespValidation: true,
      }
    : {};

  protected bodyParserOptions: IAppConfig['bodyParserOptions'] = {
    formLimit: '5mb',
    jsonLimit: '5mb',
  };

  protected multerOptions: IAppConfig['multerOptions'] = {
    limits: {
      fileSize: 8 * 1024 * 1024,
    },
  };

  private pageRenderer: IPageRenderer;

  public constructor() {
    super();
    this.container.bind(BwcxClientVueClientRoutesMapId).toConstantValue(clientRoutesMap);
  }

  protected async beforeWire() {
    // favicon.ico
    this.instance.use(favicon(`${process.cwd()}/public/favicon.ico`));
    // serve static files (remove it if use other way to serve static files like CDN)
    this.instance.use(
      mount(
        '/dist',
        koaStatic(`${process.cwd()}/dist/client/`, {
          index: false,
          maxage: 2592000000,
          extensions: false,
        }),
      ),
    );
    // SSR
    this.pageRenderer = getDependency<IPageRenderer>(IPageRenderer, this.container);
    const renderMiddleware = await this.pageRenderer.init?.();
    if (renderMiddleware) {
      this.instance.use(renderMiddleware);
    }
  }

  protected async afterWire() {
    this.instance.on('error', (error, ctx) => {
      try {
        console.error('server error', error, ctx);
      } catch (e) {
        console.error(e);
      }
    });
  }

  protected async afterStart() {
    console.log(`🚀 A bwcx app is listening on http://${this.hostname || '0.0.0.0'}:${this.port}`);
    if (!isProd) {
      // generate api client
      const apiClientGenerator = new ApiClientGenerator(
        {
          outFilePath: path.join(this.baseDir, './common/api/api-client.ts'),
          prependImports: [],
          enableExtraReqOptions: true,
        },
        getDependency<IAppWiredData>(BWCX_CONTAINER_KEY.WiredData, this.container).router,
      );
      await apiClientGenerator.generate();
    }
  }

  protected async beforeExit() {
    await this.pageRenderer?.destory?.();
  }
}

const app = new OurApp();
app.scan();
app.bootstrap().then(() => {
  app.start();
});
