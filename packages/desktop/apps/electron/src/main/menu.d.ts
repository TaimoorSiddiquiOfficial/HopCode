import type { WindowManager } from './window-manager';
import type { EventSink } from '@craft-agent/server-core/transport';
type ClientResolver = (webContentsId: number) => string | undefined;
/**
 * Creates and sets the application menu for macOS.
 * Includes only relevant items for the HopCode app.
 *
 * Call rebuildMenu() when shared menu state changes.
 */
export declare function createApplicationMenu(windowManager: WindowManager, sink?: EventSink, resolver?: ClientResolver): void;
/**
 * Set the event sink and client resolver after server creation.
 * Called separately from createApplicationMenu since the server may not exist at menu init time.
 */
export declare function setMenuEventSink(sink: EventSink, resolver: ClientResolver): void;
/**
 * Rebuilds the application menu.
 *
 * On Windows/Linux: Menu is hidden - all functionality is in the Craft logo menu.
 * On macOS: Native menu is required by Apple guidelines, so we keep it synced.
 */
export declare function rebuildMenu(): Promise<void>;
export {};
