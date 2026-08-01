import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { PlanCompletedIcon } from '@hoptrendy/webui';
/**
 * Returns true when the model is a non-runtime HopCode OAuth entry that has been
 * discontinued.  Runtime snapshots (prefixed with `$runtime|`) remain
 * selectable so users who already have a runtime model aren't blocked.
 */
function isDiscontinuedHopCodeOAuth(modelId) {
    return (modelId.includes('(hopcode-oauth)') && !modelId.startsWith('$runtime|'));
}
const DISCONTINUED_DESCRIPTION = 'Discontinued — switch to Coding Plan or API Key';
const DISCONTINUED_BLOCKED_MSG = 'HopCode OAuth free tier was discontinued on 2026-04-15';
export const ModelSelector = ({ visible, models, currentModelId, onSelectModel, onClose, }) => {
    const containerRef = useRef(null);
    const [selected, setSelected] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [blockedMessage, setBlockedMessage] = useState(null);
    // Reset selection when models change or when opened
    useEffect(() => {
        if (visible) {
            // Find current model index or default to 0
            const currentIndex = models.findIndex((m) => m.modelId === currentModelId);
            setSelected(currentIndex >= 0 ? currentIndex : 0);
            setMounted(true);
        }
        else {
            setMounted(false);
        }
    }, [visible, models, currentModelId]);
    // Handle clicking outside to close and keyboard navigation
    useEffect(() => {
        if (!visible) {
            return;
        }
        const handleClickOutside = (event) => {
            if (containerRef.current &&
                !containerRef.current.contains(event.target)) {
                onClose();
            }
        };
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setSelected((prev) => Math.min(prev + 1, models.length - 1));
                    setBlockedMessage(null);
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    setSelected((prev) => Math.max(prev - 1, 0));
                    setBlockedMessage(null);
                    break;
                case 'Enter':
                    // Prevent form submission AND stop propagation so the input form
                    // does not treat this Enter as a message send.
                    event.preventDefault();
                    event.stopPropagation();
                    if (models[selected]) {
                        if (isDiscontinuedHopCodeOAuth(models[selected].modelId)) {
                            setBlockedMessage(DISCONTINUED_BLOCKED_MSG);
                        }
                        else {
                            onSelectModel(models[selected].modelId);
                            onClose();
                        }
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    onClose();
                    break;
                default:
                    break;
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        // Use capture phase so Enter is handled before bubble-phase handlers
        // (e.g. the InputForm's Enter-to-submit) and stopPropagation can
        // prevent an empty user message.
        document.addEventListener('keydown', handleKeyDown, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [visible, models, selected, onSelectModel, onClose]);
    // Scroll selected item into view
    useEffect(() => {
        const selectedEl = containerRef.current?.querySelector(`[data-index="${selected}"]`);
        if (selectedEl) {
            selectedEl.scrollIntoView({ block: 'nearest' });
        }
    }, [selected]);
    const handleModelSelect = useCallback((modelId) => {
        if (isDiscontinuedHopCodeOAuth(modelId)) {
            setBlockedMessage(DISCONTINUED_BLOCKED_MSG);
            return;
        }
        onSelectModel(modelId);
        onClose();
    }, [onSelectModel, onClose]);
    const handleModelHover = useCallback((index, modelId) => {
        setSelected(index);
        if (!isDiscontinuedHopCodeOAuth(modelId)) {
            setBlockedMessage(null);
        }
    }, []);
    if (!visible) {
        return null;
    }
    return (_jsxs("div", { ref: containerRef, role: "menu", className: [
            'model-selector',
            // Positioning controlled by parent container
            'flex flex-col overflow-hidden',
            'rounded-large border bg-[var(--app-menu-background)]',
            'border-[var(--app-input-border)] max-h-[50vh] z-[1000]',
            // Mount animation
            mounted ? 'animate-completion-menu-enter' : '',
        ].join(' '), children: [_jsx("div", { className: "px-3 py-1.5 text-[var(--app-secondary-foreground)] text-[0.8em] uppercase tracking-wider", children: "Select a model" }), _jsx("div", { className: "flex max-h-[300px] flex-col overflow-y-auto p-[var(--app-list-padding)] pb-2", children: models.length === 0 ? (_jsx("div", { className: "px-3 py-4 text-center text-[var(--app-secondary-foreground)] text-sm", children: "No models available. Check console for details." })) : (models.map((model, index) => {
                    const isActive = index === selected;
                    const isCurrentModel = model.modelId === currentModelId;
                    const isDiscontinued = isDiscontinuedHopCodeOAuth(model.modelId);
                    const description = isDiscontinued
                        ? DISCONTINUED_DESCRIPTION
                        : model.description;
                    return (_jsx("div", { "data-index": index, "data-discontinued": isDiscontinued ? 'true' : undefined, role: "menuitem", "aria-disabled": isDiscontinued ? 'true' : undefined, onClick: () => handleModelSelect(model.modelId), onMouseOver: () => handleModelHover(index, model.modelId), className: [
                            'model-selector-item',
                            'mx-1 cursor-pointer rounded-[var(--app-list-border-radius)]',
                            'p-[var(--app-list-item-padding)]',
                            isActive ? 'bg-[var(--app-list-active-background)]' : '',
                            isDiscontinued ? 'opacity-60' : '',
                        ].join(' '), children: _jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("span", { className: [
                                                'block truncate',
                                                isActive
                                                    ? 'text-[var(--app-list-active-foreground)]'
                                                    : 'text-[var(--app-primary-foreground)]',
                                            ].join(' '), children: [model.name, isDiscontinued && (_jsx("span", { "data-testid": "discontinued-badge", className: "ml-1 text-[0.8em] text-[var(--app-secondary-foreground)]", children: "(Discontinued)" }))] }), description && (_jsx("span", { className: "block truncate text-[0.85em] text-[var(--app-secondary-foreground)] opacity-70", children: description }))] }), isCurrentModel && !isDiscontinued && (_jsx("span", { className: "flex-shrink-0 text-[var(--app-list-active-foreground)]", children: _jsx(PlanCompletedIcon, { size: 16 }) }))] }) }, model.modelId));
                })) }), blockedMessage && (_jsx("div", { "data-testid": "model-selector-blocked", className: "px-3 py-1.5 text-[0.85em] text-[var(--app-secondary-foreground)]", children: blockedMessage }))] }));
};
//# sourceMappingURL=ModelSelector.js.map