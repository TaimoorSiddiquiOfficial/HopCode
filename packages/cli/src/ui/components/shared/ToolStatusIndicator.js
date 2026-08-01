import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { ToolCallStatus } from '../../types.js';
import { HopCodeRespondingSpinner } from '../HopCodeRespondingSpinner.js';
import { TOOL_STATUS, SHELL_COMMAND_NAME, SHELL_NAME, } from '../../constants.js';
import { theme } from '../../semantic-colors.js';
// One column for the status glyph plus two trailing columns so the tool
// name never sits flush against the indicator. Paired with flexShrink={0}
// on the indicator Box so the reservation survives a tight header row.
export const STATUS_INDICATOR_WIDTH = 3;
export const ToolStatusIndicator = ({ status, name, }) => {
    const isShell = name === SHELL_COMMAND_NAME || name === SHELL_NAME;
    const statusColor = isShell ? theme.ui.symbol : theme.status.warning;
    return (_jsxs(Box, { minWidth: STATUS_INDICATOR_WIDTH, flexShrink: 0, children: [status === ToolCallStatus.Pending && (_jsx(Text, { color: theme.status.success, children: TOOL_STATUS.PENDING })), status === ToolCallStatus.Executing && (_jsx(HopCodeRespondingSpinner, { spinnerType: "toggle", nonRespondingDisplay: TOOL_STATUS.EXECUTING })), status === ToolCallStatus.Success && (_jsx(Text, { color: theme.status.success, "aria-label": 'Success:', children: TOOL_STATUS.SUCCESS })), status === ToolCallStatus.Confirming && (_jsx(Text, { color: statusColor, "aria-label": 'Confirming:', children: TOOL_STATUS.CONFIRMING })), status === ToolCallStatus.Canceled && (_jsx(Text, { color: statusColor, "aria-label": 'Canceled:', bold: true, children: TOOL_STATUS.CANCELED })), status === ToolCallStatus.Error && (_jsx(Text, { color: theme.status.error, "aria-label": 'Error:', bold: true, children: TOOL_STATUS.ERROR }))] }));
};
//# sourceMappingURL=ToolStatusIndicator.js.map