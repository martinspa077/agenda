import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS for development

  const config = new DocumentBuilder()
    .setTitle('SGC API')
    .setDescription('The Consultation Management System API description')
    .setVersion('1.0')
    .addTag('sgc')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`Listening on 0.0.0.0:${port}`);
}
bootstrap();
