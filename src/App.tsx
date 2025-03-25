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
import { useDispatch, useSelector } from "react-redux";
import { setUserData, setTheme } from "./store/telegramSlice";
import AppRouter from "./router/AppRouter";

function App() {
  const dispatch = useDispatch();
  const theme = useSelector((state: any) => state.telegram.theme) || "light"; // Default "light"

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
            webApp.setHeaderColor("#00000000"); // Transparent header
          }

          const user = webApp.initDataUnsafe?.user || {};
          const telegramTheme = webApp.colorScheme || "light"; // Default "light"

          // Dispatch complete user data to Redux
          dispatch(
            setUserData({
              firstName: user.first_name || "Noma'lum",
              lastName: user.last_name || "",
              photoUrl: user.photo_url || null,
              theme: telegramTheme,
              telegramId: user.id || 0, // Number sifatida, default 0
              username: user.username || "",
            })
          );

          // Add event listener for theme changes
          webApp.onEvent("themeChanged", () => {
            const newTheme = webApp.colorScheme || "light";
            dispatch(setTheme(newTheme));
          });
        } else {
          console.error("Telegram WebApp yuklanmadi");
          // Set default theme for testing outside Telegram
          dispatch(setTheme("light"));
        }
      } catch (error) {
        console.error("Telegram WebApp bilan xatolik:", error);
        // Set default theme for error cases
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

  // Use theme directly from Redux state
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