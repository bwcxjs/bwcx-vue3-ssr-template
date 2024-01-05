import Axios from 'axios';
import type { ApiType } from '.';
import type { ICreateApiOpts } from './interfaces';

export class ApiFactory {
  static createInstance(opts: ICreateApiOpts = {}): ApiType {
    return Axios.create({
      baseURL: 'http://127.0.0.1:3000/api/',
      timeout: 5000,
      headers: {
        Cookie: opts.cookie || '',
        referer: 'http://ssr_referrer',
        Accept: 'application/json',
        server_render_ip: opts.ip || '',
        'user-agent': opts.ua || 'BwcxServerRequest/0',
      },
    });
  }
}
