// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setUserData } from "./store/telegramSlice";
// import { RootState } from "./store/store";
// import AppRouter from "./router/AppRouter";

// const App = () => {
//   const dispatch = useDispatch();
//   const theme = useSelector((state: RootState) => state.telegram.theme);

//   useEffect(() => {
//     const checkTelegram = () => {
//       try {
//         if (window.Telegram?.WebApp) {
//           const webApp = window.Telegram.WebApp;
//           webApp.ready();
//           webApp.expand();

//           if (webApp.isVersionAtLeast("8.0")) {
//             webApp.requestFullscreen();
//           }
//           if (webApp.isVersionAtLeast("7.0")) {
//             webApp.setHeaderColor("#00000000"); // Transparent header
//           }

//           const user = webApp.initDataUnsafe?.user || {};
//           const telegramTheme = webApp.colorScheme; // "dark" yoki "light" sifatida qoldiramiz

//           dispatch(
//             setUserData({
//               firstName: user.first_name || "Noma'lum",
//               lastName: user.last_name || "",
//               photoUrl: user.photo_url || null,
//               theme: telegramTheme, // Telegramning colorScheme ni bevosita ishlatamiz
//               telegramId: user.id?.toString() || "",
//               username: user.username || "",
//             })
//           );

//           webApp.onEvent("themeChanged", () => {
//             const newTheme = webApp.colorScheme; // Yangi tema Telegramdan olinadi
//             dispatch(
//               setUserData({
//                 firstName: user.first_name || "Noma'lum",
//                 lastName: user.last_name || "",
//                 photoUrl: user.photo_url || null,
//                 theme: newTheme,
//                 telegramId: user.id?.toString() || "",
//                 username: user.username || "",
//               })
//             );
//           });
//         } else {
//           console.error("Telegram WebApp yuklanmadi");
//         }
//       } catch (error) {
//         console.error("Telegram WebApp bilan xatolik:", error);
//       }
//     };

//     if (!window.Telegram) {
//       const script = document.createElement("script");
//       script.src = "https://telegram.org/js/telegram-web-app.js";
//       script.async = true;
//       script.onload = checkTelegram;
//       document.head.appendChild(script);
//     } else {
//       checkTelegram();
//     }
//   }, [dispatch]);

//   // Telegramning colorScheme ga asoslangan tema sinflari
//   const themeClasses =
//     theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

//   return (
//     <div className={`min-h-screen max-w-[450px] mx-auto ${themeClasses}`}>
//       <AppRouter />
//     </div>
//   );
// };

// export default App;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme, setUserData } from "./store/telegramSlice"; // setUserData qo'shildi
import AppRouter from "./router/AppRouter";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkTelegram = () => {
      try {
        if (window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp;
          webApp.ready();
          webApp.expand();

          // Tema rejimini olish va Redux'ga yuborish
          const initialTheme = webApp.colorScheme || "light";
          dispatch(setTheme(initialTheme));

          // Foydalanuvchi ma'lumotlarini olish (agar mavjud bo'lsa)
          const initData = webApp.initDataUnsafe?.user;
          if (initData) {
            dispatch(
              setUserData({
                firstName: initData.first_name || "",
                lastName: initData.last_name || "",
                photoUrl: initData.photo_url || null,
                theme: initialTheme,
                telegramId: initData.id || 0,
                username: initData.username || "",
              })
            );
          }

          // Tema o'zgarishini tinglash
          webApp.onEvent("themeChanged", () => {
            const newTheme = webApp.colorScheme || "light";
            dispatch(setTheme(newTheme));
          });

          if (webApp.isVersionAtLeast("8.0")) {
            webApp.requestFullscreen();
          }
          if (webApp.isVersionAtLeast("7.0")) {
            webApp.setHeaderColor("#00000000");
          }
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
    <div className="min-h-screen max-w-[450px] mx-auto">
      <AppRouter />
    </div>
  );
}

export default App;