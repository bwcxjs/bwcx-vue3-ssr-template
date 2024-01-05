import { AbstractResponseParser } from 'bwcx-api-client';
import { ApiRequestException } from './api-request.exception';

export class ResponseParser extends AbstractResponseParser {
  public constructor() {
    super({});
  }

  public parse(resp: any) {
    if (!resp) {
      throw new Error('API request failed due to invalid response body');
    }
    if (resp.success) {
      return resp.data;
    }
    throw new ApiRequestException(resp.code, resp.msg);
  }
}
