import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useI18n } from '../i18n';
import styles from './ToastHost.module.css';
export function ToastHost({ toasts, onDismiss, autoDismissMs = 5000, }) {
    if (toasts.length === 0)
        return null;
    return (_jsx("div", { className: styles.host, role: "status", "aria-live": "polite", "data-web-shell-toast-host": true, children: toasts.map((toast) => (_jsx(ToastItem, { toast: toast, onDismiss: onDismiss, autoDismissMs: autoDismissMs }, toast.id))) }));
}
function ToastItem({ toast, onDismiss, autoDismissMs, }) {
    const { t } = useI18n();
    useEffect(() => {
        const timer = window.setTimeout(() => onDismiss(toast.id), autoDismissMs);
        return () => window.clearTimeout(timer);
    }, [autoDismissMs, onDismiss, toast.id]);
    return (_jsxs("div", { className: `${styles.toast} ${styles[toast.tone]}`, "data-web-shell-toast": true, "data-tone": toast.tone, children: [_jsx("div", { className: styles.message, children: toast.message }), _jsx("button", { type: "button", className: styles.close, onClick: () => onDismiss(toast.id), "aria-label": t('toast.dismiss'), title: t('toast.dismissShort'), children: "x" })] }));
}
//# sourceMappingURL=ToastHost.js.map