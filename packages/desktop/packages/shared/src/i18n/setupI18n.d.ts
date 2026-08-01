import i18n, { type i18n as I18nInstance } from 'i18next';
/**
 * Initialize i18next with bundled translations.
 * Call once at app startup. Pass `plugins` to add framework integrations
 * (e.g. initReactI18next for React apps, LanguageDetector for browser apps).
 */
export declare function setupI18n(plugins?: any[]): I18nInstance;
export { i18n };
