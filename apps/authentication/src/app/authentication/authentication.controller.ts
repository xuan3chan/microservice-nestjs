import { Body, Controller, Get, Post, UseFilters, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { loginDto, registerDto } from '@my-workspace/common/dtos';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcToHttpInterceptor } from 'nestjs-grpc-exceptions';

@UseInterceptors(GrpcToHttpInterceptor)
@Controller()
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @GrpcMethod('AuthenticationService', 'Register')
  async register(data: registerDto) {
    const result = await this.authService.register(data);
    return result;
  }

  @GrpcMethod('AuthenticationService', 'Login')
  async login(data: loginDto) {
    const result = await this.authService.login(data);
    return result;
  }
}
