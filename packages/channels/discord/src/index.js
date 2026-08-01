export { DiscordChannel } from './DiscordAdapter.js';
import { DiscordChannel } from './DiscordAdapter.js';
export const plugin = {
    channelType: 'discord',
    displayName: 'Discord',
    requiredConfigFields: ['token'],
    createChannel: (name, config, bridge, options) => new DiscordChannel(name, config, bridge, options),
};
//# sourceMappingURL=index.js.map