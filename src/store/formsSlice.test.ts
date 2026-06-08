import { describe, it, expect } from 'vitest';
import formsReducer, {
  addSubmission,
  clearLastSubmission,
  type SubmissionData,
} from './formsSlice';
import { COUNTRIES } from '../data/countries';

const sampleData: SubmissionData = {
  name: 'Anna',
  age: 25,
  email: 'a@b.com',
  gender: 'female',
  acceptedTerms: true,
  password: 'Aa1!aa',
  country: 'Germany',
  image: 'data:image/png;base64,xx',
};

const initialState = {
  submissions: [],
  countries: COUNTRIES,
  lastSubmissionId: null,
};

describe('formsSlice', () => {
  it('exposes countries in initial state', () => {
    const state = formsReducer(undefined, { type: 'init' });
    expect(state.countries.length).toBeGreaterThan(0);
  });

  it('addSubmission prepends a new submission', () => {
    const state = formsReducer(
      initialState,
      addSubmission({ data: sampleData, source: 'uncontrolled' })
    );
    expect(state.submissions).toHaveLength(1);
    expect(state.submissions[0].name).toBe('Anna');
    expect(state.submissions[0].source).toBe('uncontrolled');
    expect(typeof state.submissions[0].id).toBe('string');
    expect(typeof state.submissions[0].createdAt).toBe('number');
  });

  it('addSubmission sets lastSubmissionId to the new submission id', () => {
    const state = formsReducer(
      initialState,
      addSubmission({ data: sampleData, source: 'hookForm' })
    );
    expect(state.lastSubmissionId).toBe(state.submissions[0].id);
  });

  it('addSubmission preserves previous submissions and prepends', () => {
    const first = formsReducer(
      initialState,
      addSubmission({ data: sampleData, source: 'uncontrolled' })
    );
    const second = formsReducer(
      first,
      addSubmission({
        data: { ...sampleData, name: 'Bob' },
        source: 'hookForm',
      })
    );
    expect(second.submissions).toHaveLength(2);
    expect(second.submissions[0].name).toBe('Bob');
    expect(second.submissions[1].name).toBe('Anna');
  });

  it('clearLastSubmission resets lastSubmissionId without deleting submissions', () => {
    const populated = formsReducer(
      initialState,
      addSubmission({ data: sampleData, source: 'uncontrolled' })
    );
    expect(populated.lastSubmissionId).not.toBeNull();

    const cleared = formsReducer(populated, clearLastSubmission());
    expect(cleared.lastSubmissionId).toBeNull();
    expect(cleared.submissions).toHaveLength(1);
  });
});
