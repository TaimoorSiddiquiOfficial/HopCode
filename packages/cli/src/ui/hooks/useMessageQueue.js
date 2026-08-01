/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import { useCallback, useRef, useState } from 'react';
import { isSlashCommand } from '../utils/commandUtils.js';
export function useMessageQueue() {
    const [queuedMessages, setQueuedMessages] = useState([]);
    // Synchronous mirror so non-React callbacks see the latest queue.
    const queueRef = useRef([]);
    const addMessage = useCallback((message, deferUntilIdle = false) => {
        const trimmedMessage = message.trim();
        if (trimmedMessage.length > 0) {
            queueRef.current = [
                ...queueRef.current,
                { text: trimmedMessage, deferUntilIdle },
            ];
            setQueuedMessages(queueRef.current);
        }
    }, []);
    const clearQueue = useCallback(() => {
        queueRef.current = [];
        setQueuedMessages([]);
    }, []);
    const getQueuedMessagesText = useCallback(() => {
        if (queuedMessages.length === 0)
            return '';
        return queuedMessages.map(({ text }) => text).join('\n\n');
    }, [queuedMessages]);
    const popAllMessages = useCallback(() => {
        const current = queueRef.current;
        if (current.length === 0)
            return null;
        queueRef.current = [];
        setQueuedMessages([]);
        return current.map(({ text }) => text).join('\n\n');
    }, []);
    const restoreMessages = useCallback((messages) => {
        const restored = messages
            .map((text) => text.trim())
            .filter(Boolean)
            .map((text) => ({ text, deferUntilIdle: false }));
        if (restored.length === 0)
            return;
        queueRef.current = [...restored, ...queueRef.current];
        setQueuedMessages(queueRef.current);
    }, []);
    const drainQueue = useCallback((includeDeferred = false) => {
        const current = queueRef.current;
        if (current.length === 0)
            return [];
        const shouldDrain = (message) => !isSlashCommand(message.text) &&
            (includeDeferred || !message.deferUntilIdle);
        const drained = current.filter(shouldDrain);
        if (drained.length === 0)
            return [];
        const rest = current.filter((message) => !shouldDrain(message));
        queueRef.current = rest;
        setQueuedMessages(rest);
        return drained.map(({ text }) => text);
    }, []);
    const popNextSegment = useCallback(() => {
        const current = queueRef.current;
        if (current.length === 0)
            return null;
        const [head, ...rest] = current;
        queueRef.current = rest;
        setQueuedMessages(rest);
        return head.text;
    }, []);
    return {
        messageQueue: queuedMessages.map(({ text }) => text),
        addMessage,
        clearQueue,
        getQueuedMessagesText,
        popAllMessages,
        restoreMessages,
        drainQueue,
        popNextSegment,
    };
}
//# sourceMappingURL=useMessageQueue.js.map