import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsArray, IsOptional, MaxLength, MinLength, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateAdminDto {
    @ApiProperty({
        description: 'Enter name admin',
        type: String,
        required: true,
        default: 'John Doe',
    })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  nameAdmin: string;

  @ApiProperty({
    description: 'Enter username',
    type: String,
    required: true,
    default: 'nhanvien1',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  password: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  roleId: Types.ObjectId[];


}