
import { MinLength, IsEmail, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateUserDto {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    firstname: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    lastname: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsEmail({},{message:'please enter correct email'})
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(80)
    @MinLength(6,{message:'Password must be at least 6 characters'})
    password: string;

}