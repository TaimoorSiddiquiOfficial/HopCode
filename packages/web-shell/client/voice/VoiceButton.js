import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useWorkspace } from '@hoptrendy/webui/daemon-react-sdk';
import { useI18n } from '../i18n';
import { useVoiceCapture } from './useVoiceCapture';
import styles from './VoiceButton.module.css';
/** Daemon capability tag gating the mic (see serve/capabilities.ts). */
const VOICE_FEATURE = 'voice_transcribe';
/** Live waveform bar count in the recording pill. */
const BAR_COUNT = 16;
const MicIcon = () => (_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "currentColor", children: [_jsx("path", { d: "M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" }), _jsx("path", { d: "M17 11a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2Z" })] }));
const StopIcon = () => (_jsx("svg", { width: "13", height: "13", viewBox: "0 0 24 24", "aria-hidden": "true", fill: "currentColor", children: _jsx("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }) }));
function formatElapsed(ms) {
    const total = Math.floor(ms / 1000);
    const mm = Math.floor(total / 60);
    const ss = String(total % 60).padStart(2, '0');
    return `${mm}:${ss}`;
}
export function VoiceButton({ onInsert, disabled, }) {
    const workspace = useWorkspace();
    const { t } = useI18n();
    const features = workspace.capabilities?.features ?? [];
    // Surfaced when a recording finalizes with no transcript (e.g. silence).
    const [noticeMessage, setNoticeMessage] = useState(undefined);
    const { status, interimText, audioLevel, errorMessage, start, stop, abort } = useVoiceCapture({
        baseUrl: workspace.baseUrl,
        token: workspace.token,
        onFinal: (text) => {
            const trimmed = text.trim();
            if (trimmed) {
                setNoticeMessage(undefined);
                onInsert(trimmed);
            }
            else {
                setNoticeMessage(t('voice.noSpeech'));
            }
        },
    });
    const isRecording = status === 'recording';
    // Rolling waveform history, fed by the live RMS meter while recording.
    const [levels, setLevels] = useState(() => new Array(BAR_COUNT).fill(0));
    useEffect(() => {
        if (!isRecording) {
            setLevels(new Array(BAR_COUNT).fill(0));
            return;
        }
        // Amplify the raw RMS for a livelier meter, clamped to [0, 1].
        setLevels((prev) => [...prev.slice(1), Math.min(1, audioLevel * 8)]);
    }, [audioLevel, isRecording]);
    // Elapsed timer, reset on each recording session.
    const [elapsedMs, setElapsedMs] = useState(0);
    useEffect(() => {
        if (!isRecording) {
            setElapsedMs(0);
            return;
        }
        const startedAt = performance.now();
        const id = setInterval(() => setElapsedMs(performance.now() - startedAt), 200);
        return () => clearInterval(id);
    }, [isRecording]);
    // Only render when the daemon advertises a usable voice model.
    if (!features.includes(VOICE_FEATURE))
        return null;
    const isConnecting = status === 'connecting';
    const isTranscribing = status === 'transcribing';
    const isError = status === 'error';
    const isNotice = Boolean(noticeMessage) && !isError;
    // Stopping/aborting an in-progress capture must stay available even when the
    // composer is disabled (e.g. mid-turn) — only starting a new one is blocked.
    const canCancel = isRecording || isConnecting;
    const label = isRecording
        ? t('voice.stopDictation')
        : isTranscribing
            ? t('voice.transcribing')
            : isConnecting
                ? t('voice.starting')
                : isError
                    ? t('voice.errorRetry', { message: errorMessage ?? '' })
                    : isNotice
                        ? t('voice.noSpeechRetry')
                        : t('voice.startDictation');
    let control;
    if (isRecording) {
        control = (_jsxs("button", { type: "button", className: styles.pill, onClick: () => stop(), "aria-label": label, title: label, children: [_jsx("span", { className: styles.recDot, "aria-hidden": "true" }), _jsx("span", { className: styles.wave, "aria-hidden": "true", children: levels.map((lvl, i) => (_jsx("span", { className: styles.bar, style: { height: `${2 + Math.round(lvl * 14)}px` } }, i))) }), _jsx("span", { className: styles.time, children: formatElapsed(elapsedMs) }), _jsx("span", { className: styles.stop, "aria-hidden": "true", children: _jsx(StopIcon, {}) })] }));
    }
    else if (isTranscribing) {
        control = (_jsxs("span", { className: `${styles.pill} ${styles.transcribing}`, role: "status", "aria-label": label, children: [_jsx("span", { className: styles.spinner, "aria-hidden": "true" }), _jsx("span", { className: styles.time, children: "\u2026" })] }));
    }
    else {
        // idle / connecting / error / notice → icon button
        const iconClass = [
            styles.iconBtn,
            isError ? styles.error : '',
            isConnecting ? styles.connecting : '',
        ]
            .filter(Boolean)
            .join(' ');
        control = (_jsx("button", { type: "button", className: iconClass, onClick: () => {
                if (isConnecting) {
                    abort();
                }
                else if (disabled) {
                    return;
                }
                else {
                    // idle / error / notice → (re)start
                    setNoticeMessage(undefined);
                    start();
                }
            }, disabled: Boolean(disabled) && !canCancel, "aria-label": label, title: errorMessage ?? noticeMessage ?? label, children: _jsx(MicIcon, {}) }));
    }
    const showInterim = (isRecording && interimText) || isError || isNotice;
    return (_jsxs("span", { className: styles.root, children: [control, showInterim && (_jsx("span", { role: "status", "aria-live": "polite", className: `${styles.interim}${isError ? ` ${styles.error}` : ''}`, children: isError
                    ? errorMessage || t('voice.error')
                    : isNotice
                        ? noticeMessage
                        : interimText }))] }));
}
//# sourceMappingURL=VoiceButton.js.map