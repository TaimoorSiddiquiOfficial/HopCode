/**
 * Feishu media download helpers.
 *
 * Downloads images, files, audio, and video from Feishu using the
 * Open API: GET /im/v1/messages/:message_id/resources/:file_key
 */
export interface MediaFile {
    buffer: Buffer;
    mimeType: string;
}
/**
 * Download a media file from Feishu.
 *
 * @param messageId - The message ID containing the resource
 * @param fileKey - The file_key or image_key from the message content
 * @param resourceType - 'image' or 'file'
 * @param accessToken - A valid tenant access token
 * @returns MediaFile with buffer and mimeType, or null on failure
 */
export declare function downloadMedia(messageId: string, fileKey: string, resourceType: 'image' | 'file', accessToken: string): Promise<MediaFile | null>;
