/**
 * SourceInfoPage
 *
 * Displays source details including connection info, authentication status,
 * documentation (guide.md), and metadata. View-only.
 */
import * as React from 'react';
interface SourceInfoPageProps {
    sourceSlug: string;
    workspaceId: string;
    /** Optional callback when source is deleted */
    onDelete?: () => void;
}
export default function SourceInfoPage({ sourceSlug, workspaceId, onDelete }: SourceInfoPageProps): React.JSX.Element;
export {};
