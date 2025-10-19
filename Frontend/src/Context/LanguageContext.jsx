import { createContext, useEffect, useState } from "react";
import i18n from "../i18n";

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [current, setCurrent] = useState("en");

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang == "en" ? "ltr" : "rtl";
    localStorage.setItem("lang", lang);
    setCurrent(lang);
  };

  const getLang = () => {
    const lang = localStorage.getItem("lang");
    if (lang) {
      changeLanguage(lang);
    }
  };
  useEffect(() => {
    getLang();
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLang: current, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
