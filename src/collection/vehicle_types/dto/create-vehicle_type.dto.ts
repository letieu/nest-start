import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleTypeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty()
  @IsNumber()
  initPriceEth: number;

  @ApiProperty()
  @IsNumber()
  initPriceBsc: number;

  @ApiProperty()
  @IsNumber()
  initQuantityEth: number;

  @ApiProperty()
  @IsNumber()
  initQuantityBsc: number;
}
