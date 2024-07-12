//Como hacia en .net declaro mis dtos para hacer la transferancia de DATA
//es obligatorio instalar npm i class-validator class-transformer
//para de esta forma poder validar que el dto que estoy recibiendo en las peticiones coincide con 
//el dto que tengo definido en mi backend es decir aca

import { IsDate, IsEmail, IsString, MinLength } from "class-validator";

//Ademas en el file main.ts debo agregar una configuracion, fiarse en ee file
export class CreateUserDto {
    //Aca agrego validaciones sobre cada una de los atributos del dto, de esta forma solo voy a transformar la data que recibo en el dto solo si 
    //cumple con las validaciones, si no cumple no se transforma la data recibida en este dto y no se continua con el proceso dl backend
    //basicamente es como en .net que al momento de crear el dto ejecutaba el metodo validar de dicha clase y si algo fallaba enviaba una respuesta de error a la app cliente,
    //en este caso nest no hace de forma automatica
    @IsString()
    firstName: string;

    @IsString()
    lastName:string;

    @IsEmail()
    email: string;
    
    @IsDate()
    date:Date;

    @IsString()
    role: string;
    
    @MinLength(5) @IsString() 
    password:string;

}

