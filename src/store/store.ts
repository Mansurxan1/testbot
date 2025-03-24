import { configureStore } from '@reduxjs/toolkit';
import telegramReducer from './telegramSlice';

// Store-ni konfiguratsiya qilish
export const store = configureStore({
  reducer: {
    telegram: telegramReducer, // telegramSlice dan kelgan reducer
  },
});

// RootState va AppDispatch tiplarini aniqlash
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;