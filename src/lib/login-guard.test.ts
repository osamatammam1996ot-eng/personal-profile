import { describe, expect, it } from 'vitest';
import { MAX_OVERALL, MAX_PER_VISITOR, isLockedOut } from './login-guard';

describe('isLockedOut', () => {
  it('allows the first few wrong passwords', () => {
    expect(isLockedOut(0, 0)).toBe(false);
    expect(isLockedOut(MAX_PER_VISITOR - 1, MAX_PER_VISITOR - 1)).toBe(false);
  });

  it('locks a visitor who reached their own limit', () => {
    expect(isLockedOut(MAX_PER_VISITOR, MAX_PER_VISITOR)).toBe(true);
  });

  it('locks everyone when guesses are spread over many addresses', () => {
    expect(isLockedOut(0, MAX_OVERALL)).toBe(true);
    expect(isLockedOut(1, MAX_OVERALL - 1)).toBe(false);
  });
});
