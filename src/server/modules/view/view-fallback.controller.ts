import { Controller, Get } from 'bwcx-ljsm';
import { Inject } from 'bwcx-core';
import ViewService from './view.service';
import { HtmlResponse } from '@server/response-handlers/html.response-handler';
import { RenderMethodKind } from '@common/enums/render.enum';

@Controller('', { priority: -999, when: 'production' })
@HtmlResponse()
export default class ViewFallbackController {
  public constructor(
    @Inject()
    private readonly service: ViewService,
  ) {}

  @Get('*')
  public fallbackNotFoundView() {
    return this.service.render(RenderMethodKind.CSR);
  }
}
