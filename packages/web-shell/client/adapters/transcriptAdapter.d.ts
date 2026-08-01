import type { DaemonTranscriptBlock } from '@hoptrendy/webui/daemon-react-sdk';
import type { PermissionRequest } from './types';
export declare function extractPendingPermission(blocks: readonly DaemonTranscriptBlock[]): PermissionRequest | null;
