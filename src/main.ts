import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config(); // Load .env file


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with environment variables
  const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];

   app.enableCors({
     origin: allowedOrigins, // Allow requests from this origin (your Next.js front-end)
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Allowed methods
     allowedHeaders: 'X-Requested-With, Content-Type, Accept, Authorization, mode, X-CSRF-Token, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version', // Allowed headers
     credentials: true, // Allow cookies and authorization headers
   });

//  app.enableCors({
//      origin: allowedOrigins,
//      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//      credentials: true,
//  });

  // Enable CORS using NestJS's built-in method
  // app.enableCors({
  //   origin: [
  //     'http://localhost:7000',
  //     'http://localhost:3000',
  //     'http://195.248.240.132',
  //     'http://195.248.240.132:7000',
  //     'http://195.248.240.132:3000',
  //     'http://195.248.240.132:80',
  //     'http://195.248.240.132:7001',
  //     'http://195.248.240.132:3001',
  //     'http://195.248.240.132:81',
    // ], // Allow requests from this origin (your Next.js front-end)
  //   methods: 'GET,POST,PUT,PATCH,DELETE', // Allowed methods
  //   allowedHeaders: 'X-Requested-With,Content-Type, Accept,Authorization,mode', // Allowed headers
  //   credentials: true, // Allow cookies and authorization headers
  // });

  // app.use(function(req, res, next) {
  //   res.set('Access-Control-Allow-Origin', 'https://localhost');
  //   res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  //   res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  //   res.set('Access-Control-Allow-Credentials', true);
  //   next();
  // });

  // Swagger configuration
  const options = new DocumentBuilder()
    .addServer('http://localhost:7000/', 'Local environment')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(7000);
}

bootstrap();

// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   const options = new DocumentBuilder()
//   .addServer('http://localhost:7000/', 'Local environment')
//   .build();

// const document = SwaggerModule.createDocument(app, options);
// SwaggerModule.setup('docs', app, document);

// //  app.useGlobalPipes(ValidationPipeEx);

// app.use(function(req, res, next) {
//   res.set('Access-Control-Allow-Origin', 'http://localhost');
//   res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//   res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//   res.set('Access-Control-Allow-Credentials', true);
//   next();
// });

//   await app.listen(7000);

// }
// bootstrap();
