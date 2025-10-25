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
export declare const COUNTRY_INFO: Record<string, CountryInfo>;
/**
 * Get user's approximate location using browser APIs
 */
export declare function getUserLocation(): Promise<GeoLocation>;
/**
 * Get geolocation using browser geolocation API
 */
export declare function getBrowserGeolocation(): Promise<GeoLocation>;
/**
 * Get country info by country code
 */
export declare function getCountryInfo(countryCode: string): CountryInfo | null;
/**
 * Get language from country code
 */
export declare function getLanguageFromCountry(countryCode: string): string;
/**
 * Get timezone from country code
 */
export declare function getTimezoneFromCountry(countryCode: string): string;
/**
 * Format currency for a country
 */
export declare function formatCurrency(amount: number, countryCode: string): string;
/**
 * Format date for a country/locale
 */
export declare function formatDateForLocale(date: Date, countryCode: string): string;
/**
 * Get preferred language order based on user location
 */
export declare function getPreferredLanguages(userLocation: GeoLocation): string[];
/**
 * Check if content should be translated for user
 */
export declare function shouldTranslateContent(contentLanguage: string, userLocation: GeoLocation, supportedLanguages?: string[]): boolean;
/**
 * Get SEO hreflang attributes for international content
 */
export declare function getHreflangAttributes(currentLanguage: string, availableLanguages: string[], baseUrl: string, path: string): Array<{
    hreflang: string;
    href: string;
}>;
/**
 * Detect if user is in a specific region for content customization
 */
export declare function isUserInRegion(userLocation: GeoLocation, regions: string[]): boolean;
/**
 * Get localized content based on user location
 */
export declare function getLocalizedContent<T>(content: Record<string, T>, userLocation: GeoLocation, defaultLanguage?: string): T;
/**
 * Get RTL (Right-to-Left) text direction for language
 */
export declare function isRTLLanguage(language: string): boolean;
/**
 * Get text direction for language
 */
export declare function getTextDirection(language: string): 'ltr' | 'rtl';
//# sourceMappingURL=geo.d.ts.map