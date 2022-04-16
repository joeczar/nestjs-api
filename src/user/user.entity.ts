import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Logger } from '@nestjs/common';
import { getHash } from '../database/crypto.helper';

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
    select: false,
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

  @Exclude()
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    Logger.log('UserEntity - hashPassword', { password: this.password });
    try {
      Logger.log('hashPassword', { 'this.passwword': this.password });
      const hashed = getHash(this.password);
      Logger.log('hashPassword', { hashed });
      if (hashed) {
        this.password = hashed as string;
        return;
      }
    } catch (error) {
      Logger.error('hashPassword', error);
    }
  }
}
