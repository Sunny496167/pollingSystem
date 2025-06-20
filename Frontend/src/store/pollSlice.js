import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  question: '',
  options: [],
  results: {},
  isActive: false,
  hasSubmitted: false
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setPoll: (state, action) => {
      const { question, options } = action.payload;
      state.question = question;
      state.options = options;
      state.results = {};
      state.isActive = true;
      state.hasSubmitted = false;
      
      // Initialize results with 0 for each option
      options.forEach((option, index) => {
        state.results[String.fromCharCode(65 + index)] = 0;
      });
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    setSubmitted: (state) => {
      state.hasSubmitted = true;
    },
    clearPoll: (state) => {
      state.question = '';
      state.options = [];
      state.results = {};
      state.isActive = false;
      state.hasSubmitted = false;
    }
  }
});

export const { setPoll, updateResults, setSubmitted, clearPoll } = pollSlice.actions;
export default pollSlice.reducer;