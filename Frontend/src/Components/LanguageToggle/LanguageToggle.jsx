import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useCallback } from "react";
import { LanguageContext } from "../../Context/LanguageContext";

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const {
    language: contextLang,
    toggleLanguage,
    changeLanguage,
  } = useContext(LanguageContext);

  const language = (contextLang || i18n.language || "en").toLowerCase();

  const handleLanguageChange = useCallback(() => {
    const newLang = language === "en" ? "ar" : "en";
    if (changeLanguage) changeLanguage(newLang);
    else i18n.changeLanguage(newLang);
    if (toggleLanguage) toggleLanguage();
  }, [language, i18n, toggleLanguage, changeLanguage]);

  // keyboard shortcut: Alt+L toggles language
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && (e.key === "l" || e.key === "L")) {
        e.preventDefault();
        handleLanguageChange();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleLanguageChange]);

  return (
    <Button
      type="button"
      icon="pi pi-globe"
      label={` ${(language || "en").toUpperCase()}`}
      className="p-button-text flex items-center gap-2"
      onClick={handleLanguageChange}
      size="small"
      severity="secondary"
      aria-label="Toggle language (Alt+L)"
      title={`Toggle language (Alt+L)`}
    />
  );
}
