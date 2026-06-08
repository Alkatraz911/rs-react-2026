import {
  getPasswordStrength,
  STRENGTH_LABELS,
} from '../../utils/passwordStrength';

interface Props {
  password: string;
}

function PasswordStrength({ password }: Props) {
  const result = getPasswordStrength(password);
  const labelText = password.length === 0
    ? STRENGTH_LABELS[0]
    : STRENGTH_LABELS[result.score];

  return (
    <div className="password-strength" data-testid="password-strength">
      <div
        className="password-strength__bar"
        aria-hidden="true"
      >
        {[1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className={
              level <= result.score
                ? `password-strength__segment password-strength__segment--filled password-strength__segment--level-${result.score}`
                : 'password-strength__segment'
            }
          />
        ))}
      </div>

      <div className="password-strength__meta">
        <span className="password-strength__label">
          Strength: {labelText}
        </span>
        <ul className="password-strength__criteria">
          <li
            className={
              result.hasLower
                ? 'password-strength__rule password-strength__rule--met'
                : 'password-strength__rule'
            }
          >
            lowercase
          </li>
          <li
            className={
              result.hasUpper
                ? 'password-strength__rule password-strength__rule--met'
                : 'password-strength__rule'
            }
          >
            uppercase
          </li>
          <li
            className={
              result.hasNumber
                ? 'password-strength__rule password-strength__rule--met'
                : 'password-strength__rule'
            }
          >
            number
          </li>
          <li
            className={
              result.hasSpecial
                ? 'password-strength__rule password-strength__rule--met'
                : 'password-strength__rule'
            }
          >
            special
          </li>
        </ul>
      </div>
    </div>
  );
}

export default PasswordStrength;
