import { Request } from 'express';
import { User } from '../user/user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

export interface UpdateUserDto {
  firstname?: string;
  lastname?: string;
  email: string;
}
export interface RequestWithLogin extends Request {
  username: string;
  password: string;
}

export interface LocalGuardLogin {
  username: string;
  password: string;
}
