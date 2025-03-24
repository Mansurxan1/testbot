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

          // Headerni shaffof qilish (yo‘qotish)
          webApp.setHeaderColor("transparent");

          // Fullscreen rejimni yoqish
          if (webApp.requestFullscreen.isAvailable()) {
            webApp.requestFullscreen();
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

          webApp.onEvent("themeChanged", () => {
            dispatch(toggleTheme());
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
  }, [dispatch, theme]);

  return (
    <div
      className={`min-h-screen max-w-[450px] mx-auto flex items-center justify-center relative bg-cover bg-center transition-all ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
      style={{
        backgroundImage: `url('/path/to/your/image.png')`,
      }}
    >
      <AppRouter />
    </div>
  );
};

export default App;
