import { useForm, Controller } from 'react-hook-form';
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

interface FormFields {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  image: FileList;
}

interface Props {
  onSubmit: (data: SubmissionData) => void;
}

function HookForm({ onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<FormFields>({
    defaultValues: {
      name: '',
      age: 0,
      email: '',
      gender: 'other',
      acceptedTerms: false,
      password: '',
      confirmPassword: '',
      country: '',
    },
  });

  const countries = useAppSelector(
    (state) => state.forms.countries
  );

  const passwordValue = watch('password') ?? '';

  const submit = async (fields: FormFields) => {
    const file = fields.image?.[0] ?? null;
    let base64Image = '';
    if (file && validateImageFile(file).valid) {
      base64Image = await imageToBase64(file);
    }

    const data: SubmissionData = {
      name: fields.name,
      age: Number(fields.age),
      email: fields.email,
      gender: fields.gender,
      acceptedTerms: fields.acceptedTerms,
      password: fields.password,
      country: fields.country,
      image: base64Image,
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

      <div className="rs-form__row">
        <label htmlFor="rhf-country">Country</label>
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <CountryAutocomplete
              id="rhf-country"
              value={field.value}
              onChange={field.onChange}
              countries={countries}
              placeholder="Start typing..."
            />
          )}
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-image">Profile picture (PNG / JPEG)</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          {...register('image')}
        />
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-password">Password</label>
        <input
          id="rhf-password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />
        <PasswordStrength password={passwordValue} />
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-confirm-password">Confirm password</label>
        <input
          id="rhf-confirm-password"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
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
