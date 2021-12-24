import { randomBytes, scryptSync } from 'crypto';

export function getHash(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 32).toString('hex');
  return hash;
}
export async function compareHash(
  plainText: string,
  hashed: string,
): Promise<boolean> {
  const hash = getHash(plainText);
  if (hashed === hash) return true;
  return false;
}
