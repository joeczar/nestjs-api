import { compareHash, getHash } from './crypto.helper';

describe('Hash password', () => {
  const password = 'password';
  const hash = getHash(password);
  console.log('compareHash', { hash });
  it('should be defined', () => {
    expect(hash).toBeDefined();
  });
  it('should create hash from password', () => {
    expect(typeof hash).toBe('string');
  });
  it('hash should have a length of 64', () => {
    expect(hash.length).toBe(64);
  });
  it('should not contain password', () => {
    expect(hash.includes(password)).toBe(false);
  });
});
describe('Compare password', () => {
  const password = 'password';
  const notPassword = 'abc';
  const hash = getHash(password);
  const passwordMatches = compareHash(password, hash);
  const noMatch = compareHash(notPassword, hash);

  console.log({ passwordMatches });
  it('should be defined', () => {
    expect(passwordMatches).toBeDefined();
  });
  it('should match password', () => {
    expect(passwordMatches).toBe(true);
  });
  it('should not match notPassword', () => {
    expect(noMatch).toBe(false);
  });
});
