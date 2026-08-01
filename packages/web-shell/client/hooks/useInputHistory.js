import { useCallback, useRef, useState } from 'react';
const DEFAULT_STORAGE_KEY = 'hopcode-web-shell-history';
const LEGACY_DEFAULT_STORAGE_KEY = 'qwen-web-shell-history';
const MAX_HISTORY = 100;
function parseHistory(raw) {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
        ? parsed.filter((v) => typeof v === 'string')
        : [];
}
function loadHistory(storageKey, legacyStorageKey) {
    try {
        const raw = localStorage.getItem(storageKey);
        if (raw)
            return parseHistory(raw);
        if (!legacyStorageKey)
            return [];
        const legacyRaw = localStorage.getItem(legacyStorageKey);
        if (!legacyRaw)
            return [];
        const history = parseHistory(legacyRaw);
        saveHistory(storageKey, history);
        return history;
    }
    catch {
        return [];
    }
}
function saveHistory(storageKey, history) {
    try {
        localStorage.setItem(storageKey, JSON.stringify(history.slice(-MAX_HISTORY)));
    }
    catch {
        // Ignore storage failures in private browsing or restricted contexts.
    }
}
export function useInputHistory(storageKey = DEFAULT_STORAGE_KEY, legacyStorageKey = storageKey === DEFAULT_STORAGE_KEY
    ? LEGACY_DEFAULT_STORAGE_KEY
    : undefined) {
    const storageKeyRef = useRef(storageKey);
    storageKeyRef.current = storageKey;
    const historyRef = useRef(loadHistory(storageKey, legacyStorageKey));
    const indexRef = useRef(-1);
    const draftRef = useRef('');
    const searchIndexRef = useRef(-1);
    // Drives the enabled/disabled state of the history nav buttons. canUp: an
    // older entry exists to recall; canDown: currently browsing history (a newer
    // entry or the saved draft to return to).
    const [nav, setNav] = useState(() => ({
        canUp: historyRef.current.length > 0,
        canDown: false,
    }));
    const syncNav = useCallback(() => {
        const h = historyRef.current;
        const i = indexRef.current;
        setNav({
            canUp: h.length > 0 && (i === -1 || i > 0),
            canDown: i !== -1,
        });
    }, []);
    const push = useCallback((text) => {
        const h = historyRef.current;
        if (h[h.length - 1] === text)
            return;
        h.push(text);
        if (h.length > MAX_HISTORY)
            h.shift();
        saveHistory(storageKeyRef.current, h);
        indexRef.current = -1;
        syncNav();
    }, [syncNav]);
    const navigateUp = useCallback((currentText) => {
        const h = historyRef.current;
        if (h.length === 0)
            return null;
        if (indexRef.current === -1) {
            draftRef.current = currentText;
            indexRef.current = h.length - 1;
        }
        else if (indexRef.current > 0) {
            indexRef.current--;
        }
        else {
            return null;
        }
        syncNav();
        return h[indexRef.current];
    }, [syncNav]);
    const navigateDown = useCallback(() => {
        const h = historyRef.current;
        if (indexRef.current === -1)
            return null;
        if (indexRef.current < h.length - 1) {
            indexRef.current++;
            syncNav();
            return h[indexRef.current];
        }
        else {
            indexRef.current = -1;
            syncNav();
            return draftRef.current;
        }
    }, [syncNav]);
    const isNavigating = useCallback(() => indexRef.current !== -1, []);
    const reset = useCallback(() => {
        indexRef.current = -1;
        searchIndexRef.current = -1;
        syncNav();
    }, [syncNav]);
    const searchReverse = useCallback((query) => {
        const h = historyRef.current;
        if (h.length === 0 || !query)
            return null;
        const startIdx = searchIndexRef.current === -1 ? h.length - 1 : searchIndexRef.current - 1;
        if (startIdx < 0) {
            searchIndexRef.current = -1;
            return null;
        }
        const lowerQuery = query.toLowerCase();
        for (let i = startIdx; i >= 0; i--) {
            if (h[i].toLowerCase().includes(lowerQuery)) {
                searchIndexRef.current = i;
                return h[i];
            }
        }
        searchIndexRef.current = -1;
        return null;
    }, []);
    const getReverseMatches = useCallback((query) => {
        const lowerQuery = query.trim().toLowerCase();
        return historyRef.current
            .slice()
            .reverse()
            .filter((item) => !lowerQuery || item.toLowerCase().includes(lowerQuery));
    }, []);
    const getLastEntry = useCallback((filter) => {
        const h = historyRef.current;
        if (!filter)
            return h.length > 0 ? h[h.length - 1] : null;
        for (let i = h.length - 1; i >= 0; i--) {
            if (filter(h[i]))
                return h[i];
        }
        return null;
    }, []);
    const resetSearch = useCallback(() => {
        searchIndexRef.current = -1;
    }, []);
    return {
        push,
        navigateUp,
        navigateDown,
        isNavigating,
        reset,
        searchReverse,
        getReverseMatches,
        getLastEntry,
        resetSearch,
        nav,
    };
}
//# sourceMappingURL=useInputHistory.js.map