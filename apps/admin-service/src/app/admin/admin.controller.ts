import { Body, Controller, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateAdminDto } from '@my-workspace/common/dtos';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @GrpcMethod('AdminService', 'CreateAdmin')
  @Post('create')
  async createAdmin(
    @Body() data: CreateAdminDto) {
    return this.adminService.createAdminService(data);
  }
  
  @Put()
  async updateAdmin(
    @Body() data: any) {
    return this.adminService.updateAdminService(data);
  }
  
  @MessagePattern({ cmd: 'findAdminByAccount' })
  async findAdminByAccount(
    @Payload() data: { account: string }) {
    console.log(data);
    return this.adminService.findAdminByAccountService(data.account);
  }
}
