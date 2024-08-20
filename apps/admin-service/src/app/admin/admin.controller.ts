import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateAdminDto } from '@my-workspace/common/dtos';

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @GrpcMethod('AdminService', 'CreateAdmin')
  @Post()
  async createAdmin(
    @Body() data: CreateAdminDto) {
    return this.adminService.createAdmin(data);
  }
}
