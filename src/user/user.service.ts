import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
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
  async getByEmail(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }
  async create(userData: CreateUserDto) {
    try {
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
}
