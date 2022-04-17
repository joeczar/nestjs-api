import { Logger } from '@nestjs/common';
import { scryptSync } from 'crypto';

const salt = process.env.SALT;

export function getHash(password: string): string {
  const hash = scryptSync(password, salt, 32).toString('hex');
  return hash;
}
export function compareHash(plainText: string, hashed: string): boolean {
  const hash = getHash(plainText);
  const test = getHash(plainText);
  Logger.log('compareHash', {
    plainText,
    hashed,
    hash,
    match: hashed === hash,
    testMatch: test === hash,
  });
  return hashed === hash;
}
