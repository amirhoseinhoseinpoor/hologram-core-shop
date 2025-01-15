import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  const APP_MODE = process.env.APP_MODE;
  const APP_PORT = APP_MODE === 'prod' ? process.env.APP_PORT : process.env.APP_DEV_PORT;
  const CORS_HOSTS = process.env.CORS_HOSTS?.split(',') || [];
  const CORS_PORTS = APP_MODE === 'prod' ? process.env.CORS_PORTS?.split(',') : process.env.CORS_DEV_PORTS?.split(',') || [];

  const ALLOWED_ORIGINS = [];
  for (let host of CORS_HOSTS){
    ALLOWED_ORIGINS.push(`${host}`);
    for (const port of CORS_PORTS) 
      ALLOWED_ORIGINS.push(`${host}:${port}`);
  }

  console.log('ALLOWED_ORIGINS', ALLOWED_ORIGINS);

  app.enableCors({
    origin: ALLOWED_ORIGINS,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed methods
    allowedHeaders:
      'X-Requested-With, Content-Type, Accept, Authorization, mode, X-CSRF-Token, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version', // Allowed headers
    credentials: true, // Allow cookies and authorization headers
  });

  // Swagger configuration
  const options = new DocumentBuilder()
    .addServer(`http://localhost:${APP_PORT}/`, 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(APP_PORT);
}

bootstrap();
