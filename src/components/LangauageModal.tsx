import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
];

const LoginLanguageModal = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState<string | null>(localStorage.getItem("language"));
  const theme = useSelector((state: RootState) => state.telegram.theme) || "light";
  const telegramUsername = useSelector((state: RootState) => state.telegram.username);

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showTimeZoneModal, setShowTimeZoneModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(telegramUsername ? `@${telegramUsername}` : ""); // Boshlang‘ich qiymat shu yerda belgilanadi
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [progress, setProgress] = useState(selectedLang ? 33 : 0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // `telegramUsername` dan faqat bir marta foydalanish uchun `useEffect` ni o‘chirib, boshlang‘ich qiymatni yuqorida belgiladik
  // Agar `telegramUsername` dinamik ravishda o‘zgarishi kerak bo‘lsa, bu qismni qayta ko‘rib chiqamiz

  useEffect(() => {
    if (selectedLang) i18n.changeLanguage(selectedLang);
  }, [selectedLang, i18n]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const detectKeyboard = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.innerHeight;
      setIsKeyboardVisible(viewportHeight < windowHeight * 0.8);
    };
    window.visualViewport?.addEventListener("resize", detectKeyboard);
    window.addEventListener("resize", detectKeyboard);
    return () => {
      window.visualViewport?.removeEventListener("resize", detectKeyboard);
      window.removeEventListener("resize", detectKeyboard);
    };
  }, []);

  useEffect(() => {
    if (!selectedLang) setProgress(0);
    else if (showDetailsModal) {
      if (firstName.trim() && !lastName.trim()) setProgress(49.5);
      else if (firstName.trim() && lastName.trim()) setProgress(66);
      else setProgress(33);
    } else if (showUsernameModal) {
      setProgress(username.trim() ? 75 : 66);
    } else if (showTimeZoneModal) {
      setProgress(selectedCountry ? 100 : 75);
    } else {
      setProgress(33);
    }
  }, [selectedLang, firstName, lastName, username, showDetailsModal, showUsernameModal, showTimeZoneModal, selectedCountry]);

  const handleLanguageSelect = (lang: string) => {
    setSelectedLang(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[^\d\s!@#$%^&*()_+=[\]{}|;:'",.<>?~`]*$/.test(value)) {
      setFirstName(value);
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[^\d\s!@#$%^&*()_+=[\]{}|;:'",.<>?~`]*$/.test(value)) {
      setLastName(value);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Faqat harflar, raqamlar, "-" va "@" belgilariga ruxsat beramiz
    if (/^[@a-zA-Z0-9-]*$/.test(value)) {
      setUsername(value);
      if (value.startsWith("-") || value.endsWith("-")) {
        setUsernameError(t("username_error"));
      } else {
        setUsernameError(null);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
    if (!value.trim()) setSelectedCountry("");
  };

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setSearchTerm(country);
    setIsDropdownOpen(false);
    setProgress(100);
  };

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const textColor = theme === "light" ? "text-black" : "text-white";
  const bgColor = theme === "light" ? "bg-[#F1F1F1]" : "bg-[#242f3d]";
  const buttonBg = theme === "light" ? "bg-white" : "bg-[#293A4C]";
  const inputBg = theme === "light" ? "bg-white" : "bg-[#293A4C]";
  const timeBg = theme === "light" ? "bg-[#2B5278]" : "bg-[#5EB5F7]";
  const defaultButtonTextColor = theme === "light" ? "text-black" : "text-white";
  const activeButtonTextColor = "text-white";
  const inputTextColor = theme === "light" ? "text-[#4B5563]" : "text-[#D1D5DB]";

  const buttonBackground = (condition: boolean) =>
    condition
      ? "bg-gradient-to-r from-[#0061FF] to-[#52DAFF]"
      : `border ${theme === "light" ? "border-[#BFC8CF] bg-[#F1F1F1]" : "border-[#768C9E] bg-[#242f3d]"}`;

  const dropdownShadow =
    theme === "light" ? "shadow-[0px_10px_15px_-3px_#00000026]" : "shadow-[0px_10px_15px_-3px_#00000033]";

  const progressBarStyle = {
    height: "3px",
    backgroundImage: `linear-gradient(to right, #0061FF 0%, #52DAFF ${progress}%, #E5E7EB ${progress}%, #E5E7EB 100%)`,
    width: "100%",
    transition: "background-image 0.3s ease",
  };

  const buttonPositionClass = isKeyboardVisible ? "relative mt-8 mb-4" : "fixed bottom-8 left-7 right-7";

  return (
    <div className={`flex pt-5 flex-col items-center justify-center mx-auto max-w-[450px] min-h-screen w-full ${bgColor} px-8 pb-20`}>
      {/* Qolgan JSX kod bir xil qoladi */}
      {/* Username input qismi */}
      {showUsernameModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 w-full">
          <div className={`h-screen max-w-[450px] w-full mx-auto flex flex-col ${bgColor} justify-start overflow-y-auto`}>
            <div className="max-w-[450px] w-full sticky top-0 flex flex-col z-10 bg-inherit">
              <button
                onClick={() => (setShowUsernameModal(false), setShowDetailsModal(true), setProgress(66))}
                className={`${textColor} text-[24px] px-4 pt-20 phone:pt-5 self-start`}
              >
                <ChevronDown className="h-6 w-6 transform rotate-90" strokeWidth={3} />
              </button>
              <div style={progressBarStyle} className="mt-2"></div>
            </div>
            <div className="px-8 pb-24">
              <h2 className={`mt-10 text-xl font-bold ${textColor} leading-tight`}>{t("enter_username")}</h2>
              <p className={`mt-4 text-[#768C9E] text-sm leading-relaxed`}>{t("username_instructions")}</p>
              <input
                value={username}
                onChange={handleUsernameChange}
                placeholder="@username"
                className={`w-full max-w-[390px] mt-4 p-3 ${inputBg} rounded-xl ${inputTextColor} text-[16px] focus:outline-none border border-[#768C9E]`}
              />
              {usernameError && <p className="mt-2 text-[12px] text-red-500 text-center">{usernameError}</p>}
              <p className="mt-2 text-[12px] text-[#768C9E] text-center">{t("username_rules")}</p>
              <button
                onClick={() => {
                  if (username.trim() && !username.startsWith("-") && !username.endsWith("-")) {
                    setShowUsernameModal(false);
                    setShowTimeZoneModal(true);
                  }
                }}
                disabled={!username.trim() || username.startsWith("-") || username.endsWith("-")}
                className={`max-w-[385px] mx-auto p-3 rounded-xl font-semibold transition-colors ${buttonBackground(
                  !!(username.trim() && !username.startsWith("-") && !username.endsWith("-"))
                )} ${!username.trim() || username.startsWith("-") || username.endsWith("-") ? `cursor-not-allowed ${defaultButtonTextColor}` : activeButtonTextColor} ${buttonPositionClass}`}
              >
                {t("next")}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Qolgan JSX kod */}
    </div>
  );
};

export default LoginLanguageModal;