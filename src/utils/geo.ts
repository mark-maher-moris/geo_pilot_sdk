/**
 * GEO and localization utilities for the Auto Blogify SDK
 */

export interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  language?: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  language: string;
  currency: string;
  timezone: string;
}

// Common country mappings
export const COUNTRY_INFO: Record<string, CountryInfo> = {
  US: { code: 'US', name: 'United States', language: 'en', currency: 'USD', timezone: 'America/New_York' },
  CA: { code: 'CA', name: 'Canada', language: 'en', currency: 'CAD', timezone: 'America/Toronto' },
  GB: { code: 'GB', name: 'United Kingdom', language: 'en', currency: 'GBP', timezone: 'Europe/London' },
  FR: { code: 'FR', name: 'France', language: 'fr', currency: 'EUR', timezone: 'Europe/Paris' },
  DE: { code: 'DE', name: 'Germany', language: 'de', currency: 'EUR', timezone: 'Europe/Berlin' },
  ES: { code: 'ES', name: 'Spain', language: 'es', currency: 'EUR', timezone: 'Europe/Madrid' },
  IT: { code: 'IT', name: 'Italy', language: 'it', currency: 'EUR', timezone: 'Europe/Rome' },
  AU: { code: 'AU', name: 'Australia', language: 'en', currency: 'AUD', timezone: 'Australia/Sydney' },
  JP: { code: 'JP', name: 'Japan', language: 'ja', currency: 'JPY', timezone: 'Asia/Tokyo' },
  CN: { code: 'CN', name: 'China', language: 'zh', currency: 'CNY', timezone: 'Asia/Shanghai' },
  IN: { code: 'IN', name: 'India', language: 'en', currency: 'INR', timezone: 'Asia/Kolkata' },
  BR: { code: 'BR', name: 'Brazil', language: 'pt', currency: 'BRL', timezone: 'America/Sao_Paulo' },
  MX: { code: 'MX', name: 'Mexico', language: 'es', currency: 'MXN', timezone: 'America/Mexico_City' },
  RU: { code: 'RU', name: 'Russia', language: 'ru', currency: 'RUB', timezone: 'Europe/Moscow' },
  KR: { code: 'KR', name: 'South Korea', language: 'ko', currency: 'KRW', timezone: 'Asia/Seoul' },
};

/**
 * Get user's approximate location using browser APIs
 */
export async function getUserLocation(): Promise<GeoLocation> {
  const location: GeoLocation = {};

  // Try to get timezone from browser
  try {
    location.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Could not detect timezone:', error);
  }

  // Try to get language from browser
  try {
    location.language = navigator.language.split('-')[0];
  } catch (error) {
    console.warn('Could not detect language:', error);
  }

  // Try to get country from locale
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const parts = locale.split('-');
    if (parts.length > 1) {
      location.country = parts[1].toUpperCase();
    }
  } catch (error) {
    console.warn('Could not detect country from locale:', error);
  }

  return location;
}

/**
 * Get geolocation using browser geolocation API
 */
export function getBrowserGeolocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
        enableHighAccuracy: false
      }
    );
  });
}

/**
 * Get country info by country code
 */
export function getCountryInfo(countryCode: string): CountryInfo | null {
  return COUNTRY_INFO[countryCode.toUpperCase()] || null;
}

/**
 * Get language from country code
 */
export function getLanguageFromCountry(countryCode: string): string {
  const info = getCountryInfo(countryCode);
  return info?.language || 'en';
}

/**
 * Get timezone from country code
 */
export function getTimezoneFromCountry(countryCode: string): string {
  const info = getCountryInfo(countryCode);
  return info?.timezone || 'UTC';
}

/**
 * Format currency for a country
 */
export function formatCurrency(amount: number, countryCode: string): string {
  const info = getCountryInfo(countryCode);
  const currency = info?.currency || 'USD';
  const locale = info?.language === 'en' ? 'en-US' : `${info?.language}-${countryCode}`;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format date for a country/locale
 */
export function formatDateForLocale(date: Date, countryCode: string): string {
  const info = getCountryInfo(countryCode);
  const locale = info?.language === 'en' ? 'en-US' : `${info?.language}-${countryCode}`;

  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    return date.toLocaleDateString();
  }
}

/**
 * Get preferred language order based on user location
 */
export function getPreferredLanguages(userLocation: GeoLocation): string[] {
  const languages = ['en']; // Default to English

  if (userLocation.language && userLocation.language !== 'en') {
    languages.unshift(userLocation.language);
  }

  if (userLocation.country) {
    const countryLang = getLanguageFromCountry(userLocation.country);
    if (countryLang !== 'en' && !languages.includes(countryLang)) {
      languages.splice(1, 0, countryLang);
    }
  }

  return languages;
}

/**
 * Check if content should be translated for user
 */
export function shouldTranslateContent(
  contentLanguage: string,
  userLocation: GeoLocation,
  supportedLanguages: string[] = ['en']
): boolean {
  const preferredLanguages = getPreferredLanguages(userLocation);
  
  // If content is in user's preferred language, no translation needed
  if (preferredLanguages.includes(contentLanguage)) {
    return false;
  }

  // If user's preferred language is supported, translate
  return preferredLanguages.some(lang => supportedLanguages.includes(lang));
}

/**
 * Get SEO hreflang attributes for international content
 */
export function getHreflangAttributes(
  currentLanguage: string,
  availableLanguages: string[],
  baseUrl: string,
  path: string
): Array<{ hreflang: string; href: string }> {
  return availableLanguages.map(lang => ({
    hreflang: lang === 'en' ? 'x-default' : lang,
    href: `${baseUrl}${lang === 'en' ? '' : `/${lang}`}${path}`
  }));
}

/**
 * Detect if user is in a specific region for content customization
 */
export function isUserInRegion(userLocation: GeoLocation, regions: string[]): boolean {
  if (!userLocation.country) return false;
  
  return regions.some(region => {
    // Support both country codes and region names
    if (region.length === 2) {
      return userLocation.country?.toUpperCase() === region.toUpperCase();
    }
    
    // Support region groupings like 'EU', 'NA', 'APAC'
    const regionMappings: Record<string, string[]> = {
      EU: ['FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'AT', 'SE', 'DK', 'FI', 'NO', 'PL', 'PT', 'GR'],
      NA: ['US', 'CA', 'MX'],
      APAC: ['JP', 'CN', 'KR', 'IN', 'AU', 'SG', 'TH', 'VN', 'PH', 'MY'],
      LATAM: ['BR', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO'],
    };
    
    return regionMappings[region.toUpperCase()]?.includes(userLocation.country?.toUpperCase() || '');
  });
}

/**
 * Get localized content based on user location
 */
export function getLocalizedContent<T>(
  content: Record<string, T>,
  userLocation: GeoLocation,
  defaultLanguage: string = 'en'
): T {
  const preferredLanguages = getPreferredLanguages(userLocation);
  
  for (const lang of preferredLanguages) {
    if (content[lang]) {
      return content[lang];
    }
  }
  
  return content[defaultLanguage] || Object.values(content)[0];
}

/**
 * Get RTL (Right-to-Left) text direction for language
 */
export function isRTLLanguage(language: string): boolean {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ps', 'sd'];
  return rtlLanguages.includes(language);
}

/**
 * Get text direction for language
 */
export function getTextDirection(language: string): 'ltr' | 'rtl' {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
}
