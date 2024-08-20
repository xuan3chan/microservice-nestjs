import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { AuthInterface } from '@my-workspace/common/interface';
import { ClientGrpc, Client } from '@nestjs/microservices';
import { loginDto, registerDto } from '@my-workspace/common/dtos';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  private authService: AuthInterface;

  constructor(
    @Inject('AUTH_SERVICE') private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    // Khi module đã được khởi tạo, lấy service gRPC từ client
    this.authService = this.client.getService<AuthInterface>('AuthenticationService');
  }

  async register(data: registerDto) {
    return await this.authService.Register(data);
  }

  async login(data:loginDto) {
    return await this.authService.Login(data);
  }
}
