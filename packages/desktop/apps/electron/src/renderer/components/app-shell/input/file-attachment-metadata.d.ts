import type { FileAttachment } from '../../../../shared/types';
export declare function inferFileAttachmentMetadata(fileName: string, rawMimeType: string): Pick<FileAttachment, 'type' | 'mimeType'>;
