import type { ComponentEntry, CategoryGroup } from './types';
export * from './types';
export declare const componentRegistry: ComponentEntry[];
export declare function getCategories(): CategoryGroup[];
export declare function getComponentById(id: string): ComponentEntry | undefined;
