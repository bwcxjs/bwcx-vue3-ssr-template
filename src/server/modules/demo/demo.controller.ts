import { InjectCtx, Get, Contract, Data } from 'bwcx-ljsm';
import type { RequestContext } from 'bwcx-ljsm';
import { Inject } from 'bwcx-core';
import { Api } from 'bwcx-api';
import { DemoGetReqDTO, DemoGetRespDTO } from '@common/modules/demo/demo.dto';
import DemoService from './demo.service';
import MiscUtils from '@server/utils/misc.util';
import { ApiController } from '@server/decorators';

@ApiController()
export default class DemoController {
  public constructor(
    @InjectCtx()
    private readonly ctx: RequestContext,

    @Inject()
    private readonly service: DemoService,

    @Inject()
    private readonly miscUtils: MiscUtils,
  ) {}

  @Api.Summary('一个示例接口')
  @Get('/demoGet/:id')
  @Contract(DemoGetReqDTO, DemoGetRespDTO)
  public async demoGet(@Data() data: DemoGetReqDTO): Promise<DemoGetRespDTO> {
    const res = await this.service.getPublic(data.id, data.page);
    const ip = this.miscUtils.getIp(this.ctx);
    this.ctx.info('demoGet:', data);
    return {
      page: data.page,
      list: res.rows,
      ip,
      ua: this.ctx.headers['user-agent'],
    };
  }
}
