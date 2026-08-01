/**
 * SessionUpload - File upload component for session JSON files
 *
 * Supports:
 * - Click to browse files
 * - Drag and drop
 * - Paste from clipboard
 */
import * as React from 'react';
import type { StoredSession } from '@craft-agent/core';
interface SessionUploadProps {
    onSessionLoad: (session: StoredSession) => void;
}
export declare function SessionUpload({ onSessionLoad }: SessionUploadProps): React.JSX.Element;
export {};
