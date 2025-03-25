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

const initialState: TelegramUser = {
  firstName: "",
  lastName: "",
  photoUrl: null,
  theme: "light",
  telegramId: "",
  username: "",
};

// Telegram Web App'dan ma'lumotlarni olish va yangilash funksiyasi
const initializeTelegram = (dispatch: any) => {
  try {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand(); // Ekran to'liq ochilishi uchun

      if (webApp.isVersionAtLeast("8.0") && webApp.requestFullscreen?.isAvailable?.()) {
        webApp.requestFullscreen(); // To'liq ekran rejimi
      }
      if (webApp.isVersionAtLeast("7.0")) {
        webApp.setHeaderColor("#00000000"); // Shaffof header
      }
      if (webApp.isVersionAtLeast("6.0")) {
        webApp.enableClosingConfirmation(); // Ilovani yopishdan oldin tasdiqlash
      }

      const user = webApp.initDataUnsafe?.user || {};
      const telegramTheme = webApp.colorScheme || "light";

      // Dastlabki ma'lumotlarni o'rnatish
      dispatch(
        setUserData({
          firstName: user.first_name || "Noma'lum",
          lastName: user.last_name || "",
          photoUrl: user.photo_url || null,
          theme: telegramTheme,
          telegramId: user.id?.toString() || "",
          username: user.username || "",
        })
      );

      // Tema o'zgarishi hodisasi
      webApp.onEvent("themeChanged", () => {
        const newTheme = webApp.colorScheme || "light";
        dispatch(
          setUserData({
            firstName: user.first_name || "Noma'lum",
            lastName: user.last_name || "",
            photoUrl: user.photo_url || null,
            theme: newTheme,
            telegramId: user.id?.toString() || "",
            username: user.username || "",
          })
        );
      });

      // Sozlamalar o'zgarganda yangilash
      webApp.onEvent("settingsChanged", () => {
        const updatedUser = webApp.initDataUnsafe?.user || {};
        dispatch(
          setUserData({
            firstName: updatedUser.first_name || "Noma'lum",
            lastName: updatedUser.last_name || "",
            photoUrl: updatedUser.photo_url || null,
            theme: webApp.colorScheme || "light",
            telegramId: updatedUser.id?.toString() || "",
            username: updatedUser.username || "",
          })
        );
      });
    } else {
      console.error("Telegram WebApp yuklanmadi");
    }
  } catch (error) {
    console.error("Telegram WebApp bilan xatolik:", error);
  }
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
      state.username = action.payload.username;
    },
    initializeTelegramData: (_state, action: PayloadAction<{ dispatch: any }>) => {
      const { dispatch } = action.payload;
      initializeTelegram(dispatch);
    },
  },
});

export const { setUserData, initializeTelegramData } = telegramSlice.actions;
export default telegramSlice.reducer;