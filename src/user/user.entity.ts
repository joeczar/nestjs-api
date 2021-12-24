import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Logger } from '@nestjs/common';
import { getHash } from 'src/database/crypto.helper';

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
    Logger.log('UserEntity - hashPassword', { password: this.password });
    const hashed = getHash(this.password);
    this.password = hashed;
    Logger.log('hashed', { hashed: this.password });
  }
  @BeforeInsert()
  @BeforeUpdate()
  async hashToken() {
    const hashed = getHash(this.currentHashedRefreshToken);
    this.currentHashedRefreshToken = hashed;
  }
}
