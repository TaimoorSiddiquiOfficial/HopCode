/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export const SERVICE_NAME = 'hopcode';

export const EVENT_USER_PROMPT = 'hopcode.user_prompt';
export const EVENT_USER_RETRY = 'hopcode.user_retry';
export const EVENT_TOOL_CALL = 'hopcode.tool_call';
export const EVENT_API_REQUEST = 'hopcode.api_request';
export const EVENT_API_ERROR = 'hopcode.api_error';
export const EVENT_API_CANCEL = 'hopcode.api_cancel';
export const EVENT_API_RESPONSE = 'hopcode.api_response';
export const EVENT_CLI_CONFIG = 'hopcode.config';
export const EVENT_EXTENSION_DISABLE = 'hopcode.extension_disable';
export const EVENT_EXTENSION_ENABLE = 'hopcode.extension_enable';
export const EVENT_EXTENSION_INSTALL = 'hopcode.extension_install';
export const EVENT_EXTENSION_UNINSTALL = 'hopcode.extension_uninstall';
export const EVENT_EXTENSION_UPDATE = 'hopcode.extension_update';
export const EVENT_FLASH_FALLBACK = 'hopcode.flash_fallback';
export const EVENT_RIPGREP_FALLBACK = 'hopcode.ripgrep_fallback';
export const EVENT_NEXT_SPEAKER_CHECK = 'hopcode.next_speaker_check';
export const EVENT_SLASH_COMMAND = 'hopcode.slash_command';
export const EVENT_IDE_CONNECTION = 'hopcode.ide_connection';
export const EVENT_CHAT_COMPRESSION = 'hopcode.chat_compression';
export const EVENT_INVALID_CHUNK = 'hopcode.chat.invalid_chunk';
export const EVENT_CONTENT_RETRY = 'hopcode.chat.content_retry';
export const EVENT_CONTENT_RETRY_FAILURE = 'hopcode.chat.content_retry_failure';
export const EVENT_CONVERSATION_FINISHED = 'hopcode.conversation_finished';
export const EVENT_MALFORMED_JSON_RESPONSE = 'hopcode.malformed_json_response';
export const EVENT_FILE_OPERATION = 'hopcode.file_operation';
export const EVENT_MODEL_SLASH_COMMAND = 'hopcode.slash_command.model';
export const EVENT_SUBAGENT_EXECUTION = 'hopcode.subagent_execution';
export const EVENT_SKILL_LAUNCH = 'hopcode.skill_launch';
export const EVENT_AUTH = 'hopcode.auth';
export const EVENT_USER_FEEDBACK = 'hopcode.user_feedback';

// Prompt Suggestion Events
export const EVENT_PROMPT_SUGGESTION = 'hopcode.prompt_suggestion';
export const EVENT_SPECULATION = 'hopcode.speculation';

// Arena Events
export const EVENT_ARENA_SESSION_STARTED = 'hopcode.arena_session_started';
export const EVENT_ARENA_AGENT_COMPLETED = 'hopcode.arena_agent_completed';
export const EVENT_ARENA_SESSION_ENDED = 'hopcode.arena_session_ended';

// Performance Events
export const EVENT_STARTUP_PERFORMANCE = 'hopcode.startup.performance';
export const EVENT_MEMORY_USAGE = 'hopcode.memory.usage';
export const EVENT_PERFORMANCE_BASELINE = 'hopcode.performance.baseline';
export const EVENT_PERFORMANCE_REGRESSION = 'hopcode.performance.regression';

// Managed Auto-Memory Events
export const EVENT_MEMORY_EXTRACT = 'hopcode.memory.extract';
export const EVENT_MEMORY_DREAM = 'hopcode.memory.dream';
export const EVENT_MEMORY_RECALL = 'hopcode.memory.recall';
