import { createSlice } from "@reduxjs/toolkit";

const CandidatesSlice = createSlice({
  name: "Candidates",
  initialState: [],
  reducers: {
    addCandidate: (state, action) => {
      state.push(action.payload);
    },
    removeCandidate: (state, action) => {
      return state.filter((candidate) => candidate.id !== action.payload.id);
    },
    clearCandidates: () => [],
  },
});

export const { addCandidate, removeCandidate, clearCandidates } =
  CandidatesSlice.actions;
export default CandidatesSlice.reducer;
