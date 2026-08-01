import { type PetState } from '@/pets/pet-animation';
interface HopCodePetProps {
    /** URL or data URL of the 8x9 sprite atlas. */
    spritesheetUrl: string;
    state?: PetState;
    /** Rendered height in px; width derives from the cell aspect ratio. */
    size?: number;
    className?: string;
    /** Force a single static frame regardless of the OS motion preference. */
    staticFrame?: boolean;
}
/**
 * Renders one animated pet by stepping a sprite atlas via `background-position`.
 * A timeout chain (rather than CSS steps) lets each frame carry its own
 * duration and lets non-idle states settle back into the idle loop.
 */
export declare function HopCodePet({ spritesheetUrl, state, size, className, staticFrame, }: HopCodePetProps): import("react").JSX.Element;
export {};
