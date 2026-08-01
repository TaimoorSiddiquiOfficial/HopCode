import type { CodeBlockRenderer } from '../../customization';
import type { WebShellTheme } from '../../themeContext';
export declare const ECHARTS_FULLDATA_LANGUAGE = "echarts-fulldata";
export type DatasetCell = string | number | boolean | null;
type DatasetRow = Record<string, DatasetCell> | DatasetCell[];
type DatasetSource = DatasetRow[];
type DatasetDimension = string | {
    name?: string;
};
type ChartTheme = WebShellTheme;
interface EchartsDataset {
    dimensions?: DatasetDimension[];
    source?: DatasetSource;
}
export interface EchartsFullDataOption {
    title?: {
        text?: string;
    } | Array<{
        text?: string;
    }>;
    dataset?: EchartsDataset | EchartsDataset[];
    [key: string]: unknown;
}
export interface EchartsInstance {
    setOption(option: EchartsFullDataOption, opts?: {
        notMerge?: boolean;
    }): void;
    resize(): void;
    dispose(): void;
}
export interface EchartsRuntime {
    init(element: HTMLElement, theme?: string): EchartsInstance;
}
export type EchartsRuntimeLoader = () => EchartsRuntime | Promise<EchartsRuntime>;
export interface EchartsFullDataResolvedDataset {
    dimensions: string[];
    source: DatasetCell[][];
}
export interface EchartsFullDataRefMeta {
    dimensions: string[];
    format: 'csv' | 'json';
}
/**
 * Resolves a renderer-validated data ref. The ref uses artifact:// or
 * session-file:// with normalized non-empty path segments and no traversal,
 * dot, drive-qualified, query/hash, whitespace, control, backslash, or
 * double-encoded percent forms.
 */
export type EchartsFullDataRefResolver = (ref: string, meta: EchartsFullDataRefMeta) => EchartsFullDataResolvedDataset | Promise<EchartsFullDataResolvedDataset>;
export interface EchartsFullDataBlockProps {
    /**
     * Chart option. Must be JSON-serializable; functions and other non-JSON
     * values are stripped during internal cloning.
     */
    option?: EchartsFullDataOption;
    parseError?: string;
    isStreaming?: boolean;
    theme: ChartTheme;
    loadEcharts?: EchartsRuntimeLoader;
}
export interface EchartsFullDataRendererOptions {
    loadEcharts?: EchartsRuntimeLoader;
    resolveDataRef?: EchartsFullDataRefResolver;
}
export declare const ECHARTS_FULLDATA_SANITIZER_KEY_OVERLAP: readonly string[];
export declare function createEchartsFullDataRenderer({ loadEcharts, resolveDataRef, }?: EchartsFullDataRendererOptions): CodeBlockRenderer;
export declare function EchartsFullDataBlock({ option, parseError, isStreaming, theme, loadEcharts, }: EchartsFullDataBlockProps): import("react").JSX.Element;
export {};
