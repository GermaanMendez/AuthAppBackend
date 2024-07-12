import { IsDate, IsEmail, IsString, MinLength } from "class-validator";


export class RegisterUserDto {

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
