import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  SubmissionData,
  Gender,
} from '../../store/formsSlice';
import { useAppSelector } from '../../store/hooks';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import { imageToBase64 } from '../../utils/imageToBase64';
import {
  buildFormSchema,
  zodIssuesToErrors,
  type FormErrors,
} from '../../utils/validation';

interface Props {
  onSubmit: (data: SubmissionData) => void;
}

function UncontrolledForm({ onSubmit }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const countries = useAppSelector(
    (state) => state.forms.countries
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const file = imageRef.current?.files?.[0] ?? null;

    const raw = {
      name: nameRef.current?.value ?? '',
      age: ageRef.current?.value ?? '',
      email: emailRef.current?.value ?? '',
      gender: (genderRef.current?.value as Gender) ?? 'other',
      acceptedTerms: termsRef.current?.checked ?? false,
      password: passwordRef.current?.value ?? '',
      confirmPassword: confirmPasswordRef.current?.value ?? '',
      country,
      image: file,
    };

    const schema = buildFormSchema(countries);
    const result = schema.safeParse(raw);

    if (!result.success) {
      setErrors(zodIssuesToErrors(result.error.issues));
      return;
    }

    setErrors({});

    const validated = result.data;
    const base64Image = await imageToBase64(validated.image);

    const submission: SubmissionData = {
      name: validated.name,
      age: validated.age,
      email: validated.email,
      gender: validated.gender,
      acceptedTerms: validated.acceptedTerms,
      password: validated.password,
      country: validated.country,
      image: base64Image,
    };

    onSubmit(submission);
    formRef.current?.reset();
    setPassword('');
    setCountry('');
  };

  return (
    <form
      ref={formRef}
      className="rs-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Uncontrolled form"
    >
      <div className="rs-form__row">
        <label htmlFor="uc-name">Name</label>
        <input
          id="uc-name"
          name="name"
          type="text"
          ref={nameRef}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
        />
        <span className="rs-form__error" role="alert">
          {errors.name ?? ''}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-age">Age</label>
        <input
          id="uc-age"
          name="age"
          type="number"
          ref={ageRef}
          min={0}
          aria-invalid={Boolean(errors.age)}
        />
        <span className="rs-form__error" role="alert">
          {errors.age ?? ''}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-email">Email</label>
        <input
          id="uc-email"
          name="email"
          type="email"
          ref={emailRef}
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
        />
        <span className="rs-form__error" role="alert">
          {errors.email ?? ''}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-gender">Gender</label>
        <select
          id="uc-gender"
          name="gender"
          ref={genderRef}
          defaultValue="other"
          aria-invalid={Boolean(errors.gender)}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className="rs-form__error" role="alert">
          {errors.gender ?? ''}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-country">Country</label>
        <CountryAutocomplete
          id="uc-country"
          name="country"
          value={country}
          onChange={setCountry}
          countries={countries}
          placeholder="Start typing..."
        />
        <span className="rs-form__error" role="alert">
          {errors.country ?? ''}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-image">Profile picture (PNG / JPEG)</label>
        <input
          id="uc-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          ref={imageRef}
          aria-invalid={Boolean(errors.image)}
        />
        <span className="rs-form__error" role="alert">
          {errors.image ?? ''}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-password">Password</label>
        <input
          id="uc-password"
          name="password"
          type="password"
          ref={passwordRef}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
        />
        <PasswordStrength password={password} />
        <span className="rs-form__error" role="alert">
          {errors.password ?? ''}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-confirm-password">Confirm password</label>
        <input
          id="uc-confirm-password"
          name="confirmPassword"
          type="password"
          ref={confirmPasswordRef}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
        />
        <span className="rs-form__error" role="alert">
          {errors.confirmPassword ?? ''}
        </span>
      </div>

      <div className="rs-form__row rs-form__row--inline">
        <input
          id="uc-terms"
          name="acceptedTerms"
          type="checkbox"
          ref={termsRef}
          aria-invalid={Boolean(errors.acceptedTerms)}
        />
        <label htmlFor="uc-terms">
          I accept the Terms and Conditions
        </label>
      </div>
      <span className="rs-form__error" role="alert">
        {errors.acceptedTerms ?? ''}
      </span>

      <button type="submit" className="rs-form__submit">
        Submit
      </button>
    </form>
  );
}

export default UncontrolledForm;
