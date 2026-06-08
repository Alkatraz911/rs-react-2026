import { z } from 'zod';
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  type AllowedImageType,
} from './imageToBase64';

export const SPECIAL_CHARS_REGEX =
  /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export const isUpperFirst = (value: string): boolean => {
  if (!value) return false;
  const first = value[0];
  return first === first.toUpperCase() && first !== first.toLowerCase();
};

export const isValidEmail = (email: string): boolean => {
  if (!email || email.includes(' ')) return false;
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return false;
  if (atIndex !== email.lastIndexOf('@')) return false;

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);

  if (!local) return false;
  if (!domain) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (!domain.includes('.')) return false;
  return domain.split('.').every((segment) => segment.length > 0);
};

const extractFile = (value: unknown): File | undefined => {
  if (typeof File !== 'undefined' && value instanceof File) {
    return value;
  }
  if (
    value &&
    typeof value === 'object' &&
    'length' in value &&
    typeof (value as ArrayLike<unknown>).length === 'number' &&
    (value as ArrayLike<unknown>).length > 0
  ) {
    const first = (value as ArrayLike<unknown>)[0];
    if (typeof File !== 'undefined' && first instanceof File) {
      return first;
    }
  }
  return undefined;
};

const parseAge = (value: unknown): number | undefined => {
  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return undefined;
    const parsed = Number(trimmed);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
};

export const buildFormSchema = (countries: string[]) =>
  z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine(isUpperFirst, 'First letter must be uppercase'),
      age: z.preprocess(
        parseAge,
        z
          .number({ message: 'Age is required' })
          .int('Age must be a whole number')
          .min(0, 'Age cannot be negative')
      ),
      email: z
        .string()
        .min(1, 'Email is required')
        .refine(isValidEmail, 'Email is not valid'),
      gender: z.enum(['male', 'female', 'other'], {
        message: 'Pick a gender',
      }),
      acceptedTerms: z.literal(true, {
        message: 'You must accept Terms and Conditions',
      }),
      password: z
        .string()
        .min(1, 'Password is required')
        .refine(
          (value) => /[a-z]/.test(value),
          'Password must contain at least one lowercase letter'
        )
        .refine(
          (value) => /[A-Z]/.test(value),
          'Password must contain at least one uppercase letter'
        )
        .refine(
          (value) => /[0-9]/.test(value),
          'Password must contain at least one number'
        )
        .refine(
          (value) => SPECIAL_CHARS_REGEX.test(value),
          'Password must contain at least one special character'
        ),
      confirmPassword: z
        .string()
        .min(1, 'Confirm password is required'),
      country: z
        .string()
        .min(1, 'Country is required')
        .refine(
          (value) => countries.includes(value),
          'Country must be from the list'
        ),
      image: z.preprocess(
        extractFile,
        z
          .custom<File>(
            (value) =>
              typeof File !== 'undefined' && value instanceof File,
            { message: 'Image is required' }
          )
          .refine(
            (file) =>
              ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType),
            'Image must be PNG or JPEG'
          )
          .refine(
            (file) => file.size <= MAX_IMAGE_SIZE_BYTES,
            `Image must be smaller than ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB`
          )
      ),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      {
        message: 'Passwords must match',
        path: ['confirmPassword'],
      }
    );

export type FormSchema = ReturnType<typeof buildFormSchema>;
export type FormInput = z.input<FormSchema>;
export type FormOutput = z.output<FormSchema>;

export type FormErrors = Partial<Record<keyof FormOutput, string>>;

export const zodIssuesToErrors = (
  issues: z.ZodIssue[]
): FormErrors => {
  const errors: FormErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === 'string' && !(key in errors)) {
      (errors as Record<string, string>)[key] = issue.message;
    }
  }
  return errors;
};
