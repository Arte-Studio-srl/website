import { siteConfig, SiteConfig } from '@/data/site-config';

export function getSiteConfig(): SiteConfig {
  return siteConfig;
}

export function formatPhoneDisplay(raw: string): string {
  const trimmed = raw.replace(/\s+/g, '');
  if (!trimmed.startsWith('+')) return raw;

  const country = trimmed.slice(0, 3); // e.g., +39
  const rest = trimmed.slice(3);

  if (rest.startsWith('02')) {
    // Milan area example: +39 02 89031657
    const number = rest.slice(2);
    const grouped = number.replace(/(\d{3})(?=\d)/g, '$1 ');
    return `${country} 02 ${grouped}`.trim();
  }

  const grouped = rest.replace(/(\d{3})(?=\d)/g, '$1 ');
  return `${country} ${grouped}`.trim();
}

export function formatTelHref(raw: string): string {
  return `tel:${raw.replace(/\s+/g, '')}`;
}

export function getGoogleMapsEmbedUrl(config: SiteConfig): string {
  if (config.googleMapsUrl.includes('output=embed')) {
    return config.googleMapsUrl;
  }

  const queryMatch = config.googleMapsUrl.match(/query=([^&]+)/);
  const query = queryMatch ? decodeURIComponent(queryMatch[1]) : config.address.replace(/\s+/g, ' ').trim();

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

