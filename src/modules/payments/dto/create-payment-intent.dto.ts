import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ example: 'order-123' })
  @IsNotEmpty({ message: 'Order ID is required' })
  @IsString()
  orderId: string;

  @ApiProperty({ example: 100 })
  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  currency?: string = 'usd';

  @ApiProperty({ example: 'Wireless Headphones' })
  @IsOptional()
  @IsString()
  description?: string;
}