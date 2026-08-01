import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useWorkspaceActions, } from '@hoptrendy/webui/daemon-react-sdk';
import { EditorState } from '@codemirror/state';
import { basicSetup, EditorView } from 'codemirror';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, } from 'react';
import { useI18n } from '../../i18n';
import { DialogShell } from '../dialogs/DialogShell';
import { isSafeHref } from '../messages/Markdown';
import { buildCron, describeCron, parseCronToBuilder, } from '../dialogs/scheduledTasksSchedule';
import taskStyles from '../dialogs/ScheduledTasksDialog.module.css';
import { artifactKindLabel, formatArtifactSize, getArtifactLocation, normalizePath, withArtifactPreviewCsp, } from './artifactUtils';
import { displayPath, } from './TurnOutputs';
import { LineStats, sumLineStats } from './LineStats';
import styles from './ArtifactPanel.module.css';
const MIN_PANEL_WIDTH_FOR_DEFAULT_TREE = 740;
const MAX_REVIEW_SIDE_BY_SIDE_WIDTH = 700;
const FREQUENCIES = [
    'daily',
    'weekdays',
    'weekly',
    'hourly',
    'minutes',
    'custom',
];
const MINUTE_INTERVALS = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30];
export function ArtifactPanel({ artifacts, tabs, activeTabId, reviewChanges, selectedReviewPath, panelWidth, workspaceCwd, loading, error, onSelectTab, onCloseTab, onClose, }) {
    const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
    const defaultWorkspaceActions = useWorkspaceActions();
    const activeWorkspaceActions = activeTab?.kind === 'artifact' || activeTab?.kind === 'scheduled_task'
        ? (activeTab.workspaceActions ?? defaultWorkspaceActions)
        : defaultWorkspaceActions;
    return (_jsxs("aside", { className: styles.panel, style: panelWidth ? { flexBasis: panelWidth, width: panelWidth } : undefined, "aria-label": "Right panel", children: [_jsxs("div", { className: styles.header, children: [_jsx("div", { className: styles.tabs, role: "tablist", "aria-label": "Right panel", children: tabs.map((tab) => (_jsxs("div", { className: [
                                styles.tabItem,
                                tab.id === activeTab?.id ? styles.tabActive : '',
                            ]
                                .filter(Boolean)
                                .join(' '), children: [_jsxs("button", { type: "button", role: "tab", "aria-selected": tab.id === activeTab?.id, className: styles.tab, onClick: () => onSelectTab(tab.id), title: tab.title, children: [_jsx("span", { className: styles.tabIcon, "aria-hidden": "true", children: tab.kind === 'review' ? (_jsx(TabReviewIcon, {})) : tab.kind === 'artifact' ? (_jsx(TabArtifactIcon, {})) : (_jsx(TabScheduledTaskIcon, {})) }), tab.title] }), _jsx("button", { type: "button", className: styles.tabCloseButton, onClick: () => onCloseTab(tab.id), "aria-label": `Close ${tab.title}`, title: "Close", children: _jsx(CloseIcon, {}) })] }, tab.id))) }), _jsx("button", { type: "button", className: styles.iconButton, onClick: onClose, "aria-label": "Close artifacts panel", title: "Close", children: "\u00D7" })] }), _jsx("div", { className: styles.body, children: !activeTab ? (_jsx("div", { className: styles.empty, children: "No panel selected." })) : activeTab.kind === 'review' ? (_jsx(ReviewChanges, { changes: reviewChanges, selectedPath: selectedReviewPath, panelWidth: panelWidth, workspaceCwd: workspaceCwd })) : activeTab.kind === 'artifact' ? (_jsx(ArtifactDetailTab, { artifacts: artifacts, artifactId: activeTab.artifactId, workspaceActions: activeWorkspaceActions, previewContent: activeTab.previewContent, loading: loading, error: error })) : (_jsx(ScheduledTaskDetail, { task: activeTab.task, actions: activeWorkspaceActions }, activeTab.id)) })] }));
}
function CloseIcon() {
    return (_jsx("svg", { className: styles.tabCloseIcon, viewBox: "0 0 16 16", fill: "none", focusable: "false", "aria-hidden": "true", children: _jsx("path", { d: "m4.5 4.5 7 7M11.5 4.5l-7 7", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round" }) }));
}
function TabReviewIcon() {
    return (_jsxs("svg", { className: styles.tabIconSvg, viewBox: "0 0 24 24", fill: "none", focusable: "false", children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M9 9.5h6M12 6.5v6", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }), _jsx("path", { d: "M9 16h6", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })] }));
}
function TabArtifactIcon() {
    return (_jsxs("svg", { className: styles.tabIconSvg, viewBox: "0 0 24 24", fill: "none", focusable: "false", children: [_jsx("rect", { x: "6", y: "4", width: "12", height: "16", rx: "2", stroke: "currentColor", strokeWidth: "1.8" }), _jsx("path", { d: "M9 10h6M9 14h4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })] }));
}
function TabScheduledTaskIcon() {
    return (_jsxs("svg", { className: styles.tabIconSvg, viewBox: "0 0 24 24", fill: "none", focusable: "false", children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3", stroke: "currentColor", strokeWidth: "1.8" }), _jsx("path", { d: "M12 8v4l3 2", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
function ArtifactDetailTab({ artifacts, artifactId, workspaceActions, previewContent, loading, error, }) {
    const artifact = artifacts.find((item) => item.id === artifactId);
    if (artifact) {
        return (_jsx(ArtifactDetail, { artifact: artifact, workspaceActions: workspaceActions, previewContent: previewContent }));
    }
    if (loading) {
        return _jsx("div", { className: styles.empty, children: "Loading artifact..." });
    }
    if (error) {
        return _jsx("div", { className: styles.empty, children: error });
    }
    return _jsx("div", { className: styles.empty, children: "Artifact not found." });
}
function ScheduledTaskDetail({ task, actions, }) {
    const { t } = useI18n();
    const [loadedTask, setLoadedTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState(task.prompt);
    const [builder, setBuilder] = useState(() => parseCronToBuilder(task.cron));
    const [showForm, setShowForm] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [busy, setBusy] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState(null);
    const loadTask = useCallback(async () => {
        if (!task.durable) {
            setLoadedTask(null);
            setName('');
            setPrompt(task.prompt);
            setBuilder(parseCronToBuilder(task.cron));
            setLoadError(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        setLoadError(null);
        try {
            const tasks = await actions.listScheduledTasks();
            const match = tasks.find((item) => item.id === task.id) ?? null;
            setLoadedTask(match);
            if (match) {
                setName(match.name ?? '');
                setPrompt(match.prompt);
                setBuilder(parseCronToBuilder(match.cron));
            }
            else {
                setName('');
                setPrompt(task.prompt);
                setBuilder(parseCronToBuilder(task.cron));
            }
        }
        catch (err) {
            setLoadError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setLoading(false);
        }
    }, [actions, task.cron, task.durable, task.id, task.prompt]);
    useEffect(() => {
        void loadTask();
    }, [loadTask]);
    const isSessionScoped = !task.durable;
    const isDeleted = task.durable && !loading && !loadError && !loadedTask;
    const canEdit = Boolean(loadedTask);
    const detailTitle = loadedTask?.name || loadedTask?.prompt || task.title;
    const detailPrompt = loadedTask?.prompt ?? task.prompt;
    const detailCron = loadedTask?.cron ?? task.cron;
    const detailRecurring = loadedTask?.recurring ?? task.recurring;
    const detailEnabled = loadedTask?.enabled;
    const openEdit = useCallback(() => {
        if (!loadedTask)
            return;
        setName(loadedTask.name ?? '');
        setPrompt(loadedTask.prompt);
        setBuilder(parseCronToBuilder(loadedTask.cron));
        setFormError(null);
        setShowForm(true);
    }, [loadedTask]);
    const closeEdit = useCallback(() => {
        setShowForm(false);
        setFormError(null);
        if (!loadedTask)
            return;
        setName(loadedTask.name ?? '');
        setPrompt(loadedTask.prompt);
        setBuilder(parseCronToBuilder(loadedTask.cron));
    }, [loadedTask]);
    const handleSave = useCallback(async () => {
        if (!loadedTask)
            return;
        const cron = buildCron(builder);
        if (!cron) {
            setFormError(t('scheduledTasks.error.invalidSchedule'));
            return;
        }
        if (prompt.trim().length === 0) {
            setFormError(t('scheduledTasks.error.emptyPrompt'));
            return;
        }
        setSubmitting(true);
        setFormError(null);
        try {
            const updated = await actions.updateScheduledTask(loadedTask.id, {
                cron,
                prompt: prompt.trim(),
                name: name.trim() || null,
            });
            setLoadedTask(updated);
            setName(updated.name ?? '');
            setPrompt(updated.prompt);
            setBuilder(parseCronToBuilder(updated.cron));
            setShowForm(false);
        }
        catch (err) {
            setFormError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setSubmitting(false);
        }
    }, [actions, builder, loadedTask, name, prompt, t]);
    const handleToggle = useCallback(async () => {
        if (!loadedTask)
            return;
        setBusy(true);
        setFormError(null);
        try {
            const updated = await actions.updateScheduledTask(loadedTask.id, {
                enabled: !loadedTask.enabled,
            });
            setLoadedTask(updated);
        }
        catch (err) {
            setFormError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setBusy(false);
        }
    }, [actions, loadedTask]);
    const handleDelete = useCallback(async () => {
        if (!loadedTask)
            return;
        setBusy(true);
        setFormError(null);
        try {
            await actions.deleteScheduledTask(loadedTask.id);
            setLoadedTask(null);
            setShowDeleteConfirm(false);
        }
        catch (err) {
            setFormError(err instanceof Error ? err.message : String(err));
        }
        finally {
            setBusy(false);
        }
    }, [actions, loadedTask]);
    const previewCron = buildCron(builder);
    const previewLabel = previewCron ? describeCron(previewCron, t) : null;
    return (_jsxs("div", { className: styles.detail, children: [loading && (_jsx("div", { className: styles.empty, children: t('scheduledTasks.loading') })), loadError && _jsx("div", { className: taskStyles.loadError, children: loadError }), isDeleted && (_jsx("div", { className: styles.empty, children: t('scheduledTasks.deletedSnapshot') })), isSessionScoped && (_jsx("div", { className: styles.empty, children: t('scheduledTasks.sessionScopedSnapshot') })), !isDeleted && (_jsx("div", { className: styles.section, children: _jsxs("div", { className: styles.fieldGrid, children: [_jsx("span", { className: styles.fieldLabel, children: t('scheduledTasks.name') }), _jsx("span", { className: styles.fieldValue, children: detailTitle }), _jsx("span", { className: styles.fieldLabel, children: t('scheduledTasks.taskId') }), _jsx("span", { className: styles.fieldValue, children: task.id }), _jsx("span", { className: styles.fieldLabel, children: t('scheduledTasks.schedule') }), _jsx("span", { className: styles.fieldValue, children: describeCron(detailCron, t) }), _jsx("span", { className: styles.fieldLabel, children: "Cron" }), _jsx("span", { className: styles.fieldValue, children: detailCron }), _jsx("span", { className: styles.fieldLabel, children: t('scheduledTasks.type') }), _jsx("span", { className: styles.fieldValue, children: detailRecurring
                                ? t('scheduledTasks.repeats')
                                : t('scheduledTasks.runsOnce') }), detailEnabled !== undefined && (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.fieldLabel, children: t('scheduledTasks.status') }), _jsx("span", { className: styles.fieldValue, children: detailEnabled
                                        ? t('scheduledTasks.enable')
                                        : t('scheduledTasks.disable') })] }))] }) })), !isDeleted && (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: "Prompt" }), _jsx("div", { className: styles.description, children: detailPrompt })] })), formError && _jsx("div", { className: taskStyles.formError, children: formError }), _jsxs("div", { className: styles.actionsRow, children: [_jsx("button", { type: "button", className: taskStyles.primaryButton, disabled: !canEdit || busy, onClick: openEdit, children: t('scheduledTasks.edit') }), _jsx("button", { type: "button", className: taskStyles.secondaryButton, disabled: !canEdit || busy, onClick: () => void handleToggle(), children: loadedTask?.enabled
                            ? t('scheduledTasks.disable')
                            : t('scheduledTasks.enable') }), _jsx("button", { type: "button", className: taskStyles.secondaryButton, disabled: !canEdit || busy, onClick: () => setShowDeleteConfirm(true), children: t('scheduledTasks.delete') })] }), showDeleteConfirm && loadedTask && (_jsx(DialogShell, { title: t('scheduledTasks.deleteConfirmTitle'), size: "sm", onClose: () => setShowDeleteConfirm(false), children: _jsxs("div", { className: taskStyles.formFields, children: [_jsx("div", { className: styles.description, children: t('scheduledTasks.deleteConfirm', {
                                name: loadedTask.name || loadedTask.prompt,
                            }) }), formError && (_jsx("div", { className: taskStyles.formError, children: formError })), _jsxs("div", { className: taskStyles.formActions, children: [_jsx("button", { type: "button", className: taskStyles.secondaryButton, onClick: () => setShowDeleteConfirm(false), disabled: busy, children: t('scheduledTasks.cancel') }), _jsx("button", { type: "button", className: taskStyles.primaryButton, onClick: () => void handleDelete(), disabled: busy, children: t('scheduledTasks.delete') })] })] }) })), showForm && (_jsx(DialogShell, { title: t('scheduledTasks.editTitle'), size: "md", onClose: closeEdit, children: _jsxs("div", { className: taskStyles.formFields, children: [_jsxs("label", { className: taskStyles.field, children: [_jsx("span", { className: taskStyles.fieldLabel, children: t('scheduledTasks.name') }), _jsx("input", { className: taskStyles.input, type: "text", value: name, maxLength: 200, placeholder: t('scheduledTasks.namePlaceholder'), onChange: (e) => setName(e.target.value) })] }), _jsxs("label", { className: taskStyles.field, children: [_jsxs("span", { className: taskStyles.fieldLabel, children: [t('scheduledTasks.prompt'), _jsx("span", { className: taskStyles.required, children: "*" })] }), _jsx("textarea", { className: taskStyles.textarea, value: prompt, rows: 4, maxLength: 100_000, placeholder: t('scheduledTasks.promptPlaceholder'), onChange: (e) => setPrompt(e.target.value) })] }), _jsxs("div", { className: taskStyles.scheduleRow, children: [_jsxs("label", { className: taskStyles.field, children: [_jsx("span", { className: taskStyles.fieldLabel, children: t('scheduledTasks.frequency') }), _jsx("select", { className: taskStyles.select, value: builder.frequency, onChange: (e) => {
                                                const frequency = e.target.value;
                                                setBuilder((value) => ({
                                                    ...value,
                                                    frequency,
                                                    ...(frequency === 'hourly' ? { time: '00:00' } : {}),
                                                }));
                                            }, children: FREQUENCIES.map((frequency) => (_jsx("option", { value: frequency, children: t(`scheduledTasks.freq.${frequency}`) }, frequency))) })] }), (builder.frequency === 'daily' ||
                                    builder.frequency === 'weekdays' ||
                                    builder.frequency === 'weekly') && (_jsxs("label", { className: taskStyles.field, children: [_jsx("span", { className: taskStyles.fieldLabel, children: t('scheduledTasks.time') }), _jsx("input", { className: taskStyles.input, type: "time", value: builder.time, onChange: (e) => setBuilder((value) => ({
                                                ...value,
                                                time: e.target.value,
                                            })) })] })), builder.frequency === 'weekly' && (_jsxs("label", { className: taskStyles.field, children: [_jsx("span", { className: taskStyles.fieldLabel, children: t('scheduledTasks.weekday') }), _jsx("select", { className: taskStyles.select, value: builder.weekday, onChange: (e) => setBuilder((value) => ({
                                                ...value,
                                                weekday: Number(e.target.value),
                                            })), children: t('scheduledTasks.weekdayNames')
                                                .split(',')
                                                .map((label, index) => (_jsx("option", { value: index, children: label }, index))) })] })), builder.frequency === 'minutes' && (_jsxs("label", { className: taskStyles.field, children: [_jsx("span", { className: taskStyles.fieldLabel, children: t('scheduledTasks.interval') }), _jsx("select", { className: taskStyles.select, value: builder.minuteInterval, onChange: (e) => setBuilder((value) => ({
                                                ...value,
                                                minuteInterval: Number(e.target.value),
                                            })), children: MINUTE_INTERVALS.map((minute) => (_jsx("option", { value: minute, children: minute }, minute))) })] })), builder.frequency === 'custom' && (_jsxs("label", { className: `${taskStyles.field} ${taskStyles.fieldGrow}`, children: [_jsx("span", { className: taskStyles.fieldLabel, children: t('scheduledTasks.cron') }), _jsx("input", { className: taskStyles.input, type: "text", value: builder.customCron, spellCheck: false, placeholder: "0 9 * * 1-5", onChange: (e) => setBuilder((value) => ({
                                                ...value,
                                                customCron: e.target.value,
                                            })) })] }))] }), _jsx("div", { className: taskStyles.preview, children: previewLabel ? (_jsxs(_Fragment, { children: [_jsx("span", { className: taskStyles.previewLabel, children: previewLabel }), _jsx("code", { className: taskStyles.previewCron, children: previewCron })] })) : (_jsx("span", { className: taskStyles.previewInvalid, children: t('scheduledTasks.error.invalidSchedule') })) }), formError && (_jsx("div", { className: taskStyles.formError, children: formError })), _jsxs("div", { className: taskStyles.formActions, children: [_jsx("button", { type: "button", className: taskStyles.secondaryButton, onClick: closeEdit, disabled: submitting, children: t('scheduledTasks.cancel') }), _jsx("button", { type: "button", className: taskStyles.primaryButton, onClick: () => void handleSave(), disabled: submitting, children: submitting
                                        ? t('scheduledTasks.saving')
                                        : t('scheduledTasks.save') })] })] }) }))] }));
}
function ReviewChanges({ changes, selectedPath, panelWidth, workspaceCwd, }) {
    const { t } = useI18n();
    const [isTreeOpen, setIsTreeOpen] = useState(() => !panelWidth || panelWidth >= MIN_PANEL_WIDTH_FOR_DEFAULT_TREE);
    const [isFileListOpen, setIsFileListOpen] = useState(true);
    const [isReviewStacked, setIsReviewStacked] = useState(false);
    const [reviewListWidth, setReviewListWidth] = useState(520);
    const reviewListWidthRef = useRef(reviewListWidth);
    const reviewContentRef = useRef(null);
    const reviewResizeCleanupRef = useRef(null);
    const [expandedPath, setExpandedPath] = useState(null);
    const showTree = isTreeOpen;
    const fileTree = useMemo(() => buildFileTree(changes, workspaceCwd), [changes, workspaceCwd]);
    useEffect(() => {
        setExpandedPath(selectedPath);
    }, [selectedPath]);
    useEffect(() => {
        reviewListWidthRef.current = reviewListWidth;
    }, [reviewListWidth]);
    useEffect(() => {
        const container = reviewContentRef.current;
        if (!container)
            return;
        const update = () => {
            setIsReviewStacked(container.clientWidth < MAX_REVIEW_SIDE_BY_SIDE_WIDTH);
        };
        update();
        const observer = new ResizeObserver(update);
        observer.observe(container);
        return () => observer.disconnect();
    }, [isFileListOpen]);
    useEffect(() => () => reviewResizeCleanupRef.current?.(), []);
    const handleReviewSplitResizeStart = useCallback((event) => {
        const container = reviewContentRef.current;
        if (!container)
            return;
        event.preventDefault();
        const resizeHandle = event.currentTarget;
        resizeHandle.setPointerCapture(event.pointerId);
        const startX = event.clientX;
        const startWidth = reviewListWidthRef.current;
        const containerWidth = container.getBoundingClientRect().width;
        const maxWidth = Math.max(180, containerWidth - 180);
        const previousCursor = document.body.style.cursor;
        const previousUserSelect = document.body.style.userSelect;
        let pendingWidth = startWidth;
        let animationFrame = null;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        const flushWidth = () => {
            animationFrame = null;
            setReviewListWidth(pendingWidth);
        };
        const handlePointerMove = (moveEvent) => {
            pendingWidth = Math.min(maxWidth, Math.max(180, startWidth + (moveEvent.clientX - startX)));
            if (animationFrame === null) {
                animationFrame = window.requestAnimationFrame(flushWidth);
            }
        };
        let handlePointerUp = () => { };
        const cleanupResize = (commitWidth) => {
            reviewResizeCleanupRef.current = null;
            if (animationFrame !== null) {
                window.cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
            if (commitWidth)
                setReviewListWidth(pendingWidth);
            if (resizeHandle.hasPointerCapture(event.pointerId)) {
                resizeHandle.releasePointerCapture(event.pointerId);
            }
            document.body.style.cursor = previousCursor;
            document.body.style.userSelect = previousUserSelect;
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };
        handlePointerUp = () => cleanupResize(true);
        reviewResizeCleanupRef.current = () => cleanupResize(false);
        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
    }, []);
    if (changes.length === 0) {
        return _jsx("div", { className: styles.empty, children: "No file changes to review." });
    }
    const totals = sumLineStats(changes);
    const toggleDiff = (path) => {
        setExpandedPath((current) => (current === path ? null : path));
    };
    return (_jsxs("div", { className: styles.review, children: [_jsxs("div", { className: styles.reviewToolbar, children: [_jsxs("div", { className: styles.reviewToolbarTitle, children: [_jsx("span", { children: t('turnOutputs.previousTurn') }), _jsx(LineStats, { additions: totals?.additions, deletions: totals?.deletions, className: styles.lineStats, additionsClassName: styles.additions, deletionsClassName: styles.deletions })] }), _jsxs("div", { className: styles.reviewToolbarActions, children: [_jsxs("button", { type: "button", className: styles.reviewTotalsButton, onClick: () => setIsFileListOpen((value) => !value), "aria-expanded": isFileListOpen, children: [_jsx("span", { children: t('turnOutputs.fileCount', { count: changes.length }) }), _jsx("span", { className: [
                                            styles.chevron,
                                            isFileListOpen ? styles.chevronOpen : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' '), "aria-hidden": "true", children: _jsx(ChevronIcon, {}) })] }), _jsx("button", { type: "button", className: [
                                    styles.iconButton,
                                    isTreeOpen ? styles.iconButtonActive : '',
                                ]
                                    .filter(Boolean)
                                    .join(' '), onClick: () => setIsTreeOpen((value) => !value), "aria-label": isTreeOpen
                                    ? t('turnOutputs.closeFileTree')
                                    : t('turnOutputs.openFileTree'), title: isTreeOpen
                                    ? t('turnOutputs.closeFileTree')
                                    : t('turnOutputs.openFileTree'), children: isTreeOpen ? _jsx(FolderOpenIcon, {}) : _jsx(FolderIcon, {}) })] })] }), isFileListOpen && (_jsxs("div", { ref: reviewContentRef, className: [
                    styles.reviewContent,
                    showTree ? '' : styles.reviewContentListOnly,
                    showTree && isReviewStacked ? styles.reviewContentStacked : '',
                ]
                    .filter(Boolean)
                    .join(' '), style: {
                    '--review-list-width': `${reviewListWidth}px`,
                }, children: [_jsx("div", { className: [
                            styles.reviewList,
                            expandedPath ? styles.reviewListWithExpanded : '',
                        ]
                            .filter(Boolean)
                            .join(' '), children: changes.map((change) => {
                            const isExpanded = expandedPath === change.path;
                            return (_jsxs("div", { className: [
                                    styles.reviewItem,
                                    isExpanded ? styles.reviewItemExpanded : '',
                                ]
                                    .filter(Boolean)
                                    .join(' '), children: [_jsxs("button", { type: "button", className: styles.reviewRow, "data-selected": change.path === selectedPath || undefined, onClick: () => toggleDiff(change.path), children: [_jsx("span", { className: styles.fileIcon, children: fileExtensionLabel(change.path) }), _jsx(PathText, { path: displayPath(change.path, workspaceCwd), title: change.path }), _jsx(LineStats, { additions: change.additions, deletions: change.deletions, className: styles.lineStats, additionsClassName: styles.additions, deletionsClassName: styles.deletions }), _jsx("span", { className: [
                                                    styles.chevron,
                                                    isExpanded ? styles.chevronOpen : '',
                                                ]
                                                    .filter(Boolean)
                                                    .join(' '), "aria-hidden": "true", children: _jsx(ChevronIcon, {}) })] }), isExpanded && _jsx(DiffPreview, { change: change })] }, `${change.toolCallId}:${change.path}`));
                        }) }), showTree && !isReviewStacked && (_jsx("div", { className: styles.reviewSplitHandle, role: "separator", "aria-orientation": "vertical", onPointerDown: handleReviewSplitResizeStart })), showTree && (_jsx("div", { className: styles.tree, children: fileTree.children.map((child) => (_jsx(TreeNode, { node: child, depth: 0, selectedPath: selectedPath }, child.path))) }))] }))] }));
}
function DiffPreview({ change }) {
    if (change.diffs.length === 0) {
        return _jsx("div", { className: styles.diffEmpty, children: "No diff available." });
    }
    const diffs = getDisplayDiffs(change.diffs);
    return (_jsx("div", { className: styles.diffPreview, children: diffs.map((diff, index) => (_jsx(CodeMirrorDiff, { oldText: diff.oldText, newText: diff.newText }, index))) }));
}
function getDisplayDiffs(diffs) {
    for (let index = diffs.length - 1; index >= 0; index--) {
        const diff = diffs[index];
        if (diff?.fullContent)
            return diffs.slice(index);
    }
    return diffs;
}
function CodeMirrorDiff({ oldText, newText, }) {
    const hostRef = useRef(null);
    const [isWide, setIsWide] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        const host = hostRef.current;
        if (!host)
            return;
        const update = () => setIsWide(host.clientWidth >= 720);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(host);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        const host = hostRef.current;
        if (!host || isWide === null)
            return;
        host.replaceChildren();
        setError(null);
        let cancelled = false;
        let view = null;
        const extensions = [
            basicSetup,
            EditorView.editable.of(false),
            EditorState.readOnly.of(true),
            EditorView.lineWrapping,
        ];
        const diffConfig = { scanLimit: 1_000, timeout: 500 };
        const collapseUnchanged = { margin: 3, minSize: 8 };
        void import('@codemirror/merge')
            .then(({ MergeView, unifiedMergeView }) => {
            if (cancelled)
                return;
            try {
                if (isWide) {
                    view = new MergeView({
                        a: { doc: oldText, extensions },
                        b: { doc: newText, extensions },
                        parent: host,
                        highlightChanges: true,
                        gutter: true,
                        revertControls: undefined,
                        collapseUnchanged,
                        diffConfig,
                    });
                    return;
                }
                view = new EditorView({
                    doc: newText,
                    extensions: [
                        ...extensions,
                        unifiedMergeView({
                            original: oldText,
                            highlightChanges: true,
                            gutter: true,
                            mergeControls: false,
                            allowInlineDiffs: true,
                            collapseUnchanged,
                            diffConfig,
                        }),
                    ],
                    parent: host,
                });
            }
            catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : String(err));
                }
            }
        })
            .catch((err) => {
            if (!cancelled) {
                setError(err instanceof Error ? err.message : String(err));
            }
        });
        return () => {
            cancelled = true;
            view?.destroy();
        };
    }, [isWide, newText, oldText]);
    return (_jsxs("div", { className: styles.codeMirrorDiffWrap, children: [_jsx("div", { ref: hostRef, className: styles.codeMirrorDiff }), error && (_jsxs("div", { className: styles.diffError, children: ["Diff unavailable: ", error] }))] }));
}
function TreeNode({ node, depth, selectedPath, }) {
    const isFile = Boolean(node.file);
    const [isOpen, setIsOpen] = useState(true);
    const rowClassName = [
        styles.treeRow,
        isFile ? styles.treeFile : styles.treeFolder,
    ]
        .filter(Boolean)
        .join(' ');
    const rowStyle = {
        paddingLeft: 10 + depth * 18,
        '--tree-row-line-left': `${19 + Math.max(0, depth - 1) * 18}px`,
    };
    const childrenStyle = {
        '--tree-children-line-left': `${19 + depth * 18}px`,
    };
    const rowContent = (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.treeTwisty, children: !isFile && (_jsx("span", { className: [
                        styles.treeChevron,
                        isOpen ? '' : styles.treeChevronClosed,
                    ]
                        .filter(Boolean)
                        .join(' '), children: _jsx(TreeChevronIcon, {}) })) }), _jsxs("span", { className: styles.treeContent, children: [isFile && (_jsx("span", { className: styles.fileIcon, children: fileExtensionLabel(node.path) })), _jsx("span", { className: styles.treeName, children: node.name })] }), node.file?.isArtifact && (_jsx("span", { className: styles.reviewBadge, children: "artifact" }))] }));
    return (_jsxs("div", { className: styles.treeNode, children: [isFile ? (_jsx("div", { className: rowClassName, "data-selected": node.file?.path === selectedPath || undefined, "data-depth": depth, style: rowStyle, title: node.path, children: rowContent })) : (_jsx("button", { type: "button", className: rowClassName, "data-depth": depth, style: rowStyle, title: node.path, "aria-expanded": isOpen, onClick: () => setIsOpen((value) => !value), children: rowContent })), !isFile && isOpen && node.children.length > 0 && (_jsx("div", { className: styles.treeChildren, style: childrenStyle, children: node.children.map((child) => (_jsx(TreeNode, { node: child, depth: depth + 1, selectedPath: selectedPath }, child.path))) }))] }));
}
function PathText({ path, title }) {
    const ref = useRef(null);
    const [display, setDisplay] = useState(() => splitReviewPath(path));
    useLayoutEffect(() => {
        const node = ref.current;
        if (!node)
            return;
        const update = () => setDisplay(compactReviewPath(path, node));
        update();
        const observer = new ResizeObserver(update);
        observer.observe(node);
        return () => observer.disconnect();
    }, [path]);
    return (_jsxs("span", { ref: ref, className: styles.reviewPath, title: title ?? path, children: [display.prefix && (_jsx("span", { className: styles.pathPrefix, children: display.prefix })), _jsx("span", { className: styles.pathFileName, children: display.leaf })] }));
}
function splitReviewPath(path) {
    const slashIndex = path.lastIndexOf('/');
    return slashIndex < 0
        ? { prefix: '', leaf: path }
        : {
            prefix: path.slice(0, slashIndex + 1),
            leaf: path.slice(slashIndex + 1),
        };
}
let measureCanvas = null;
function compactReviewPath(path, container) {
    const full = splitReviewPath(path);
    const width = container.clientWidth;
    if (width <= 0)
        return full;
    const measure = createTextMeasurer(container);
    if (measure(path) <= width)
        return full;
    const parts = path.split('/').filter(Boolean);
    const leaf = parts.at(-1) ?? path;
    const fileWidth = measure(leaf);
    if (parts.length <= 1 || fileWidth + measure('.../') > width) {
        return { prefix: '', leaf };
    }
    let prefix = '.../';
    for (let dirCount = 1; dirCount < parts.length; dirCount++) {
        const dirs = parts.slice(parts.length - 1 - dirCount, -1);
        const candidate = `.../${dirs.join('/')}/`;
        if (measure(candidate) + fileWidth > width)
            break;
        prefix = candidate;
    }
    return { prefix, leaf };
}
function createTextMeasurer(element) {
    measureCanvas ??= document.createElement('canvas');
    const context = measureCanvas.getContext('2d');
    const style = window.getComputedStyle(element);
    if (context) {
        context.font = [
            style.fontStyle,
            style.fontVariant,
            style.fontWeight,
            style.fontSize,
            style.fontFamily,
        ].join(' ');
    }
    return (text) => context?.measureText(text).width ?? text.length * 8;
}
function FolderIcon() {
    return (_jsxs("svg", { className: styles.toolbarIcon, viewBox: "0 0 24 24", fill: "none", focusable: "false", "aria-hidden": "true", children: [_jsx("path", { d: "M3.5 7.5h6l1.6 2h9.4v8.2a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7.5Z", stroke: "currentColor", strokeWidth: "1.7", strokeLinejoin: "round" }), _jsx("path", { d: "M3.5 7.5V5.8a1.5 1.5 0 0 1 1.5-1.5h4l1.8 2.1h7.2a1.5 1.5 0 0 1 1.5 1.5v1.6", stroke: "currentColor", strokeWidth: "1.7", strokeLinejoin: "round" })] }));
}
function FolderOpenIcon() {
    return (_jsxs("svg", { className: styles.toolbarIcon, viewBox: "0 0 24 24", fill: "none", focusable: "false", "aria-hidden": "true", children: [_jsx("path", { d: "M3.5 8.2V5.8A1.5 1.5 0 0 1 5 4.3h4l1.8 2.1h7.2a1.5 1.5 0 0 1 1.5 1.5v1.4", stroke: "currentColor", strokeWidth: "1.7", strokeLinejoin: "round" }), _jsx("path", { d: "M4.8 19.7h12.9a2 2 0 0 0 1.9-1.4l2-7H6.4l-2.8 7.1a.9.9 0 0 0 1.2 1.3Z", stroke: "currentColor", strokeWidth: "1.7", strokeLinejoin: "round" })] }));
}
function ChevronIcon() {
    return (_jsx("svg", { className: styles.chevronIcon, viewBox: "0 0 16 16", fill: "none", focusable: "false", "aria-hidden": "true", children: _jsx("path", { d: "m6 4 4 4-4 4", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
function TreeChevronIcon() {
    return (_jsx("svg", { className: styles.treeChevronIcon, viewBox: "0 0 16 16", fill: "none", focusable: "false", "aria-hidden": "true", children: _jsx("path", { d: "m4 6 4 4 4-4", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
function buildFileTree(changes, workspaceCwd) {
    const root = { name: '', path: '', children: [] };
    for (const change of changes) {
        const parts = displayPath(change.path, workspaceCwd)
            .split('/')
            .filter(Boolean);
        let current = root;
        for (let index = 0; index < parts.length; index++) {
            const part = parts[index];
            const path = parts.slice(0, index + 1).join('/');
            let child = current.children.find((node) => node.name === part);
            if (!child) {
                child = { name: part, path, children: [] };
                current.children.push(child);
            }
            if (index === parts.length - 1)
                child.file = change;
            current = child;
        }
    }
    sortTree(root);
    return root;
}
function sortTree(node) {
    node.children.sort((left, right) => {
        if (Boolean(left.file) !== Boolean(right.file))
            return left.file ? 1 : -1;
        return left.name.localeCompare(right.name);
    });
    for (const child of node.children)
        sortTree(child);
}
function fileName(value) {
    const parts = normalizePath(value).split('/').filter(Boolean);
    return parts.at(-1) ?? value;
}
function fileExtensionLabel(value) {
    const name = fileName(value);
    const extension = name.includes('.')
        ? name.split('.').pop()?.toLowerCase()
        : '';
    if (!extension)
        return 'FILE';
    const labels = {
        css: 'CSS',
        html: 'HTML',
        js: 'JS',
        json: 'JSON',
        jsx: 'JSX',
        md: 'MD',
        ts: 'TS',
        tsx: 'TSX',
    };
    return labels[extension] ?? extension.slice(0, 3).toUpperCase();
}
function ArtifactDetail({ artifact, workspaceActions, previewContent, }) {
    const location = getArtifactLocation(artifact);
    const safeUrl = isSafeHref(artifact.url) ? artifact.url : undefined;
    const isAutomationSnapshot = artifact.metadata?.['artifactType'] === 'automation_snapshot';
    const canPreviewWorkspaceFile = artifact.storage === 'workspace' && Boolean(artifact.workspacePath);
    const canPreviewHtml = canPreviewWorkspaceFile &&
        artifact.workspacePath &&
        isHtmlArtifact(artifact);
    if (canPreviewHtml && artifact.workspacePath) {
        return (_jsx(HtmlArtifactPreview, { workspacePath: artifact.workspacePath, artifactVersion: artifact.updatedAt, workspaceActions: workspaceActions, previewContent: previewContent }));
    }
    if (canPreviewWorkspaceFile && artifact.workspacePath) {
        return (_jsx(FileArtifactPreview, { workspacePath: artifact.workspacePath, artifactVersion: artifact.updatedAt, workspaceActions: workspaceActions }));
    }
    return (_jsxs("div", { className: styles.detail, children: [_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: isAutomationSnapshot ? 'Automation Snapshot' : 'Artifact' }), _jsxs("div", { className: styles.fieldGrid, children: [_jsx(Field, { label: "Type", value: artifactKindLabel(artifact.kind) }), _jsx(Field, { label: "Storage", value: artifact.storage }), _jsx(Field, { label: "Status", value: artifact.status }), _jsx(Field, { label: "Source", value: artifact.source }), _jsx(Field, { label: "Size", value: formatArtifactSize(artifact.sizeBytes) }), _jsx(Field, { label: "Created", value: artifact.createdAt }), _jsx(Field, { label: "Updated", value: artifact.updatedAt }), artifact.toolName && (_jsx(Field, { label: "Tool", value: artifact.toolName })), artifact.toolCallId && (_jsx(Field, { label: "Tool call", value: artifact.toolCallId }))] })] }), artifact.description && (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: "Description" }), _jsx("div", { className: styles.description, children: artifact.description })] })), isAutomationSnapshot && artifact.metadata && (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: "Details" }), _jsxs("div", { className: styles.fieldGrid, children: [metadataField(artifact.metadata, 'automationId', 'Automation ID'), metadataField(artifact.metadata, 'schedule', 'Schedule'), metadataField(artifact.metadata, 'timezone', 'Timezone'), metadataField(artifact.metadata, 'status', 'Status'), metadataField(artifact.metadata, 'nextRunAt', 'Next run'), metadataField(artifact.metadata, 'prompt', 'Prompt')] })] })), (location || safeUrl) && (_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionTitle, children: "Location" }), safeUrl ? (_jsx("a", { className: styles.link, href: safeUrl, target: "_blank", rel: "noreferrer", children: safeUrl })) : (_jsx("div", { className: styles.meta, children: location }))] }))] }));
}
function isHtmlArtifact(artifact) {
    const path = artifact.workspacePath?.toLowerCase() ?? '';
    return (artifact.kind === 'html' || path.endsWith('.html') || path.endsWith('.htm'));
}
function HtmlArtifactPreview({ workspacePath, artifactVersion, workspaceActions, previewContent, }) {
    const [html, setHtml] = useState(previewContent ?? null);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        setHtml(previewContent ?? null);
        setError(null);
        workspaceActions
            .readWorkspaceFile(workspacePath)
            .then((file) => {
            if (cancelled)
                return;
            setHtml(file.content);
            if (file.truncated) {
                setError('Preview is truncated because the file is too large.');
            }
        })
            .catch((err) => {
            if (cancelled)
                return;
            setError(err instanceof Error ? err.message : String(err));
        });
        return () => {
            cancelled = true;
        };
    }, [artifactVersion, previewContent, workspaceActions, workspacePath]);
    return (_jsxs("div", { className: styles.htmlPreviewWrap, children: [html === null ? (_jsx("div", { className: styles.empty, children: "Loading preview..." })) : (_jsx("iframe", { className: styles.htmlPreview, referrerPolicy: "no-referrer", sandbox: "", srcDoc: withArtifactPreviewCsp(html), title: `Preview ${workspacePath}` })), error && _jsx("div", { className: styles.previewError, children: error })] }));
}
function FileArtifactPreview({ workspacePath, artifactVersion, workspaceActions, }) {
    const hostRef = useRef(null);
    const [content, setContent] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        let cancelled = false;
        setContent(null);
        setError(null);
        workspaceActions
            .readWorkspaceFile(workspacePath)
            .then((file) => {
            if (cancelled)
                return;
            setContent(file.content);
            if (file.truncated) {
                setError('File is truncated because it is too large.');
            }
        })
            .catch((err) => {
            if (cancelled)
                return;
            setError(err instanceof Error ? err.message : String(err));
        });
        return () => {
            cancelled = true;
        };
    }, [artifactVersion, workspaceActions, workspacePath]);
    useEffect(() => {
        const host = hostRef.current;
        if (!host || content === null)
            return;
        host.replaceChildren();
        let view;
        try {
            view = new EditorView({
                doc: content,
                extensions: [
                    basicSetup,
                    EditorView.editable.of(false),
                    EditorState.readOnly.of(true),
                    EditorView.lineWrapping,
                ],
                parent: host,
            });
        }
        catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            return undefined;
        }
        return () => view.destroy();
    }, [content]);
    return (_jsxs("div", { className: styles.filePreviewWrap, children: [content === null ? (_jsx("div", { className: styles.empty, children: "Loading file..." })) : (_jsx("div", { ref: hostRef, className: styles.codeMirrorFile })), error && _jsx("div", { className: styles.previewError, children: error })] }));
}
function Field({ label, value }) {
    if (!value)
        return null;
    return (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.fieldLabel, children: label }), _jsx("span", { className: styles.fieldValue, children: value })] }));
}
function metadataField(metadata, key, label) {
    const value = metadata[key];
    if (value === undefined || value === null || value === '')
        return null;
    return _jsx(Field, { label: label, value: String(value) }, key);
}
//# sourceMappingURL=ArtifactPanel.js.map