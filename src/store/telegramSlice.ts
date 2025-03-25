import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TelegramUser {
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  theme: "light" | "dark";
  telegramId: string;
  username?: string;
}

const initialState: TelegramUser = {
  firstName: "",
  lastName: "",
  photoUrl: null,
  theme: "light",
  telegramId: "",
  username: "",
};

const telegramSlice = createSlice({
  name: "telegram",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<TelegramUser>) => {
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.photoUrl = action.payload.photoUrl;
      state.theme = action.payload.theme;
      state.telegramId = action.payload.telegramId;
      state.username = action.payload.username || "";
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const { setUserData, setTheme } = telegramSlice.actions;
export default telegramSlice.reducer;

// Add TypeScript declarations for Telegram WebApp
interface TelegramWebApp {
  ready: () => void
  expand: () => void
  isVersionAtLeast: (version: string) => boolean
  requestFullscreen: () => void
  setHeaderColor: (color: string) => void
  colorScheme: "light" | "dark"
  initDataUnsafe: {
    user?: {
      id?: number
      first_name?: string
      last_name?: string
      username?: string
      photo_url?: string
    }
  }
  onEvent: (eventType: string, callback: () => void) => void
}

export interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}

export interface TelegramState {
  firstName: string
  lastName: string
  photoUrl: string | null
  theme: "light" | "dark"
  telegramId: string
  username: string
}

