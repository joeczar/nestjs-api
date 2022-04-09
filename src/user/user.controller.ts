import { UpdateUserDto } from './../auth/request.interface';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  async updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
    Logger.log('update', { id, user });
    return this.userService.updateUser(id, user);
  }
  @Get(':name')
  async getUsersWithName(@Param('name') name: string) {
    return this.userService.getAllThatMatchName(name);
  }
}
