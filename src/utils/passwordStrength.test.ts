import { describe, it, expect } from 'vitest';
import {
  getPasswordStrength,
  STRENGTH_LABELS,
} from './passwordStrength';

describe('getPasswordStrength', () => {
  it('returns score 0 for empty string', () => {
    const r = getPasswordStrength('');
    expect(r.score).toBe(0);
    expect(r.hasLower).toBe(false);
    expect(r.hasUpper).toBe(false);
    expect(r.hasNumber).toBe(false);
    expect(r.hasSpecial).toBe(false);
  });

  it('detects lowercase only', () => {
    const r = getPasswordStrength('abc');
    expect(r.score).toBe(1);
    expect(r.hasLower).toBe(true);
    expect(r.hasUpper).toBe(false);
  });

  it('detects uppercase', () => {
    const r = getPasswordStrength('AB');
    expect(r.hasUpper).toBe(true);
    expect(r.hasLower).toBe(false);
  });

  it('detects numbers', () => {
    const r = getPasswordStrength('123');
    expect(r.hasNumber).toBe(true);
    expect(r.score).toBe(1);
  });

  it('detects special characters', () => {
    const r = getPasswordStrength('!@#');
    expect(r.hasSpecial).toBe(true);
    expect(r.score).toBe(1);
  });

  it('combines lower and number', () => {
    const r = getPasswordStrength('abc1');
    expect(r.score).toBe(2);
    expect(r.hasLower).toBe(true);
    expect(r.hasNumber).toBe(true);
  });

  it('returns max score 4 when all criteria met', () => {
    const r = getPasswordStrength('Abc1!');
    expect(r.score).toBe(4);
    expect(r.hasLower).toBe(true);
    expect(r.hasUpper).toBe(true);
    expect(r.hasNumber).toBe(true);
    expect(r.hasSpecial).toBe(true);
  });

  it('treats space as not special', () => {
    const r = getPasswordStrength('abc ABC1');
    expect(r.hasSpecial).toBe(false);
  });
});

describe('STRENGTH_LABELS', () => {
  it('has a label for every score', () => {
    for (const score of [0, 1, 2, 3, 4] as const) {
      expect(STRENGTH_LABELS[score]).toBeDefined();
      expect(STRENGTH_LABELS[score].length).toBeGreaterThan(0);
    }
  });
});
