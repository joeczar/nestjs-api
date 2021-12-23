import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { UserService } from 'src/user/user.service';
import { RegisterDto, ReturnedUserDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './tokenPayload.interface';
import { compareHash } from 'src/database/crypto.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async register(registrationData: RegisterDto) {
    try {
      Logger.log('AuthService - register', { ...registrationData });
      const createdUser = await this.userService.create({
        ...registrationData,
      });
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  public async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<ReturnedUserDto> {
    try {
      const { password, ...returnedUser } = await this.userService.getByEmail(
        email,
      );
      await this.verifyPassword(plainTextPassword, password);

      return returnedUser;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    try {
      const isPasswordMatching = await compareHash(
        plainTextPassword,
        hashedPassword,
      );
      Logger.log('verifyPassword', {
        isPasswordMatching,
      });
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      Logger.error('verifyPassword', error);
    }
  }
  public getJwt(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}`,
    });
    return token;
  }
  public getRefreshToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}`,
    });
    return token;
  }
  public getCookieWithJwt(userId: string) {
    const token = this.getJwt(userId);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
