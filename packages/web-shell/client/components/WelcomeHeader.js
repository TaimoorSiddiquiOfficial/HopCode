import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { useI18n } from '../i18n';
import styles from './WelcomeHeader.module.css';
const TIPS_EN = [
    'Type / to open commands; Tab completes slash commands and saved prompts.',
    'Add a HOPCODE.md file to give HopCode durable project context.',
    'Use ! to run shell commands through HopCode, for example !ls.',
    'When a chat gets long, use /compress to free context.',
    'Use Shift+Tab or /approval-mode to switch approval modes quickly.',
    'Use /clear or /new to start fresh; previous sessions stay resumable.',
];
const TIPS_ZH = [
    '输入 / 打开命令弹窗；Tab 可以补全斜杠命令和已保存的 prompt。',
    '添加 HOPCODE.md 文件，为 HopCode 提供持久的项目上下文。',
    '可以使用 ! 从 HopCode 运行 shell 命令，例如 !ls。',
    '对话变长时，使用 /compress 压缩历史并释放上下文。',
    '使用 Shift+Tab 或 /approval-mode 快速切换权限模式。',
    '使用 /clear 或 /new 开始新想法；之前的会话仍可从历史恢复。',
];
const ASCII_LOGO = `
 ▄▄▄▄▄▄  ▄▄     ▄▄ ▄▄▄▄▄▄▄ ▄▄▄    ▄▄
██╔═══██╗██║    ██║██╔════╝████╗  ██║
██║   ██║██║ █╗ ██║█████╗  ██╔██╗ ██║
██║▄▄ ██║██║███╗██║██╔══╝  ██║╚██╗██║
╚██████╔╝╚███╔███╔╝███████╗██║ ╚████║
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═══╝
`.trim();
function pickTip(language) {
    const tips = language === 'zh-CN' ? TIPS_ZH : TIPS_EN;
    return tips[Math.floor(Math.random() * tips.length)];
}
function shortenPath(path, maxLength = 72) {
    if (!path || path.length <= maxLength) {
        return path;
    }
    const headLength = Math.max(12, Math.floor((maxLength - 3) * 0.38));
    const tailLength = Math.max(18, maxLength - headLength - 3);
    return `${path.slice(0, headLength)}...${path.slice(-tailLength)}`;
}
function formatMode(mode, t) {
    switch (mode) {
        case 'plan':
            return t('mode.plan');
        case 'auto-edit':
            return t('mode.auto-edit');
        case 'izn':
            return t('mode.izn');
        case 'default':
            return t('mode.default');
        default:
            return mode || t('mode.unknown');
    }
}
export function WelcomeHeader({ version, cwd, currentModel, currentMode, hideTips = false, }) {
    const { language, t } = useI18n();
    const tip = useMemo(() => pickTip(language), [language]);
    const displayPath = useMemo(() => shortenPath(cwd), [cwd]);
    const model = currentModel || t('welcome.defaultModel');
    const mode = formatMode(currentMode, t);
    return (_jsxs("div", { className: styles.header, children: [_jsxs("div", { className: styles.banner, children: [_jsx("pre", { className: styles.logo, "aria-hidden": "true", children: ASCII_LOGO }), _jsxs("div", { className: styles.panel, children: [_jsxs("div", { className: styles.titleRow, children: [_jsx("span", { className: styles.title, children: '>_ HopCode' }), version && _jsxs("span", { className: styles.version, children: ["(v", version, ")"] })] }), _jsx("div", { className: styles.subtitle, "aria-hidden": "true", children: "\u00A0" }), _jsxs("div", { className: styles.metaLine, children: [_jsx("span", { className: styles.terminalLabel, children: "Web terminal" }), _jsx("span", { className: styles.sep, children: "|" }), _jsx("span", { className: styles.model, children: model }), _jsx("span", { className: styles.modelHint, children: t('welcome.changeModel') })] }), _jsxs("div", { className: styles.metaLine, children: [_jsx("span", { children: mode }), _jsx("span", { className: styles.modelHint, children: t('welcome.modeHint') })] }), displayPath && (_jsx("div", { className: styles.cwd, title: cwd, children: displayPath }))] })] }), !hideTips && (_jsxs("div", { className: styles.tip, children: [_jsx("span", { className: styles.tipLabel, children: t('welcome.tipLabel') }), _jsx("span", { className: styles.tipText, children: tip })] }))] }));
}
//# sourceMappingURL=WelcomeHeader.js.map