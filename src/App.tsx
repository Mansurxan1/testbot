"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUserData, setTheme } from "./store/telegramSlice"
import type { RootState } from "./store/store"
import AppRouter from "./router/AppRouter"

function App() {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.telegram.theme)

  useEffect(() => {
    const checkTelegram = () => {
      try {
        if (window.Telegram?.WebApp) {
          const webApp = window.Telegram.WebApp
          webApp.ready()
          webApp.expand()

          if (webApp.isVersionAtLeast("8.0")) {
            webApp.requestFullscreen()
          }
          if (webApp.isVersionAtLeast("7.0")) {
            webApp.setHeaderColor("#00000000") // Transparent header
          }

          const user = webApp.initDataUnsafe?.user || {}
          const telegramTheme = webApp.colorScheme || "light"

          // Set user data in Redux
          dispatch(
            setUserData({
              firstName: user.first_name || "Noma'lum",
              lastName: user.last_name || "",
              photoUrl: user.photo_url || null,
              theme: telegramTheme, // Use Telegram's theme
              telegramId: user.id?.toString() || "",
              username: user.username || "",
            }),
          )

          // Listen for theme changes
          webApp.onEvent("themeChanged", () => {
            const newTheme = webApp.colorScheme
            dispatch(setTheme(newTheme as "light" | "dark"))
          })
        } else {
          console.log("Telegram WebApp not loaded, using default theme")
          // Only set default theme if not already set
          if (!theme) {
            dispatch(setTheme("light"))
          }
        }
      } catch (error) {
        console.error("Error with Telegram WebApp:", error)
        if (!theme) {
          dispatch(setTheme("light"))
        }
      }
    }

    if (!window.Telegram) {
      const script = document.createElement("script")
      script.src = "https://telegram.org/js/telegram-web-app.js"
      script.async = true
      script.onload = checkTelegram
      document.head.appendChild(script)
    } else {
      checkTelegram()
    }
  }, [dispatch, theme])

  // Apply theme to body element for global theming
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark-theme")
      document.body.classList.remove("light-theme")
    } else {
      document.body.classList.add("light-theme")
      document.body.classList.remove("dark-theme")
    }
  }, [theme])

  return (
    <div
      className={`min-h-screen max-w-[450px] mx-auto ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <AppRouter />
    </div>
  )
}

export default App

