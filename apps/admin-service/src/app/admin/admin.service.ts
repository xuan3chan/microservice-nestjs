import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Admins } from '@my-workspace/common/schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAdminDto } from '@my-workspace/common/dtos';
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

    async createAdmin(dto: CreateAdminDto): Promise<any> {
        //check nameAdmin
        const checkName = await this.adminModel
          .findOne({ userName: dto.userName })
          .select('userName')
          .lean();
        if (checkName) {
            throw new GrpcAlreadyExistsException('Name admin already exists');
        }
        const roleExits = await firstValueFrom(this.roleRabbit.send(
            { cmd: 'findRoleById' },
            { ids: dto.roleId },
        ));
        console.log(roleExits);
        if (!roleExits || roleExits.length === 0) {
            throw new GrpcAlreadyExistsException('Role not exists');
        }
        //hash password
        const hashPassword = await bcrypt.hash(dto.password, 10);
        dto.password = hashPassword;

        const createdAdmin = new this.adminModel(dto);
        return createdAdmin.save();
    }

}
