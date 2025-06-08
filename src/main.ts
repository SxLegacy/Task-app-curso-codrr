import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan'
import { CORS } from './constants';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(morgan('dev'));

  app.useGlobalPipes(
    new ValidationPipe({
      transformOptions:{
        enableImplicitConversion: true,
      },
    }),
  );

  const reflector = app.get(Reflector)

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  const configService = app.get(ConfigService);

  console.log(configService.get('PORT'));

  app.enableCors(CORS);

  app.setGlobalPrefix('api')
  
  const config = new DocumentBuilder()
    .setTitle('SxLegacy Taskrr API v1.0')
    .setDescription('This is a task app')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(configService.get('PORT'));
  console.log(`App run on: ${await app.getUrl()}`)
}
bootstrap();
