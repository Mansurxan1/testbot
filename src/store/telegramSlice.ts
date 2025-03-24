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
  theme: "light" | "dark"; // Telegramdan keladigan tema
  telegramId: string;
  username?: string;
}

const initialState: TelegramUser = {
  firstName: "",
  lastName: "",
  photoUrl: null,
  theme: "light", // Dastlabki qiymat sifatida "light"
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
      state.theme = action.payload.theme; // Faqat Telegramdan kelgan tema ishlatiladi
      state.telegramId = action.payload.telegramId;
      state.username = action.payload.username || "";
    },
  },
});

export const { setUserData } = telegramSlice.actions;
export default telegramSlice.reducer;