import type { ImageProcessor } from '../runtime/platform';
export interface ImageResizeResult {
    /** Resized image buffer */
    buffer: Buffer;
    /** Output dimensions */
    width: number;
    height: number;
    /** Output format */
    format: 'png' | 'jpeg';
}
export type ImageBufferInspection = {
    status: 'ok';
    width: number;
    height: number;
} | {
    status: 'invalid_image';
    error?: Error;
} | {
    status: 'processor_unavailable';
    error?: Error;
};
/**
 * Inspect an uploaded image buffer and distinguish between invalid input and
 * unavailable image-processing support.
 */
export declare function inspectImageBuffer(buffer: Buffer, processor: ImageProcessor): Promise<ImageBufferInspection>;
export declare function setImageProcessor(proc: ImageProcessor): void;
/**
 * Get image dimensions from a buffer.
 * Returns { width, height } or null if the buffer is not a valid image.
 */
export declare function getImageSize(buffer: Buffer): Promise<{
    width: number;
    height: number;
} | null>;
/**
 * Resize an image buffer to fit within maxSize×maxSize, output as PNG.
 * Returns the resized PNG buffer, or undefined if the input is invalid.
 */
export declare function resizeIconBuffer(buffer: Buffer, targetSize: number): Promise<Buffer | undefined>;
/**
 * Resize and/or compress an image buffer to fit within agent attachment limits.
 *
 * Strategy:
 * 1. If dimensions exceed OPTIMAL_EDGE (1568px), resize down
 * 2. Output as PNG (or JPEG if isPhoto)
 * 3. If still over maxSizeBytes, try JPEG at 90 quality
 * 4. If still over, try JPEG at 75 quality
 * 5. If still over, return null (can't fix)
 *
 * @returns Resized image data, or null if image can't be made small enough
 */
export declare function resizeImageForAPI(buffer: Buffer, options?: {
    /** Max output size in bytes. Default: IMAGE_LIMITS.MAX_SIZE (5MB) */
    maxSizeBytes?: number;
    /** Prefer JPEG output (for photos). Default: false */
    isPhoto?: boolean;
}): Promise<ImageResizeResult | null>;
