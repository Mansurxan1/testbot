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
          webApp.expand(); // Ekran to‘liq ochilishi uchun

          if (webApp.isVersionAtLeast("8.0") && webApp.requestFullscreen?.isAvailable?.()) {
            webApp.requestFullscreen(); // To‘liq ekran rejimi
          }
          if (webApp.isVersionAtLeast("7.0")) {
            webApp.setHeaderColor("#00000000"); // Shaffof header
          }
          if (webApp.isVersionAtLeast("6.0")) {
            webApp.enableClosingConfirmation(); // Ilovani yopishdan oldin tasdiqlash
          }

          const user = webApp.initDataUnsafe?.user || {};
          const telegramTheme = webApp.colorScheme || "light"; // Telegramdan kelgan tema, agar mavjud bo‘lmasa "light"

          // Dastlabki foydalanuvchi ma'lumotlari va tema o‘rnatiladi
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

          // Tema o‘zgarishi hodisasi
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

          // Sozlamalar o‘zgarganda yangilash
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

    if (!window.Telegram) {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = checkTelegram;
      script.onerror = () => console.error("Telegram skripti yuklanmadi");
      document.head.appendChild(script);
    } else {
      checkTelegram();
    }
  }, [dispatch]);

  // Telegramning colorScheme’ga asoslangan tema sinflari
  const themeClasses = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";

  return (
    <div className={`min-h-screen w-full max-w-[450px] mx-auto ${themeClasses}`}>
      <AppRouter />
    </div>
  );
};

export default App;