// store.ts
import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import { coachSlice, listenerMiddleware } from './coach/coachSlice';
import coachReducer from './coach/coachSlice';
import physioReducer, { updateListenerMiddleWare } from './physio/physioSlice';
import { useDispatch, useSelector } from 'react-redux';
export const store = configureStore({
  reducer: {
    coach: coachReducer,
    physio: physioReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware)
    .concat(updateListenerMiddleWare.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

