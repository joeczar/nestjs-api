import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@Req() request: Request, @Res() response: Response) {
    return response.json(this.userService.getAll());
  }
}
