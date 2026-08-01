export { WeComChannel } from './WeComAdapter.js';
import { WeComChannel } from './WeComAdapter.js';
export const plugin = {
    channelType: 'wecom',
    displayName: 'WeCom',
    requiredConfigFields: ['botId', 'secret'],
    envResolvableConfigFields: ['wsUrl'],
    createChannel: (name, config, bridge, options) => new WeComChannel(name, config, bridge, options),
};
//# sourceMappingURL=index.js.map