import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, scryptSync } from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async getAll() {
    const users = this.userRepository.find();
    return users;
  }
  async getByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ email });
      Logger.log('UserService - getByEmail', { user });
      if (user?.email) {
        return user;
      }
      throw new HttpException(
        'User with this email does not exist',
        HttpStatus.NOT_FOUND,
      );
    } catch (error) {
      Logger.error('UserService - getByEmail', error);
    }
  }
  async create(userData: CreateUserDto) {
    try {
      Logger.log('UserService - create', { userData });
      const newUser = await this.userRepository.create(userData);
      const savedUser = await this.userRepository.save(newUser);
      return newUser;
    } catch (error) {
      throw new Error('User creation error');
      Logger.error('User creation error', error);
    }
  }
  async getById(id: string) {
    const user = await this.userRepository.findOne({ id });
    if (user) return user;
    throw new HttpException(
      "User with this id doesn't exist",
      HttpStatus.NOT_FOUND,
    );
  }
  async updateUser(id: string, user: UpdateUserDto) {
    try {
      const savedUser = await this.userRepository.update(id, user);
      return savedUser;
    } catch (error) {
      Logger.log('Error updating user', error);
    }
  }
}
