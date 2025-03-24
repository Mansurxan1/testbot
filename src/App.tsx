import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "./store/telegramSlice";
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

          // Fullscreen rejimi
          if (webApp.isVersionAtLeast("8.0")) {
            webApp.requestFullscreen();
          }
          if (webApp.isVersionAtLeast("7.0")) {
            webApp.setHeaderColor("#00000000"); // Transparent header
          }

          const user = webApp.initDataUnsafe?.user || {};
          // Telegramning joriy temasini olish
          const telegramTheme = webApp.colorScheme === "dark" ? "dark" : "light";

          // Redux store’ga ma'lumotlarni yuborish
          dispatch(
            setUserData({
              firstName: user.first_name || "Noma'lum",
              lastName: user.last_name || "",
              photoUrl: user.photo_url || null,
              theme: telegramTheme, // Telegramning temasiga qat'iy rioya qilish
              telegramId: user.id?.toString() || "",
              username: user.username || "",
            })
          );

          // Tema o‘zgarishi uchun event
          webApp.onEvent("themeChanged", () => {
            const newTheme = webApp.colorScheme === "dark" ? "dark" : "light";
            dispatch(
              setUserData({
                firstName: user.first_name || "Noma'lum",
                lastName: user.last_name || "",
                photoUrl: user.photo_url || null,
                theme: newTheme, // Yangi tema Telegramdan olinadi
                telegramId: user.id?.toString() || "",
                username: user.username || "",
              })
            );
          });

          // Tekshirish uchun log
          console.log("Telegramning joriy temasi:", telegramTheme);
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