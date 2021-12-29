import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';
import { RegisterDto, ReturnedUserDto } from './dto/register.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({});
  }
  async validate(username: string, password: string): Promise<ReturnedUserDto> {
    Logger.log("LocalStrategy - validate", {username, password})
    return this.authService.getAuthenticatedUser(username, password);
  }
}
