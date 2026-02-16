import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateMe, CreateUser, UpdateUser } from './dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: CreateUser): Promise<UserDocument> {
    const createdUser = new this.userModel(user);

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`Пользователь с таким ID ${id} не найден`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async update(id: string, updateUserDto: UpdateUser): Promise<User> {
    const existingUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`Пользователь с такиим ID ${id} не найден`);
    }

    return existingUser;
  }

  async updateMe(id: string, data: UpdateMe): Promise<UserDocument> {
    const existingUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      data,
    );

    if (!existingUser) {
      throw new NotFoundException('Пользователь не найден');
    }

    await existingUser.save();

    return existingUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();

    if (!deletedUser) {
      throw new NotFoundException(`Пользователь с таким ID ${id} не найден`);
    }

    return deletedUser;
  }

  async count(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
