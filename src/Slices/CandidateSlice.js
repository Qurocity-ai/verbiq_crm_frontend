import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("Candidates");
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (e) {
    return [];
  }
};

const saveState = (state) => {
  try {
    localStorage.setItem("Candidates", JSON.stringify(state));
  } catch (e) {
    console.log("Error to set Candidates", e.message);
  }
};

const CandidatesSlice = createSlice({
  name: "Candidates",
  initialState: loadState(),
  reducers: {
    addCandidate: (state, action) => {
      state.push(action.payload);
      saveState(state);
    },
    removeCandidate: (state, action) => {
      const newState = state.filter(
        (candidate) => candidate._id !== action.payload._id
      );
      saveState(newState);
      return newState;
    },
    clearCandidates: () => {
      saveState([]);
      return [];
    },
  },
});

export const { addCandidate, removeCandidate, clearCandidates } =
  CandidatesSlice.actions;
export default CandidatesSlice.reducer;
