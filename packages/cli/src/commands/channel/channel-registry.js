const registry = new Map();
let builtinsPromise = null;
function ensureBuiltins() {
    if (!builtinsPromise) {
        builtinsPromise = (async () => {
            const labelled = [
                { name: 'telegram', promise: import('@hoptrendy/channel-telegram') },
                { name: 'weixin', promise: import('@hoptrendy/channel-weixin') },
                { name: 'dingtalk', promise: import('@hoptrendy/channel-dingtalk') },
                { name: 'wecom', promise: import('@hoptrendy/channel-wecom') },
                { name: 'feishu', promise: import('@hoptrendy/channel-feishu') },
                { name: 'qqbot', promise: import('@hoptrendy/channel-qqbot') },
            ];
            const results = await Promise.allSettled(labelled.map((l) => l.promise));
            for (let i = 0; i < results.length; i++) {
                const result = results[i];
                if (result.status === 'fulfilled') {
                    registry.set(result.value.plugin.channelType, result.value.plugin);
                }
                else {
                    process.stderr.write(`[channel-registry] Failed to load "${labelled[i].name}" channel: ${result.reason}\n`);
                }
            }
        })();
    }
    return builtinsPromise;
}
export function registerPlugin(plugin) {
    if (registry.has(plugin.channelType)) {
        throw new Error(`Channel type "${plugin.channelType}" is already registered.`);
    }
    registry.set(plugin.channelType, plugin);
}
export async function getPlugin(channelType) {
    await ensureBuiltins();
    return registry.get(channelType);
}
export async function supportedTypes() {
    await ensureBuiltins();
    return [...registry.keys()];
}
//# sourceMappingURL=channel-registry.js.map