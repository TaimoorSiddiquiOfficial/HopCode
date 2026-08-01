/** On-disk manifest shape (`pet.json`). */
export interface PetManifest {
    id: string;
    displayName: string;
    description: string;
    spritesheetPath?: string;
}
/** A custom pet resolved for the renderer (spritesheet inlined as a data URL). */
export interface CustomPetEntry {
    id: string;
    displayName: string;
    description: string;
    spritesheetDataUrl: string;
}
/** Directory holding user-provided custom pets: ~/.hopcode/pets (matches ~/.hopcode/skills). */
export declare function getPetsDir(): string;
/**
 * Load every valid custom pet under `~/.hopcode/pets/`.
 * Malformed pets are skipped rather than throwing so one bad folder cannot
 * break the picker.
 */
export declare function loadCustomPets(): CustomPetEntry[];
