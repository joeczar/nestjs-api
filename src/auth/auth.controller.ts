import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  Logger,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { RequestWithUser } from './request.interface';
import { LocalAuthGuard } from './localAuth.guard';
import { JwtAuthGuard } from './jwtAuth.guard';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    const result = this.authService.register(registrationData);
    Logger.log({ registrationData, result });
    return result;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      const { user } = request;
      const token = this.authService.getJwt(user.id);
      const refresh_token = this.authService.getRefreshToken(user.id);
      Logger.log('log-in', {
        token,
        refresh_token,
      });
      await this.usersService.setCurrentRefreshToken(refresh_token, user.id);
      return response.json({ token, refresh_token });
    } catch (error) {
      Logger.error('Login error', error);
    }
  }
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refresh(@Req() request: RequestWithUser, @Res() response: Response) {
    try {
      Logger.log('refresh', request.cookies);
      const { user } = request;
      const refresh_token = this.authService.getRefreshToken(user.id);
      return response.json(refresh_token);
    } catch (error) {
      Logger.error('Login error', error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    Logger.log('log-out', request);
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }
  @UseGuards(JwtAuthGuard)
  @Get('user')
  authenticate(@Req() request: RequestWithUser, @Res() response: Response) {
    const user = request.user;
    return response.json({ user });
  }
}
