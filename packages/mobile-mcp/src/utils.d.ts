export declare function validatePackageName(packageName: string): void;
export declare function validateLocale(locale: string): void;
export declare function validateFileExtension(filePath: string, allowedExtensions: string[], toolName: string): void;
export declare function validateOutputPath(filePath: string): void;
/**
 * Strip UIAutomator `bounds="[left,top][right,bottom]"` attributes from a UI
 * hierarchy XML dump to cut token usage. Coordinates can be negative for
 * elements scrolled partially off-screen, so each value allows a leading `-`.
 */
export declare function stripUiBounds(xml: string): string;
