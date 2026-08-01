/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { SlashCommand } from './types.js';
/**
 * Agent OWASP Compliance Command
 *
 * Checks AI agent codebases against OWASP Agentic Security Initiative Top 10 risks:
 *
 * 1. Excessive Agency
 * 2. Indirect Prompt Injection
 * 3. Memory Corruption
 * 4. Misconfigured Model Context
 * 5. Overreliance on AI
 * 6. Agent Data Leakage
 * 7. Inadequate Sandboxing
 * 8. Denial of Service (Agent)
 * 9. Supply Chain Vulnerabilities
 * 10. Agentic Code Exploitation
 */
export declare const agentOwaspComplianceCommand: SlashCommand;
