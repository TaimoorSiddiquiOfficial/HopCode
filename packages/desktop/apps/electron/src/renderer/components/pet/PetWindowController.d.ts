/**
 * Headless. Mirrors the pet's enabled state + current selection into the
 * separate always-on-top desktop window owned by the main process. Re-runs on
 * selection change so the main process can reload the window with the new pet.
 */
export declare function PetWindowController(): null;
