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

  @ApiProperty({
    description: 'Enter password',
    type: String,
    required: true,
    default: 'Admin@123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  password: string;

  @ApiProperty({
    description: 'Enter role id',
    type: [String],
    required: true,
    default: ['60e1d0b5d8f1f40015e4e8b0'],
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  roleId: Types.ObjectId[];

}
export class UpdateAdminDto {
  @ApiProperty({
    description: 'Id of the admin',
    example: '60e1d0b5d8f1f40015e4e8b0',
  })
  @IsString()
  id: string;
  @ApiProperty({
    description: 'Name of the admin',
    example: 'Admin1',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  nameAdmin: string;

  @ApiProperty({
    description: 'Email of the admin',
    example: 'admin1@gmail.com',
  })
  @IsOptional()
  @MinLength(3)
  @MaxLength(30)
  userName: string;

  @ApiProperty({
    description: 'Password of the admin',
    example: 'Admin@123',
  })
  @IsString()
  @IsOptional()
  @MinLength(6)
  @MaxLength(30)
  password: string;

  @ApiProperty({
    description: 'Role of the admin',
    example: ['66445e3ad052f97add5912c1', '66445e3ad052f97add5912c1'],
  })
  @IsOptional()
  roleId: string[];
}