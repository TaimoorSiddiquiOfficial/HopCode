export { WeComChannel } from './WeComAdapter.js';

import { WeComChannel } from './WeComAdapter.js';
import type { ChannelPlugin } from '@hoptrendy/channel-base';

export const plugin: ChannelPlugin = {
  channelType: 'wecom',
  displayName: 'WeCom',
  requiredConfigFields: ['botId', 'secret'],
  envResolvableConfigFields: ['wsUrl'],
  createChannel: (name, config, bridge, options) =>
    new WeComChannel(name, config, bridge, options),
};
