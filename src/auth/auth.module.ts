import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports:[
    //utilizo el modulo config para levantar las variables de entorno
    ConfigModule.forRoot(),
    //Importo el modulo Mongoose para usar y proporcionar a mongo db el schema User que cree
    MongooseModule.forFeature([
      {
        //Establezco el name que tendra en la bdd y el esquema a usar
        name:User.name,
        schema:UserSchema
      }
    ]),

    //Importo el modulo para hacer uso del json token
    //JWT utiliza una "seed" para a partir de ahi crear cada token, dicha seed la debo guardar en un lugar seguro es x eso que la creo en las variables de entorno
    JwtModule.register({
      global:true,
      secret:process.env.JWT_SEED,
      signOptions:{expiresIn:'6h'}//expira luego de 6 horas
    })
  ]
})
export class AuthModule {}
