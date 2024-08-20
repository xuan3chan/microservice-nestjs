import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { UsersInterface } from '@my-workspace/common/interface';
import { loginDto, registerDto } from '@my-workspace/common/dtos';
import { firstValueFrom, Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { GrpcInternalException, GrpcNotFoundException } from 'nestjs-grpc-exceptions';


@Injectable()
export class AuthenticationService implements OnModuleInit {
  private usersService: UsersInterface;

  constructor(
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc,
    @Inject('USER_RABBIT') private readonly clientRabbit: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersInterface>('UsersService');
  }

  private async createJwtPayload(
    accountHolder: any,
  ): Promise<any> {
    return {
      email: accountHolder.email,
      id: accountHolder._id,
    };
  }

  async register(data: registerDto): Promise<any> {
    try {
      // Convert Observable to Promise using toPromise() or firstValueFrom()
      const result = await this.usersService.CreateUser(data);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(data: loginDto): Promise<{ message: string, accessToken: string}> {

      const checkUser = await firstValueFrom(this.clientRabbit.send(
        { cmd: 'findUserByEmail' },
        { email: data.email }
      ));
      if (!checkUser) {
        throw new GrpcNotFoundException("User Not Found.");
      }
      if (checkUser.password !== data.password) {
        throw new Error('Password is incorrect');
      }
      const payload = await this.createJwtPayload(checkUser);
      const token = this.jwtService.sign(payload);
       return { message: 'Login success', accessToken: token };
      
  }
  }
