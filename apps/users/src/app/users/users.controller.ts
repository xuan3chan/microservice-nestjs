import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from '@my-workspace/common/dtos';
import { User } from '@my-workspace/common/schema';

@Controller()
// @UseFilters(new GrpcExceptionFilter())
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'CreateUser')
  createUser(data: CreateUserDto): Promise<User> {
    return this.usersService.create(data);
  }

  @GrpcMethod('UsersService', 'FindUser')
  findUser(data: { id: string }): Promise<User> {
    return this.usersService.findById(data.id);
  }

  @GrpcMethod('UsersService', 'GetAll')
  getAll(): Promise<any> {
    return this.usersService.getAll();
  }
  @MessagePattern({ cmd: 'findUserByEmail' })
  async findUserByEmail(@Payload() data: { email: string }) {
    return this.usersService.findByEmail(data.email);
  }
}
