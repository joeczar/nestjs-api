import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @UseGuards(JwtAuthGuard)
  @Get()
  async getHello(@Req() request: Request, @Res() response: Response) {
    const users = await this.userService.getAll();
    Logger.log('user', { users });
    return response.json(users);
  }
}
