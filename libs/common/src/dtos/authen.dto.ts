import { ApiProperty } from '@nestjs/swagger';
import {
  MinLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class registerDto {
  @ApiProperty({
    description: 'Enter first name',
    type: String,
    required: true,
    default: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstname: string;

  @ApiProperty({
    description: 'Enter last name',
    type: String,
    required: true,
    default: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastname: string;

  @ApiProperty({
    description: 'Enter account',
    type: String,
    required: true,
    default: 'minhxuan',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  account: string;

  @ApiProperty({
    description: 'Enter password',
    type: String,
    required: true,
    default: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
export class loginDto {
  @ApiProperty({
    description: 'Enter account',
    example: 'minhxuan'
    
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  account: string;

  @ApiProperty({
    description: 'Enter password',
    example: '123456',
    type: String,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
