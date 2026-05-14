import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["it", "en"],
  defaultLocale: "it",
  localePrefix: "always",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale);
}
