/**
 * Automations Atom
 *
 * Simple atom for storing parsed workspace automations.
 * AppShell populates this when automations.json is loaded from the workspace root.
 * MainContentPanel reads from it for automation detail display.
 */
/**
 * Atom to store the current workspace's parsed automations.
 * AppShell loads automations.json, parses via parseAutomationsConfig(), and sets this atom.
 */
export declare const automationsAtom: any;
