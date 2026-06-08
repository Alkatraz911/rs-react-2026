import { describe, it, expect } from 'vitest';
import {
  buildFormSchema,
  isUpperFirst,
  isValidEmail,
  zodIssuesToErrors,
} from './validation';

describe('isUpperFirst', () => {
  it('returns true when first letter is uppercase', () => {
    expect(isUpperFirst('Anna')).toBe(true);
  });

  it('returns false when first letter is lowercase', () => {
    expect(isUpperFirst('anna')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isUpperFirst('')).toBe(false);
  });

  it('returns false when first char is non-letter', () => {
    expect(isUpperFirst('1abc')).toBe(false);
  });
});

describe('isValidEmail', () => {
  it('accepts a basic valid email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('rejects empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('rejects email without @', () => {
    expect(isValidEmail('userexample.com')).toBe(false);
  });

  it('rejects email with multiple @', () => {
    expect(isValidEmail('a@b@c.com')).toBe(false);
  });

  it('rejects email with empty local part', () => {
    expect(isValidEmail('@example.com')).toBe(false);
  });

  it('rejects email with empty domain', () => {
    expect(isValidEmail('user@')).toBe(false);
  });

  it('rejects email when domain has no dot', () => {
    expect(isValidEmail('user@localhost')).toBe(false);
  });

  it('rejects domain starting with dot', () => {
    expect(isValidEmail('user@.com')).toBe(false);
  });

  it('rejects domain ending with dot', () => {
    expect(isValidEmail('user@example.')).toBe(false);
  });

  it('rejects email with consecutive dots in domain', () => {
    expect(isValidEmail('user@example..com')).toBe(false);
  });

  it('rejects email with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
  });
});

describe('zodIssuesToErrors', () => {
  it('maps issues to errors by first path key', () => {
    const result = zodIssuesToErrors([
      { path: ['name'], message: 'Name is required' } as never,
      { path: ['age'], message: 'Age is required' } as never,
    ]);
    expect(result.name).toBe('Name is required');
    expect(result.age).toBe('Age is required');
  });

  it('keeps only the first error per field', () => {
    const result = zodIssuesToErrors([
      { path: ['name'], message: 'First' } as never,
      { path: ['name'], message: 'Second' } as never,
    ]);
    expect(result.name).toBe('First');
  });

  it('ignores issues with empty path', () => {
    const result = zodIssuesToErrors([
      { path: [], message: 'global' } as never,
    ]);
    expect(result).toEqual({});
  });
});

describe('buildFormSchema', () => {
  const COUNTRIES = ['Germany', 'Spain'];
  const schema = buildFormSchema(COUNTRIES);

  const makeFile = (
    type = 'image/png',
    size = 1024
  ): File => {
    const blob = new Blob([new Uint8Array(size)], { type });
    return new File([blob], 'a.png', { type });
  };

  const validInput = () => ({
    name: 'Anna',
    age: 25,
    email: 'a@b.com',
    gender: 'female' as const,
    acceptedTerms: true as const,
    password: 'Aa1!aa',
    confirmPassword: 'Aa1!aa',
    country: 'Germany',
    image: makeFile(),
  });

  it('accepts a fully valid input', () => {
    const result = schema.safeParse(validInput());
    expect(result.success).toBe(true);
  });

  it('rejects name with lowercase first letter', () => {
    const result = schema.safeParse({ ...validInput(), name: 'anna' });
    expect(result.success).toBe(false);
  });

  it('rejects negative age', () => {
    const result = schema.safeParse({ ...validInput(), age: -1 });
    expect(result.success).toBe(false);
  });

  it('rejects non-numeric age string', () => {
    const result = schema.safeParse({ ...validInput(), age: 'abc' });
    expect(result.success).toBe(false);
  });

  it('coerces numeric age string', () => {
    const result = schema.safeParse({ ...validInput(), age: '25' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = schema.safeParse({ ...validInput(), email: 'bad' });
    expect(result.success).toBe(false);
  });

  it('rejects when terms not accepted', () => {
    const result = schema.safeParse({ ...validInput(), acceptedTerms: false });
    expect(result.success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    const result = schema.safeParse({
      ...validInput(),
      password: 'aa1!aa',
      confirmPassword: 'aa1!aa',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched confirm password', () => {
    const result = schema.safeParse({
      ...validInput(),
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
  });

  it('rejects country not in list', () => {
    const result = schema.safeParse({
      ...validInput(),
      country: 'Atlantis',
    });
    expect(result.success).toBe(false);
  });

  it('rejects image with wrong type', () => {
    const result = schema.safeParse({
      ...validInput(),
      image: makeFile('image/gif'),
    });
    expect(result.success).toBe(false);
  });

  it('rejects image that is too large', () => {
    const result = schema.safeParse({
      ...validInput(),
      image: makeFile('image/png', 5 * 1024 * 1024),
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing image', () => {
    const result = schema.safeParse({ ...validInput(), image: null });
    expect(result.success).toBe(false);
  });
});
