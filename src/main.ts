import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS using NestJS's built-in method
  app.enableCors({
    origin: ['http://localhost:3000', 'http://176.120.16.221'], // Allow requests from this origin (your Next.js front-end)
    methods: 'GET,POST,PUT,PATCH,DELETE', // Allowed methods
    allowedHeaders: 'X-Requested-With,Content-Type,Authorization,mode', // Allowed headers
    credentials: true, // Allow cookies and authorization headers
  });

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
