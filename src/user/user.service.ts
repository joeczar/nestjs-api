import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.entity';
import { compareHash } from 'src/database/crypto.helper';

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
      Logger.log('UserService - create', { userData });
      const newUser = await this.userRepository.create(userData);
      Logger.log('create', { newUser });
      const saved = await this.userRepository.save(newUser);
      Logger.log('create', { saved });
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
  async setCurrentRefreshToken(refreshToken: string, userId: string) {
    await this.userRepository.update(userId, {
      currentHashedRefreshToken: refreshToken,
    });
  }
  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    const isRefreshTokenMatch = await compareHash(
      refreshToken,
      user.currentHashedRefreshToken,
    );
    if (isRefreshTokenMatch) {
      return user;
    }
  }
}
