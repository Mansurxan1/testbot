import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const { firstName, lastName, photoUrl, theme, telegramId, username } = useSelector(
    (state: RootState) => state.telegram
  );

  // Test uchun log qo‘shish
  console.log("Redux state:", { firstName, lastName, photoUrl, theme, telegramId, username });

  const handleBack = () => {
    navigate(-1);
  };

  // Default tema qo‘shish (agar Redux’dan kelmasa)
  const effectiveTheme = theme || "light";

  // Stil sinflari
  const containerClass = `flex flex-col items-center justify-center h-screen ${
    effectiveTheme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black"
  }`;
  const buttonClass = `absolute top-4 left-4 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
    effectiveTheme === "dark" ? "bg-gray-800 hover:bg-gray-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
  }`;
  const titleClass = `text-2xl font-bold mb-4 ${
    effectiveTheme === "dark" ? "text-blue-400" : "text-blue-600"
  }`;
  const placeholderClass = `w-32 h-32 rounded-full mb-4 flex items-center justify-center ${
    effectiveTheme === "dark" ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-600"
  }`;

  return (
    <div className={containerClass}>
      <button onClick={handleBack} className={buttonClass}>
        Ortga
      </button>

      <h1 className={titleClass}>
        Xush kelibsiz, {firstName || "Noma'lum"} {lastName || ""}
      </h1>

      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Foydalanuvchi rasmi"
          className="w-32 h-32 rounded-full mb-4 object-cover border-2 border-blue-500"
          onError={() => console.log("Rasm yuklanmadi:", photoUrl)}
        />
      ) : (
        <div className={placeholderClass}>Rasm yo‘q</div>
      )}

      <p className="mb-2">Telegram ID: {telegramId || "Mavjud emas"}</p>
      <p className="mb-2">
        Username: {username ? (username.startsWith("@") ? username : `@${username}`) : "Yo‘q"}
      </p>
    </div>
  );
};

export default Profile;