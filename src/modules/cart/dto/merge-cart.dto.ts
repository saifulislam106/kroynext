// src/cart/dto/merge-cart.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, IsNumber } from 'class-validator';

export class CartItemDto {
  @ApiProperty({example: '550e8400-e29b-41d4-a716-446655440000'})
  @IsString()
  productId: string;

  @ApiProperty({example: 2, })
  @IsNumber()
  quantity: number;
}

export class MergeCartDto {
  @ApiProperty({ type: [CartItemDto] })
  @IsArray()
  items: CartItemDto[];
}