import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

//Este guard esta basado en la validacion de json bearer token por lo tanto voy a 
//declarar el mismo en mi guard para luego usarlo para validar la solicitud, este guard
//debe ser llamado en los metodos de peticion en el controler
@Injectable()
export class AuthGuard implements CanActivate {
  
  private jwtService:JwtService;
  private authService:AuthService;

  constructor(jwtService:JwtService, authService:AuthService) {
    this.jwtService = jwtService;
    this.authService = authService;
  }

  //obtengo la request que me llega y de la misma extraigo el token para validar
  async canActivate(context: ExecutionContext,): Promise<boolean>  {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw new UnauthorizedException('Token vacio')
    }
    try {
      //Verifico que el token que me estan pasando corresponde a la creacion de tokens basada en mi seed
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token,{secret: process.env.JWT_SEED}
        );
        //extraigo el id del usuario del token que me pasan para luego buscarlo y saber si quien esta enviando la peticion existe en la base de datos
        const user = await this.authService.findUserById(payload.id);
        if(!user) throw new UnauthorizedException('User no existe');
        if(!user.isActive) throw new UnauthorizedException('Usuario no activo');
        //en el objeto request en la propiedad user seteo todo el usuario que obtuve desde la base de datos con el metodo findUserById
        request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }
    
    return true;
  }


  private extractTokenFromHeader(request:Request):string|undefined{
    const [type, token] = request.headers['authorization']?.split(' ')??[];
    return type === 'Bearer' ? token : undefined;
  }

}
