
import { useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const Profile = () => {
  const navigate = useNavigate()
  const { firstName, lastName, photoUrl, theme, telegramId, username } = useSelector(
    (state: RootState) => state.telegram,
  )

  // Add state to track if user data is loaded
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if we have at least some user data
    if (firstName || telegramId) {
      setIsLoaded(true)
    } else if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      // If Redux doesn't have data but Telegram WebApp does, we can use it directly
      setIsLoaded(true)
    }
  }, [firstName, telegramId])

  const effectiveTheme = theme || "light"

  const containerClass = `flex flex-col items-center justify-center min-h-screen w-full ${
    effectiveTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
  }`
  const buttonClass = `absolute top-4 left-4 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
    effectiveTheme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
  }`
  const titleClass = `text-2xl font-bold mb-4 ${effectiveTheme === "dark" ? "text-blue-400" : "text-blue-600"}`
  const placeholderClass = `w-32 h-32 rounded-full mb-4 flex items-center justify-center ${
    effectiveTheme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
  }`

  // Get user data directly from Telegram WebApp if not in Redux
  const getUserData = () => {
    const user = window.Telegram?.WebApp?.initDataUnsafe?.user || {}
    return {
      firstName: firstName || user.first_name || "Noma'lum",
      lastName: lastName || user.last_name || "",
      photoUrl: photoUrl || user.photo_url || null,
      telegramId: telegramId || user.id?.toString() || "Mavjud emas",
      username: username || user.username || "Yo'q",
    }
  }

  const userData = getUserData()

  return (
    <div className={containerClass}>
      <button onClick={() => navigate(-1)} className={buttonClass}>
        Ortga
      </button>

      <h1 className={titleClass}>
        Xush kelibsiz, {userData.firstName} {userData.lastName}
      </h1>

      {userData.photoUrl ? (
        <img
          src={userData.photoUrl || "/placeholder.svg"}
          alt="Foydalanuvchi rasmi"
          className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-blue-500"
          onError={(e) => {
            console.log("Rasm yuklanmadi:", userData.photoUrl)
            e.currentTarget.onerror = null // Prevent infinite loop
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName)}&background=random`
          }}
        />
      ) : (
        <div className={placeholderClass}>{userData.firstName.charAt(0).toUpperCase()}</div>
      )}

      <p className="mb-2">Telegram ID: {userData.telegramId}</p>
      <p className="mb-2">
        Username:{" "}
        {userData.username ? (userData.username.startsWith("@") ? userData.username : `@${userData.username}`) : "Yo'q"}
      </p>
    </div>
  )
}

export default Profile

