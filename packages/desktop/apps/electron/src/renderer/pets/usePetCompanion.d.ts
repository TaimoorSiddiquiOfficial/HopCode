import { type PetDescriptor } from './registry';
export interface PetCompanion {
    pets: PetDescriptor[];
    selectedPet: PetDescriptor;
    selectedPetId: string;
    setSelectedPetId: (id: string) => void;
    petEnabled: boolean;
    setPetEnabled: (enabled: boolean) => void;
    petSettingsLoaded: boolean;
    petSize: number;
    setPetSize: (size: number) => void;
    refreshCustomPets: () => Promise<void>;
}
export declare function usePetCompanion(): PetCompanion;
