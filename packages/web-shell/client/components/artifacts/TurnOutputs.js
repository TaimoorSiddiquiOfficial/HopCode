import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useState } from 'react';
import { useI18n } from '../../i18n';
import { describeCron } from '../dialogs/scheduledTasksSchedule';
import { artifactKindLabel, formatArtifactSize, isSamePath, stripWorkspacePath, } from './artifactUtils';
import { LineStats, sumLineStats } from './LineStats';
import styles from './TurnOutputs.module.css';
export const TURN_OUTPUT_KINDS = [
    'file',
    'artifact',
    'scheduled_task',
];
function TurnOutputsComponent({ turnId, changes, artifacts, scheduledTasks, workspaceCwd, onOpenRequest, onReviewChanges, onOpenArtifact, onOpenScheduledTask, }) {
    const { t } = useI18n();
    const [showAllChanges, setShowAllChanges] = useState(false);
    if (changes.length === 0 &&
        artifacts.length === 0 &&
        scheduledTasks.length === 0) {
        return null;
    }
    const visibleChanges = showAllChanges ? changes : changes.slice(0, 3);
    const remainingChanges = changes.length - 3;
    const totals = sumLineStats(changes);
    const openReview = (selectedPath) => {
        if (onOpenRequest) {
            onOpenRequest({
                id: 'review',
                kind: 'review',
                title: t('turnOutputs.review'),
                turnId,
                changes,
                ...(selectedPath ? { selectedPath } : {}),
            });
            return;
        }
        onReviewChanges(changes, selectedPath);
    };
    const openArtifact = (artifact) => {
        const previewContent = getArtifactPreviewContent(artifact, changes, workspaceCwd);
        if (onOpenRequest) {
            onOpenRequest({
                id: `artifact:${artifact.id}`,
                kind: 'artifact',
                title: artifact.title ?? 'Artifact',
                turnId,
                artifactId: artifact.id,
                artifact,
                ...(previewContent !== undefined ? { previewContent } : {}),
            });
            return;
        }
        onOpenArtifact(artifact.id, previewContent);
    };
    const openScheduledTask = (task) => {
        if (onOpenRequest) {
            onOpenRequest({
                id: `scheduled-task:${task.toolCallId}`,
                kind: 'scheduled_task',
                title: t('scheduledTasks.title'),
                turnId,
                task,
            });
            return;
        }
        onOpenScheduledTask(task);
    };
    return (_jsxs("div", { className: styles.root, children: [changes.length > 0 && (_jsxs("div", { className: styles.card, children: [_jsxs("div", { className: styles.summary, children: [_jsx("span", { className: styles.icon, "aria-hidden": "true", children: _jsxs("svg", { viewBox: "0 0 24 24", fill: "none", focusable: "false", className: styles.iconSvg, children: [_jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", stroke: "currentColor", strokeWidth: "1.6" }), _jsx("path", { d: "M9 9.5h6M12 6.5v6", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" }), _jsx("path", { d: "M9 16h6", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round" })] }) }), _jsxs("div", { children: [_jsx("div", { className: styles.title, children: t('turnOutputs.filesEdited', { count: changes.length }) }), _jsx(LineStats, { additions: totals?.additions, deletions: totals?.deletions, className: styles.lineStats, additionsClassName: styles.additions, deletionsClassName: styles.deletions }), _jsxs("button", { type: "button", className: styles.linkButton, onClick: () => openReview(), children: [t('turnOutputs.viewChanges'), " \u2197"] })] }), _jsx("div", { className: styles.actions, children: _jsx("button", { type: "button", className: styles.reviewButton, onClick: () => openReview(), children: t('turnOutputs.review') }) })] }), _jsxs("div", { className: styles.list, children: [visibleChanges.map((change) => (_jsxs("button", { type: "button", className: styles.fileRow, onClick: () => openReview(change.path), title: change.path, children: [_jsx("span", { className: styles.path, children: displayPath(change.path, workspaceCwd) }), _jsx(LineStats, { additions: change.additions, deletions: change.deletions, className: styles.lineStats, additionsClassName: styles.additions, deletionsClassName: styles.deletions })] }, `${change.toolCallId}:${change.path}`))), remainingChanges > 0 && (_jsxs("button", { type: "button", className: styles.showMoreButton, onClick: () => setShowAllChanges((value) => !value), children: [_jsx("span", { children: showAllChanges
                                            ? t('turnOutputs.collapseFiles')
                                            : t('turnOutputs.showMoreFiles', {
                                                count: remainingChanges,
                                            }) }), _jsx(ChevronIcon, { open: showAllChanges })] }))] })] })), artifacts.map((artifact) => (_jsx(ArtifactCard, { artifact: artifact, onOpen: () => openArtifact(artifact) }, artifact.id))), scheduledTasks.map((task) => (_jsx(ScheduledTaskCard, { task: task, scheduleLabel: describeCron(task.cron, t), onOpen: () => openScheduledTask(task) }, task.toolCallId)))] }));
}
function ArtifactCard({ artifact, onOpen, }) {
    const { t } = useI18n();
    const size = formatArtifactSize(artifact.sizeBytes);
    return (_jsx("div", { className: styles.card, children: _jsxs("div", { className: styles.summary, children: [_jsx("span", { className: styles.icon, "aria-hidden": "true", children: _jsx(DocumentIcon, {}) }), _jsxs("div", { className: styles.artifactInfo, children: [_jsx("div", { className: styles.title, children: artifact.title }), _jsx("div", { className: styles.artifactMeta, children: [artifactKindLabel(artifact.kind), size]
                                .filter(Boolean)
                                .join(' · ') })] }), _jsx("div", { className: styles.actions, children: _jsx("button", { type: "button", className: styles.reviewButton, onClick: onOpen, title: artifact.title, children: t('common.open') }) })] }) }));
}
function ScheduledTaskCard({ task, scheduleLabel, onOpen, }) {
    const { t } = useI18n();
    return (_jsx("div", { className: styles.card, children: _jsxs("div", { className: styles.summary, children: [_jsx("span", { className: styles.icon, "aria-hidden": "true", children: _jsx(ClockIcon, {}) }), _jsxs("div", { className: styles.artifactInfo, children: [_jsx("div", { className: styles.title, children: task.title }), _jsx("div", { className: styles.artifactMeta, children: [
                                scheduleLabel,
                                task.recurring
                                    ? t('scheduledTasks.repeats')
                                    : t('scheduledTasks.runsOnce'),
                            ]
                                .filter(Boolean)
                                .join(' · ') })] }), _jsx("div", { className: styles.actions, children: _jsx("button", { type: "button", className: styles.reviewButton, onClick: onOpen, title: task.title, children: t('common.open') }) })] }) }));
}
function DocumentIcon() {
    return (_jsxs("svg", { className: styles.iconSvg, viewBox: "0 0 24 24", fill: "none", focusable: "false", "aria-hidden": "true", children: [_jsx("rect", { x: "6", y: "4", width: "12", height: "16", rx: "2", stroke: "currentColor", strokeWidth: "1.8" }), _jsx("path", { d: "M9 10h6M9 14h4", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })] }));
}
function ClockIcon() {
    return (_jsxs("svg", { className: styles.iconSvg, viewBox: "0 0 24 24", fill: "none", focusable: "false", "aria-hidden": "true", children: [_jsx("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3", stroke: "currentColor", strokeWidth: "1.8" }), _jsx("path", { d: "M12 8v4l3 2", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" })] }));
}
function ChevronIcon({ open }) {
    return (_jsx("svg", { className: [styles.chevronIcon, open ? styles.chevronIconOpen : '']
            .filter(Boolean)
            .join(' '), viewBox: "0 0 16 16", fill: "none", focusable: "false", "aria-hidden": "true", children: _jsx("path", { d: "m4 6 4 4 4-4", stroke: "currentColor", strokeWidth: "1.7", strokeLinecap: "round", strokeLinejoin: "round" }) }));
}
export const TurnOutputs = memo(TurnOutputsComponent);
export function getArtifactPreviewContent(artifact, changes, workspaceCwd) {
    if (artifact.kind !== 'html' || !artifact.workspacePath)
        return undefined;
    const change = changes.find((item) => isSamePath(item.path, artifact.workspacePath, workspaceCwd));
    if (!change)
        return undefined;
    for (let index = change.diffs.length - 1; index >= 0; index--) {
        const diff = change.diffs[index];
        if (diff?.fullContent)
            return diff.newText;
    }
    return undefined;
}
export function displayPath(path, workspaceCwd) {
    return stripWorkspacePath(path, workspaceCwd);
}
//# sourceMappingURL=TurnOutputs.js.map