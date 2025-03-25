import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserData, setTheme } from "../store/telegramSlice";

const TelegramInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();

      if (webApp.isVersionAtLeast("8.0")) {
        webApp.requestFullscreen();
      }
      if (webApp.isVersionAtLeast("7.0")) {
        webApp.setHeaderColor("#00000000");
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