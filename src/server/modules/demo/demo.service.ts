import { Service, InjectCtx } from 'bwcx-ljsm';
import type { RequestContext } from 'bwcx-ljsm';

@Service()
export default class DemoService {
  public constructor(
    @InjectCtx()
    private readonly ctx: RequestContext,
  ) {}

  public async getPublic(id: number, _page: number) {
    return {
      rows: [
        { id, name: 'demo1' },
        { id: 999, name: 'demo2' },
      ],
    };
  }
}
