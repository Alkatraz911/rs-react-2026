import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type {
  SubmissionData,
  Gender,
} from '../../store/formsSlice';
import { useAppSelector } from '../../store/hooks';
import CountryAutocomplete from '../CountryAutocomplete/CountryAutocomplete';
import PasswordStrength from '../PasswordStrength/PasswordStrength';
import { imageToBase64 } from '../../utils/imageToBase64';
import { buildFormSchema } from '../../utils/validation';

interface FormFields {
  name: string;
  age: number | string;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
  password: string;
  confirmPassword: string;
  country: string;
  image: FileList | null;
}

interface Props {
  onSubmit: (data: SubmissionData) => void;
}

function HookForm({ onSubmit }: Props) {
  const countries = useAppSelector(
    (state) => state.forms.countries
  );

  const schema = useMemo(
    () => buildFormSchema(countries),
    [countries]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    trigger,
    formState: { errors, isValid, touchedFields, dirtyFields },
  } = useForm<FormFields>({
    resolver: zodResolver(schema) as unknown as Resolver<FormFields>,
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: '',
      email: '',
      gender: 'other',
      acceptedTerms: false,
      password: '',
      confirmPassword: '',
      country: '',
      image: null,
    },
  });

  useEffect(() => {
    void trigger();
  }, [trigger]);

  const passwordValue = watch('password') ?? '';

  const errorFor = (field: keyof FormFields): string => {
    if (!touchedFields[field] && !dirtyFields[field]) return '';
    return errors[field]?.message ?? '';
  };

  const submit = async (fields: FormFields) => {
    const fileList = fields.image;
    const file = fileList && fileList.length > 0 ? fileList[0] : null;
    const base64Image = file ? await imageToBase64(file) : '';

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
          aria-invalid={Boolean(errors.name)}
          {...register('name')}
        />
        <span className="rs-form__error" role="alert">
          {errorFor('name')}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-age">Age</label>
        <input
          id="rhf-age"
          type="number"
          min={0}
          aria-invalid={Boolean(errors.age)}
          {...register('age')}
        />
        <span className="rs-form__error" role="alert">
          {errorFor('age')}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-email">Email</label>
        <input
          id="rhf-email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          {...register('email')}
        />
        <span className="rs-form__error" role="alert">
          {errorFor('email')}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-gender">Gender</label>
        <select
          id="rhf-gender"
          aria-invalid={Boolean(errors.gender)}
          {...register('gender')}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <span className="rs-form__error" role="alert">
          {errorFor('gender')}
        </span>
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
        <span className="rs-form__error" role="alert">
          {errorFor('country')}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-image">Profile picture (PNG / JPEG)</label>
        <input
          id="rhf-image"
          type="file"
          accept="image/png,image/jpeg"
          aria-invalid={Boolean(errors.image)}
          {...register('image')}
        />
        <span className="rs-form__error" role="alert">
          {errorFor('image')}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-password">Password</label>
        <input
          id="rhf-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          {...register('password')}
        />
        <PasswordStrength password={passwordValue} />
        <span className="rs-form__error" role="alert">
          {errorFor('password')}
        </span>
      </div>

      <div className="rs-form__row">
        <label htmlFor="rhf-confirm-password">Confirm password</label>
        <input
          id="rhf-confirm-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register('confirmPassword')}
        />
        <span className="rs-form__error" role="alert">
          {errorFor('confirmPassword')}
        </span>
      </div>

      <div className="rs-form__row rs-form__row--inline">
        <input
          id="rhf-terms"
          type="checkbox"
          aria-invalid={Boolean(errors.acceptedTerms)}
          {...register('acceptedTerms')}
        />
        <label htmlFor="rhf-terms">
          I accept the Terms and Conditions
        </label>
      </div>
      <span className="rs-form__error" role="alert">
        {errorFor('acceptedTerms')}
      </span>

      <button
        type="submit"
        className="rs-form__submit"
        disabled={!isValid}
      >
        Submit
      </button>
    </form>
  );
}

export default HookForm;
