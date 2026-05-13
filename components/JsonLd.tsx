/**
 * Renders JSON-LD structured data for SEO (Organization, WebSite, CreativeWork).
 * Search engines use this for rich results.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + WebSite schema for home/layout */
export function OrganizationJsonLd({
  siteName,
  tagline,
  siteUrl,
  contactEmail,
  address,
  social,
  locale,
}: {
  siteName: string;
  tagline: string;
  siteUrl: string;
  contactEmail: string;
  address: string;
  social?: { facebook?: string; instagram?: string; linkedin?: string };
  locale?: string;
}) {
  const sameAs = [social?.facebook, social?.instagram, social?.linkedin].filter(Boolean) as string[];
  const inLanguage = locale === "en" ? "en-US" : "it-IT";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        description: tagline,
        url: siteUrl,
        email: contactEmail,
        address: {
          "@type": "PostalAddress",
          streetAddress: address.replace(/\n/g, ", "),
        },
        sameAs: sameAs.length > 0 ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: tagline,
        publisher: { "@id": `${siteUrl}/#organization` },
        inLanguage,
      },
    ],
  };

  return <JsonLd data={data} />;
}

/** CreativeWork schema for project detail pages */
export function ProjectJsonLd({
  name,
  description,
  image,
  dateCreated,
  url,
}: {
  name: string;
  description: string;
  image: string;
  dateCreated?: string;
  url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    image,
    dateCreated: dateCreated || undefined,
    url,
  };

  return <JsonLd data={data} />;
}
