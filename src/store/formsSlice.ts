import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { COUNTRIES } from '../data/countries';

export type FormSource = 'uncontrolled' | 'hookForm';
export type Gender = 'male' | 'female' | 'other';

export interface SubmissionData {
  name: string;
  age: number;
  email: string;
  gender: Gender;
  acceptedTerms: boolean;
  password: string;
  country: string;
  image: string;
}

export interface Submission extends SubmissionData {
  id: string;
  source: FormSource;
  createdAt: number;
}

export interface AddSubmissionPayload {
  data: SubmissionData;
  source: FormSource;
}

interface FormsState {
  submissions: Submission[];
  countries: string[];
  lastSubmissionId: string | null;
}

const initialState: FormsState = {
  submissions: [],
  countries: COUNTRIES,
  lastSubmissionId: null,
};

const formsSlice = createSlice({
  name: 'forms',
  initialState,
  reducers: {
    addSubmission: {
      reducer(state, action: PayloadAction<Submission>) {
        state.submissions.unshift(action.payload);
        state.lastSubmissionId = action.payload.id;
      },
      prepare(payload: AddSubmissionPayload) {
        return {
          payload: {
            ...payload.data,
            id: nanoid(),
            source: payload.source,
            createdAt: Date.now(),
          },
        };
      },
    },
    clearLastSubmission(state) {
      state.lastSubmissionId = null;
    },
  },
});

export const { addSubmission, clearLastSubmission } =
  formsSlice.actions;
export default formsSlice.reducer;
