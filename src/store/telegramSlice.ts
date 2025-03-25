// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface TelegramUser {
//   firstName: string;
//   lastName: string;
//   photoUrl: string | null;
//   theme: "light" | "dark";
//   telegramId: string;
//   username?: string;
// }

// const initialState: TelegramUser = {
//   firstName: "",
//   lastName: "",
//   photoUrl: null,
//   theme: "light",
//   telegramId: "",
//   username: "",
// };

// const telegramSlice = createSlice({
//   name: "telegram",
//   initialState,
//   reducers: {
//     setUserData: (state, action: PayloadAction<TelegramUser>) => {
//       state.firstName = action.payload.firstName;
//       state.lastName = action.payload.lastName;
//       state.photoUrl = action.payload.photoUrl;
//       state.theme = action.payload.theme;
//       state.telegramId = action.payload.telegramId;
//       state.username = action.payload.username || "";
//     },
//   },
// });

// export const { setUserData } = telegramSlice.actions;
// export default telegramSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TelegramUser {
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  theme: "light" | "dark";
  telegramId: string;
  username?: string;
}

const getTelegramTheme = (): "light" | "dark" => {
  return window.Telegram?.WebApp?.colorScheme === "dark" ? "dark" : "light";
};

const getTelegramUser = (): TelegramUser => {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user || {};
  return {
    firstName: user.first_name || "Noma'lum",
    lastName: user.last_name || "",
    photoUrl: user.photo_url || null,
    theme: getTelegramTheme(),
    telegramId: user.id?.toString() || "",
    username: user.username || "",
  };
};

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
    setUserData: (state) => {
      const userData = getTelegramUser();
      state.firstName = userData.firstName;
      state.lastName = userData.lastName;
      state.photoUrl = userData.photoUrl;
      state.theme = userData.theme;
      state.telegramId = userData.telegramId;
      state.username = userData.username;
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
    },
  },
});

export const { setUserData, setTheme } = telegramSlice.actions;
export default telegramSlice.reducer;