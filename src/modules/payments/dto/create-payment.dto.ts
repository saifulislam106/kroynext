import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @ApiProperty({ example: '0125ae-4d4d-4d4d-4d4d-4d4d4d4d4d4d' })
  @IsNotEmpty()
  @IsString()
  paymentIntentId: string;

  @ApiProperty({ example: '0125ae-4d4d-4d4d-4d4d-4d4d4d4d4d4d' })
  @IsNotEmpty()
  @IsString()
  orderId: string;
}