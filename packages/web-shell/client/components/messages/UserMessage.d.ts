import type { DaemonInputAnnotation } from '@hoptrendy/sdk/daemon';
interface UserMessageImage {
    data: string;
    mimeType: string;
}
interface UserMessageProps {
    content: string;
    images?: UserMessageImage[];
    inputAnnotations?: readonly DaemonInputAnnotation[];
    isLocateFlashing?: boolean;
}
export declare const UserMessage: import("react").MemoExoticComponent<({ content, images, inputAnnotations, isLocateFlashing, }: UserMessageProps) => import("react").JSX.Element>;
export {};
