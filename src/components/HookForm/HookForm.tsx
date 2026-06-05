import { useForm } from 'react-hook-form';
import type {
  SubmissionData,
  Gender,
} from '../../store/formsSlice';

interface FormFields {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
}

interface Props {
  onSubmit: (data: SubmissionData) => void;
}

function HookForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: 'other',
      acceptedTerms: false,
    },
  });

  const submit = (fields: FormFields) => {
    const data: SubmissionData = {
      name: fields.name,
      age: Number(fields.age),
      email: fields.email,
      gender: fields.gender,
      acceptedTerms: fields.acceptedTerms,
      password: '',
      country: '',
      image: '',
    };

    onSubmit(data);
    reset();
  };

  return (
    <form
      className="rs-form"
      onSubmit={handleSubmit(submit)}
      noValidate
      aria-label="React Hook Form"
    >
      <div className="rs-form__row">
        <label htmlFor="rhf-name">Name</label>
        <input
          id="rhf-name"
          type="text"
          autoComplete="name"
          {...register('name')}
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-age">Age</label>
        <input
          id="rhf-age"
          type="number"
          min={0}
          {...register('age', { valueAsNumber: true })}
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-email">Email</label>
        <input
          id="rhf-email"
          type="email"
          autoComplete="email"
          {...register('email')}
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-gender">Gender</label>
        <select id="rhf-gender" {...register('gender')}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="rs-form__row rs-form__row--inline">
        <input
          id="rhf-terms"
          type="checkbox"
          {...register('acceptedTerms')}
        />
        <label htmlFor="rhf-terms">
          I accept the Terms and Conditions
        </label>
      </div>

      <button type="submit" className="rs-form__submit">
        Submit
      </button>
    </form>
  );
}

export default HookForm;
