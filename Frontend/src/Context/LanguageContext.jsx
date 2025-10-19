import { createContext, useEffect, useState, useCallback } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [current, setCurrent] = useState("en");

  const changeLanguage = useCallback((lang) => {
    if (!lang) return;
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "en" ? "ltr" : "rtl";
    localStorage.setItem("lang", lang);
    setCurrent(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    const next = current === "en" ? "ar" : "en";
    changeLanguage(next);
  }, [current, changeLanguage]);

  const getLang = () => {
    const lang = localStorage.getItem("lang");
    if (lang) {
      changeLanguage(lang);
    }
  };
  useEffect(() => {
    getLang();
  }, [changeLanguage]);

  return (
    <LanguageContext.Provider
      value={{
        currentLang: current,
        changeLanguage,
        language: current,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
