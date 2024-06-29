import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


//Declaro como sera la estrucura de la entidad User
//uso el decorador Schema para definirle a mongo como 
//debe crear la tabla/entidad en la base de datos
@Schema()
export class User {

    //este atributo no lo creo ni mapeo como propiedad en el schema y por lo tanto en la base
    //lo hago para declarar que algunos pueden venir con ese valor pero como dije no sera mapeada a la base
    _id? : string
    //Defino las propiedades de la entidad en la base
    //usando @Prop y tambien agrego ciertas validaciones
    @Prop({ unique: true, required: true })
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop({ minlength: 6, required: true })
    password?: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop({ type: [String], default: ['user'] })
    roles: string[];

}
//Creo y exporto un nuevo schema que tendra la estrucura que defini arriba
//para que mongo db lo use y cree la tabla
export const UserSchema = SchemaFactory.createForClass(User)

//Luego debo importar este esquema en el modulo donde estoy parado
//para asi exponer el schema y que mongo db lo use