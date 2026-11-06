import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import esCommon from "./locales/es/common.json";
import esClients from "./locales/es/clients.json";

import enCommon from "./locales/en/common.json";
import enClients from "./locales/en/clients.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      es: {
        common: esCommon,
        clients: esClients,
      },
      en: {
        common: enCommon,
        clients: enClients,
      },
    },

    lng: "es",
    fallbackLng: "es",

    defaultNS: "common",

    interpolation: {
      escapeValue: false,
    },

    react: {
      useSuspense: false,
    },
  });

export default i18n;