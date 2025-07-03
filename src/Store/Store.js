import { configureStore } from "@reduxjs/toolkit";
import CandidatesReducer from "../Slices/CandidateSlice.js";

export const store = configureStore({
  reducer: {
    Candidates: CandidatesReducer,
  },
});
