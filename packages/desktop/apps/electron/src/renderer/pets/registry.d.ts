/**
 * Built-in pet companions and custom-pet merging.
 *
 * Built-in spritesheets are bundled by Vite from `assets/pets/`. Custom pets
 * come from the main process (`loadCustomPets`) as base64 data URLs.
 */
import type { CustomPetEntry } from '@craft-agent/shared/config';
export interface PetDescriptor {
    id: string;
    displayName: string;
    description: string;
    /** URL or data URL usable directly as a CSS background-image. */
    spritesheetUrl: string;
    custom?: boolean;
}
export declare const DEFAULT_PET_ID = "hopcode";
export declare const BUILT_IN_PETS: PetDescriptor[];
/** Built-in pets followed by any custom pets (custom ids cannot shadow built-ins). */
export declare function mergeCustomPets(custom: CustomPetEntry[] | undefined): PetDescriptor[];
/** Resolve a pet by id, falling back to the default then the first available. */
export declare function resolvePet(id: string | undefined, pets?: PetDescriptor[]): PetDescriptor;
