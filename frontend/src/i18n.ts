import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// ── Vietnamese ─────────────────────────────────────────────────────────────
import viCommon from "./locales/vi/common.json";
import viTeacher from "./locales/vi/teacher.json";
import viStudent from "./locales/vi/student.json";
import viAuth from "./locales/vi/auth.json";
import viBlog from "./locales/vi/blog.json";
import viLanding from "./locales/vi/landing.json";
import viVstep from "./locales/vi/vstep.json";
import viAdmin from "./locales/vi/admin.json";

// ── English ────────────────────────────────────────────────────────────────
import enCommon from "./locales/en/common.json";
import enTeacher from "./locales/en/teacher.json";
import enStudent from "./locales/en/student.json";
import enAuth from "./locales/en/auth.json";
import enBlog from "./locales/en/blog.json";
import enLanding from "./locales/en/landing.json";
import enVstep from "./locales/en/vstep.json";
import enAdmin from "./locales/en/admin.json";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        translation: {
          ...viCommon,
          ...viTeacher,
          ...viStudent,
          ...viAuth,
          ...viBlog,
          ...viLanding,
          ...viVstep,
          ...viAdmin,
        },
      },
      en: {
        translation: {
          ...enCommon,
          ...enTeacher,
          ...enStudent,
          ...enAuth,
          ...enBlog,
          ...enLanding,
          ...enVstep,
          ...enAdmin,
        },
      },
    },
    lng: "vi",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
