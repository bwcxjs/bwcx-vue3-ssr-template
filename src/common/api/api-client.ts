/* eslint-disable @typescript-eslint/member-ordering */
/**
 * This file was automatically generated by `bwcx-api-client`.
 * DO NOT MODIFY IT BY HAND.
 */

import { AllowedRequestMethod, IBwcxApiRequestAdaptorArgs, AbstractResponseParser } from 'bwcx-api-client';
import { configure as configureUrlcat } from 'urlcat-fork';
import { DemoGetReqDTO, DemoGetRespDTO } from '../modules/demo/demo.dto';

const urlcat = configureUrlcat({ arrayFormat: 'repeat' });

export class ApiClient<T = undefined> {
  private readonly _r: (args: IBwcxApiRequestAdaptorArgs<T>) => Promise<any>;
  private readonly _rp: AbstractResponseParser;

  public constructor(
    requestAdapter: { request: (args: IBwcxApiRequestAdaptorArgs<T>) => Promise<any> },
    responseParser: AbstractResponseParser,
  ) {
    this._r = requestAdapter.request;
    this._rp = responseParser;
  }

  /**
   * 一个示例接口
   *
   * @param {DemoGetReqDTO} req The request data (compatible with ReqDTO).
   * @param {T} opts Extra request options.
   * @returns {DemoGetRespDTO} The response data (RespDTO).
   */
  public async demoGet(req: DemoGetReqDTO, opts?: T): Promise<DemoGetRespDTO> {
    return this._r(this._rArgs.a(req, opts)).then((resp) => this._rp.pat(DemoGetRespDTO, resp));
  }

  private _rArgs = {
    a: (req: DemoGetReqDTO, opts?: any) => {
      return {
        method: 'GET' as AllowedRequestMethod,
        url: this._uf('/api/demoGet/:id', {
          param: {
            id: req.id,
          },
          query: {
            page: req.page,
          },
        }),
        data: {},
        extraOpts: opts,
        metadata: {
          name: 'demoGet',
          method: 'GET',
          path: '/api/demoGet/:id',
          req: DemoGetReqDTO,
          resp: DemoGetRespDTO,
        },
      };
    },
  }

  private _uf(url: string, extra: { param?: object; query?: object } = {}): string {
    const { param, query } = extra;
    return urlcat(url, {
      ...param,
      ...query,
    });
  }
}