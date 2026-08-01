import type { RpcServer } from '@craft-agent/server-core/transport';
import type { HandlerDeps } from './handler-deps';
export declare const GUI_HANDLED_CHANNELS: readonly [any, any, any];
/**
 * GUI handlers for the floating desktop-pet window. The renderer that hosts the
 * main UI toggles the window on/off (and reloads it on pet change); the pet
 * window itself toggles click-through as the cursor enters/leaves the pet.
 */
export declare function registerPetWindowGuiHandlers(server: RpcServer, deps: HandlerDeps): void;
