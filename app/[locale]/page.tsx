import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, routing, type Locale } from "@/i18n/routing";
import { readSiteConfig } from "@/lib/site-config-storage";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./standby.module.css";

export const dynamic = "force-static";

type Props = { params: Promise<{ locale: string }> };

const copy = {
  it: {
    title: "Stiamo costruendo il nostro nuovo spazio.",
    intro:
      "Il nuovo sito di ArteStudio sarà presto online. Nel frattempo continuiamo a progettare e realizzare scenografie, eventi e spazi espositivi.",
    status: "Lavori in corso",
    contact: "Scrivici",
    metaTitle: "ArteStudio | Nuovo sito in arrivo",
    metaDescription:
      "ArteStudio progetta e realizza scenografie, eventi e spazi espositivi. Il nuovo sito sarà presto online.",
  },
  en: {
    title: "We are building our new space.",
    intro:
      "ArteStudio’s new website will be online soon. In the meantime, we continue to design and create sets, events and exhibition spaces.",
    status: "Work in progress",
    contact: "Contact us",
    metaTitle: "ArteStudio | New website coming soon",
    metaDescription:
      "ArteStudio designs and creates sets, events and exhibition spaces. Our new website will be online soon.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : routing.defaultLocale;
  const site = await readSiteConfig(locale);
  const pageCopy = copy[locale];

  return buildPageMetadata(
    {
      title: pageCopy.metaTitle,
      description: pageCopy.metaDescription,
      path: `/${locale}/`,
      absoluteTitle: true,
    },
    site,
    locale
  );
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();

  const locale: Locale = localeParam;
  setRequestLocale(locale);

  const site = await readSiteConfig(locale);
  const pageCopy = copy[locale];

  return (
    <main className={styles.page}>
      <div className={styles.stageLight} aria-hidden="true" />
      <div className={styles.draftingLines} aria-hidden="true" />

      <header className={styles.header}>
        <Image
          src="/logo.png"
          alt={site.siteName}
          width={400}
          height={105}
          priority
          className={styles.logo}
        />
        <nav className={styles.languages} aria-label="Language">
          <Link href="/it/" lang="it" aria-current={locale === "it" ? "page" : undefined}>
            IT
          </Link>
          <Link href="/en/" lang="en" aria-current={locale === "en" ? "page" : undefined}>
            EN
          </Link>
        </nav>
      </header>

      <section className={styles.content} aria-labelledby="standby-title">
        <p className={styles.status}>
          <span aria-hidden="true" />
          {pageCopy.status}
        </p>
        <h1 id="standby-title">{pageCopy.title}</h1>
        <p className={styles.intro}>{pageCopy.intro}</p>
        <a className={styles.contact} href={`mailto:${site.contactEmail}`}>
          <span>{pageCopy.contact}</span>
          <span>{site.contactEmail}</span>
        </a>
      </section>

      <footer className={styles.footer}>
        <span>{site.legal?.companyName || site.siteName}</span>
        <span>Milano, Italia</span>
      </footer>
    </main>
  );
}
