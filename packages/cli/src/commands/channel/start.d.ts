import type { CommandModule } from 'yargs';
export { resolveExtensionChannelEntrySpecifier } from './runtime.js';
export { resolveProxy } from './proxy.js';
export declare const startCommand: CommandModule<object, {
    name?: string;
}>;
