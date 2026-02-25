import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "it",
  localePrefix: "always",
  localeDetection: true,
});

export type Locale = (typeof routing.locales)[number];
