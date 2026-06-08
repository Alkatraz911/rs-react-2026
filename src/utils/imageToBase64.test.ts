import { describe, it, expect } from 'vitest';
import {
  validateImageFile,
  imageToBase64,
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
} from './imageToBase64';

const makeFile = (
  name: string,
  type: string,
  sizeBytes: number
): File => {
  const blob = new Blob([new Uint8Array(sizeBytes)], { type });
  return new File([blob], name, { type });
};

describe('validateImageFile', () => {
  it('returns error when file is null', () => {
    const r = validateImageFile(null);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/required/i);
  });

  it('returns error when file is undefined', () => {
    const r = validateImageFile(undefined);
    expect(r.valid).toBe(false);
  });

  it('rejects unsupported mime type', () => {
    const file = makeFile('a.gif', 'image/gif', 1024);
    const r = validateImageFile(file);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/PNG or JPEG/i);
  });

  it('rejects file larger than max size', () => {
    const file = makeFile('big.png', 'image/png', MAX_IMAGE_SIZE_BYTES + 1);
    const r = validateImageFile(file);
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/smaller/i);
  });

  it('accepts a valid PNG within size limit', () => {
    const file = makeFile('a.png', 'image/png', 1024);
    const r = validateImageFile(file);
    expect(r.valid).toBe(true);
    expect(r.error).toBeNull();
  });

  it('accepts a valid JPEG within size limit', () => {
    const file = makeFile('a.jpg', 'image/jpeg', 1024);
    const r = validateImageFile(file);
    expect(r.valid).toBe(true);
  });

  it('exports the list of allowed types', () => {
    expect(ALLOWED_IMAGE_TYPES).toContain('image/png');
    expect(ALLOWED_IMAGE_TYPES).toContain('image/jpeg');
  });
});

describe('imageToBase64', () => {
  it('reads a file and returns a data URL string', async () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });
    const result = await imageToBase64(file);
    expect(typeof result).toBe('string');
    expect(result.startsWith('data:')).toBe(true);
  });
});
