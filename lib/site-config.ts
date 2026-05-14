import type { SiteConfig } from '@/types';

const DAY_KEYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
export type DayKey = (typeof DAY_KEYS)[number];

const DAY_ALIASES: Record<string, DayKey> = {
  monday: 'monday', mon: 'monday',
  tuesday: 'tuesday', tue: 'tuesday', tues: 'tuesday',
  wednesday: 'wednesday', wed: 'wednesday',
  thursday: 'thursday', thu: 'thursday', thurs: 'thursday',
  friday: 'friday', fri: 'friday',
  saturday: 'saturday', sat: 'saturday',
  sunday: 'sunday', sun: 'sunday',
  lunedi: 'monday', lun: 'monday',
  martedi: 'tuesday', mar: 'tuesday',
  mercoledi: 'wednesday', mer: 'wednesday',
  giovedi: 'thursday', gio: 'thursday',
  venerdi: 'friday', ven: 'friday',
  sabato: 'saturday', sab: 'saturday',
  domenica: 'sunday', dom: 'sunday',
};

export function resolveDayKey(day: string): DayKey | null {
  const normalized = day
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[.\s]/g, '');
  return DAY_ALIASES[normalized] ?? null;
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
