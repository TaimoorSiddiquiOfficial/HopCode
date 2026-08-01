import { jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Text } from 'ink';
import { useConfig } from '../contexts/ConfigContext.js';
import { theme } from '../semantic-colors.js';
const POLL_INTERVAL_MS = 1000;
function getScheduledTaskCount(config) {
    if (!config?.isCronEnabled?.())
        return 0;
    return config.getCronScheduler?.()?.size ?? 0;
}
function useScheduledTaskCount(config) {
    const [count, setCount] = useState(() => getScheduledTaskCount(config));
    useEffect(() => {
        const id = setInterval(() => {
            setCount(getScheduledTaskCount(config));
        }, POLL_INTERVAL_MS);
        return () => clearInterval(id);
    }, [config]);
    return count;
}
export function useFooterCronTaskCount() {
    return useScheduledTaskCount(useConfig());
}
export const CronPill = ({ count }) => {
    if (count <= 0)
        return null;
    const noun = count === 1 ? 'scheduled task' : 'scheduled tasks';
    return (_jsxs(Text, { color: theme.text.accent, children: ["\u25CE ", count, " ", noun] }));
};
//# sourceMappingURL=CronPill.js.map