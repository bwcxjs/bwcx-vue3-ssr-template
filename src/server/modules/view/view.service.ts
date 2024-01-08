import { Service, InjectCtx } from 'bwcx-ljsm';
import type { RequestContext } from 'bwcx-ljsm';
import { Inject } from 'bwcx-core';
import { RenderMethodKind } from 'bwcx-client-vue';
import { IPageRenderer } from '@server/lib/page-renderer.interface';

@Service()
export default class ViewService {
  public constructor(
    @InjectCtx()
    private readonly ctx: RequestContext,

    @Inject(IPageRenderer)
    private readonly renderer: IPageRenderer,
  ) {}

  public async render(mode: RenderMethodKind) {
    if (mode === RenderMethodKind.CSR || this.ctx.query.ssr === '0') {
      return await this.renderer.render('csr', this.ctx);
    }
    if (mode === RenderMethodKind.SSR) {
      return await this.renderer.render('ssr', this.ctx);
    }
    throw new Error(`Unsupported render mode ${mode}`);
  }
}
