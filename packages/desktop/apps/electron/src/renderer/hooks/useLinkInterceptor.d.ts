/**
 * useLinkInterceptor - Centralized hook for intercepting file/URL open requests.
 *
 * Replaces the old handleOpenFile/handleOpenUrl in App.tsx that always opened externally.
 * Now classifies file types and decides whether to show an in-app preview overlay
 * or fall back to opening in the default external application.
 *
 * Architecture:
 *   Markdown click → PlatformContext → App.tsx → useLinkInterceptor
 *     ├── canPreview? → set previewState (renders overlay in App.tsx)
 *     └── can't preview? → electronAPI.openFile (opens externally)
 *
 * Uses refs for options to keep returned callbacks referentially stable,
 * preventing unnecessary re-renders of consumers (AppShellContext, PlatformProvider).
 */
interface ImagePreview {
    type: 'image';
    filePath: string;
}
interface PDFPreview {
    type: 'pdf';
    filePath: string;
}
interface CodePreview {
    type: 'code';
    filePath: string;
    content: string | null;
    language: string;
    error?: string;
}
interface MarkdownPreview {
    type: 'markdown';
    filePath: string;
    content: string | null;
    error?: string;
}
interface JSONPreview {
    type: 'json';
    filePath: string;
    content: string | null;
    error?: string;
}
interface TextPreview {
    type: 'text';
    filePath: string;
    content: string | null;
    error?: string;
}
export type FilePreviewState = ImagePreview | PDFPreview | CodePreview | MarkdownPreview | JSONPreview | TextPreview;
interface LinkInterceptorOptions {
    /** Open file in default external application (e.g., VS Code) */
    openFileExternal: (path: string) => Promise<void>;
    /** Open URL in default browser */
    openUrl: (url: string) => Promise<void>;
    /** Reveal file in system file manager */
    showInFolder: (path: string) => Promise<void>;
    /** Read file as UTF-8 text (for code, markdown, json, text previews) */
    readFile: (path: string) => Promise<string>;
    /** Read file as data URL (for image previews) */
    readFileDataUrl: (path: string) => Promise<string>;
    /** Read file as binary (Uint8Array) for PDF previews via react-pdf */
    readFileBinary: (path: string) => Promise<Uint8Array>;
}
interface LinkInterceptorResult {
    /** Replacement for App.tsx handleOpenFile — classifies and routes */
    handleOpenFile: (path: string) => void;
    /** Replacement for App.tsx handleOpenUrl — always opens externally */
    handleOpenUrl: (url: string) => void;
    /** Open file directly in external app, bypassing classification/preview */
    openFileExternal: (path: string) => void;
    /** Current preview state, drives which overlay renders in App.tsx */
    previewState: FilePreviewState | null;
    /** Close the preview overlay */
    closePreview: () => void;
    /** Open the currently previewed file in external app */
    openCurrentExternal: () => void;
    /** Reveal the currently previewed file in system file manager */
    revealCurrentInFinder: () => void;
    /** Read file as data URL — passed to image overlays as their loader */
    readFileDataUrl: (path: string) => Promise<string>;
    /** Read file as binary — passed to PDF overlays for react-pdf */
    readFileBinary: (path: string) => Promise<Uint8Array>;
}
export declare function useLinkInterceptor(options: LinkInterceptorOptions): LinkInterceptorResult;
export {};
