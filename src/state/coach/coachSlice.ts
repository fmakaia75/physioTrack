import { Client, Program } from "@/app/dashboard/coach-dashboard";
import { createSlice, createAsyncThunk, PayloadAction, createListenerMiddleware } from "@reduxjs/toolkit";
import physioSlice from "../physio/physioSlice";
import { AppDispatch, RootState, useAppSelector } from "../store";

interface CoachInfo {
  _id: string;
  name: string;
  email: string;
}

interface CoachState {
  coachInfo: CoachInfo | null, // Stores coach details (name, email, etc.)
  trainees: Client[], // Stores assigned trainees (clients)
  programs: Program[], // Stores programs managed by the coach
  status: "idle" | "loading" | "succeeded" | "failed",
  error: string | null,
}

const initialState: CoachState = {
  coachInfo: null,
  trainees: [],
  programs: [],
  status: "idle", // For tracking API request status
  error: null,
}

export const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    setCoachData: (state, action: PayloadAction<CoachState>) => {
      state.status = "succeeded";
      state.coachInfo = action.payload.coachInfo;
      state.trainees = action.payload.trainees;
      state.programs = action.payload.programs;
      state.error = null;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setError: (state, action: PayloadAction<string>) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
})

export const getCoachData = () => useAppSelector((state) => state.coach.coachInfo);
export const getCoachTrainees = () => useAppSelector((state) => state.coach.trainees);
// console.log("Selector Output:", coachTrainees); // Check if data updates
export const getCoachPrograms = () => useAppSelector((state) => state.coach.programs);
export const getStatus = () => useAppSelector((state) => state.coach.status);
export const getError = () => useAppSelector((state) => state.coach.error);

export const { setCoachData, setLoading, setError } = coachSlice.actions
export const listenerMiddleware= createListenerMiddleware()

listenerMiddleware.startListening.withTypes<RootState, AppDispatch>()({
  predicate: (action, currentState, originalState) => {
    return currentState.coach.status === "idle";
  },
  effect: async (_action, listenerApi) => {
    try {
      listenerApi.dispatch(setLoading());
      //can be replaced by search using id then using the api instead
      const response = await fetch("/api/test-db");
      if (!response.ok) {
        throw new Error("Failed to fetch coach data");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      listenerApi.dispatch(setCoachData(data));
    } catch (error) {
      listenerApi.dispatch(setError("Something went wrong"));
    }
  },

});

export default coachSlice.reducer;
