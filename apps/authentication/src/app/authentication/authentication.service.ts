// authentication.service.ts
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy, RpcException } from '@nestjs/microservices';
import { UsersInterface } from '@my-workspace/common/interface';
import { loginDto, registerDto } from '@my-workspace/common/dtos';
import { firstValueFrom } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import {
  GrpcCancelledException,
  GrpcInternalException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcUnauthenticatedException,
  GrpcUnavailableException,
} from 'nestjs-grpc-exceptions';
import { timeout, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AuthenticationService implements OnModuleInit {
  private usersService: UsersInterface;

  constructor(
    @Inject('USER_PACKAGE') private readonly client: ClientGrpc,
    @Inject('ADMIN_RABBIT') private readonly _AdminService: ClientProxy,
    @Inject('USER_RABBIT') private readonly _UserService: ClientProxy,
    private readonly jwtService: JwtService
  ) {}

  onModuleInit() {
    this.usersService = this.client.getService<UsersInterface>('UsersService');
  }

  private async createJwtPayload(accountHolder: any): Promise<any> {
    return {
      account: accountHolder.account,
      id: accountHolder._id,
    };
  }

  async register(data: registerDto): Promise<any> {
    try {
      const checkUserExist = await this.usersService.FindByAccount(data.account);
      if (checkUserExist) {
        throw new GrpcInvalidArgumentException('User already exists');
      }
      const result = await this.usersService.CreateUser(data);
      return result;
    } catch (error) {
      throw new GrpcInternalException(error.message);
    }
  }

  async login(
    data: loginDto
  ): Promise<{ message: string; accessToken: string }> {
    try {
      const userResponse$ = this._UserService
        .send({ cmd: 'findByAccount' }, { account: data.account })
        .pipe(
          timeout(5000), // Timeout after 5 seconds
          catchError((err) => {
            // If timeout occurs or any other error, return null
            if (err.name === 'TimeoutError') {
              console.error('User Service is unavailable:', err.message);
            }
            return throwError(
              () => new GrpcCancelledException('User Service is unavailable')
            );
          })
        );

      const adminResponse$ = this._AdminService
        .send({ cmd: 'findAdminByAccount' }, { account: data.account })
        .pipe(
          timeout(5000), // Timeout after 5 seconds
          catchError((err) => {
            // If timeout occurs or any other error, return null
            if (err.name === 'TimeoutError') {
              console.error('Admin Service is unavailable:', err.message);
            }
            return throwError(
              () => new GrpcCancelledException('Admin Service is unavailable')
            );
          })
        );

      // Fetch responses with timeout and error handling
      const userResponse = await firstValueFrom(userResponse$).catch(
        () => null
      );
      const adminResponse = await firstValueFrom(adminResponse$).catch(
        () => null
      );

      // If neither user nor admin is found, throw not found exception
      if (
        (!userResponse || (Array.isArray(userResponse) && userResponse.length === 0)) &&
        (!adminResponse || (Array.isArray(adminResponse) && adminResponse.length === 0))
      ) {
        throw new GrpcNotFoundException('User or Admin not found.');
      }
      // Determine the valid response to use
      const validResponse = userResponse || adminResponse;
      // If password is incorrect in the valid response, throw an unauthenticated exception
      if (validResponse.password !== data.password) {
        throw new GrpcInvalidArgumentException('Invalid password');
      }
      // Create JWT payload and sign the token
      const payload = await this.createJwtPayload(validResponse);
      const token = this.jwtService.sign(payload);

      return { message: 'Login success', accessToken: token };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new GrpcInternalException(
        'An internal error occurred during login.'
      );
    }
  }
}
