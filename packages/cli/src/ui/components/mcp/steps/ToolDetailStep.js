import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { Box, Text } from 'ink';
import { theme } from '../../../semantic-colors.js';
import { useKeypress } from '../../../hooks/useKeypress.js';
import { t } from '../../../../i18n/index.js';
/**
 * ??????
 */
const renderParameter = (name, param, isRequired) => {
    const type = param['type'] || 'any';
    const description = param['description'] || '';
    // const defaultValue = param['default'];
    // const enumValues = param['enum'] as string[] | undefined;
    const text = `� ${name}${isRequired ? t('required') : ''}: ${type} ${description ? `- ${description}` : ''}`;
    return (_jsx(Box, { children: _jsx(Text, { color: theme.text.secondary, wrap: "wrap", children: text }) }, name));
};
/**
 * ??????
 */
const ParametersList = ({ properties, required }) => {
    const requiredSet = new Set(required);
    return (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { color: theme.text.primary, bold: true, children: [t('Parameters'), ":"] }), _jsx(Box, { flexDirection: "column", marginLeft: 1, children: Object.entries(properties).map(([name, param]) => renderParameter(name, param, requiredSet.has(name))) })] }));
};
/**
 * ?????schema?????,?????????
 */
const SchemaSummary = ({ schema }) => {
    const obj = schema;
    const properties = obj['properties'];
    const required = obj['required'] || [];
    return (_jsx(Box, { flexDirection: "column", children: properties && Object.keys(properties).length > 0 && (_jsx(ParametersList, { properties: properties, required: required })) }));
};
export const ToolDetailStep = ({ tool, onBack, isActive = true, }) => {
    useKeypress((key) => {
        if (key.name === 'escape') {
            onBack();
        }
    }, { isActive });
    if (!tool) {
        return (_jsx(Box, { children: _jsx(Text, { color: theme.status.error, children: t('No tool selected') }) }));
    }
    return (_jsxs(Box, { flexDirection: "column", gap: 1, children: [!tool.isValid && (_jsxs(Box, { flexDirection: "column", marginBottom: 1, children: [_jsx(Text, { color: theme.status.error, bold: true, children: t('Warning: This tool cannot be called by the LLM') }), _jsxs(Text, { color: theme.status.error, children: [t('Reason'), ": ", tool.invalidReason || t('unknown')] }), _jsx(Text, { color: theme.text.secondary, children: t('Tools must have both name and description to be used by the LLM.') })] })), tool.description && (_jsxs(Box, { flexDirection: "column", children: [_jsxs(Text, { color: theme.text.primary, bold: true, children: [t('Description'), ":"] }), _jsx(Text, { wrap: "wrap", children: tool.description })] })), tool.schema && (_jsx(Box, { flexDirection: "column", children: _jsx(SchemaSummary, { schema: tool.schema }) }))] }));
};
//# sourceMappingURL=ToolDetailStep.js.map