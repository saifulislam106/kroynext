import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
      ThrottlerModule.forRoot([
      {
        ttl: 60, // seconds
        limit: 10, // 10 requests per 60 seconds
      },
    ]),
    PrismaModule,
     AuthModule,
     UserModule,
     CategoryModule,
     ProductModule,
     OrdersModule,
     PaymentsModule],
    controllers: [AppController],
    providers: [AppService,
      {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
