import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  firstname: string;
  @Column({
    type: 'varchar',
    nullable: true,
  })
  lastname: string;
  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  public currentHashedRefreshToken?: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    try {
      const hashed = await bcrypt.hash(this.password, 10);
      this.password = hashed;
    } catch (error) {
      Logger.error('bcrypt error', { error });
      throw new Error('bcrypt error');
    }
  }
  @BeforeInsert()
  @BeforeUpdate()
  async hashToken() {
    try {
      const hashed = await bcrypt.hash(this.currentHashedRefreshToken, 10);
      this.currentHashedRefreshToken = hashed;
    } catch (error) {
      Logger.error('bcrypt error', { error });
      throw new Error('bcrypt error');
    }
  }
}
