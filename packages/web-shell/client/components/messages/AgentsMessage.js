import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo, useRef, } from 'react';
import { useAgents, useTools, } from '@hoptrendy/webui/daemon-react-sdk';
import { useI18n } from '../../i18n';
import { trimDialogLabel } from '../../utils/dialogLabels';
import styles from './AgentsMessage.module.css';
function scopeForLevel(level) {
    if (level === 'project')
        return 'workspace';
    if (level === 'user')
        return 'global';
    return undefined;
}
function canModifyAgent(agent) {
    return (scopeForLevel(agent.level) !== undefined &&
        !agent.isBuiltin &&
        agent.level !== 'extension');
}
function levelLabel(level, t) {
    if (level === 'project')
        return t('agent.level.project');
    if (level === 'user')
        return t('agent.level.user');
    if (level === 'builtin')
        return t('agent.level.builtin');
    if (level === 'extension')
        return t('agent.level.extension');
    return level;
}
const detailLabel = trimDialogLabel;
function normalizeToolName(tool) {
    return tool.displayName || tool.name;
}
function isReadTool(name) {
    const normalized = name.toLowerCase();
    return [
        'read',
        'grep',
        'glob',
        'ls',
        'list',
        'search',
        'fetch',
        'webfetch',
        'web_fetch',
        'websearch',
        'web_search',
        'think',
        'todo',
        'context',
    ].some((token) => normalized.includes(token));
}
function isEditTool(name) {
    const normalized = name.toLowerCase();
    return ['edit', 'write', 'delete', 'move', 'patch', 'replace', 'create'].some((token) => normalized.includes(token));
}
function isExecuteTool(name) {
    const normalized = name.toLowerCase();
    return ['shell', 'exec', 'run', 'command', 'terminal', 'bash', 'spawn'].some((token) => normalized.includes(token));
}
function resolveToolCategoryIndex(categories, tools) {
    if (!tools || tools.length === 0)
        return 0;
    const input = new Set(tools);
    const match = categories.findIndex((category) => {
        if (category.id === 'all')
            return false;
        if (category.tools.length !== input.size)
            return false;
        return category.tools.every((tool) => input.has(tool));
    });
    return match >= 0 ? match : 0;
}
// ── Main Component ────────────────────────────────────────────────
export function AgentsMessage({ mode, embedded = false, onMessage, onClose, }) {
    const { t } = useI18n();
    const { agents, loading, reload, getAgent, createAgent, generateAgent, deleteAgent, } = useAgents({ autoLoad: true });
    const { tools: workspaceTools } = useTools({ autoLoad: true });
    const [closed, setClosed] = useState(false);
    const [topMode, setTopMode] = useState(() => {
        if (mode === 'manage')
            return 'manage';
        if (mode === 'create' ||
            mode === 'create-user' ||
            mode === 'create-project')
            return 'create';
        return 'menu';
    });
    // ── Menu state ──
    const [menuIdx, setMenuIdx] = useState(0);
    // ── Manage state ──
    const [selectedAgentIdx, setSelectedAgentIdx] = useState(0);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [expandedAgentIdx, setExpandedAgentIdx] = useState(null);
    const [busy, setBusy] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    // ── Create state (linear wizard) ──
    const [createStep, setCreateStep] = useState(1);
    const [createScope, setCreateScope] = useState(() => mode === 'create-user' ? 'global' : 'workspace');
    const [createMethod, setCreateMethod] = useState('manual');
    const [createName, setCreateName] = useState('');
    const [createDesc, setCreateDesc] = useState('');
    const [createPrompt, setCreatePrompt] = useState('');
    const [createTools, setCreateTools] = useState([]);
    const [createSelIdx, setCreateSelIdx] = useState(0);
    const [createGenerating, setCreateGenerating] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const generationRunRef = useRef(0);
    const handleClose = useCallback(() => {
        setClosed(true);
        onClose();
    }, [onClose]);
    // Group agents by level for manage view
    const agentGroups = useMemo(() => {
        const project = agents.filter((a) => a.level === 'project');
        const user = agents.filter((a) => a.level === 'user');
        const builtin = agents.filter((a) => a.level === 'builtin');
        const extension = agents.filter((a) => a.level === 'extension');
        return { project, user, builtin, extension };
    }, [agents]);
    const flatAgents = useMemo(() => [
        ...agentGroups.project,
        ...agentGroups.user,
        ...agentGroups.builtin,
        ...agentGroups.extension,
    ], [agentGroups]);
    const toolCategories = useMemo(() => {
        const enabledToolNames = workspaceTools
            .filter((tool) => tool.enabled)
            .map(normalizeToolName)
            .sort((a, b) => a.localeCompare(b));
        const readTools = enabledToolNames.filter(isReadTool);
        const editTools = enabledToolNames.filter(isEditTool);
        const executeTools = enabledToolNames.filter(isExecuteTool);
        return [
            { id: 'all', label: t('agent.create.tools.all'), tools: [] },
            { id: 'read', label: t('agent.create.tools.readOnly'), tools: readTools },
            {
                id: 'edit',
                label: t('agent.create.tools.readEdit'),
                tools: [...new Set([...readTools, ...editTools])],
            },
            {
                id: 'execute',
                label: t('agent.create.tools.readEditExecute'),
                tools: [...new Set([...readTools, ...editTools, ...executeTools])],
            },
        ];
    }, [t, workspaceTools]);
    // Load agent detail when selected
    useEffect(() => {
        if (topMode !== 'manage')
            return;
        const agent = expandedAgentIdx !== null ? flatAgents[expandedAgentIdx] : undefined;
        if (!agent)
            return;
        getAgent(agent.name)
            .then(setSelectedAgent)
            .catch((e) => setErrorMsg(e instanceof Error ? e.message : String(e)));
    }, [topMode, flatAgents, expandedAgentIdx, getAgent]);
    // Clamp selectedAgentIdx when agents list changes
    useEffect(() => {
        if (selectedAgentIdx >= flatAgents.length && flatAgents.length > 0) {
            setSelectedAgentIdx(flatAgents.length - 1);
        }
        if (expandedAgentIdx !== null && expandedAgentIdx >= flatAgents.length) {
            setExpandedAgentIdx(null);
        }
    }, [expandedAgentIdx, flatAgents.length, selectedAgentIdx]);
    // ── Manage: delete agent ──
    const handleDelete = useCallback((agentIdx = selectedAgentIdx) => {
        const agent = flatAgents[agentIdx];
        if (!agent || !canModifyAgent(agent))
            return;
        const deleteScope = scopeForLevel(agent.level);
        if (!deleteScope)
            return;
        setBusy(true);
        deleteAgent(agent.name, deleteScope)
            .then(() => {
            onMessage(t('agent.deleted', { name: agent.name }));
            setSelectedAgent(null);
            setExpandedAgentIdx(null);
            setSelectedAgentIdx(0);
            reload();
        })
            .catch((e) => setErrorMsg(e instanceof Error ? e.message : String(e)))
            .finally(() => setBusy(false));
    }, [flatAgents, selectedAgentIdx, deleteAgent, onMessage, reload, t]);
    // ── Create: save ──
    const handleCreateSave = useCallback(() => {
        if (!createName.trim() || !createDesc.trim() || !createPrompt.trim()) {
            setErrorMsg(t('agent.create.required'));
            return;
        }
        setBusy(true);
        createAgent({
            name: createName.trim(),
            description: createDesc.trim(),
            systemPrompt: createPrompt.trim(),
            scope: createScope,
            tools: createTools,
        })
            .then((result) => {
            onMessage(t('agent.created', { name: result.agent.name }));
            handleClose();
        })
            .catch((e) => setErrorMsg(e instanceof Error ? e.message : String(e)))
            .finally(() => setBusy(false));
    }, [
        createName,
        createDesc,
        createPrompt,
        createScope,
        createTools,
        createAgent,
        onMessage,
        handleClose,
        t,
    ]);
    // ── Create helpers ──
    const handleGenerateAgent = useCallback(async () => {
        const description = createDesc.trim();
        if (!description || createGenerating)
            return;
        const runId = generationRunRef.current + 1;
        generationRunRef.current = runId;
        setCreateGenerating(true);
        setInputFocused(false);
        setErrorMsg(null);
        try {
            const generated = await generateAgent(description);
            if (generationRunRef.current !== runId)
                return;
            setCreateName(generated.name);
            setCreateDesc(generated.description);
            setCreatePrompt(generated.systemPrompt);
            setCreateStep(createMethod === 'manual' ? 6 : 4);
            setCreateSelIdx(0);
        }
        catch (err) {
            if (generationRunRef.current !== runId)
                return;
            setErrorMsg(t('agent.create.generateFailed', {
                error: err instanceof Error ? err.message : String(err),
            }));
            setInputFocused(true);
        }
        finally {
            if (generationRunRef.current === runId) {
                setCreateGenerating(false);
            }
        }
    }, [createDesc, createGenerating, createMethod, generateAgent, t]);
    const handleInputNext = useCallback((field) => {
        if (field === 'name' && createName.trim()) {
            setCreateStep(4);
            setInputFocused(true);
        }
        else if (field === 'prompt' && createPrompt.trim()) {
            setCreateStep(5);
            setInputFocused(true);
        }
        else if (field === 'desc' && createDesc.trim()) {
            if (createMethod === 'hopcode') {
                void handleGenerateAgent();
                return;
            }
            setCreateStep(createMethod === 'manual' ? 6 : 4);
            setCreateSelIdx(0);
            setInputFocused(false);
        }
    }, [createName, createDesc, createPrompt, createMethod, handleGenerateAgent]);
    // ── Render ──
    if (closed) {
        return (_jsx("div", { className: `${styles.panel} ${embedded ? styles.embedded : ''} ${styles.closed}`, children: _jsx("div", { className: styles.closedText, children: t('agents.closed') }) }));
    }
    if (loading && agents.length === 0) {
        return (_jsxs("div", { className: `${styles.panel} ${embedded ? styles.embedded : ''}`, children: [_jsxs("div", { className: styles.titleLine, children: [_jsx("span", { className: styles.icon, children: "?" }), _jsx("span", { className: styles.title, children: t('agents.title') })] }), _jsx("div", { className: styles.loading, children: t('common.loading') })] }));
    }
    const panelTitle = t('agents.title');
    return (_jsxs("div", { className: `${styles.panel} ${embedded ? styles.embedded : ''}`, children: [!embedded && topMode !== 'create' && (_jsxs("div", { className: styles.titleLine, children: [_jsx("span", { className: styles.icon, children: "?" }), _jsx("span", { className: styles.title, children: panelTitle }), _jsx("span", { className: styles.subtitle, children: t('agent.count', { count: agents.length }) })] })), errorMsg && _jsx("div", { className: styles.error, children: errorMsg }), topMode === 'menu' && (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.text, children: t('agent.selectAction') }), _jsxs("div", { className: styles.options, children: [_jsx(OptionItem, { idx: 0, active: menuIdx === 0, label: t('agent.manage'), desc: t('agent.manage.desc'), onClick: () => {
                                    setMenuIdx(0);
                                    setTopMode('manage');
                                }, onHover: () => setMenuIdx(0) }), _jsx(OptionItem, { idx: 1, active: menuIdx === 1, label: t('agent.create'), desc: t('agent.create.desc'), onClick: () => {
                                    setMenuIdx(1);
                                    setTopMode('create');
                                }, onHover: () => setMenuIdx(1) })] }), _jsx("div", { className: styles.footer, children: t('agent.footer.nav') })] })), topMode === 'manage' && (_jsx(ManageView, { agents: flatAgents, expandedAgentIdx: expandedAgentIdx, selectedAgent: selectedAgent, busy: busy, onToggleAgent: (idx) => {
                    setSelectedAgentIdx(idx);
                    setExpandedAgentIdx((current) => (current === idx ? null : idx));
                    setSelectedAgent(null);
                }, onDelete: (idx) => {
                    if (!busy)
                        handleDelete(idx);
                }, t: t })), topMode === 'create' && (_jsx(CreateView, { step: createStep, method: createMethod, scope: createScope, name: createName, desc: createDesc, prompt: createPrompt, tools: createTools, toolCategories: toolCategories, selIdx: createSelIdx, busy: busy, generating: createGenerating, inputFocused: inputFocused, onSetName: setCreateName, onSetDesc: setCreateDesc, onSetPrompt: setCreatePrompt, onInputNext: handleInputNext, onInputFocus: () => setInputFocused(true), onInputBlur: () => setInputFocused(false), onSetStep: setCreateStep, onSetSelectedIndex: setCreateSelIdx, onSelectLocation: (idx) => {
                    setCreateSelIdx(idx);
                    setCreateScope(idx === 0 ? 'workspace' : 'global');
                }, onSelectMethod: (idx) => {
                    setCreateSelIdx(idx);
                    setCreateMethod(idx === 0 ? 'hopcode' : 'manual');
                }, onSelectTools: (idx) => {
                    setCreateSelIdx(idx);
                    setCreateTools(toolCategories[idx]?.tools ?? []);
                }, onSave: () => {
                    if (!busy)
                        handleCreateSave();
                }, t: t }))] }));
}
// ── Shared OptionItem ─────────────────────────────────────────────
function OptionItem({ idx, active, label, desc, badge, numbered = false, onClick, onHover, }) {
    return (_jsxs("div", { className: `${styles.option} ${active ? styles.optionActive : ''}`, onClick: onClick, onMouseEnter: onHover, children: [_jsx("span", { className: styles.optionIcon, "aria-hidden": "true" }), _jsxs("span", { className: styles.optionContent, children: [_jsxs("span", { className: styles.optionLabel, children: [numbered ? `${idx + 1}. ` : '', label, badge && _jsx("span", { className: styles.badge, children: badge })] }), desc && _jsx("span", { className: styles.optionDesc, children: desc })] })] }));
}
// ── Manage View ───────────────────────────────────────────────────
function ManageView({ agents, expandedAgentIdx, selectedAgent, busy, onToggleAgent, onDelete, t, }) {
    const [deleteConfirmIdx, setDeleteConfirmIdx] = useState(null);
    const projectNames = useMemo(() => new Set(agents
        .filter((agent) => agent.level === 'project')
        .map((agent) => agent.name)), [agents]);
    if (agents.length === 0) {
        return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.text, children: t('agent.empty') }), _jsx("div", { className: styles.text, children: t('agent.createFirstHint') })] }));
    }
    return (_jsx("div", { className: styles.manageList, children: agents.map((agent, idx) => {
            const expanded = expandedAgentIdx === idx;
            const detail = expanded && selectedAgent?.name === agent.name ? selectedAgent : null;
            const mutable = canModifyAgent(agent);
            const detailTools = detail?.tools ?? [];
            const toolsText = detailTools.length === 0 || detailTools.includes('*')
                ? t('agent.create.tools.all')
                : detailTools.join(', ');
            return (_jsxs("div", { className: `${styles.manageItem} ${expanded ? styles.manageItemExpanded : ''}`, children: [_jsxs("button", { type: "button", className: `${styles.manageRow} ${expanded ? styles.manageRowActive : ''}`, onClick: () => {
                            setDeleteConfirmIdx(null);
                            onToggleAgent(idx);
                        }, children: [_jsx("span", { className: styles.manageIcon, "aria-hidden": "true" }), _jsx("span", { className: styles.manageName, children: agent.name }), _jsx("span", { className: styles.levelTag, children: levelLabel(agent.level, t) }), agent.level === 'user' && projectNames.has(agent.name) ? (_jsx("span", { className: styles.levelTag, children: t('agent.overriddenBadge') })) : null, _jsx("span", { className: `${styles.manageChevron} ${expanded ? styles.manageChevronExpanded : ''}` })] }), expanded ? (_jsx("div", { className: styles.manageDetail, children: detail ? (_jsxs("div", { className: styles.manageDetailInner, children: [_jsx("div", { className: styles.manageDetailHeader, children: mutable ? (_jsx("div", { className: styles.manageActions, children: deleteConfirmIdx === idx ? (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.deleteText, children: busy
                                                        ? t('agent.delete.loading')
                                                        : t('agent.delete.confirm', {
                                                            name: agent.name,
                                                        }) }), _jsx("button", { type: "button", className: styles.manageButton, onClick: () => setDeleteConfirmIdx(null), disabled: busy, children: t('common.cancel') }), _jsx("button", { type: "button", className: `${styles.manageButton} ${styles.dangerButton}`, onClick: () => onDelete(idx), disabled: busy, children: t('agent.action.delete') })] })) : (_jsx("button", { type: "button", className: `${styles.manageButton} ${styles.dangerButton}`, onClick: () => setDeleteConfirmIdx(idx), disabled: busy, children: t('agent.action.delete') })) })) : null }), _jsxs("div", { className: styles.viewerField, children: [_jsx("div", { className: styles.viewerSectionTitle, children: detailLabel(t('agent.toolsLabel')) }), _jsx("div", { className: styles.viewerBlock, children: toolsText })] }), _jsxs("div", { className: styles.viewerField, children: [_jsx("div", { className: styles.viewerSectionTitle, children: detailLabel(t('agent.filePathLabel')) }), _jsx("div", { className: styles.viewerBlock, children: detail.filePath || '—' })] }), detail.model ? (_jsxs("div", { className: styles.viewerRow, children: [_jsx("span", { className: styles.viewerLabel, children: detailLabel(t('agent.modelLabel')) }), _jsx("span", { children: detail.model })] })) : null, _jsxs("div", { className: styles.viewerField, children: [_jsx("div", { className: styles.viewerSectionTitle, children: detailLabel(t('agent.descriptionLabel')) }), _jsx("div", { className: styles.viewerBlock, children: detail.description || '—' })] }), _jsxs("div", { className: styles.viewerField, children: [_jsx("div", { className: styles.viewerSectionTitle, children: detailLabel(t('agent.systemPromptLabel')) }), _jsx("div", { className: styles.viewerBlock, children: detail.systemPrompt || '—' })] })] })) : (_jsx("div", { className: styles.loading, children: t('common.loading') })) })) : null] }, `${agent.level}:${agent.name}`));
        }) }));
}
// ── Create View ───────────────────────────────────────────────────
function CreateView({ step, method, scope, name, desc, prompt, tools, toolCategories, selIdx, busy, generating, inputFocused, onSetName, onSetDesc, onSetPrompt, onInputNext, onInputFocus, onInputBlur, onSetStep, onSetSelectedIndex, onSelectLocation, onSelectMethod, onSelectTools, onSave, t, }) {
    const nameRef = useRef(null);
    const descRef = useRef(null);
    const promptRef = useRef(null);
    // Auto-focus text inputs
    useEffect(() => {
        if (!inputFocused)
            return;
        if (method === 'manual') {
            if (step === 3)
                nameRef.current?.focus();
            else if (step === 4)
                promptRef.current?.focus();
            else if (step === 5)
                descRef.current?.focus();
        }
        else {
            if (step === 3)
                descRef.current?.focus();
        }
    }, [step, method, inputFocused]);
    const toolsStep = method === 'manual' ? 6 : 4;
    const confirmStep = toolsStep + 1;
    const stepItems = method === 'manual'
        ? [
            t('agent.create.location'),
            t('agent.create.method'),
            t('agent.create.name'),
            t('agent.create.prompt'),
            t('agent.create.description'),
            t('agent.create.toolsSelection'),
        ]
        : [
            t('agent.create.location'),
            t('agent.create.method'),
            t('agent.create.describeAgent'),
            t('agent.create.toolsSelection'),
        ];
    const selectedIndexForStep = (targetStep) => {
        if (targetStep === 1)
            return scope === 'workspace' ? 0 : 1;
        if (targetStep === 2)
            return method === 'hopcode' ? 0 : 1;
        if (targetStep === toolsStep) {
            return resolveToolCategoryIndex(toolCategories, tools);
        }
        return 0;
    };
    const goToStep = (targetStep) => {
        onSetStep(targetStep);
        onSetSelectedIndex(selectedIndexForStep(targetStep));
        if ((method === 'manual' &&
            (targetStep === 3 || targetStep === 4 || targetStep === 5)) ||
            (method === 'hopcode' && targetStep === 3)) {
            onInputFocus();
        }
        else {
            onInputBlur();
        }
    };
    const goBack = () => {
        if (step <= 1 || generating)
            return;
        goToStep(step - 1);
    };
    const goNext = () => {
        if (generating)
            return;
        if (step === 1) {
            goToStep(2);
            return;
        }
        if (step === 2) {
            goToStep(3);
            return;
        }
        if (method === 'manual' && step === 3) {
            onInputNext('name');
            return;
        }
        if (method === 'manual' && step === 4) {
            onInputNext('prompt');
            return;
        }
        if ((method === 'manual' && step === 5) ||
            (method === 'hopcode' && step === 3)) {
            onInputNext('desc');
            return;
        }
        if (step === toolsStep) {
            onSelectTools(selIdx);
            goToStep(confirmStep);
        }
    };
    const nextDisabled = generating ||
        (method === 'manual' && step === 3 && !name.trim()) ||
        (method === 'manual' && step === 4 && !prompt.trim()) ||
        (method === 'manual' && step === 5 && !desc.trim()) ||
        (method === 'hopcode' && step === 3 && !desc.trim());
    let body = null;
    if (step === 1) {
        body = (_jsx(_Fragment, { children: _jsxs("div", { className: styles.options, children: [_jsx(OptionItem, { idx: 0, active: selIdx === 0, label: t('agent.create.project.cli'), numbered: true, onClick: () => onSelectLocation(0) }), _jsx(OptionItem, { idx: 1, active: selIdx === 1, label: t('agent.create.user.cli'), numbered: true, onClick: () => onSelectLocation(1) })] }) }));
    }
    if (step === 2) {
        body = (_jsx(_Fragment, { children: _jsxs("div", { className: styles.options, children: [_jsx(OptionItem, { idx: 0, active: selIdx === 0, label: t('agent.create.method.hopcode.recommended'), numbered: true, onClick: () => onSelectMethod(0) }), _jsx(OptionItem, { idx: 1, active: selIdx === 1, label: t('agent.create.method.manual'), numbered: true, onClick: () => onSelectMethod(1) })] }) }));
    }
    if (method === 'manual' && step === 3) {
        body = (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.text, children: t('agent.create.nameHelp') }), _jsx("input", { ref: nameRef, className: styles.textInput, value: name, onChange: (e) => onSetName(e.target.value), onFocus: onInputFocus, onBlur: onInputBlur, placeholder: t('agent.create.namePlaceholder'), autoFocus: true })] }));
    }
    if (method === 'manual' && step === 4) {
        body = (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.text, children: t('agent.create.promptHelp') }), _jsx("textarea", { ref: promptRef, className: styles.textArea, value: prompt, onChange: (e) => onSetPrompt(e.target.value), onFocus: onInputFocus, onBlur: onInputBlur, placeholder: t('agent.create.promptPlaceholder.cli'), autoFocus: true })] }));
    }
    if (method === 'manual' && step === 5) {
        body = (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.text, children: t('agent.create.manualDescHelp') }), _jsx("textarea", { ref: descRef, className: styles.textArea, value: desc, onChange: (e) => onSetDesc(e.target.value), onFocus: onInputFocus, onBlur: onInputBlur, placeholder: t('agent.create.manualDescPlaceholder'), autoFocus: true })] }));
    }
    if (method === 'hopcode' && step === 3) {
        body = (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.text, children: t('agent.create.hopcodeHint') }), generating ? (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.text, children: t('agent.create.generatingConfig') }), _jsx("div", { className: styles.footer, children: t('agent.footer.generating') })] })) : (_jsx(_Fragment, { children: _jsx("textarea", { ref: descRef, className: styles.textArea, value: desc, onChange: (e) => onSetDesc(e.target.value), onFocus: onInputFocus, onBlur: onInputBlur, placeholder: t('agent.create.hopcodePlaceholder'), autoFocus: true }) }))] }));
    }
    if (step === toolsStep) {
        const selectedCategory = toolCategories[selIdx] ?? toolCategories[0];
        const selectedToolList = selectedCategory?.tools ?? [];
        const selectedToolsDisplay = selectedCategory?.id === 'all'
            ? t('agent.create.tools.allInfo')
            : selectedToolList.length > 0
                ? selectedToolList.join(', ')
                : t('agent.create.tools.none');
        const selectedReadTools = selectedToolList.filter(isReadTool);
        const selectedEditTools = selectedToolList.filter(isEditTool);
        const selectedExecuteTools = selectedToolList.filter(isExecuteTool);
        body = (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.options, children: toolCategories.map((category, i) => (_jsx(OptionItem, { idx: i, active: selIdx === i, label: category.label, numbered: true, onClick: () => onSelectTools(i) }, category.id))) }), _jsx("div", { className: styles.toolDetail, children: selectedCategory?.id === 'all' ? (_jsx("div", { className: styles.toolDetailBody, children: selectedToolsDisplay })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.toolDetailTitle, children: t('agent.create.tools.selected') }), _jsx("div", { className: styles.toolList, children: selectedToolList.length === 0 ? (selectedToolsDisplay) : (_jsxs(_Fragment, { children: [selectedReadTools.length > 0 && (_jsxs("div", { children: [t('agent.create.tools.readOnlyLabel'), ' ', selectedReadTools.join(', ')] })), selectedEditTools.length > 0 && (_jsxs("div", { children: [t('agent.create.tools.editLabel'), ' ', selectedEditTools.join(', ')] })), selectedExecuteTools.length > 0 && (_jsxs("div", { children: [t('agent.create.tools.executionLabel'), ' ', selectedExecuteTools.join(', ')] }))] })) })] })) })] }));
    }
    if (step === confirmStep) {
        const toolsDisplay = tools.length === 0 ? '*' : tools.join(', ');
        body = (_jsx(_Fragment, { children: _jsxs("div", { className: styles.summary, children: [_jsxs("div", { className: styles.summaryRow, children: [_jsx("span", { className: styles.summaryLabel, children: detailLabel(t('agent.create.name')) }), _jsx("span", { className: styles.summaryValue, children: name || '—' })] }), _jsxs("div", { className: styles.summaryRow, children: [_jsx("span", { className: styles.summaryLabel, children: detailLabel(t('agent.location')) }), _jsx("span", { className: styles.summaryValue, children: scope === 'workspace'
                                    ? t('agent.create.project.cli')
                                    : t('agent.create.user.cli') })] }), _jsxs("div", { className: styles.summaryRow, children: [_jsx("span", { className: styles.summaryLabel, children: detailLabel(t('agent.toolsLabel')) }), _jsx("span", { className: styles.summaryValue, children: toolsDisplay })] }), _jsx("div", { className: styles.summaryBlockTitle, children: detailLabel(t('agent.descriptionLabel')) }), _jsx("div", { className: styles.summaryBlock, children: desc || '—' }), _jsx("div", { className: styles.summaryBlockTitle, children: detailLabel(t('agent.systemPromptLabel')) }), _jsx("div", { className: styles.summaryBlock, children: prompt || '—' })] }) }));
    }
    return (_jsxs("div", { className: styles.createWizard, children: [_jsx("div", { className: styles.createSteps, children: stepItems.map((label, index) => {
                    const stepNumber = index + 1;
                    return (_jsxs("div", { className: `${styles.createStepPill} ${stepNumber === Math.min(step, toolsStep)
                            ? styles.createStepPillActive
                            : ''} ${stepNumber < Math.min(step, toolsStep) ? styles.createStepPillDone : ''}`, children: [_jsx("span", { className: styles.createStepNumber, children: stepNumber }), _jsx("span", { className: styles.createStepLabel, children: label })] }, `${stepNumber}:${label}`));
                }) }), _jsx("div", { className: styles.createBody, children: body }), _jsxs("div", { className: styles.createActions, children: [_jsx("button", { type: "button", className: styles.manageButton, onClick: goBack, disabled: step <= 1 || generating || busy, children: t('common.previous') }), step === confirmStep ? (_jsx("button", { type: "button", className: styles.manageButton, onClick: onSave, disabled: busy, children: busy ? t('agent.create.loading') : t('agent.create.save') })) : (_jsx("button", { type: "button", className: styles.manageButton, onClick: goNext, disabled: nextDisabled, children: t('common.next') }))] })] }));
}
//# sourceMappingURL=AgentsMessage.js.map