import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Put,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto, UpdateRoleDto, DeleteRoleDto } from '@my-workspace/common/dtos';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('role')
@ApiBearerAuth()
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiCreatedResponse({ description: 'Role created successfully' })
  @ApiBadRequestResponse({ description: 'Role already exists' })
  async createRoleController(@Body() role: CreateRoleDto) {
    await this.roleService.createRoleService(role.name, role.permissionID);
    return { message: 'Role created successfully' };
  }

  @Put()
  @ApiOkResponse({ description: 'Role updated successfully' })
  @ApiBadRequestResponse({ description: 'Role already exists or Role not exists' })
  async updateRoleController(
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<{ message: string }> {
    await this.roleService.updateRoleService(
      updateRoleDto._id,
      updateRoleDto.name,
      updateRoleDto.permissionID,
    );
    return { message: 'Role updated successfully' };
  }

  @Get()
  @ApiOkResponse({ description: 'Get all roles' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async viewlistRoleController(): Promise<{ data: any }> {
    const data = await this.roleService.viewlistRoleService();
    return { data };
  }

  @MessagePattern({ cmd: 'findRoleById' })
  @ApiBadRequestResponse({ description: 'Role not found' })
  async getRoleByIdController(@Payload() data: { ids: string[] }) {
    return this.roleService.findRoleService(data.ids);
  }

  // @Delete()
  // @ApiOkResponse({ description: 'Role deleted successfully' })
  // @ApiBadRequestResponse({ description: 'Role not exists or Role exists in admin' })
  // @HttpCode(200)
  // async deleteRoleController(@Body() deleteRoleDto: DeleteRoleDto) {
  //   return this.roleService.deleteRoleService(deleteRoleDto.id);
  // }
}
