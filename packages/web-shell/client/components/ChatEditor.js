import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, memo, useImperativeHandle, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, } from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { DAEMON_APPROVAL_MODES } from '@hoptrendy/webui/daemon-react-sdk';
import { useI18n } from '../i18n';
import { useWebShellPortalRoot } from '../portalRoot';
import { useWebShellCustomization, } from '../customization';
import { useComposerCore, getComposerTagDisplay, getComposerTagLabel, getComposerTagValue, } from '../hooks/useComposerCore';
import { AtMentionPanel } from './AtMentionPanel';
import { cssUrlVar } from '../utils/cssUrlVar';
import { getComposerTagIconUrl, isBuiltinComposerTagIconUrl, } from '../utils/composerTag';
import { isSafeImageSrc } from './messages/Markdown';
import { ModeIcon } from './ModeIcon';
import { planSlashSectionRows } from '../utils/slashSectionPlan';
import { getModelDisplayName } from '../utils/modelDisplay';
import { VoiceButton } from '../voice/VoiceButton';
import { GitBranchChipContent, GitBranchIndicator } from './GitBranchIndicator';
import { WorkspaceIndicator } from './WorkspaceIndicator';
import { ChevronDownIcon, FolderClosedIcon } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, } from './ui/select';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger, } from './ui/popover';
import { Input } from './ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from './ui/tooltip';
import { filterToolbarDropdownItems, getToolbarExpansionBudget, getToolbarItemVisibilityWithHysteresis, resolveToolbarModelLabel, } from './toolbarDropdown';
import styles from './ChatEditor.module.css';
const ACTIVE_TOOLBAR_ACTIONS = [
    'approvalMode',
    'gitBranch',
    'model',
    'widthMode',
    'voice',
    'workspace',
];
const ACTIVE_TOOLBAR_ACTION_SET = new Set(ACTIVE_TOOLBAR_ACTIONS);
const CHAT_EDITOR_THEME = {
    '&': {
        fontSize: '14px',
        background: 'transparent',
        border: 'none',
    },
    '&.cm-focused': {
        outline: 'none',
    },
    '.cm-scroller': {
        maxHeight: 'var(--chat-editor-input-max-height, 300px)',
        overflowX: 'hidden',
        overflowY: 'auto',
    },
    '.cm-content': {
        padding: '0',
        fontFamily: 'var(--font-sans, system-ui, sans-serif)',
        color: 'var(--chat-editor-text-primary, #e0e0e0)',
        caretColor: 'var(--chat-editor-accent-color, #4a9eff)',
        fontSize: '14px',
        lineHeight: '1.6',
    },
    '.cm-line': {
        padding: '0',
    },
    '.cm-placeholder': {
        color: 'var(--chat-editor-text-dimmed, #666)',
    },
    '.cm-followup-ghost': {
        color: 'var(--chat-editor-text-dimmed, #666)',
        opacity: '0.72',
        pointerEvents: 'none',
        userSelect: 'none',
    },
    '.cm-selectionBackground, &.cm-focused .cm-selectionBackground': {
        backgroundColor: 'var(--chat-editor-selection-bg) !important',
    },
    '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
        backgroundColor: 'var(--chat-editor-selection-bg) !important',
    },
    '&.cm-focused .cm-content ::selection': {
        backgroundColor: 'var(--chat-editor-selection-bg)',
        color: 'var(--chat-editor-selection-color)',
    },
    '.cm-content ::selection': {
        backgroundColor: 'var(--chat-editor-selection-bg)',
        color: 'var(--chat-editor-selection-color)',
    },
    '.cm-cursor': {
        borderLeftColor: 'var(--chat-editor-accent-color, #4a9eff)',
        borderLeftWidth: '2px',
    },
};
function isTouchLikeDevice() {
    if (typeof window === 'undefined')
        return false;
    return ((typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) ||
        (typeof window.matchMedia === 'function' &&
            window.matchMedia('(hover: none), (pointer: coarse)').matches));
}
function TopComposerTag({ tag, content, tooltip, onActivate, onRemove, }) {
    const anchorRef = useRef(null);
    const portalRoot = useWebShellPortalRoot();
    const hasTooltip = tooltip !== undefined && tooltip !== null;
    const tagContent = (_jsx("span", { className: styles.tagContent, "data-web-shell-composer-tag-trigger": true, role: onActivate ? 'button' : undefined, tabIndex: onActivate || hasTooltip ? 0 : undefined, onClick: (event) => {
            if (!onActivate)
                return;
            event.stopPropagation();
            onActivate(anchorRef.current?.getBoundingClientRect() ??
                event.currentTarget.getBoundingClientRect());
        }, onKeyDown: (event) => {
            if (!onActivate)
                return;
            if (event.key !== 'Enter' && event.key !== ' ')
                return;
            event.preventDefault();
            onActivate(anchorRef.current?.getBoundingClientRect() ??
                event.currentTarget.getBoundingClientRect());
        }, children: content }));
    const tagElement = (_jsxs("span", { ref: anchorRef, className: styles.tag, "data-web-shell-composer-tag": true, children: [hasTooltip ? (_jsx(TooltipPrimitive.Trigger, { asChild: true, children: tagContent })) : (tagContent), onRemove && (_jsx("button", { type: "button", className: styles.tagRemove, "aria-label": `Remove ${getComposerTagDisplay(tag)}`, onMouseDown: (event) => event.preventDefault(), onClick: (event) => {
                    event.stopPropagation();
                    onRemove();
                }, onKeyDown: (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.stopPropagation();
                        return;
                    }
                    if (event.key !== 'Backspace' && event.key !== 'Delete')
                        return;
                    event.preventDefault();
                    event.stopPropagation();
                    onRemove();
                }, children: "\u00D7" }))] }));
    if (!hasTooltip)
        return tagElement;
    return (_jsxs(TooltipPrimitive.Root, { disableHoverableContent: false, children: [tagElement, _jsx(TooltipPrimitive.Portal, { container: portalRoot ?? undefined, children: _jsx(TooltipPrimitive.Content, { className: styles.tagTooltip, "data-web-shell-composer-tag-tooltip": true, sideOffset: 6, collisionPadding: 8, avoidCollisions: true, children: tooltip }) })] }));
}
function SendIcon() {
    return (_jsx("svg", { className: styles.sendIcon, viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg", "aria-hidden": "true", children: _jsx("path", { d: "M10 15.5v-11M5.5 9 10 4.5 14.5 9", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
function StopIcon() {
    return _jsx("span", { className: styles.stopIcon, "aria-hidden": "true" });
}
function LoadingIcon() {
    return _jsx("span", { className: styles.loadingIcon, "aria-hidden": "true" });
}
function QuickActionsIcon() {
    return (_jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: [7, 12, 17].flatMap((y) => [7, 12, 17].map((x) => (_jsx("circle", { cx: x, cy: y, r: "1.35", fill: "currentColor" }, `${x}-${y}`)))) }));
}
function attachComposerGlow(glowRootEl, inputEl) {
    let glowRaf;
    let pulseRaf;
    let pulseDecayTimer;
    let typingTimer;
    let glowCurrent = 0;
    let pulseCurrent = 0;
    const apply = (on, pulse) => {
        glowRootEl.style.setProperty('--dac-glow-on', on.toFixed(4));
        glowRootEl.style.setProperty('--dac-glow-pulse', pulse.toFixed(4));
    };
    const animateGlow = (target) => {
        if (glowRaf !== undefined)
            window.cancelAnimationFrame(glowRaf);
        const start = glowCurrent;
        const diff = target - start;
        if (Math.abs(diff) < 0.001) {
            glowCurrent = target;
            apply(target, pulseCurrent);
            return;
        }
        const t0 = performance.now();
        const tick = (now) => {
            const t = Math.min((now - t0) / 220, 1);
            glowCurrent = start + diff * (1 - (1 - t) ** 2);
            apply(glowCurrent, pulseCurrent);
            glowRaf = t < 1 ? window.requestAnimationFrame(tick) : undefined;
        };
        glowRaf = window.requestAnimationFrame(tick);
    };
    const animatePulseDecay = () => {
        if (pulseRaf !== undefined)
            window.cancelAnimationFrame(pulseRaf);
        const start = pulseCurrent;
        const t0 = performance.now();
        const tick = (now) => {
            const t = Math.min((now - t0) / 300, 1);
            pulseCurrent = start * (1 - t);
            apply(glowCurrent, pulseCurrent);
            pulseRaf = t < 1 ? window.requestAnimationFrame(tick) : undefined;
        };
        pulseRaf = window.requestAnimationFrame(tick);
    };
    const setTyping = (on) => {
        if (on)
            glowRootEl.setAttribute('data-dac-typing', '');
        else
            glowRootEl.removeAttribute('data-dac-typing');
    };
    const onFocus = () => animateGlow(1);
    const onBlur = () => {
        animateGlow(0);
        setTyping(false);
        if (typingTimer !== undefined)
            window.clearTimeout(typingTimer);
    };
    const onKeydown = () => {
        if (pulseRaf !== undefined)
            window.cancelAnimationFrame(pulseRaf);
        if (pulseDecayTimer !== undefined)
            window.clearTimeout(pulseDecayTimer);
        pulseCurrent = 1;
        apply(glowCurrent, 1);
        pulseDecayTimer = window.setTimeout(animatePulseDecay, 100);
        setTyping(true);
        if (typingTimer !== undefined)
            window.clearTimeout(typingTimer);
        typingTimer = window.setTimeout(() => setTyping(false), 650);
    };
    inputEl.addEventListener('focus', onFocus);
    inputEl.addEventListener('blur', onBlur);
    inputEl.addEventListener('keydown', onKeydown);
    if (document.activeElement === inputEl)
        animateGlow(1);
    return () => {
        if (glowRaf !== undefined)
            window.cancelAnimationFrame(glowRaf);
        if (pulseRaf !== undefined)
            window.cancelAnimationFrame(pulseRaf);
        if (pulseDecayTimer !== undefined)
            window.clearTimeout(pulseDecayTimer);
        if (typingTimer !== undefined)
            window.clearTimeout(typingTimer);
        inputEl.removeEventListener('focus', onFocus);
        inputEl.removeEventListener('blur', onBlur);
        inputEl.removeEventListener('keydown', onKeydown);
        apply(0, 0);
        setTyping(false);
    };
}
function WidthModeIcon({ mode }) {
    if (mode === 'wide') {
        return (_jsxs("svg", { viewBox: "0 0 1024 1024", "aria-hidden": "true", children: [_jsx("path", { d: "M550.012 486.537a8.16 8.16 0 0 1 8.17-8.17h305.36l-111.88-111.89c-3.19-3.19-3.19-8.4 0-11.59l25.08-25.08c3.19-3.19 8.4-3.19 11.59 0l168.61 168.6c3.19 3.19 3.19 8.4 0 11.59l-164.47 168.67c-3.19 3.19-8.4 3.19-11.59 0l-25.61-25.61c-3.19-3.19-3.19-8.4 0-11.59l106.58-110.78-303.62 0.11c-4.52 0-8.23-3.71-8.23-8.23v-36.03z", fill: "currentColor", transform: "translate(-483.41 0)" }), _jsx("path", { d: "M473.532 524.327a8.16 8.16 0 0 1-8.17 8.17h-305.36l111.88 111.88c3.19 3.19 3.19 8.4 0 11.59l-25.09 25.09c-3.19 3.19-8.4 3.19-11.59 0l-168.6-168.61c-3.19-3.19-3.19-8.4 0-11.59l164.47-168.67c3.19-3.19 8.4-3.19 11.59 0l25.61 25.61c3.19 3.19 3.19 8.4 0 11.59l-106.59 110.78 303.62-0.11c4.52 0 8.23 3.71 8.23 8.23v36.04z", fill: "currentColor", transform: "translate(483.41 0)" })] }));
    }
    return (_jsx("svg", { viewBox: "0 0 1024 1024", "aria-hidden": "true", children: _jsx("path", { d: "M473.532 524.327a8.16 8.16 0 0 1-8.17 8.17h-305.36l111.88 111.88c3.19 3.19 3.19 8.4 0 11.59l-25.09 25.09c-3.19 3.19-8.4 3.19-11.59 0l-168.6-168.61c-3.19-3.19-3.19-8.4 0-11.59l164.47-168.67c3.19-3.19 8.4-3.19 11.59 0l25.61 25.61c3.19 3.19 3.19 8.4 0 11.59l-106.59 110.78 303.62-0.11c4.52 0 8.23 3.71 8.23 8.23v36.04zM550.012 486.537a8.16 8.16 0 0 1 8.17-8.17h305.36l-111.88-111.89c-3.19-3.19-3.19-8.4 0-11.59l25.08-25.08c3.19-3.19 8.4-3.19 11.59 0l168.61 168.6c3.19 3.19 3.19 8.4 0 11.59l-164.47 168.67c-3.19 3.19-8.4 3.19-11.59 0l-25.61-25.61c-3.19-3.19-3.19-8.4 0-11.59l106.58-110.78-303.62 0.11c-4.52 0-8.23-3.71-8.23-8.23v-36.03z", fill: "currentColor" }) }));
}
function ModelIcon() {
    return (_jsxs("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", children: [_jsx("path", { d: "M12 3.5 19.4 7.8v8.4L12 20.5l-7.4-4.3V7.8L12 3.5Z", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinejoin: "round" }), _jsx("path", { d: "m8.2 9.7 3.8 2.2 3.8-2.2M12 11.9v4.4", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
function getQuickActionCommandName(action) {
    const text = action.action.type === 'run'
        ? action.action.command
        : action.action.type === 'insert'
            ? action.action.text
            : '';
    const match = text.trimStart().match(/^\/([^\s]+)/);
    return match?.[1] ?? null;
}
const QUICK_KEY_ITEMS = [
    {
        id: 'tab',
        label: 'Tab',
        descriptionKey: 'quickKeys.tab',
        event: { key: 'Tab', code: 'Tab' },
    },
    {
        id: 'escape',
        label: 'Esc',
        descriptionKey: 'quickKeys.escape',
        event: { key: 'Escape', code: 'Escape' },
    },
    {
        id: 'arrow-up',
        label: '↑',
        descriptionKey: 'quickKeys.history',
        event: { key: 'ArrowUp', code: 'ArrowUp' },
    },
    {
        id: 'arrow-down',
        label: '↓',
        descriptionKey: 'quickKeys.history',
        event: { key: 'ArrowDown', code: 'ArrowDown' },
    },
    {
        id: 'arrow-left',
        label: '←',
        descriptionKey: 'quickKeys.cursor',
        event: { key: 'ArrowLeft', code: 'ArrowLeft' },
    },
    {
        id: 'arrow-right',
        label: '→',
        descriptionKey: 'quickKeys.cursor',
        event: { key: 'ArrowRight', code: 'ArrowRight' },
    },
];
function CheckIcon() {
    return (_jsx("svg", { viewBox: "0 0 16 16", "aria-hidden": "true", children: _jsx("path", { d: "m3 8.3 3.1 3.1L13 4.6", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
function getModeLabel(modeId, t) {
    const labels = {
        plan: t('mode.label.plan'),
        default: t('mode.label.default'),
        'auto-edit': t('mode.label.auto-edit'),
        auto: t('mode.label.auto'),
        yolo: t('mode.label.yolo'),
    };
    return labels[modeId] ?? modeId;
}
function getModeListLabel(modeId, t) {
    const labels = {
        plan: t('mode.listLabel.plan'),
        default: t('mode.listLabel.default'),
        'auto-edit': t('mode.listLabel.auto-edit'),
        auto: t('mode.listLabel.auto'),
        yolo: t('mode.listLabel.yolo'),
    };
    return labels[modeId] ?? getModeLabel(modeId, t);
}
function ToolbarPopover({ open, items, activeId, onOpenChange, onSelect, trigger, tooltip, showCheck = false, searchable = false, searchLabel, noResultsLabel, }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [collisionBoundary, setCollisionBoundary] = useState(null);
    const selectionRef = useRef(false);
    const handoffRef = useRef(false);
    const triggerRef = useRef(null);
    const hasRichItems = items.some((item) => item.description || item.icon);
    const visibleItems = searchable
        ? filterToolbarDropdownItems(items, searchQuery)
        : items;
    useEffect(() => {
        if (!open) {
            setSearchQuery('');
        }
    }, [open]);
    const hasCheckItems = hasRichItems || showCheck;
    return (_jsxs(Popover, { open: open, onOpenChange: (nextOpen) => {
            if (nextOpen) {
                selectionRef.current = false;
                handoffRef.current = false;
                setCollisionBoundary(triggerRef.current?.closest('[data-web-shell-root]') ??
                    null);
            }
            onOpenChange(nextOpen);
        }, children: [tooltip ? (_jsx(TooltipProvider, { delayDuration: 300, children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(PopoverTrigger, { ref: triggerRef, asChild: true, children: trigger }) }), _jsx(TooltipContent, { side: "top", children: tooltip })] }) })) : (_jsx(PopoverTrigger, { ref: triggerRef, asChild: true, children: trigger })), _jsxs(PopoverContent, { side: "top", align: "start", collisionPadding: 8, collisionBoundary: collisionBoundary ?? undefined, "data-web-shell-toolbar-popover": true, onClick: (event) => event.stopPropagation(), onPointerDownOutside: (event) => {
                    const target = event.target;
                    if (target instanceof Element &&
                        target.closest('[data-web-shell-toolbar-popover-trigger]')) {
                        handoffRef.current = true;
                    }
                }, onCloseAutoFocus: (event) => {
                    if (handoffRef.current) {
                        event.preventDefault();
                        handoffRef.current = false;
                        return;
                    }
                    if (document.activeElement instanceof HTMLElement &&
                        document.activeElement.closest('[data-web-shell-toolbar-popover]')) {
                        event.preventDefault();
                        return;
                    }
                    if (!selectionRef.current)
                        return;
                    event.preventDefault();
                    selectionRef.current = false;
                }, children: [searchable && (_jsx(Input, { type: "search", value: searchQuery, "aria-label": searchLabel, placeholder: searchLabel, autoComplete: "off", onChange: (event) => setSearchQuery(event.target.value) })), _jsxs("div", { className: `${styles.dropdownList} ${hasRichItems
                            ? styles.dropdownRich
                            : showCheck
                                ? styles.dropdownCheck
                                : ''} ${searchable ? styles.dropdownListConstrained : ''}`, children: [visibleItems.map((item) => (_jsx("button", { type: "button", className: `${styles.dropdownItem} ${item.id === activeId ? styles.dropdownItemActive : ''}`, onClick: () => {
                                    selectionRef.current = true;
                                    onSelect(item.id);
                                }, children: hasCheckItems ? (_jsxs(_Fragment, { children: [hasRichItems && (_jsx("span", { className: styles.dropdownItemIcon, children: item.icon })), _jsxs("span", { className: styles.dropdownItemContent, children: [_jsx("span", { className: styles.dropdownItemLabel, children: item.label }), item.description && (_jsx("span", { className: styles.dropdownItemDesc, children: item.description }))] }), _jsx("span", { className: styles.dropdownItemCheck, children: item.id === activeId ? _jsx(CheckIcon, {}) : null })] })) : (item.label) }, item.id))), visibleItems.length === 0 && noResultsLabel && (_jsx("div", { className: styles.dropdownEmpty, role: "status", children: noResultsLabel(searchQuery) }))] })] })] }));
}
function SlashCommandPanel({ menu, anchorRef, panelRef, detailRef, onClose, onSelect, onAccept, }) {
    const itemRefs = useRef([]);
    const hoverAnchorRef = useRef(null);
    const [collisionBoundary, setCollisionBoundary] = useState(null);
    const [hoverDetail, setHoverDetail] = useState(null);
    useEffect(() => {
        itemRefs.current[menu.selectedIndex]?.scrollIntoView({
            block: 'nearest',
        });
    }, [menu.items, menu.selectedIndex]);
    useEffect(() => {
        setHoverDetail(null);
    }, [menu.items]);
    useLayoutEffect(() => {
        setCollisionBoundary(anchorRef.current?.closest('[data-web-shell-root]') ?? null);
    }, [anchorRef]);
    useEffect(() => {
        const preserveImeEscape = (event) => {
            if (event.key !== 'Escape' ||
                (!event.isComposing && event.keyCode !== 229)) {
                return;
            }
            Object.defineProperty(event, 'key', {
                configurable: true,
                value: 'Process',
            });
            window.addEventListener('keydown', (currentEvent) => {
                if (currentEvent === event)
                    Reflect.deleteProperty(event, 'key');
            }, { once: true });
        };
        window.addEventListener('keydown', preserveImeEscape, { capture: true });
        return () => {
            window.removeEventListener('keydown', preserveImeEscape, {
                capture: true,
            });
        };
    }, []);
    const rowPlans = planSlashSectionRows(menu.items, menu.kind);
    const maxLabelLength = Math.max(...menu.items.map((item) => Array.from(item.label).length), 0);
    const maxDetailLength = Math.max(...menu.items.map((item) => Array.from(item.detail ?? '').length), 0);
    const hasDetailColumn = maxDetailLength > 0;
    const panelStyle = {
        '--slash-command-col': `${Math.min(Math.max(maxLabelLength + 1, 10), 24)}ch`,
        '--slash-desc-col': hasDetailColumn
            ? `${Math.min(Math.max(maxDetailLength + 1, 18), 36)}ch`
            : '0px',
        '--slash-column-gap': hasDetailColumn ? '2ch' : '0px',
    };
    return (_jsxs(_Fragment, { children: [_jsxs(Popover, { open: true, onOpenChange: (open) => {
                    if (!open)
                        onClose();
                }, children: [_jsx(PopoverAnchor, { virtualRef: anchorRef }), _jsx(PopoverContent, { ref: panelRef, side: "top", align: "start", alignOffset: 16, sideOffset: 8, collisionPadding: 12, collisionBoundary: collisionBoundary ?? undefined, role: "listbox", "data-web-shell-slash-menu": true, style: panelStyle, onOpenAutoFocus: (event) => event.preventDefault(), onCloseAutoFocus: (event) => event.preventDefault(), onInteractOutside: (event) => {
                            const target = event.target;
                            if (target instanceof Node &&
                                (anchorRef.current?.contains(target) ||
                                    detailRef.current?.contains(target))) {
                                event.preventDefault();
                            }
                        }, onMouseDown: (event) => event.preventDefault(), onMouseLeave: (event) => {
                            const nextTarget = event.relatedTarget;
                            if (nextTarget instanceof Node &&
                                detailRef.current?.contains(nextTarget)) {
                                return;
                            }
                            setHoverDetail(null);
                        }, children: _jsx("div", { className: styles.slashPanel, children: _jsx("div", { className: styles.slashPanelBody, children: _jsx("div", { className: styles.slashList, onScroll: () => setHoverDetail(null), children: menu.items.map((item, index) => {
                                        const plan = rowPlans[index];
                                        return (_jsxs("div", { className: styles.slashEntry, children: [plan.showHeader && (_jsxs(_Fragment, { children: [plan.showDivider && (_jsx("div", { className: styles.slashSection })), _jsxs("div", { className: styles.slashSectionHeader, children: [_jsx("span", { children: item.section }), plan.count > 0 ? (_jsx("span", { className: styles.slashSectionCount, children: plan.count })) : null] })] })), _jsxs("button", { ref: (node) => {
                                                        itemRefs.current[index] = node;
                                                    }, type: "button", role: "option", "aria-selected": index === menu.selectedIndex, "data-has-description": item.detail ? '' : undefined, className: `${styles.slashItem} ${index === menu.selectedIndex
                                                        ? styles.slashItemActive
                                                        : ''}`, onMouseEnter: (event) => {
                                                        onSelect(index);
                                                        if (!item.detail) {
                                                            setHoverDetail(null);
                                                            return;
                                                        }
                                                        hoverAnchorRef.current = event.currentTarget;
                                                        setHoverDetail({
                                                            label: item.label,
                                                            detail: item.detail,
                                                        });
                                                    }, onMouseDown: (event) => {
                                                        event.preventDefault();
                                                        event.stopPropagation();
                                                        onAccept(index);
                                                    }, children: [_jsx("span", { className: styles.slashCommand, children: item.label }), item.detail && (_jsx("span", { className: styles.slashDescription, children: item.detail }))] })] }, `${item.id}:${index}`));
                                    }) }) }) }) })] }), _jsxs(Popover, { open: Boolean(hoverDetail), onOpenChange: (open) => {
                    if (!open)
                        setHoverDetail(null);
                }, children: [_jsx(PopoverAnchor, { virtualRef: hoverAnchorRef }), hoverDetail && (_jsx(PopoverContent, { ref: detailRef, side: "right", align: "start", sideOffset: 8, collisionPadding: 12, collisionBoundary: collisionBoundary ?? undefined, "data-web-shell-slash-detail": true, onOpenAutoFocus: (event) => event.preventDefault(), onCloseAutoFocus: (event) => event.preventDefault(), onMouseLeave: (event) => {
                            const nextTarget = event.relatedTarget;
                            if (nextTarget instanceof Node &&
                                panelRef.current?.contains(nextTarget)) {
                                return;
                            }
                            setHoverDetail(null);
                        }, children: _jsxs("div", { className: styles.slashDetail, children: [_jsx("div", { className: styles.slashDetailCommand, children: hoverDetail.label }), _jsx("div", { className: styles.slashDetailText, children: hoverDetail.detail })] }) }))] })] }));
}
function QuickActionsPanel({ actions, onRun, onPressKey, }) {
    const { t } = useI18n();
    return (_jsxs("div", { className: styles.quickActionsPanel, onMouseDown: (event) => event.stopPropagation(), onClick: (event) => event.stopPropagation(), children: [_jsx("div", { className: styles.quickActionsHeader, children: t('quickActions.title') }), _jsxs("div", { className: styles.quickActionsLayout, children: [_jsx("div", { className: styles.quickActionsGrid, children: actions.map((action) => (_jsx("button", { type: "button", className: styles.quickAction, onClick: () => onRun(action), children: _jsx("span", { className: styles.quickActionLabel, children: action.label }) }, action.id))) }), _jsx("div", { className: styles.quickKeysGrid, children: QUICK_KEY_ITEMS.map((item) => (_jsx("button", { type: "button", className: styles.quickKey, title: t(item.descriptionKey), onMouseDown: (event) => event.preventDefault(), onClick: () => onPressKey(item), children: _jsx("span", { className: styles.quickKeyLabel, children: item.label }) }, item.id))) })] })] }));
}
export const ChatEditor = memo(forwardRef(function ChatEditor(props, ref) {
    const { onSubmit, onInputTextChange, onCycleMode, onToggleShortcuts, onCancel, isRunning = false, isPreparing = false, cancelArmed = false, disabled = false, placeholderText = 'Type a message...', commands, skills = [], slashCommandCategoryOrder, queuedMessages = [], onPopQueuedMessages, currentMode = 'default', currentModel = '', gitBranch, gitStatus, onOpenGitDiff, workspaceName, workspaceTitle, workspaceColor, chatWidthMode = '1000', showChatWidthToggle = true, chatWidthToggleMin, visibleToolbarActions, availableModels = [], onSelectMode, onSelectModel, workspaces, selectedWorkspaceCwd, workspaceSelectionDisabled = false, onSelectWorkspace, atWorkspaceCwd, onChatWidthModeChange, onFocusFooter, dialogOpen = false, followupState, onAcceptFollowup, onDismissFollowup, sessionName, composerInput, composerInputVersion, builtinAtProviders, atProviders, composerTagIcons, } = props;
    const { renderComposerToolbarStart: ToolbarStart, renderComposerToolbarEnd: ToolbarEnd, renderComposerToolbarRight: ToolbarRight, renderComposerTag, renderComposerTagTooltip, onComposerTagClick, } = useWebShellCustomization();
    const core = useComposerCore({
        onSubmit,
        onInputTextChange,
        onCycleMode,
        onToggleShortcuts,
        disabled,
        placeholderText,
        commands,
        skills,
        slashCommandCategoryOrder,
        queuedMessages,
        onPopQueuedMessages,
        currentMode,
        onFocusFooter,
        dialogOpen,
        followupState,
        onAcceptFollowup,
        onDismissFollowup,
        sessionName,
        composerInput,
        composerInputVersion,
        builtinAtProviders,
        atProviders,
        atWorkspaceCwd,
        composerTagIcons,
        renderComposerTag,
        renderComposerTagTooltip,
        onComposerTagClick,
        editorTheme: CHAT_EDITOR_THEME,
    });
    const { t } = useI18n();
    useImperativeHandle(ref, () => core.handle, [core.handle]);
    const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
    const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
    const [quickActionsOpen, setQuickActionsOpen] = useState(false);
    const [workspaceTooltipOpen, setWorkspaceTooltipOpen] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(isTouchLikeDevice);
    const containerRef = useRef(null);
    const slashPanelRef = useRef(null);
    const slashDetailRef = useRef(null);
    const atPanelRef = useRef(null);
    const toolbarRef = useRef(null);
    const toolbarLeadingRef = useRef(null);
    const toolbarRightRef = useRef(null);
    const toolbarStartRef = useRef(null);
    const toolbarEndRef = useRef(null);
    const toolbarRightCustomRef = useRef(null);
    const toolbarMeasurementsRef = useRef(null);
    const workspaceSelectTriggerRef = useRef(null);
    const suppressWorkspaceTooltipRef = useRef(false);
    const workspaceSelectPointerInsideRef = useRef(false);
    const [widthToggleFits, setWidthToggleFits] = useState(false);
    const [toolbarLabelVisibility, setToolbarLabelVisibility] = useState({
        workspaceSelect: false,
        workspace: false,
        gitBranch: false,
        mode: false,
        model: false,
    });
    const [lastConfirmedModelLabel, setLastConfirmedModelLabel] = useState('');
    const slashMenu = core.slashMenu;
    const closeSlashMenu = core.closeSlashMenu;
    const atMenu = core.atMenu;
    const closeAtMenu = core.closeAtMenu;
    const hasSlashMenu = Boolean(slashMenu);
    const hasAtMenu = Boolean(atMenu);
    const editorViewRef = core.viewRef;
    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia)
            return;
        const media = window.matchMedia('(hover: none), (pointer: coarse)');
        const update = () => setShowQuickActions(isTouchLikeDevice());
        update();
        media.addEventListener('change', update);
        return () => media.removeEventListener('change', update);
    }, []);
    useEffect(() => {
        if (!showQuickActions)
            setQuickActionsOpen(false);
    }, [showQuickActions]);
    useEffect(() => {
        if (!hasSlashMenu && !hasAtMenu)
            return;
        const onPointerOutside = (event) => {
            const target = event.target;
            const container = containerRef.current;
            if (target instanceof Node &&
                container &&
                !container.contains(target) &&
                !slashPanelRef.current?.contains(target) &&
                !slashDetailRef.current?.contains(target) &&
                !atPanelRef.current?.contains(target)) {
                closeSlashMenu();
                closeAtMenu();
            }
        };
        window.addEventListener('mousedown', onPointerOutside);
        window.addEventListener('touchstart', onPointerOutside);
        return () => {
            window.removeEventListener('mousedown', onPointerOutside);
            window.removeEventListener('touchstart', onPointerOutside);
        };
    }, [hasAtMenu, hasSlashMenu, closeAtMenu, closeSlashMenu]);
    useEffect(() => {
        const glowRoot = containerRef.current;
        const inputEl = editorViewRef.current?.contentDOM;
        if (!glowRoot || !inputEl)
            return undefined;
        return attachComposerGlow(glowRoot, inputEl);
    }, [editorViewRef]);
    useEffect(() => {
        const container = containerRef.current;
        const minWidth = chatWidthToggleMin;
        if (!container || minWidth === undefined) {
            setWidthToggleFits(false);
            return;
        }
        const update = () => {
            setWidthToggleFits(container.getBoundingClientRect().width >= minWidth - 50);
        };
        update();
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(container);
        return () => resizeObserver.disconnect();
    }, [chatWidthToggleMin]);
    const modeItems = useMemo(() => DAEMON_APPROVAL_MODES.map((id) => ({
        id,
        label: getModeListLabel(id, t),
        description: t(`mode.desc.${id}`),
        icon: _jsx(ModeIcon, { mode: id }),
    })), [t]);
    const visibleActionSet = useMemo(() => {
        if (!visibleToolbarActions)
            return null;
        const activeActions = visibleToolbarActions.filter((action) => ACTIVE_TOOLBAR_ACTION_SET.has(action));
        return new Set(activeActions);
    }, [visibleToolbarActions]);
    const showToolbarAction = (action) => {
        if (!visibleActionSet)
            return true;
        return visibleActionSet.has(action);
    };
    const showModeAction = showToolbarAction('approvalMode');
    const showModelAction = showToolbarAction('model');
    const commandNames = useMemo(() => new Set(commands.map((command) => command.name.replace(/^\/+/, ''))), [commands]);
    const hasCommand = useCallback((name) => commandNames.has(name), [commandNames]);
    const quickActions = useMemo(() => [
        {
            id: 'new',
            label: t('quickActions.new'),
            action: { type: 'run', command: '/new' },
        },
        {
            id: 'resume',
            label: t('quickActions.resume'),
            action: { type: 'run', command: '/resume' },
        },
        {
            id: 'delete',
            label: t('quickActions.delete'),
            action: { type: 'run', command: '/delete' },
        },
        {
            id: 'branch',
            label: t('quickActions.branch'),
            action: { type: 'run', command: '/branch' },
        },
        {
            id: 'rewind',
            label: t('quickActions.rewind'),
            action: { type: 'run', command: '/rewind' },
        },
        {
            id: 'history-search',
            label: t('quickActions.historyQuestion'),
            action: {
                type: 'key',
                item: {
                    id: 'ctrl-r',
                    label: 'Ctrl+R',
                    descriptionKey: 'quickKeys.searchHistory',
                    event: { key: 'r', code: 'KeyR', ctrlKey: true },
                },
            },
        },
        {
            id: 'recap',
            label: t('quickActions.recap'),
            action: { type: 'run', command: '/recap' },
        },
        {
            id: 'stats',
            label: t('quickActions.stats'),
            action: { type: 'run', command: '/stats' },
        },
        {
            id: 'context',
            label: t('quickActions.context'),
            action: { type: 'run', command: '/context' },
        },
        {
            id: 'status',
            label: t('quickActions.status'),
            action: { type: 'run', command: '/status' },
        },
        {
            id: 'skills',
            label: t('quickActions.skills'),
            action: { type: 'run', command: '/skills detail' },
        },
        {
            id: 'tools',
            label: t('quickActions.tools'),
            action: { type: 'run', command: '/tools desc' },
        },
        {
            id: 'agents',
            label: t('quickActions.agents'),
            action: { type: 'run', command: '/agents' },
        },
        {
            id: 'mcp',
            label: t('quickActions.mcp'),
            action: { type: 'run', command: '/mcp' },
        },
        {
            id: 'memory',
            label: t('quickActions.memory'),
            action: { type: 'run', command: '/memory' },
        },
        {
            id: 'theme',
            label: t('quickActions.theme'),
            action: { type: 'run', command: '/theme' },
        },
        {
            id: 'shell',
            label: core.shellMode
                ? t('quickActions.exitShellMode')
                : t('quickActions.shellMode'),
            action: { type: 'shell' },
        },
        {
            id: 'goal',
            label: t('quickActions.setGoal'),
            action: { type: 'insert', text: '/goal ' },
        },
    ].filter((action) => {
        const commandName = getQuickActionCommandName(action);
        return !commandName || hasCommand(commandName);
    }), [core.shellMode, hasCommand, t]);
    const modelItems = useMemo(() => availableModels.map((m) => ({
        id: m.id,
        label: getModelDisplayName(m.label || m.id),
        searchText: `${m.label ?? ''}\n${m.id}`,
    })), [availableModels]);
    const handleModeSelect = useCallback((modeId) => {
        onSelectMode?.(modeId);
        setModeDropdownOpen(false);
        core.focus();
    }, [onSelectMode, core]);
    const handleModelSelect = useCallback((modelId) => {
        onSelectModel?.(modelId);
        setModelDropdownOpen(false);
        core.focus();
    }, [onSelectModel, core]);
    const dispatchComposerKey = useCallback((event) => {
        const view = core.viewRef.current;
        if (!view)
            return;
        view.focus();
        view.contentDOM.dispatchEvent(new KeyboardEvent('keydown', {
            ...event,
            bubbles: true,
            cancelable: true,
        }));
    }, [core]);
    const runQuickAction = useCallback((action) => {
        setQuickActionsOpen(false);
        setModeDropdownOpen(false);
        setModelDropdownOpen(false);
        core.closeSlashMenu();
        core.closeAtMenu();
        if (action.action.type === 'insert') {
            core.insertText(action.action.text, { mode: 'replace' });
            return;
        }
        if (action.action.type === 'shell') {
            core.toggleShellMode();
            return;
        }
        if (action.action.type === 'key') {
            dispatchComposerKey(action.action.item.event);
            return;
        }
        onSubmit(action.action.command);
    }, [core, dispatchComposerKey, onSubmit]);
    const pressQuickKey = useCallback((item) => {
        dispatchComposerKey(item.event);
        if (item.id === 'ctrl-r') {
            setQuickActionsOpen(false);
        }
    }, [dispatchComposerKey]);
    const { searchMode, searchQuery, searchMatches, searchActiveIndex, searchInputRef, searchUiRef, closeSearch, handleSearchKeyDown, handleSearchInput, handleSearchCompositionEnd, } = core.searchState;
    const renderComposerTagContent = (tag) => {
        const custom = renderComposerTag?.({
            tag,
            placement: 'composer',
            readonly: false,
        });
        if (custom !== undefined && custom !== null) {
            return custom;
        }
        const rawTagLabel = getComposerTagLabel(tag);
        const tagValue = getComposerTagValue(tag);
        const tagLabel = tag.kind ? '' : rawTagLabel;
        const iconUrl = tag.icon ?? getComposerTagIconUrl(tag.kind, composerTagIcons);
        const safeIconUrl = iconUrl &&
            (isBuiltinComposerTagIconUrl(iconUrl) || isSafeImageSrc(iconUrl))
            ? iconUrl
            : undefined;
        if (!tagLabel && !tagValue) {
            return _jsx("span", { className: styles.tagLabel, children: tag.id });
        }
        return (_jsxs(_Fragment, { children: [safeIconUrl && (_jsx("span", { className: styles.tagIcon, style: cssUrlVar('--composer-tag-icon-url', safeIconUrl), "aria-hidden": "true" })), tagLabel && _jsx("span", { className: styles.tagLabel, children: tagLabel }), tagValue && _jsx("span", { className: styles.tagValue, children: tagValue })] }));
    };
    // Mode display label
    const modeLabel = getModeLabel(currentMode, t);
    const currentModelLabel = currentModel
        ? (availableModels.find((model) => model.id === currentModel)?.label ??
            (currentModel.startsWith('hopcode-route:')
                ? ''
                : getModelDisplayName(currentModel)))
        : '';
    const { modelLabel, modelLabelReady } = resolveToolbarModelLabel({
        currentModelLabel,
        lastConfirmedModelLabel,
    });
    const selectedWorkspace = workspaces?.find((entry) => selectedWorkspaceCwd ? entry.cwd === selectedWorkspaceCwd : entry.primary);
    const selectedWorkspaceLabel = selectedWorkspace?.label ?? '';
    const workspaceSelectVisible = Boolean(workspaces && workspaces.length > 1 && onSelectWorkspace);
    const workspaceIndicatorVisible = Boolean(workspaceName && showToolbarAction('workspace'));
    const gitBranchVisible = Boolean(gitBranch && showToolbarAction('gitBranch'));
    useLayoutEffect(() => {
        if (currentModelLabel && currentModelLabel !== lastConfirmedModelLabel) {
            setLastConfirmedModelLabel(currentModelLabel);
        }
    }, [currentModelLabel, lastConfirmedModelLabel]);
    const showWorkspaceSelectLabel = toolbarLabelVisibility.workspaceSelect;
    const showWorkspaceLabel = toolbarLabelVisibility.workspace;
    const showGitBranchLabel = toolbarLabelVisibility.gitBranch;
    const showModeLabel = toolbarLabelVisibility.mode;
    const showModelLabel = toolbarLabelVisibility.model;
    const showCancelButton = isRunning && !core.hasContent;
    useLayoutEffect(() => {
        const toolbar = toolbarRef.current;
        const toolbarLeading = toolbarLeadingRef.current;
        const toolbarRight = toolbarRightRef.current;
        const measurements = toolbarMeasurementsRef.current;
        if (!toolbar || !toolbarLeading || !toolbarRight || !measurements) {
            return undefined;
        }
        const update = () => {
            const expansionWidth = (id) => {
                const collapsed = measurements.querySelector(`[data-toolbar-measure="${id}:collapsed"]`);
                const expanded = measurements.querySelector(`[data-toolbar-measure="${id}:expanded"]`);
                return Math.max(0, Math.ceil(expanded?.getBoundingClientRect().width ?? 0) -
                    Math.ceil(collapsed?.getBoundingClientRect().width ?? 0));
            };
            const items = [
                ...(workspaceSelectVisible
                    ? [
                        {
                            id: 'workspaceSelect',
                            expansionWidth: expansionWidth('workspaceSelect'),
                        },
                    ]
                    : []),
                ...(workspaceIndicatorVisible
                    ? [
                        {
                            id: 'workspace',
                            expansionWidth: expansionWidth('workspace'),
                        },
                    ]
                    : []),
                ...(gitBranchVisible
                    ? [
                        {
                            id: 'gitBranch',
                            expansionWidth: expansionWidth('gitBranch'),
                        },
                    ]
                    : []),
                ...(showModeAction
                    ? [
                        {
                            id: 'mode',
                            expansionWidth: expansionWidth('mode'),
                        },
                    ]
                    : []),
                ...(showModelAction
                    ? [
                        {
                            id: 'model',
                            expansionWidth: expansionWidth('model'),
                            ready: modelLabelReady,
                        },
                    ]
                    : []),
            ];
            const currentExpansionWidth = items.reduce((total, item) => total +
                (toolbarLabelVisibility[item.id]
                    ? item.expansionWidth
                    : 0), 0);
            const currentLeadingWidth = toolbarLeading.scrollWidth;
            const gap = Math.ceil(Number.parseFloat(getComputedStyle(toolbar).columnGap) || 0);
            const availableWidth = getToolbarExpansionBudget({
                toolbarWidth: Math.floor(toolbar.getBoundingClientRect().width),
                leadingWidth: currentLeadingWidth,
                rightWidth: Math.ceil(toolbarRight.getBoundingClientRect().width),
                currentExpansionWidth,
                gap,
            });
            const itemVisibility = getToolbarItemVisibilityWithHysteresis({
                availableWidth,
                items,
                currentVisibility: toolbarLabelVisibility,
                // Aggregate scrollWidth can differ from the sum of individually
                // rounded replicas by one pixel per item. Apply that slack only when
                // expanding so a collapsed/expanded pair cannot form a two-cycle.
                expansionMargin: items.length,
            });
            const next = {
                workspaceSelect: itemVisibility.workspaceSelect ?? false,
                workspace: itemVisibility.workspace ?? false,
                gitBranch: itemVisibility.gitBranch ?? false,
                mode: itemVisibility.mode ?? false,
                model: itemVisibility.model ?? false,
            };
            setToolbarLabelVisibility((current) => {
                const unchanged = Object.keys(next).every((key) => current[key] ===
                    next[key]);
                return unchanged ? current : next;
            });
        };
        update();
        const resizeObserver = new ResizeObserver(update);
        resizeObserver.observe(toolbar);
        resizeObserver.observe(toolbarLeading);
        resizeObserver.observe(toolbarRight);
        for (const child of measurements.children) {
            resizeObserver.observe(child);
        }
        const customToolbarRoots = [
            toolbarStartRef.current,
            toolbarEndRef.current,
            toolbarRightCustomRef.current,
        ].filter((element) => element !== null);
        const observeCustomToolbarContent = () => {
            for (const root of customToolbarRoots) {
                resizeObserver.observe(root);
                for (const child of root.children) {
                    resizeObserver.observe(child);
                }
            }
        };
        observeCustomToolbarContent();
        const mutationObserver = new MutationObserver(() => {
            observeCustomToolbarContent();
            update();
        });
        for (const root of customToolbarRoots) {
            mutationObserver.observe(root, {
                attributes: true,
                characterData: true,
                childList: true,
                subtree: true,
            });
        }
        return () => {
            mutationObserver.disconnect();
            resizeObserver.disconnect();
        };
    }, [
        ToolbarEnd,
        ToolbarRight,
        ToolbarStart,
        disabled,
        gitBranch,
        gitBranchVisible,
        isRunning,
        modelLabel,
        modelLabelReady,
        modeLabel,
        sessionName,
        showModelAction,
        showModeAction,
        toolbarLabelVisibility,
        workspaceIndicatorVisible,
        workspaceName,
        workspaceSelectVisible,
        selectedWorkspaceLabel,
    ]);
    return (_jsxs("div", { className: `${styles.editorShell} ${modeDropdownOpen || modelDropdownOpen
            ? styles.editorShellDropdownOpen
            : ''}`, "data-composer": true, "data-web-shell-composer": true, children: [_jsxs("div", { ref: containerRef, className: styles.container, "data-web-shell-composer-surface": true, "data-dac-glow": true, onClick: () => {
                    setModeDropdownOpen(false);
                    setModelDropdownOpen(false);
                    setQuickActionsOpen(false);
                    core.focus();
                }, children: [_jsx("div", { className: styles.dacAura, "aria-hidden": "true" }), _jsx("div", { className: styles.dacHalo, "aria-hidden": "true" }), searchMode && (_jsxs("div", { ref: searchUiRef, className: styles.searchPanel, onMouseDown: (event) => event.stopPropagation(), onClick: (event) => event.stopPropagation(), children: [_jsxs("div", { className: styles.searchBar, children: [_jsx("span", { className: styles.searchLabel, children: t('editor.searchLabel') }), _jsx("input", { ref: searchInputRef, className: styles.searchInput, value: searchQuery, onChange: handleSearchInput, onCompositionEnd: handleSearchCompositionEnd, onKeyDown: handleSearchKeyDown, placeholder: t('editor.searchPlaceholder') })] }), searchMatches.length > 0 && (_jsx("div", { className: styles.searchResults, children: searchMatches.map((match, matchIndex) => {
                                    return (_jsxs("button", { type: "button", className: `${styles.searchResult} ${matchIndex === searchActiveIndex
                                            ? styles.searchResultActive
                                            : ''}`, onMouseDown: (event) => {
                                            event.preventDefault();
                                            core.replaceEditorText(match);
                                            closeSearch(false);
                                        }, children: [_jsx("span", { className: styles.searchResultMarker, children: matchIndex === searchActiveIndex ? '›' : '' }), _jsx("span", { className: styles.searchResultText, children: match })] }, `${match}-${matchIndex}`));
                                }) })), searchMatches.length === 0 && (_jsx("div", { className: styles.searchEmpty, children: t('editor.noHistory') }))] })), _jsxs("div", { className: styles.content, children: [(core.composerTags.length > 0 || core.pastedImages.length > 0) && (_jsxs("div", { className: styles.attachments, "data-web-shell-composer-attachments": true, children: [core.composerTags.length > 0 && (_jsx(TooltipPrimitive.Provider, { delayDuration: 0, disableHoverableContent: false, children: _jsx("div", { className: styles.tags, children: core.composerTags.map((tag) => {
                                                const tagInfo = {
                                                    tag,
                                                    placement: 'composer',
                                                    readonly: false,
                                                };
                                                let tooltip;
                                                try {
                                                    tooltip = renderComposerTagTooltip?.(tagInfo);
                                                }
                                                catch (error) {
                                                    console.warn('[WebShell] composer tag tooltip render failed', error);
                                                }
                                                return (_jsx(TopComposerTag, { tag: tag, content: renderComposerTagContent(tag), tooltip: tooltip, onActivate: onComposerTagClick
                                                        ? (anchorRect) => onComposerTagClick({
                                                            ...tagInfo,
                                                            anchorRect,
                                                        })
                                                        : undefined, onRemove: tag.removable !== false
                                                        ? () => {
                                                            core.removeTopTag(tag.id);
                                                            core.viewRef.current?.focus();
                                                        }
                                                        : undefined }, tag.id));
                                            }) }) })), core.pastedImages.length > 0 && (_jsx("div", { className: styles.images, children: core.pastedImages.map((img, i) => (_jsxs("div", { className: styles.imageThumb, children: [_jsx("img", { src: `data:${img.media_type};base64,${img.data}`, alt: "" }), _jsx("button", { className: styles.imageRemove, onClick: (e) => {
                                                        e.stopPropagation();
                                                        core.removeImage(i);
                                                    }, children: "\u00D7" })] }, i))) }))] })), core.slashMenu && (_jsx(SlashCommandPanel, { menu: core.slashMenu, anchorRef: containerRef, panelRef: slashPanelRef, detailRef: slashDetailRef, onClose: core.closeSlashMenu, onSelect: core.selectSlashCompletion, onAccept: core.acceptSlashCompletion })), core.atMenu && (_jsx(AtMentionPanel, { menu: core.atMenu, anchorRef: containerRef, panelRef: atPanelRef, onSelect: core.selectAtCompletion, onAccept: core.acceptAtCompletion, onBack: () => {
                                    const result = core.backAtCategories();
                                    if (result === 'categories') {
                                        window.setTimeout(() => core.focus(), 0);
                                    }
                                    return Boolean(result);
                                }, onSearch: core.updateAtSearch, onSelectTab: core.selectAtTab })), _jsxs("div", { className: styles.editorArea, children: [core.shellMode && (_jsx("span", { className: styles.shellPrefix, "aria-hidden": "true", children: "!" })), _jsx("div", { ref: core.containerRef, "data-web-shell-composer-editor": true })] }), _jsxs("div", { ref: toolbarRef, className: styles.toolbar, children: [_jsxs("div", { ref: toolbarLeadingRef, className: styles.toolbarLeading, children: [ToolbarStart && (_jsx("div", { ref: toolbarStartRef, className: styles.toolbarStart, children: _jsx(ToolbarStart, { disabled: disabled, isRunning: isRunning, currentMode: currentMode, currentModel: currentModel, sessionName: sessionName }) })), _jsxs("div", { className: styles.toolbarLeft, children: [workspaceSelectVisible &&
                                                        workspaces &&
                                                        onSelectWorkspace && (_jsxs(Select, { value: selectedWorkspace?.id, disabled: workspaceSelectionDisabled, onValueChange: (value) => {
                                                            const nextWorkspace = workspaces.find((entry) => entry.id === value);
                                                            if (!nextWorkspace)
                                                                return;
                                                            onSelectWorkspace(nextWorkspace.primary
                                                                ? undefined
                                                                : nextWorkspace.cwd);
                                                            suppressWorkspaceTooltipRef.current = true;
                                                            setWorkspaceTooltipOpen(false);
                                                            requestAnimationFrame(() => {
                                                                workspaceSelectTriggerRef.current?.blur();
                                                            });
                                                        }, children: [_jsx(TooltipProvider, { delayDuration: 300, children: _jsxs(Tooltip, { open: workspaceTooltipOpen, onOpenChange: (open) => {
                                                                        if (open &&
                                                                            (suppressWorkspaceTooltipRef.current ||
                                                                                !workspaceSelectPointerInsideRef.current)) {
                                                                            return;
                                                                        }
                                                                        setWorkspaceTooltipOpen(open);
                                                                    }, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("span", { className: `${styles.workspaceSelectTooltipTrigger} ${showWorkspaceSelectLabel
                                                                                    ? ''
                                                                                    : styles.workspaceSelectTooltipTriggerCompact}`, onPointerEnter: () => {
                                                                                    workspaceSelectPointerInsideRef.current = true;
                                                                                }, onPointerLeave: () => {
                                                                                    workspaceSelectPointerInsideRef.current = false;
                                                                                    suppressWorkspaceTooltipRef.current = false;
                                                                                }, onBlur: () => {
                                                                                    if (!workspaceSelectPointerInsideRef.current) {
                                                                                        suppressWorkspaceTooltipRef.current = false;
                                                                                    }
                                                                                }, children: _jsxs(SelectTrigger, { ref: workspaceSelectTriggerRef, size: "sm", className: `${styles.toolBtn} ${styles.workspaceSelectTrigger} ${showWorkspaceSelectLabel
                                                                                        ? ''
                                                                                        : styles.workspaceSelectTriggerCompact}`, "aria-label": t('sidebar.workspaceSelectLabel'), children: [_jsx(FolderClosedIcon, { size: 16, strokeWidth: 1.2 }), _jsx(SelectValue, {})] }) }) }), _jsx(TooltipContent, { side: "top", children: selectedWorkspaceLabel })] }) }), _jsx(SelectContent, { position: "popper", align: "start", children: _jsx(SelectGroup, { children: workspaces.map((entry) => (_jsx(SelectItem, { value: entry.id, children: entry.label }, entry.id))) }) })] })), workspaceIndicatorVisible && workspaceName && (_jsx(WorkspaceIndicator, { name: workspaceName, title: workspaceTitle ?? workspaceName, color: workspaceColor, compact: !showWorkspaceLabel, ariaLabel: t('workspace.paneLabel', {
                                                            name: workspaceName,
                                                        }) })), gitBranchVisible && gitBranch && (_jsx(GitBranchIndicator, { branch: gitBranch, status: gitStatus, compact: !showGitBranchLabel, onOpenDiff: onOpenGitDiff })), showModeAction && (_jsx("div", { className: `${styles.dropdownWrapper} ${showModeLabel ? '' : styles.dropdownWrapperCompact}`, children: _jsx(ToolbarPopover, { open: modeDropdownOpen, items: modeItems, activeId: currentMode, onOpenChange: (open) => {
                                                                setModeDropdownOpen(open);
                                                                if (open)
                                                                    setModelDropdownOpen(false);
                                                            }, onSelect: handleModeSelect, tooltip: modeLabel, trigger: _jsxs("button", { className: `${styles.toolBtn} ${styles.modeToolBtn} ${showModeLabel ? '' : styles.toolBtnCompact}`, "data-web-shell-mode-button": true, "data-web-shell-toolbar-popover-trigger": true, onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    core.closeSlashMenu();
                                                                    core.closeAtMenu();
                                                                    setQuickActionsOpen(false);
                                                                }, "aria-label": t('status.mode'), children: [_jsx("span", { className: styles.toolBtnModeIcon, children: _jsx(ModeIcon, { mode: currentMode }) }), showModeLabel && (_jsx("span", { className: styles.toolBtnText, children: modeLabel })), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] }) }) })), showModelAction && (_jsx("div", { className: `${styles.dropdownWrapper} ${showModelLabel ? '' : styles.dropdownWrapperCompact}`, children: _jsx(ToolbarPopover, { open: modelDropdownOpen, items: modelItems, activeId: currentModel, onOpenChange: (open) => {
                                                                setModelDropdownOpen(open);
                                                                if (open)
                                                                    setModeDropdownOpen(false);
                                                            }, onSelect: handleModelSelect, tooltip: modelLabel, showCheck: true, searchable: true, searchLabel: t('common.search'), noResultsLabel: (query) => t('model.noMatch', { query }), trigger: _jsxs("button", { className: `${styles.toolBtn} ${styles.modelToolBtn} ${showModelLabel ? '' : styles.toolBtnCompact}`, "data-web-shell-model-button": true, "data-web-shell-toolbar-popover-trigger": true, onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    core.closeSlashMenu();
                                                                    core.closeAtMenu();
                                                                    setQuickActionsOpen(false);
                                                                }, "aria-label": t('model.select'), children: [_jsx("span", { className: styles.toolBtnModelIcon, children: _jsx(ModelIcon, {}) }), showModelLabel && (_jsx("span", { className: styles.toolBtnText, children: modelLabel })), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] }) }) })), ToolbarEnd && (_jsx("div", { ref: toolbarEndRef, className: styles.toolbarEnd, children: _jsx(ToolbarEnd, { disabled: disabled, isRunning: isRunning, currentMode: currentMode, currentModel: currentModel, sessionName: sessionName }) }))] })] }), _jsxs("div", { ref: toolbarRightRef, className: styles.toolbarRight, children: [showQuickActions && quickActions.length > 0 && (_jsx("button", { className: `${styles.toolBtn} ${styles.quickActionsBtn}`, onClick: (e) => {
                                                    e.stopPropagation();
                                                    core.closeSlashMenu();
                                                    core.closeAtMenu();
                                                    setModeDropdownOpen(false);
                                                    setModelDropdownOpen(false);
                                                    setQuickActionsOpen((value) => !value);
                                                }, "aria-expanded": quickActionsOpen, "aria-label": t('quickActions.open'), title: t('quickActions.open'), "data-tooltip": t('quickActions.open'), children: _jsx("span", { className: styles.toolBtnIcon, children: _jsx(QuickActionsIcon, {}) }) })), ToolbarRight && (_jsx("div", { ref: toolbarRightCustomRef, className: styles.toolbarRightCustom, children: _jsx(ToolbarRight, { disabled: disabled, isRunning: isRunning, currentMode: currentMode, currentModel: currentModel, sessionName: sessionName }) })), showChatWidthToggle &&
                                                widthToggleFits &&
                                                showToolbarAction('widthMode') && (_jsx("button", { className: `${styles.toolBtn} ${styles.widthModeBtn}`, onClick: (e) => {
                                                    e.stopPropagation();
                                                    onChatWidthModeChange?.(chatWidthMode === 'wide' ? '1000' : 'wide');
                                                }, disabled: !onChatWidthModeChange, "aria-label": chatWidthMode === 'wide'
                                                    ? t('settings.option.ui.chatWidth.1000')
                                                    : t('settings.option.ui.chatWidth.wide'), title: chatWidthMode === 'wide'
                                                    ? t('settings.option.ui.chatWidth.1000')
                                                    : t('settings.option.ui.chatWidth.wide'), "data-tooltip": chatWidthMode === 'wide'
                                                    ? t('settings.option.ui.chatWidth.1000')
                                                    : t('settings.option.ui.chatWidth.wide'), children: _jsx("span", { className: styles.toolBtnIcon, children: _jsx(WidthModeIcon, { mode: chatWidthMode }) }) })), showToolbarAction('voice') && (_jsx(VoiceButton, { disabled: disabled, onInsert: (text) => {
                                                    const existing = core.getText();
                                                    const sep = existing && !/\s$/.test(existing) ? ' ' : '';
                                                    core.insertText(`${sep}${text} `);
                                                    core.focus();
                                                } })), _jsx("button", { className: isPreparing || showCancelButton
                                                    ? `${styles.sendBtn} ${styles.sendBtnRunning}${cancelArmed ? ` ${styles.sendBtnArmed}` : ''}`
                                                    : styles.sendBtn, disabled: isPreparing
                                                    ? true
                                                    : showCancelButton
                                                        ? !onCancel
                                                        : core.disabled || !core.hasContent, "data-web-shell-composer-submit": true, onClick: (e) => {
                                                    e.stopPropagation();
                                                    if (isPreparing) {
                                                        return;
                                                    }
                                                    if (showCancelButton) {
                                                        onCancel?.();
                                                        return;
                                                    }
                                                    core.submitText();
                                                }, "aria-label": isPreparing
                                                    ? t('common.loading')
                                                    : showCancelButton
                                                        ? cancelArmed
                                                            ? t('stream.cancelArmed')
                                                            : t('stream.cancel')
                                                        : t('editor.send'), title: isRunning && cancelArmed
                                                    ? t('stream.cancelArmed')
                                                    : undefined, children: isPreparing ? (_jsx(LoadingIcon, {})) : showCancelButton ? (cancelArmed ? (_jsx("span", { className: styles.escLabel, "aria-hidden": "true", children: "Esc" })) : (_jsx(StopIcon, {}))) : (_jsx(SendIcon, {})) }), _jsx("span", { role: "status", "aria-live": "polite", className: styles.srOnly, children: isRunning && cancelArmed ? t('stream.cancelArmed') : '' })] })] }), _jsxs("div", { ref: toolbarMeasurementsRef, className: styles.toolbarMeasurements, "aria-hidden": "true", children: [workspaceSelectVisible && selectedWorkspace && (_jsxs(_Fragment, { children: [_jsxs("span", { "data-toolbar-measure": "workspaceSelect:collapsed", className: `${styles.toolBtn} ${styles.workspaceSelectTrigger} ${styles.workspaceSelectTriggerCompact}`, children: [_jsx(FolderClosedIcon, { size: 16, strokeWidth: 1.2 }), _jsx("span", { className: styles.toolBtnText, children: selectedWorkspaceLabel }), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] }), _jsxs("span", { "data-toolbar-measure": "workspaceSelect:expanded", className: `${styles.toolBtn} ${styles.workspaceSelectTrigger}`, children: [_jsx(FolderClosedIcon, { size: 16, strokeWidth: 1.2 }), _jsx("span", { className: styles.toolBtnText, children: selectedWorkspaceLabel }), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] })] })), workspaceIndicatorVisible && workspaceName && (_jsxs(_Fragment, { children: [_jsxs("span", { "data-toolbar-measure": "workspace:collapsed", className: `${styles.workspaceChip} ${styles.workspaceChipCompact}`, children: [_jsx("span", { className: styles.workspaceChipIcon }), _jsx("span", { className: styles.workspaceChipText, children: workspaceName })] }), _jsxs("span", { "data-toolbar-measure": "workspace:expanded", className: styles.workspaceChip, children: [_jsx("span", { className: styles.workspaceChipIcon }), _jsx("span", { className: styles.workspaceChipText, children: workspaceName })] })] })), gitBranchVisible && gitBranch && (_jsxs(_Fragment, { children: [_jsx("span", { "data-toolbar-measure": "gitBranch:collapsed", className: `${styles.gitBranchChip} ${styles.gitBranchChipCompact}`, children: _jsx(GitBranchChipContent, { branch: gitBranch, status: gitStatus, compact: true }) }), _jsx("span", { "data-toolbar-measure": "gitBranch:expanded", className: styles.gitBranchChip, children: _jsx(GitBranchChipContent, { branch: gitBranch, status: gitStatus, compact: false }) })] })), _jsxs("span", { "data-toolbar-measure": "mode:collapsed", className: `${styles.toolBtn} ${styles.modeToolBtn} ${styles.toolBtnCompact}`, children: [_jsx("span", { className: styles.toolBtnModeIcon, children: _jsx(ModeIcon, { mode: currentMode }) }), _jsx("span", { className: styles.toolBtnText, children: modeLabel }), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] }), _jsxs("span", { "data-toolbar-measure": "mode:expanded", className: `${styles.toolBtn} ${styles.modeToolBtn}`, children: [_jsx("span", { className: styles.toolBtnModeIcon, children: _jsx(ModeIcon, { mode: currentMode }) }), _jsx("span", { className: styles.toolBtnText, children: modeLabel }), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] }), _jsxs("span", { "data-toolbar-measure": "model:collapsed", className: `${styles.toolBtn} ${styles.modelToolBtn} ${styles.toolBtnCompact}`, children: [_jsx("span", { className: styles.toolBtnModelIcon, children: _jsx(ModelIcon, {}) }), _jsx("span", { className: styles.toolBtnText, children: modelLabel }), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] }), _jsxs("span", { "data-toolbar-measure": "model:expanded", className: `${styles.toolBtn} ${styles.modelToolBtn}`, children: [_jsx("span", { className: styles.toolBtnModelIcon, children: _jsx(ModelIcon, {}) }), _jsx("span", { className: styles.toolBtnText, children: modelLabel }), _jsx("span", { className: styles.toolBtnArrow, children: _jsx(ChevronDownIcon, {}) })] })] })] })] }), showQuickActions && quickActionsOpen && quickActions.length > 0 && (_jsx(QuickActionsPanel, { actions: quickActions, onRun: runQuickAction, onPressKey: pressQuickKey }))] }));
}));
//# sourceMappingURL=ChatEditor.js.map