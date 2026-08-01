import { type LanguageCode } from "./registry";
export type { LanguageCode } from "./registry";
export interface LanguageConfig {
    nativeName: string;
}
/** All supported language codes, derived from the locale registry. */
export declare const SUPPORTED_LANGUAGE_CODES: readonly LanguageCode[];
/** Language display metadata, derived from the locale registry. */
export declare const LANGUAGES: Record<LanguageCode, LanguageConfig>;
