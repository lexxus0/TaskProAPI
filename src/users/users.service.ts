import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';
import { User } from 'src/database/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findOne({ userId }).exec();
  }

  async update(
    userId: string,
    payload: Partial<User>,
    options: QueryOptions = {},
  ): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ _id: userId }, payload, {
      new: true,
      runValidators: true,
      ...options,
    });
  }
}
