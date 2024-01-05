/**
 * 发送请求时要传递的参数
 *
 * 通常只在 SSR 内部请求时需要从 context 上透传参数。
 */
export interface ICreateApiOpts {
  cookie?: string;
  ip?: string;
  ua?: string;
}
