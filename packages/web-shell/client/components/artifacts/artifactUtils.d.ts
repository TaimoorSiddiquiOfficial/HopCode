import type { DaemonSessionArtifact } from '@hoptrendy/sdk/daemon';
export declare function artifactKindLabel(kind: string): string;
export declare function formatArtifactSize(sizeBytes: number | undefined): string;
export declare function getArtifactLocation(artifact: DaemonSessionArtifact): string;
export declare function normalizePath(value: string | undefined): string;
export declare function stripWorkspacePath(path: string, workspaceCwd?: string): string;
export declare function isSamePath(left: string | undefined, right: string | undefined, workspaceCwd?: string): boolean;
export declare function withArtifactPreviewCsp(html: string): string;
