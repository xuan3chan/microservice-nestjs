import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Admins } from '@my-workspace/common/schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminDto, UpdateAdminDto } from '@my-workspace/common/dtos';
import { GrpcAlreadyExistsException } from 'nestjs-grpc-exceptions';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { firstValueFrom } from 'rxjs';


@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Admins.name) private adminModel: Model<Admins>,
        @Inject('ROLE_RABBIT') private readonly roleRabbit: ClientProxy,
    ) {}

    async createAdminService(dto: CreateAdminDto): Promise<any> {
        //check nameAdmin
        const checkName = await this.adminModel
          .findOne({ userName: dto.userName })
          .select('userName')
          .lean();
        if (checkName) {
            console.log('checkName', checkName);
            throw new GrpcAlreadyExistsException('UserName of admin already exists');
        }
        
        const roleExits = await firstValueFrom(this.roleRabbit.send(
            { cmd: 'findRoleById' },
            { ids: dto.roleId },
        ));
        if (!roleExits || roleExits.length === 0) {
            throw new GrpcAlreadyExistsException('Role not exists');
        }
        //hash password
        const hashPassword = await bcrypt.hash(dto.password, 10);
        dto.password = hashPassword;

        const createdAdmin = new this.adminModel(dto);
        return createdAdmin.save();
    }
    async updateAdminService(dto: UpdateAdminDto): Promise<any> {
        // Kiểm tra xem admin có tồn tại không
        const admin = await this.adminModel.findOne({ _id: dto.id }).lean();
        if (!admin) {
            throw new BadRequestException('Admin not exists');
        }
        
        if (dto.userName) {
            const checkName = await this.adminModel
                .findOne({userName:dto.userName})
                .select('userName')
                .lean();
            if (checkName) {
                throw new BadRequestException('Name admin already exists');
            }
        }
        // Nếu có password mới, mã hóa password
        if (dto.password) {
            const hashPassword = await bcrypt.hash(dto.password, 10);
            dto.password = hashPassword;
        }
    
        // Kiểm tra xem roleId có hợp lệ không (nếu có thay đổi)
        if (dto.roleId && dto.roleId.length > 0) {
            const roleExits = await firstValueFrom(this.roleRabbit.send(
                { cmd: 'findRoleById' },
                { ids: dto.roleId },
            ));
            if (!roleExits || roleExits.length === 0) {
                throw new BadRequestException('Role not exists');
            }
        }
        // Cập nhật thông tin admin
        const updatedAdmin = await this.adminModel.findByIdAndUpdate(dto.id, dto, { new: true }).lean();
        
        return updatedAdmin;
    }
    
}
