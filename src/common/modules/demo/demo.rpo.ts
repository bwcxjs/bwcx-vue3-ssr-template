import { InParam, InQuery, BaseType, DefaultValue, TransformValue } from 'bwcx-client-vue';

export class DemoDetailRPO {
  /** ID */
  @InParam()
  @BaseType(Number)
  public id: number;

  /** 页码 */
  @InQuery()
  @BaseType(Number)
  public page?: number;

  /** 是否预览 */
  @InQuery()
  @BaseType(Boolean)
  @DefaultValue(false)
  public preview?: boolean;

  /** 数组参数 */
  @InQuery()
  @BaseType(Array)
  @DefaultValue(() => [])
  @TransformValue(Number)
  public arr?: number[];
}
