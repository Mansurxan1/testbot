// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setTheme, setUserData } from "./store/telegramSlice"; 
// import AppRouter from "./router/AppRouter";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkTelegram = () => {
//       try {
//         if (window.Telegram?.WebApp) {
//           const webApp = window.Telegram.WebApp;
//           webApp.ready();
//           webApp.expand();

//           const initialTheme = webApp.colorScheme || "light";
//           dispatch(setTheme(initialTheme));

//           // Foydalanuvchi ma'lumotlarini olish 
//           const initData = webApp.initDataUnsafe?.user;
//           if (initData) {
//             dispatch(
//               setUserData({
//                 firstName: initData.first_name || "",
//                 lastName: initData.last_name || "",
//                 photoUrl: initData.photo_url || null,
//                 theme: initialTheme,
//                 telegramId: initData.id || 0,
//                 username: initData.username || "",
//               })
//             );
//           }

//           webApp.onEvent("themeChanged", () => {
//             const newTheme = webApp.colorScheme || "light";
//             dispatch(setTheme(newTheme));
//           });

//           if (webApp.isVersionAtLeast("8.0")) {
//             webApp.requestFullscreen();
//           }
//           if (webApp.isVersionAtLeast("7.0")) {
//             webApp.setHeaderColor("#00000000");
//           }
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

//   return (
//     <div className="min-h-screen max-w-[450px] mx-auto">
//       <AppRouter />
//     </div>
//   );
// }

// export default App;


import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme, setUserData } from "./store/telegramSlice";
import AppRouter from "./router/AppRouter";
import { useLocation, useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTelegram = () => {
      try {
        if (window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp;
          webApp.ready();
          webApp.expand();

          const initialTheme = webApp.colorScheme || "light";
          dispatch(setTheme(initialTheme));

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

  // Bosh sahifada yopish tugmasi, qolgan sahifalarda ortga qaytish tugmasi
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen max-w-[450px] mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        {isHomePage ? (
          <button
            onClick={() => window.Telegram?.WebApp.close()}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Yopish
          </button>
        ) : (
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Orqaga
          </button>
        )}
      </div>
      <AppRouter />
    </div>
  );
}

export default App;
