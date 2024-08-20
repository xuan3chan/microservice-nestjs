import { Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { loginDto, registerDto } from '@my-workspace/common/dtos';
import { GrpcExceptionFilter } from '@my-workspace/common/filters/rpc-exception';
import { AuthGuard } from '@my-workspace/common/gaurd';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseFilters(GrpcExceptionFilter)
@Controller()
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(
    @Body() dto:registerDto
    )
   {
    return await this.authenticationService.register(dto);
  }

  @Post('login')
  async login(
    @Body() dto:loginDto
    )
   {
    return await this.authenticationService.login(dto);
  }
}
