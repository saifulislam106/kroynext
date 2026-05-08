// DTO for creating order

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty()
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    example: 49.99,
  })
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    { message: 'Price must be a valid number (e.g., 49.99)' },
  )
  @Type(() => Number)
  price: number;
}
export class CreateOrderDto {
  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shippingAddress: string;
}