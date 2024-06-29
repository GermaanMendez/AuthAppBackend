import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt'

import { CreateUserDto,LoginDto,RegisterUserDto,UpdateAuthDto } from './dto/index';


import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';


@Injectable()
export class AuthService {

  private userModel:Model<User>;
  private jwtService:JwtService;
  //Hago la inyeccion de dependencias para recibir el modelo definido User para realizar
  //las operaciones a mi base de datos en base a dicho modelo como en .net cuando hacia db<usuario>
  constructor(@InjectModel(User.name) userModell: Model<User>, jwtService:JwtService){
    this.userModel = userModell;
    this.jwtService = jwtService;
  }

  async create(createAuthDto: CreateUserDto):Promise<User> {
    try {
      //1-Encriptar la contrasenia
      //Instalo un paquete para encriptar npm i bcryptjs o npm i --save-dev @types/bcryptjs

      //extraigo el password del usuario y el resto de la data
      const {password, ...userData} = createAuthDto;
      //creo un nuevo usuario en base al modelo que cree, le asigno el password encriptado y asigno el resto de atibutos usando el ...userdata
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password,10),
        ...userData
      })
      //3-Generar el json token
      await newUser.save();

      //retorno un objecto con la misma estructura del userModel y la misma data del usuario que cree menos la contrasenia
      //esto lo hago asi protejo la contrasenia y que esta no viaje en la respuesta ya que es un dato sensible, aunque perfectamente podria retornar todo el objeto
      const {password:_, ...user} = newUser.toJSON();
      return user;
      //esto es la desestructuracion, retorno un objeto que tendra una propiedad password con el valor _ y luego tendra los mismos atributos y correspondientes valores del objeto user

    } catch (error) {
      console.log(error)
      //es codigo 11000 ya que es el codigo de error que manda mongoDb cuando se intenta crear un duplicado, en este caso yo dije que los emails deben ser unicos
      if(error.code === 11000){
        throw new BadRequestException(`${createAuthDto.email} already exists `)
      }
      throw new InternalServerErrorException('Error servidor')
    }
  }



  async login(loginDto : LoginDto):Promise<LoginResponse>{
    const {email,password} = loginDto;

    //voy a buscar a la base de datos un usuario con el email que recibo
    const user = await this.userModel.findOne({email:email})
    //si no hay usuario es xq no existe ninguno con ese email
    if(!user){
      throw new UnauthorizedException('no existe un usuairo con ese email')
    }
    //uso la libreria para saber si la password que recibo transformada a encriptacion 
    //es igual a la que hay en la bdd ya que esa siempre estara encriptada
    if(!bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('passowrd incorrecta ')
    }
    const { password:_, ...rest} = user.toJSON();

    //para el json token instalo npm i --save @nestjs/jwt
    return{
      user: rest,
      token: this.getJWTtoken({id:user.id}),
    }

  }

  async register(registerDto:RegisterUserDto):Promise<LoginResponse>{
    const user = await this.create( registerDto );

    return{
      user:user,
      token: this.getJWTtoken({id:user._id})
    }
  }

  
  findAll():Promise<User[]>{
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }
  
  async findUserById(id:string){
    const user = await this.userModel.findOne({_id:id});
    const {password:_, ...userData} = user.toJSON();
    return userData;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJWTtoken(payload:JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

}
