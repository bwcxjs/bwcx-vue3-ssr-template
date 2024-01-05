export class ApiRequestException extends Error {
  public code: number;
  public msg: string;

  public constructor(code: number, msg: string) {
    super(`API request error with code ${code}: ${msg}`);
    this.name = 'ApiRequestException';
    this.code = code;
    this.msg = msg;

    // restore prototype chain
    const actualProto = new.target.prototype;

    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      // @ts-ignore
      this.__proto__ = actualProto;
    }

    // @ts-ignore
    Error.captureStackTrace?.(this, this.constructor);
  }
}
