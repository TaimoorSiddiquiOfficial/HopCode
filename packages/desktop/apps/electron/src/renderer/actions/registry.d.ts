import React from 'react';
import { actions, type ActionId } from './definitions';
import type { ActionHandler } from './types';
interface ActionRegistryContextType {
    register: (handler: ActionHandler) => () => void;
    execute: (actionId: ActionId) => void;
    getHotkey: (actionId: ActionId) => string | null;
    getHotkeyDisplay: (actionId: ActionId) => string | null;
    getAction: (actionId: ActionId) => typeof actions[ActionId];
    userOverrides: Map<ActionId, string | null>;
}
export declare function ActionRegistryProvider({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
export declare function useActionRegistry(): ActionRegistryContextType;
export {};
