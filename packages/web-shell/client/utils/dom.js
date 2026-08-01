export function isEditableTarget(target) {
    if (!(target instanceof HTMLElement))
        return false;
    if (target.isContentEditable)
        return true;
    return !!target.closest('input, textarea, select, [contenteditable="true"], .cm-editor, [data-keyboard-scope]');
}
//# sourceMappingURL=dom.js.map