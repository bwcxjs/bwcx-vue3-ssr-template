import { FromParam, FromQuery } from 'bwcx-common';
import { IsInt, Min, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DemoGetReqDTO {
  @FromParam()
  @IsInt()
  public id: number;

  @FromQuery()
  @IsInt()
  @Min(1)
  public page: number;
}

export class DemoItem {
  @IsInt()
  public id: number;

  @IsString()
  public name: string;
}

export class DemoGetRespDTO {
  @IsInt()
  public page: number;

  @Type(() => DemoItem)
  @ValidateNested()
  public list: DemoItem[];

  @IsString()
  public ip: string;

  @IsString()
  public ua: string;
}
