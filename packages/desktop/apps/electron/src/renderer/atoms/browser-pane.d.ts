/**
 * Browser Pane Atoms
 *
 * Jotai atoms for browser instance state in the renderer.
 * Synced from the main process via BROWSER_PANE_STATE_CHANGED IPC events.
 */
export declare const DEFAULT_DOCKED_BROWSER_INSTANCE_ID = "built-in-browser";
/** Map of all browser instances by ID */
export declare const browserInstancesMapAtom: any;
/** Derived: array of all browser instances (for iteration) */
export declare const browserInstancesAtom: any;
/** Derived: count of active browser instances */
export declare const browserInstanceCountAtom: any;
/** Currently active browser instance ID (selected/focused by user interactions) */
export declare const activeBrowserInstanceIdAtom: any;
/** Tombstones for instances removed from renderer state (guards against late out-of-order updates) */
export declare const removedBrowserInstanceIdsAtom: any;
/** Derived: currently active browser instance info */
export declare const activeBrowserInstanceAtom: any;
/** Update a single browser instance (from IPC state change event) */
export declare const updateBrowserInstanceAtom: any;
/** Remove a browser instance (when destroyed) */
export declare const removeBrowserInstanceAtom: any;
/** Set all browser instances at once (from list query) */
export declare const setBrowserInstancesAtom: any;
