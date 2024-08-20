import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from '@my-workspace/common/dtos';
import {  RpcException } from '@nestjs/microservices';
import { User } from '@my-workspace/common/schema';


@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.email) {
        throw new RpcException('Email already exists');
        }
      throw new RpcException({ code: 500, message: 'Internal server error' });
    }
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).exec();
  }

  async getAll(): Promise<any> {
    const user1 = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'sdsdasd',
      password: 'sdsdsd',
    };
    return user1;
  }
}
