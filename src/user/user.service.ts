import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as uuid from 'uuid';
import { hashPassword } from '../helper/hash_password';

@Injectable()
export class UserService {
  private users: User[] = [];

  constructor(@InjectModel('User') private userModel: Model<User>) {}
  async create(users: User) {
    const salt = uuid.v4();
    const newUser = new this.userModel({
      name: users.name,
      email: users.email,
      password: await hashPassword(users.password, salt),
      salt,
      identityNumber: users.identityNumber,
    });
    const results = await newUser.save();
    return results.id;
  }

  async findAll() {
    const users = await this.userModel.find();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      identityNumber: user.identityNumber,
    }));
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .exec()
      .catch(() => {
        throw new NotFoundException('User Not Found');
      });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel
      .findOne({ email: email })
      .exec()
      .catch(() => {
        throw new NotFoundException('User Not Found');
      });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
  async getOne(id: string) {
    const user = await this.findOne(id);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      identityNumber: user.identityNumber,
    };
  }

  async update(id: string, updateUserDto: User) {
    const user = await this.findOne(id);

    user.name = updateUserDto.name;
    user.email = updateUserDto.email;
    user.identityNumber = updateUserDto.identityNumber;

    if (updateUserDto.password) {
      const salt = uuid.v4();
      user.password = await hashPassword(updateUserDto.password, salt);
      user.salt = salt;
    }

    const results = await user.save();
    return `success update ${results.id}`;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await user.deleteOne();
    return `remove a #${id} user`;
  }
}
