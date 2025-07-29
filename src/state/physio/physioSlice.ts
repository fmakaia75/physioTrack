// import { updateOrInsertClient } from "@/app/api/test-insert/route";
import { Client as Athlete, Program } from "@/app/dashboard/coach-dashboard";
import { connectDB } from "@/lib/mongodb";
import { createSlice, PayloadAction, createListenerMiddleware } from "@reduxjs/toolkit";
import mongoose from "mongoose";
import { AppDispatch, RootState } from "../store";
import Client from '@/models/Client'

interface PhysioState {
    athletes: Athlete[], // Stores assigned trainees (clients)
    programs: Program[], // Stores programs managed by the coach
    status: "idle" | "loading" | "succeeded" | "failed",
    error: string | null,
}

const initialState: PhysioState = {
    athletes: [],
    programs: [],
    status: "idle", // For tracking API request status
    error: null,
}

export const physioSlice = createSlice({
    name: "physio",
    initialState: initialState,
    reducers: {
        setUpdate: (state, action: PayloadAction<PhysioState>) => {
            state.athletes = action.payload.athletes;
            state.programs = action.payload.programs;
        },
        setLoading: (state) => {
            state.status = "loading";
        },
        setSuccess: (state) => {
            state.status = "succeeded";
        },
        setError: (state, action: PayloadAction<string>) => {
            state.status = "failed";
            state.error = action.payload;
        },

    }
});
export default physioSlice.reducer
export const { setUpdate, setLoading, setError, setSuccess } = physioSlice.actions
export const updateListenerMiddleWare = createListenerMiddleware();




let isUpdating = false; // Prevent multiple updates

updateListenerMiddleWare.startListening.withTypes<RootState, AppDispatch>()({
    actionCreator: setUpdate,
    effect: async (action, listenerApi) => {
        if (isUpdating) return; // Prevent duplicate calls
        isUpdating = true;
        
        try {
            listenerApi.dispatch(setLoading());
            const response = await fetch("/api/test-insert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clients: action.payload.athletes,
                    programs: action.payload.programs
                })
            });

            if (!response.ok) {
                throw new Error("Failed to update database");
            }

            listenerApi.dispatch(setSuccess());
        } catch (error) {
            console.error("Middleware Error:", error);
            listenerApi.dispatch(setError("Database update failed"));
        } finally {
            isUpdating = false;
        }
    }
});