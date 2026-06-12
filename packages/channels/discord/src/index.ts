export { DiscordChannel } from './DiscordAdapter.js';

import { DiscordChannel } from './DiscordAdapter.js';
import type { ChannelPlugin } from '@hopcode/channel-base';

export const plugin: ChannelPlugin = {
  channelType: 'discord',
  displayName: 'Discord',
  requiredConfigFields: ['token'],
  createChannel: (name, config, bridge, options) =>
    new DiscordChannel(name, config, bridge, options),
};
