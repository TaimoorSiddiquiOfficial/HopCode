/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export declare const SERVICE_NAME = "hopcode";
export declare const EVENT_USER_PROMPT = "hopcode.user_prompt";
export declare const EVENT_USER_RETRY = "hopcode.user_retry";
export declare const EVENT_TOOL_CALL = "hopcode.tool_call";
export declare const EVENT_API_REQUEST = "hopcode.api_request";
export declare const EVENT_API_ERROR = "hopcode.api_error";
export declare const EVENT_API_CANCEL = "hopcode.api_cancel";
export declare const EVENT_API_RESPONSE = "hopcode.api_response";
export declare const EVENT_CLI_CONFIG = "hopcode.config";
export declare const EVENT_EXTENSION_DISABLE = "hopcode.extension_disable";
export declare const EVENT_EXTENSION_ENABLE = "hopcode.extension_enable";
export declare const EVENT_EXTENSION_INSTALL = "hopcode.extension_install";
export declare const EVENT_EXTENSION_UNINSTALL = "hopcode.extension_uninstall";
export declare const EVENT_EXTENSION_UPDATE = "hopcode.extension_update";
export declare const EVENT_FLASH_FALLBACK = "hopcode.flash_fallback";
export declare const EVENT_RIPGREP_FALLBACK = "hopcode.ripgrep_fallback";
export declare const EVENT_NEXT_SPEAKER_CHECK = "hopcode.next_speaker_check";
export declare const EVENT_SLASH_COMMAND = "hopcode.slash_command";
export declare const EVENT_IDE_CONNECTION = "hopcode.ide_connection";
export declare const EVENT_CHAT_COMPRESSION = "hopcode.chat_compression";
export declare const EVENT_INVALID_CHUNK = "hopcode.chat.invalid_chunk";
export declare const EVENT_CONTENT_RETRY = "hopcode.chat.content_retry";
export declare const EVENT_CONTENT_RETRY_FAILURE = "qwen-code.chat.content_retry_failure";
export declare const EVENT_PROTOCOL_TAG_SANITIZED = "qwen-code.chat.protocol_tag_sanitized";
export declare const EVENT_API_RETRY = "hopcode.api_retry";
export declare const EVENT_CONVERSATION_FINISHED = "hopcode.conversation_finished";
export declare const EVENT_MALFORMED_JSON_RESPONSE = "hopcode.malformed_json_response";
export declare const EVENT_FILE_OPERATION = "hopcode.file_operation";
export declare const EVENT_MODEL_SLASH_COMMAND = "hopcode.slash_command.model";
export declare const EVENT_SUBAGENT_EXECUTION = "hopcode.subagent_execution";
export declare const EVENT_SKILL_LAUNCH = "hopcode.skill_launch";
export declare const EVENT_AUTH = "hopcode.auth";
export declare const EVENT_USER_FEEDBACK = "hopcode.user_feedback";
export declare const EVENT_TOOL_OUTPUT_TRUNCATED = "hopcode.tool_output_truncated";
export declare const DEFAULT_SENSITIVE_SPAN_ATTRIBUTE_MAX_LENGTH: number;
export declare const SENSITIVE_SPAN_ATTRIBUTE_MAX_LENGTH_LIMIT: number;
export declare function isValidSensitiveSpanAttributeMaxLength(value: number): boolean;
export declare const EVENT_PROMPT_SUGGESTION = "hopcode.prompt_suggestion";
export declare const EVENT_SPECULATION = "hopcode.speculation";
export declare const EVENT_WORKFLOW_KEYWORD = "hopcode.workflow_keyword";
export declare const EVENT_WORKFLOW_RUN = "hopcode.workflow_run";
export declare const EVENT_ARENA_SESSION_STARTED = "hopcode.arena_session_started";
export declare const EVENT_ARENA_AGENT_COMPLETED = "hopcode.arena_agent_completed";
export declare const EVENT_ARENA_SESSION_ENDED = "hopcode.arena_session_ended";
export declare const EVENT_STARTUP_PERFORMANCE = "hopcode.startup.performance";
export declare const EVENT_MEMORY_USAGE = "hopcode.memory.usage";
export declare const EVENT_PERFORMANCE_BASELINE = "hopcode.performance.baseline";
export declare const EVENT_PERFORMANCE_REGRESSION = "hopcode.performance.regression";
export declare const EVENT_MEMORY_EXTRACT = "hopcode.memory.extract";
export declare const EVENT_MEMORY_DREAM = "hopcode.memory.dream";
export declare const EVENT_MEMORY_RECALL = "hopcode.memory.recall";
export declare const SPAN_INTERACTION = "hopcode.interaction";
export declare const SPAN_LLM_REQUEST = "hopcode.llm_request";
export declare const SPAN_TOOL = "hopcode.tool";
export declare const SPAN_TOOL_EXECUTION = "hopcode.tool.execution";
/** Brackets the time a tool spends in `awaiting_approval` waiting on the user. */
export declare const SPAN_TOOL_BLOCKED_ON_USER = "hopcode.tool.blocked_on_user";
/** Wraps each pre/post-tool-use hook fire site for per-hook latency / decision tracking. */
export declare const SPAN_HOOK = "hopcode.hook";
/**
 * Wraps a single subagent invocation. Parents the LLM/tool/hook spans the
 * subagent emits, so concurrent subagents (parallel AGENT tool calls) get
 * isolated subtrees instead of interleaving under the parent interaction
 * (#3731 Phase 3).
 */
export declare const SPAN_SUBAGENT = "hopcode.subagent";
