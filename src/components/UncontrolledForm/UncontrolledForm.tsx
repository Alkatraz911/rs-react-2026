import { useRef } from 'react';
import type { FormEvent } from 'react';
import type {
  SubmissionData,
  Gender,
} from '../../store/formsSlice';

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: SubmissionData = {
      name: nameRef.current?.value ?? '',
      age: Number(ageRef.current?.value ?? 0),
      email: emailRef.current?.value ?? '',
      gender: (genderRef.current?.value as Gender) ?? 'other',
      acceptedTerms: termsRef.current?.checked ?? false,
      password: '',
      country: '',
      image: '',
    };

    onSubmit(data);
    formRef.current?.reset();
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
