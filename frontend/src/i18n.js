import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enPayload from "./assets/locales/lang_en.json";
import plPayload from "./assets/locales/lang_pl.json";

i18n.use(initReactI18next).init({
    lng: localStorage.getItem("lang") || "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    resources: {
        en: {
            translation: enPayload
        },
        pl: {
            translation: plPayload
        }
    }
});

export default i18n;