import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
  .addServer('http://localhost:7000/', 'Local environment')
  .build();

const document = SwaggerModule.createDocument(app, options);
SwaggerModule.setup('docs', app, document);

//  app.useGlobalPipes(ValidationPipeEx);

app.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'https://localhost');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.set('Access-Control-Allow-Credentials', true);
  next();
});

  await app.listen(7000);


}
bootstrap();
