import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import es from "./locales/es.json";
import ja from "./locales/ja.json";
import de from "./locales/de.json";
import vi from "./locales/vi.json";
import ko from "./locales/ko.json";
import fr from "./locales/fr.json";
import ar from "./locales/ar.json";
import hi from "./locales/hi.json";
import ru from "./locales/ru.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "ja", name: "日本語" },
  { code: "de", name: "Deutsch" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "ko", name: "한국어" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "ru", name: "Русский" },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]["code"];

const RTL_LANGUAGES = new Set<string>(["ar"]);

const applyDirection = (lng: string) => {
  if (typeof document === "undefined") return;
  const base = (lng || "en").split("-")[0];
  document.documentElement.lang = base;
  document.documentElement.dir = RTL_LANGUAGES.has(base) ? "rtl" : "ltr";
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      ja: { translation: ja },
      de: { translation: de },
      vi: { translation: vi },
      ko: { translation: ko },
      fr: { translation: fr },
      ar: { translation: ar },
      hi: { translation: hi },
      ru: { translation: ru },
    },
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES.map((l) => l.code),
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "streamwalkers.language",
    },
    returnEmptyString: false,
  });

applyDirection(i18n.language);
i18n.on("languageChanged", applyDirection);

export default i18n;
