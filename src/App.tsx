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

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setTheme } from "./store/telegramSlice";
import { RootState } from "./store/store";
import AppRouter from "./router/AppRouter";

function App() {
  const dispatch = useDispatch();
  const reduxTheme = useSelector((state: RootState) => state.telegram.theme) || "light";

  // Redux holatini mahalliy state bilan sinxronlash
  const [theme, setThemeState] = useState(reduxTheme);

  useEffect(() => {
    setThemeState(reduxTheme);
  }, [reduxTheme]);

  useEffect(() => {
    const checkTelegram = () => {
      try {
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

          const user = webApp.initDataUnsafe?.user || {};
          const telegramTheme = webApp.colorScheme || "light";

          dispatch(
            setUserData({
              firstName: user.first_name || "Noma'lum",
              lastName: user.last_name || "",
              photoUrl: user.photo_url || null,
              theme: telegramTheme,
              telegramId: user.id || 0,
              username: user.username || "",
            })
          );

          // **✅ To‘g‘ri event handler**
          const updateTheme = () => {
            const newTheme = webApp.colorScheme || "light";
            dispatch(setTheme(newTheme));
          };

          webApp.onEvent("themeChanged", updateTheme);

          // **⏳ Agar `onEvent` ishlamasa, har 2 soniyada tekshirish**
          const interval = setInterval(updateTheme, 2000);

          return () => {
            clearInterval(interval); // ⏹ Intervalni to‘xtatish
          };
        } else {
          console.error("Telegram WebApp yuklanmadi");
          dispatch(setTheme("light"));
        }
      } catch (error) {
        console.error("Telegram WebApp bilan xatolik:", error);
        dispatch(setTheme("light"));
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
}

export default App;
