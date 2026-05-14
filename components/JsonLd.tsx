import { resolveDayKey, type DayKey } from '@/lib/site-config';
import type { OpeningHour, SiteConfig } from '@/types';

/**
 * Renders JSON-LD structured data for SEO.
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

const DAY_TO_SCHEMA: Record<DayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

function normalizeTime(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (/^\d{1,2}:\d{2}/.test(trimmed)) {
    const [h, m] = trimmed.split(':');
    return `${h.padStart(2, '0')}:${m.slice(0, 2)}`;
  }
  if (/^\d{1,2}$/.test(trimmed)) {
    return `${trimmed.padStart(2, '0')}:00`;
  }
  return null;
}

function buildOpeningHoursSpec(hours: OpeningHour[] | undefined) {
  if (!hours || hours.length === 0) return undefined;
  const spec = hours.flatMap((h) => {
    if (h.closed) return [];
    const opens = normalizeTime(h.open || '');
    const closes = normalizeTime(h.close || '');
    if (!opens || !closes) return [];
    const key = resolveDayKey(h.day);
    if (!key) return [];
    return [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${DAY_TO_SCHEMA[key]}`,
        opens,
        closes,
      },
    ];
  });
  return spec.length > 0 ? spec : undefined;
}

function buildPostalAddress(
  site: Pick<SiteConfig, 'address' | 'addressLocality' | 'addressRegion' | 'postalCode' | 'addressCountry'>
) {
  const streetAddress = site.address?.replace(/\n/g, ', ');
  const address: Record<string, string> = { '@type': 'PostalAddress' };
  if (streetAddress) address.streetAddress = streetAddress;
  if (site.addressLocality) address.addressLocality = site.addressLocality;
  if (site.addressRegion) address.addressRegion = site.addressRegion;
  if (site.postalCode) address.postalCode = site.postalCode;
  if (site.addressCountry) address.addressCountry = site.addressCountry;
  return address;
}

function buildGeo(geo: SiteConfig['geo']) {
  if (!geo || typeof geo.latitude !== 'number' || typeof geo.longitude !== 'number') return undefined;
  return {
    '@type': 'GeoCoordinates',
    latitude: geo.latitude,
    longitude: geo.longitude,
  };
}

/**
 * Organization + LocalBusiness + WebSite graph for the locale layout.
 * The triple @type makes the studio eligible for Knowledge-Panel,
 * Map-Pack, and generic Organization rich results in parallel.
 */
export function OrganizationJsonLd({
  site,
  siteUrl,
  locale,
}: {
  site: SiteConfig;
  siteUrl: string;
  locale?: string;
}) {
  const sameAs = [site.social?.facebook, site.social?.instagram, site.social?.linkedin].filter(Boolean) as string[];
  const inLanguage = locale === 'en' ? 'en-US' : 'it-IT';
  const logoUrl = `${siteUrl.replace(/\/$/, '')}/logo.png`;
  const openingHoursSpec = buildOpeningHoursSpec(site.openingHours);
  const postalAddress = buildPostalAddress(site);
  const geo = buildGeo(site.geo);

  const organization: Record<string, unknown> = {
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    '@id': `${siteUrl}/#organization`,
    name: site.siteName,
    description: site.tagline,
    url: siteUrl,
    logo: logoUrl,
    image: logoUrl,
    email: site.contactEmail,
    address: postalAddress,
  };
  if (site.phone) organization.telephone = site.phone;
  if (site.legal?.companyName) organization.legalName = site.legal.companyName;
  if (site.legal?.piva) organization.vatID = site.legal.piva;
  if (openingHoursSpec) organization.openingHoursSpecification = openingHoursSpec;
  if (geo) organization.geo = geo;
  if (site.googleMapsUrl) organization.hasMap = site.googleMapsUrl;
  if (sameAs.length > 0) organization.sameAs = sameAs;

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: site.siteName,
        description: site.tagline,
        publisher: { '@id': `${siteUrl}/#organization` },
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
  siteUrl,
}: {
  name: string;
  description: string;
  image: string;
  dateCreated?: string;
  url: string;
  siteUrl?: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    image,
    url,
  };
  if (dateCreated) data.dateCreated = dateCreated;
  if (siteUrl) data.creator = { '@id': `${siteUrl.replace(/\/$/, '')}/#organization` };

  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList for category and project pages.
 * Google replaces the URL in SERPs with this trail and may award a small CTR bump.
 * The structured data should mirror the visible breadcrumb on the page.
 */
export function BreadcrumbListJsonLd({
  items,
}: {
  items: Array<{ name: string; url?: string }>;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => {
      const node: Record<string, unknown> = {
        '@type': 'ListItem',
        position: idx + 1,
        name: item.name,
      };
      if (item.url) node.item = item.url;
      return node;
    }),
  };
  return <JsonLd data={data} />;
}

/**
 * ImageObject list for project detail pages.
 * Helps Google Images index each shot with a caption + creator link back
 * to the Organization graph — biggest realistic organic-traffic lever for
 * a visual portfolio site.
 */
export function ProjectImagesJsonLd({
  images,
  siteUrl,
}: {
  images: Array<{ url: string; caption: string }>;
  siteUrl?: string;
}) {
  if (images.length === 0) return null;
  const creator = siteUrl ? { '@id': `${siteUrl.replace(/\/$/, '')}/#organization` } : undefined;
  const data = {
    '@context': 'https://schema.org',
    '@graph': images.map((img, idx) => {
      const node: Record<string, unknown> = {
        '@type': 'ImageObject',
        '@id': `${img.url}#image-${idx}`,
        contentUrl: img.url,
        url: img.url,
        caption: img.caption,
      };
      if (creator) node.creator = creator;
      return node;
    }),
  };
  return <JsonLd data={data} />;
}
