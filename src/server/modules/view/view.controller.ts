import { Controller, Get } from 'bwcx-ljsm';
import { Inject } from 'bwcx-core';
import ViewService from './view.service';
import { HtmlResponse } from '@server/response-handlers/html.response-handler';
import { RenderMethodKind } from '@common/enums/render.enum';

@Controller('', { priority: -100 })
@HtmlResponse()
export default class ViewController {
  public constructor(
    @Inject()
    private readonly service: ViewService,
  ) {}

  @Get('/')
  @Get('/detail/:id')
  public async ssrViews() {
    return await this.service.render(RenderMethodKind.SSR);
  }

  @Get('/about')
  public async csrViews() {
    return await this.service.render(RenderMethodKind.CSR);
  }

  @Get('*')
  public async notFoundView() {
    return await this.service.render(RenderMethodKind.CSR);
  }
}
