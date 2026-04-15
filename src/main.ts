import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set api prefix
  app.setGlobalPrefix('api/v1');

  // set Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  // Todo : add cors

  // Enable Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Kroynext API')
    .setDescription('The Kroynext API description')
    .setVersion('1.0')
    .addTag('auth', 'Authentication related endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh-JWT',
        description: 'Enter Refresh JWT token',
        in: 'header',
      },
      'Refresh-JWT',
    )
    .addServer('http://localhost:3000', 'Development server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document,{
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Kroynext API Docs',
    customfavIcon : 'https:nextjs.com/favicjon.ico',
    customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info {margin: 50px 0},
    .swagger-ui .info .title {color: #fff}`,

  });

  // start server
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  Logger.error('Error starting server', err);
  process.exit(1);
});
