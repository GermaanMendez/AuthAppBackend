import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,Request} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto,RegisterUserDto,UpdateAuthDto } from './dto/index';
import { AuthGuard } from './guards/auth.guard';
import { User } from './entities/user.entity';
import { LoginResponse } from './interfaces/login-response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterUserDto) {
    console.log("teees")
    console.log(registerDto)
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginAuthDto: LoginDto) {
    console.log("teees")
    return this.authService.login(loginAuthDto);
  }

  //uso el guard que cree para proteger el acceso al metodo en base al token
  @UseGuards( AuthGuard )
  @Get()
  //utilizo el decorador request para acceder al objeto Request que contiene sus propiedades
  findAll(@Request() req:Request) {
    //como estoy usando el guard y tengo definido en el metodo que valida la peticion una logica que obtiene el usuario que hacer la request y lo guarda en la propiedad user del objeto request
    //cuando el guard me devuelve dicha req lo puedo acceder, el flujo es primero la peticion va al guard y luego viene al contrlador por lo tanto todo cambio que haga en la request en el guard el controlador lo recibira
    //en este caso actualio la ruequest para setear en la propiedad user el usuario que esta haciendo la peticion
    const user = req['user'];
    return this.authService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('check-token')
  checkToken(@Request() req:Request):LoginResponse{
    const user = req['user'] as User;
    return {
      user,
      token: this.authService.getJWTtoken({ id: user._id })
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
