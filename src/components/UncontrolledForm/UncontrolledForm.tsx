import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  SubmissionData,
  Gender,
} from '../../store/formsSlice';
import { useAppSelector } from '../../store/hooks';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import {
  imageToBase64,
  validateImageFile,
} from '../../utils/imageToBase64';

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
  const [imageError, setImageError] = useState<string | null>(null);

  const countries = useAppSelector(
    (state) => state.forms.countries
  );

  const handleImageChange = () => {
    const file = imageRef.current?.files?.[0] ?? null;
    if (!file) {
      setImageError(null);
      return;
    }
    const result = validateImageFile(file);
    setImageError(result.valid ? null : result.error);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const file = imageRef.current?.files?.[0] ?? null;
    let base64Image = '';
    if (file && validateImageFile(file).valid) {
      base64Image = await imageToBase64(file);
    }

    const data: SubmissionData = {
      name: nameRef.current?.value ?? '',
      age: Number(ageRef.current?.value ?? 0),
      email: emailRef.current?.value ?? '',
      gender: (genderRef.current?.value as Gender) ?? 'other',
      acceptedTerms: termsRef.current?.checked ?? false,
      password: passwordRef.current?.value ?? '',
      country,
      image: base64Image,
    };

    onSubmit(data);
    formRef.current?.reset();
    setPassword('');
    setCountry('');
    setImageError(null);
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
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-age">Age</label>
        <input
          id="uc-age"
          name="age"
          type="number"
          ref={ageRef}
          min={0}
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-email">Email</label>
        <input
          id="uc-email"
          name="email"
          type="email"
          ref={emailRef}
          autoComplete="email"
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-gender">Gender</label>
        <select
          id="uc-gender"
          name="gender"
          ref={genderRef}
          defaultValue="other"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
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
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-image">Profile picture (PNG / JPEG)</label>
        <input
          id="uc-image"
          name="image"
          type="file"
          accept="image/png,image/jpeg"
          ref={imageRef}
          onChange={handleImageChange}
        />
        {imageError && (
          <span className="rs-form__error" role="alert">
            {imageError}
          </span>
        )}
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
        />
        <PasswordStrength password={password} />
      </div>

      <div className="rs-form__row">
        <label htmlFor="uc-confirm-password">Confirm password</label>
        <input
          id="uc-confirm-password"
          name="confirmPassword"
          type="password"
          ref={confirmPasswordRef}
          autoComplete="new-password"
        />
      </div>

      <div className="rs-form__row rs-form__row--inline">
        <input
          id="uc-terms"
          name="acceptedTerms"
          type="checkbox"
          ref={termsRef}
        />
        <label htmlFor="uc-terms">
          I accept the Terms and Conditions
        </label>
      </div>

      <button type="submit" className="rs-form__submit">
        Submit
      </button>
    </form>
  );
}

export default UncontrolledForm;
