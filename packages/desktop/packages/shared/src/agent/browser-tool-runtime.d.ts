import type { BrowserPaneFns } from './browser-tools.ts';
export interface BrowserCommandImage {
    data: string;
    mimeType: 'image/png' | 'image/jpeg';
    sizeBytes: number;
}
export interface BrowserCommandResult {
    output: string;
    appendReleaseHint: boolean;
    image?: BrowserCommandImage;
}
export declare function getBrowserToolHelp(): string;
export declare function executeBrowserToolCommand(args: {
    command: string | string[];
    fns: BrowserPaneFns;
    sessionId: string;
    platform?: NodeJS.Platform;
}): Promise<BrowserCommandResult>;
