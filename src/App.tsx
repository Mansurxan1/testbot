import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, toggleTheme } from "./store/telegramSlice";
import { RootState } from "./store/store";
import AppRouter from "./router/AppRouter";

const App = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.telegram.theme);

  useEffect(() => {
    const checkTelegram = () => {
      try {
        if (window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp;
          webApp.ready();
          webApp.expand();

          // Fullscreen rejimini yoqish
          if (webApp.isVersionAtLeast("8.0")) {
            webApp.requestFullscreen();
          }

          // Header rangini shaffof yoki to'liq ekran uchun moslashtirish
          if (webApp.isVersionAtLeast("7.0")) {
            webApp.setHeaderColor("#00000000"); // Transparent header uchun #00000000 (RGBA)
          }

          const user = (webApp as any).initDataUnsafe?.user || {};
          dispatch(
            setUserData({
              firstName: user.first_name || "Noma'lum",
              lastName: user.last_name || "",
              photoUrl: user.photo_url || null,
              theme: webApp.colorScheme === "dark" ? "dark" : "light",
              telegramId: user.id?.toString() || "",
            })
          );

          // Fullscreen holatini tekshirish
          if (webApp.isFullscreen) {
            console.log("Mini App fullscreen rejimida ochildi");
          }

          // Tema o'zgarishi uchun event
          webApp.onEvent("themeChanged", () => {
            dispatch(toggleTheme());
          });

          // Fullscreen o'zgarishi uchun event (agar kerak bo'lsa)
          webApp.onEvent("fullscreenChanged", () => {
            console.log("Fullscreen holati:", webApp.isFullscreen);
          });
        } else {
          console.error("Telegram WebApp yuklanmadi");
        }
      } catch (error) {
        console.error("Telegram WebApp bilan xatolik:", error);
      }
    };

    if (!window.Telegram) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = checkTelegram;
      document.head.appendChild(script);
    } else {
      checkTelegram();
    }
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen max-w-[450px] mx-auto ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <AppRouter />
    </div>
  );
};

export default App;