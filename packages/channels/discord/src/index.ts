export { DiscordChannel } from './DiscordAdapter.js';

import { DiscordChannel } from './DiscordAdapter.js';
import type { ChannelPlugin } from '@hoptrendy/channel-base';

export const plugin: ChannelPlugin = {
  channelType: 'discord',
  displayName: 'Discord',
  requiredConfigFields: ['token'],
  createChannel: (name, config, bridge, options) =>
    new DiscordChannel(name, config, bridge, options),
};
