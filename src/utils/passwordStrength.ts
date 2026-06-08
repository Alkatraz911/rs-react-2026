export interface PasswordStrengthResult {
  score: 0 | 1 | 2 | 3 | 4;
  hasNumber: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasSpecial: boolean;
}

const SPECIAL_CHARS = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/;

export const getPasswordStrength = (
  password: string
): PasswordStrengthResult => {
  const hasNumber = /[0-9]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasSpecial = SPECIAL_CHARS.test(password);

  const score = (
    Number(hasNumber) +
    Number(hasUpper) +
    Number(hasLower) +
    Number(hasSpecial)
  ) as PasswordStrengthResult['score'];

  return { score, hasNumber, hasUpper, hasLower, hasSpecial };
};

export const STRENGTH_LABELS: Record<
  PasswordStrengthResult['score'],
  string
> = {
  0: 'Empty',
  1: 'Weak',
  2: 'Fair',
  3: 'Good',
  4: 'Strong',
};
