import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'], // Asegúrate de incluir todos los niveles que quieras ver
  });
  app.enableCors() 

  //Agrego esta configuracion para poder usar
  //la validacion del dto
  //de esta forma si me envian un dto que no corresponde a su dto se envia un mensaje de error a quien hizo la peticion
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true
    })
  )

  console.log("App correindo en port" + process.env.PORT)
  await app.listen(process.env.PORT || 3000);
  // await app.listen(process.env.PORT || 3000);
}
bootstrap();
