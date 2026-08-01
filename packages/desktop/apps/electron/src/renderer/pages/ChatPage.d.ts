/**
 * ChatPage
 *
 * Displays a single session's chat with a consistent PanelHeader.
 * Extracted from MainContentPanel for consistency with other pages.
 */
import * as React from 'react';
export interface ChatPageProps {
    sessionId: string;
}
declare const ChatPage: React.MemoExoticComponent<({ sessionId }: ChatPageProps) => React.JSX.Element>;
export default ChatPage;
