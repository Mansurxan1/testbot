import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData, setTheme } from "../store/telegramSlice";

const TelegramInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand(); // Ekran to‘liq ochilishi uchun

      if (webApp.isVersionAtLeast("6.0")) {
        webApp.enableClosingConfirmation();
      }
      if (webApp.isVersionAtLeast("8.0") && webApp.requestFullscreen.isAvailable()) {
        webApp.requestFullscreen(); // To‘liq ekran rejimi
      }
      if (webApp.isVersionAtLeast("7.0")) {
        webApp.setHeaderColor("#00000000"); // Shaffof header
      }

      dispatch(setUserData());

      webApp.onEvent("themeChanged", () => {
        dispatch(setTheme(webApp.colorScheme));
      });

      webApp.onEvent("settingsChanged", () => {
        dispatch(setUserData());
      });
    }
  }, [dispatch]);

  return null;
};

export default TelegramInit;