import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Centralized API for Smart Contracts')
    .setDescription(
      'This is the centralized API for smart contracts. It is used to interact with the smart contracts deployed on the blockchain.',
    )
    .setVersion('1.0')
    .addTag('Centralized API for Smart Contracts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
