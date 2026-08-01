import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import deleteIconUrl from '../assets/icons/delete.svg';
import editIconUrl from '../assets/icons/edit.svg';
import insertIconUrl from '../assets/icons/insert.svg';
import queueIconUrl from '../assets/icons/queue.svg';
import { cssUrlVar } from '../utils/cssUrlVar';
import { isCommandPrompt } from '../utils/localCommandQueue';
import styles from '../App.module.css';
const MAX_QUEUED_PROMPT_PREVIEW_CHARS = 240;
export function QueuedPromptDisplay({ prompts, t, onDelete, onInsert, onEdit, }) {
    if (prompts.length === 0)
        return null;
    return (_jsxs("div", { className: styles.queuedPrompts, children: [prompts.map((prompt) => {
                const normalizedPreview = prompt.text.replace(/\s+/g, ' ').trim();
                const preview = normalizedPreview.length > MAX_QUEUED_PROMPT_PREVIEW_CHARS
                    ? `${normalizedPreview.slice(0, MAX_QUEUED_PROMPT_PREVIEW_CHARS)}...`
                    : normalizedPreview;
                const imageCount = prompt.images?.length ?? 0;
                const isCommand = isCommandPrompt(prompt.text);
                const isSubmitting = prompt.serverState === 'submitting';
                const isRunning = prompt.serverState === 'running';
                const isRemoving = prompt.isRemoving === true;
                const isBusy = isSubmitting || isRunning || prompt.isEditing === true || isRemoving;
                let insertTitle = t('queue.insertTip');
                if (isBusy) {
                    insertTitle = t('queue.submittingDisabled');
                }
                else if (isCommand) {
                    insertTitle = t('queue.insertCommandDisabled');
                }
                let editTitle = t('queue.editTip');
                if (isBusy) {
                    editTitle = t('queue.submittingDisabled');
                }
                const deleteTitle = isBusy
                    ? t('queue.submittingDisabled')
                    : t('queue.deleteTip');
                return (_jsxs("div", { className: styles.queuedPrompt, children: [_jsx("span", { className: styles.queuedPromptIcon, "aria-hidden": "true", children: _jsx("span", { className: styles.queuedPromptMaskIcon, style: cssUrlVar('--queued-icon-url', queueIconUrl) }) }), _jsxs("span", { className: styles.queuedPromptText, children: [preview, imageCount > 0
                                    ? ` ${t('queue.imageCount', { count: imageCount })}`
                                    : '', isSubmitting || prompt.isEditing || isRemoving ? (_jsxs("span", { className: styles.queuedPromptState, children: [_jsx("span", { className: styles.queuedPromptSpinner }), isRemoving
                                            ? t('queue.removing')
                                            : prompt.isEditing
                                                ? t('queue.editing')
                                                : t('queue.submitting')] })) : null] }), _jsxs("span", { className: styles.queuedPromptActions, children: [imageCount === 0 && (_jsxs("button", { type: "button", className: styles.queuedPromptAction, onClick: () => onInsert(prompt.id), disabled: isCommand || isBusy, title: insertTitle, children: [_jsx("span", { className: styles.queuedPromptActionIcon, style: cssUrlVar('--queued-icon-url', insertIconUrl), "aria-hidden": "true" }), t('queue.insert')] })), _jsx("button", { type: "button", className: styles.queuedPromptAction, onClick: () => onDelete(prompt.id), disabled: isBusy, "aria-label": t('queue.delete'), title: deleteTitle, children: _jsx("span", { className: styles.queuedPromptActionIcon, style: cssUrlVar('--queued-icon-url', deleteIconUrl), "aria-hidden": "true" }) }), _jsx("button", { type: "button", className: styles.queuedPromptAction, onClick: () => onEdit(prompt.id), disabled: isBusy, "aria-label": t('queue.edit'), title: editTitle, children: _jsx("span", { className: styles.queuedPromptActionIcon, style: cssUrlVar('--queued-icon-url', editIconUrl), "aria-hidden": "true" }) })] })] }, prompt.id));
            }), _jsx("div", { className: styles.queuedHint, children: t('queue.footer') })] }));
}
//# sourceMappingURL=QueuedPromptDisplay.js.map