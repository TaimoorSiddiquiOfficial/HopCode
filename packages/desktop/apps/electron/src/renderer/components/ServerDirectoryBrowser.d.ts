interface ServerDirectoryBrowserProps {
    open: boolean;
    mode: 'browse' | 'manual';
    onSelect: (path: string) => void;
    onCancel: () => void;
    initialPath?: string;
}
export declare function ServerDirectoryBrowser({ open, mode, onSelect, onCancel, initialPath, }: ServerDirectoryBrowserProps): import("react").JSX.Element;
export {};
