import { compareHash, getHash } from './crypto.helper';

describe('compareHash', () => {
  const password = 'password';
  const hash = getHash(password);
  console.log('compareHash', { hash });
  it('should be defined', () => {
    expect(hash).toBeDefined();
    expect(typeof hash).toBe('string');
    expect(hash.length).toBe(64);
  });
});
