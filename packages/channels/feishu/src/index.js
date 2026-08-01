export { FeishuChannel } from './FeishuAdapter.js';
export { downloadMedia } from './media.js';
import { FeishuChannel } from './FeishuAdapter.js';
export const plugin = {
    channelType: 'feishu',
    displayName: 'Feishu',
    requiredConfigFields: ['clientId', 'clientSecret'],
    createChannel: (name, config, bridge, options) => new FeishuChannel(name, config, bridge, options),
};
//# sourceMappingURL=index.js.map