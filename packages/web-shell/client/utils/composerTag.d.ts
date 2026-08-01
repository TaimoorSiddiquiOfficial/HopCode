import type { DaemonInputAnnotation } from '@hoptrendy/sdk/daemon';
import type { WebShellComposerTag, WebShellComposerTagIconMap, WebShellComposerTagKind } from '../customization';
export interface ComposerTagViewModel {
    tagLabel: string;
    tagValue: string;
    fallback: string;
    iconUrl?: string;
}
export type ComposerTagContentSegment = {
    type: 'text';
    text: string;
} | {
    type: 'reference';
    tag: WebShellComposerTag;
};
export declare function getComposerTagSerialized(tag: WebShellComposerTag): string;
export declare function getComposerTagIconUrl(kind: WebShellComposerTagKind | undefined, customIconUrls?: WebShellComposerTagIconMap): string | undefined;
export declare function isBuiltinComposerTagIconUrl(iconUrl: string | undefined): boolean;
export declare function createInputAnnotationsFromComposerTags(content: string, tags: readonly WebShellComposerTag[]): DaemonInputAnnotation[];
export declare function splitComposerTagContentByAnnotations(content: string, inputAnnotations?: readonly DaemonInputAnnotation[]): ComposerTagContentSegment[];
export declare function getComposerTagViewModel(tag: WebShellComposerTag, composerTagIcons?: WebShellComposerTagIconMap): ComposerTagViewModel;
