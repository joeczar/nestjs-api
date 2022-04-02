import { Logger } from '@nestjs/common';
import { randomBytes, scryptSync } from 'crypto';

const salt = randomBytes(16).toString('hex');

export function getHash(password: string): string {
  Logger.log('getHash', { password });

  const hash = scryptSync(password, salt, 32).toString('hex');
  Logger.log('getHash', { password, hash });
  return hash;
}
export async function compareHash(
  plainText: string,
  hashed: string,
): Promise<boolean> {
  const hash = getHash(plainText);
  Logger.log('compareHash', { hash, hashed });
  if (hashed === hash) return true;
  return false;
}
