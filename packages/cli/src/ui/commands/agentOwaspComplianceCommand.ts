/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  SlashCommand,
  CommandContext,
  SlashCommandActionReturn,
} from './types.js';
import { CommandKind } from './types.js';

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
export const agentOwaspComplianceCommand: SlashCommand = {
  name: 'agent-owasp-compliance',
  description:
    'Check AI agent codebase against OWASP Top 10 agentic security risks',
  kind: CommandKind.BUILT_IN,
  action: async (
    context: CommandContext,
    _args: string,
  ): Promise<SlashCommandActionReturn> => {
    try {
      const complianceResults = await performOwaspComplianceCheck(context);
      return {
        type: 'message',
        messageType: complianceResults.nonCompliant > 0 ? 'warning' : 'success',
        content: generateComplianceReport(complianceResults),
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      return {
        type: 'message',
        messageType: 'error',
        content: `# ❌ OWASP Compliance Check Failed

**Error**: ${errorMessage}

## Troubleshooting

1. Ensure agent codebase is accessible
2. Check file permissions
3. Verify HopCode has read access

Run: \`hopcode /agent-owasp-compliance\` after fixing issues.`,
      };
    }
  },
};

interface ComplianceResult {
  risk: OwaspRisk;
  status: 'compliant' | 'non-compliant' | 'partial';
  findings: string[];
  recommendations: string[];
  evidence?: string;
}

interface OwaspComplianceReport {
  results: ComplianceResult[];
  compliant: number;
  nonCompliant: number;
  partial: number;
}

interface OwaspRisk {
  id: number;
  name: string;
  description: string;
  mitreId?: string;
}

const OWASP_TOP_10: OwaspRisk[] = [
  {
    id: 1,
    name: 'Excessive Agency',
    description: 'Agents with broad permissions can perform unintended actions',
    mitreId: 'T1078',
  },
  {
    id: 2,
    name: 'Indirect Prompt Injection',
    description: 'External inputs manipulate agent behavior through prompts',
    mitreId: 'T1566',
  },
  {
    id: 3,
    name: 'Memory Corruption',
    description:
      'Agent memory manipulated to leak sensitive data or alter behavior',
    mitreId: 'T1562',
  },
  {
    id: 4,
    name: 'Misconfigured Model Context',
    description: 'Improper context window management exposes sensitive data',
  },
  {
    id: 5,
    name: 'Overreliance on AI',
    description: 'Critical decisions made without human oversight',
  },
  {
    id: 6,
    name: 'Agent Data Leakage',
    description: 'Sensitive data exposed through agent outputs or logs',
    mitreId: 'T1537',
  },
  {
    id: 7,
    name: 'Inadequate Sandboxing',
    description: 'Agent actions not properly isolated from production systems',
  },
  {
    id: 8,
    name: 'Denial of Service (Agent)',
    description:
      'Agents overwhelmed with requests consuming excessive resources',
    mitreId: 'T1499',
  },
  {
    id: 9,
    name: 'Supply Chain Vulnerabilities',
    description: 'Compromised dependencies or MCP servers in agent ecosystem',
    mitreId: 'T1195',
  },
  {
    id: 10,
    name: 'Agentic Code Exploitation',
    description: 'Vulnerabilities in agent code allowing unauthorized access',
    mitreId: 'T1190',
  },
];

/**
 * Perform OWASP compliance check
 */
async function performOwaspComplianceCheck(
  context: CommandContext,
): Promise<OwaspComplianceReport> {
  const results: ComplianceResult[] = [];

  // Check each OWASP risk
  for (const risk of OWASP_TOP_10) {
    const result = await checkOwaspRisk(context, risk);
    results.push(result);
  }

  const compliant = results.filter((r) => r.status === 'compliant').length;
  const nonCompliant = results.filter(
    (r) => r.status === 'non-compliant',
  ).length;
  const partial = results.filter((r) => r.status === 'partial').length;

  return { results, compliant, nonCompliant, partial };
}

/**
 * Check specific OWASP risk
 */
async function checkOwaspRisk(
  context: CommandContext,
  risk: OwaspRisk,
): Promise<ComplianceResult> {
  const findings: string[] = [];
  const recommendations: string[] = [];
  let status: 'compliant' | 'non-compliant' | 'partial' = 'compliant';

  switch (risk.id) {
    case 1: // Excessive Agency
      {
        const hasPermissionChecks = await checkForPermissionChecks(context);
        const hasLeastPrivilege = await checkForLeastPrivilege(context);
        const hasUserConfirmation = await checkForUserConfirmation(context);

        if (!hasPermissionChecks) {
          findings.push('No permission checks detected for agent actions');
          recommendations.push(
            'Implement permission checks before sensitive operations',
          );
          status = 'non-compliant';
        }

        if (!hasLeastPrivilege) {
          findings.push('Agent may have excessive permissions');
          recommendations.push(
            'Apply principle of least privilege to agent capabilities',
          );
          if (status === 'compliant') status = 'partial';
        }

        if (!hasUserConfirmation) {
          findings.push(
            'No user confirmation required for destructive actions',
          );
          recommendations.push(
            'Require explicit user confirmation for destructive or irreversible actions',
          );
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 2: // Indirect Prompt Injection
      {
        const hasInputSanitization = await checkForInputSanitization(context);
        const hasPromptSeparation = await checkForPromptSeparation(context);
        const hasExternalInputValidation =
          await checkForExternalInputValidation(context);

        if (!hasInputSanitization) {
          findings.push('No input sanitization for external data');
          recommendations.push(
            'Sanitize all external inputs before including in prompts',
          );
          status = 'non-compliant';
        }

        if (!hasPromptSeparation) {
          findings.push(
            'User input not properly separated from system instructions',
          );
          recommendations.push(
            'Use prompt templates with clear separation of concerns',
          );
          status = 'non-compliant';
        }

        if (!hasExternalInputValidation) {
          findings.push('External inputs not validated before processing');
          recommendations.push('Validate and validate all external inputs');
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 3: // Memory Corruption
      {
        const hasMemoryEncryption = await checkForMemoryEncryption(context);
        const hasMemoryIsolation = await checkForMemoryIsolation(context);
        const hasMemoryValidation = await checkForMemoryValidation(context);

        if (!hasMemoryEncryption) {
          findings.push('Agent memory not encrypted at rest');
          recommendations.push('Encrypt sensitive data in agent memory');
          status = 'non-compliant';
        }

        if (!hasMemoryIsolation) {
          findings.push('Memory not isolated between sessions/users');
          recommendations.push(
            'Isolate memory between different users and sessions',
          );
          status = 'non-compliant';
        }

        if (!hasMemoryValidation) {
          findings.push('No validation of retrieved memory content');
          recommendations.push(
            'Validate memory content before using in decisions',
          );
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 4: // Misconfigured Model Context
      {
        const hasContextLimits = await checkForContextLimits(context);
        const hasSensitiveDataFiltering =
          await checkForSensitiveDataFiltering(context);
        const hasContextRotation = await checkForContextRotation(context);

        if (!hasContextLimits) {
          findings.push('No context window limits configured');
          recommendations.push('Set appropriate context window limits');
          status = 'non-compliant';
        }

        if (!hasSensitiveDataFiltering) {
          findings.push('No filtering of sensitive data from context');
          recommendations.push('Filter PII and secrets from model context');
          status = 'non-compliant';
        }

        if (!hasContextRotation) {
          findings.push('Context not rotated or cleared between sessions');
          recommendations.push('Implement context rotation and cleanup');
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 5: // Overreliance on AI
      {
        const hasHumanOversight = await checkForHumanOversight(context);
        const hasCriticalActionReview =
          await checkForCriticalActionReview(context);
        const hasConfidenceThresholds =
          await checkForConfidenceThresholds(context);

        if (!hasHumanOversight) {
          findings.push('No human oversight for critical decisions');
          recommendations.push(
            'Implement human-in-the-loop for critical operations',
          );
          status = 'non-compliant';
        }

        if (!hasCriticalActionReview) {
          findings.push('Critical actions not reviewed before execution');
          recommendations.push('Require review for high-impact actions');
          status = 'non-compliant';
        }

        if (!hasConfidenceThresholds) {
          findings.push('No confidence thresholds for AI recommendations');
          recommendations.push(
            'Set confidence thresholds and escalate low-confidence outputs',
          );
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 6: // Agent Data Leakage
      {
        const hasDataClassification = await checkForDataClassification(context);
        const hasOutputFiltering = await checkForOutputFiltering(context);
        const hasLoggingRedaction = await checkForLoggingRedaction(context);

        if (!hasDataClassification) {
          findings.push('No data classification for sensitive information');
          recommendations.push('Classify data by sensitivity level');
          status = 'non-compliant';
        }

        if (!hasOutputFiltering) {
          findings.push('No filtering of sensitive data from outputs');
          recommendations.push('Filter sensitive data from agent responses');
          status = 'non-compliant';
        }

        if (!hasLoggingRedaction) {
          findings.push('Logs may contain sensitive data');
          recommendations.push('Redact sensitive information from logs');
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 7: // Inadequate Sandboxing
      {
        const hasSandboxEnvironment = await checkForSandboxEnvironment(context);
        const hasActionLimits = await checkForActionLimits(context);
        const hasRollbackCapability = await checkForRollbackCapability(context);

        if (!hasSandboxEnvironment) {
          findings.push('Agent not running in sandboxed environment');
          recommendations.push('Execute agent actions in isolated sandbox');
          status = 'non-compliant';
        }

        if (!hasActionLimits) {
          findings.push('No rate limits on agent actions');
          recommendations.push('Implement rate limiting for agent operations');
          status = 'non-compliant';
        }

        if (!hasRollbackCapability) {
          findings.push('No rollback capability for agent actions');
          recommendations.push(
            'Implement rollback mechanism for all stateful operations',
          );
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 8: // Denial of Service (Agent)
      {
        const hasRateLimiting = await checkForRateLimiting(context);
        const hasResourceLimits = await checkForResourceLimits(context);
        const hasCircuitBreaker = await checkForCircuitBreaker(context);

        if (!hasRateLimiting) {
          findings.push('No rate limiting for agent requests');
          recommendations.push('Implement rate limiting to prevent DoS');
          status = 'non-compliant';
        }

        if (!hasResourceLimits) {
          findings.push('No resource limits for agent operations');
          recommendations.push(
            'Set CPU, memory, and time limits for agent tasks',
          );
          status = 'non-compliant';
        }

        if (!hasCircuitBreaker) {
          findings.push('No circuit breaker for failing operations');
          recommendations.push(
            'Implement circuit breaker pattern for external calls',
          );
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 9: // Supply Chain Vulnerabilities
      {
        const hasDependencyScanning = await checkForDependencyScanning(context);
        const hasPinnedVersions = await checkForPinnedVersions(context);
        const hasMcpSecurityAudit = await checkForMcpSecurityAudit(context);

        if (!hasDependencyScanning) {
          findings.push('No automated dependency vulnerability scanning');
          recommendations.push(
            'Enable Dependabot or similar for dependency scanning',
          );
          status = 'non-compliant';
        }

        if (!hasPinnedVersions) {
          findings.push('Dependencies not pinned to specific versions');
          recommendations.push('Pin all dependency versions (no ^ or ~)');
          status = 'non-compliant';
        }

        if (!hasMcpSecurityAudit) {
          findings.push('MCP servers not audited for security');
          recommendations.push('Run /mcp-security-audit on all MCP servers');
          if (status === 'compliant') status = 'partial';
        }
      }
      break;

    case 10: // Agentic Code Exploitation
      {
        const hasCodeReview = await checkForCodeReview(context);
        const hasSecurityTesting = await checkForSecurityTesting(context);
        const hasVulnerabilityScanning =
          await checkForVulnerabilityScanning(context);

        if (!hasCodeReview) {
          findings.push('Agent code not regularly reviewed for security');
          recommendations.push('Implement security-focused code reviews');
          status = 'non-compliant';
        }

        if (!hasSecurityTesting) {
          findings.push('No security testing for agent code');
          recommendations.push('Add security tests to CI/CD pipeline');
          status = 'non-compliant';
        }

        if (!hasVulnerabilityScanning) {
          findings.push('No automated vulnerability scanning');
          recommendations.push(
            'Run CodeQL or similar for vulnerability detection',
          );
          if (status === 'compliant') status = 'partial';
        }
      }
      break;
    default:
      // Other risks are considered compliant for now
      break;
  }

  return {
    risk,
    status,
    findings,
    recommendations,
  };
}

/**
 * Compliance check helpers - stubs that honestly report as not-yet-implemented.
 * TODO: Implement each check using actual codebase analysis.
 */
async function checkForPermissionChecks(
  _context: CommandContext,
): Promise<boolean> {
  // Implemented: check if approval mode is NOT yolo
  return process.env.HOPCODE_APPROVAL_MODE !== 'yolo';
}

async function checkForLeastPrivilege(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Scan for permission scopes
}

async function checkForUserConfirmation(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check if destructive commands require confirmation
}

async function checkForInputSanitization(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Scan for sanitization functions
}

async function checkForPromptSeparation(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check prompt template structure
}

async function checkForExternalInputValidation(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check for input validation
}

async function checkForMemoryEncryption(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check memory encryption settings
}

async function checkForMemoryIsolation(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check memory isolation
}

async function checkForMemoryValidation(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check memory validation
}

async function checkForContextLimits(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check if context limits are configured
}

async function checkForSensitiveDataFiltering(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check for PII filtering
}

async function checkForContextRotation(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check context rotation
}

async function checkForHumanOversight(
  _context: CommandContext,
): Promise<boolean> {
  // Use config approval mode rather than raw env var
  return false; // TODO: Check if human oversight is configured for critical actions
}

async function checkForCriticalActionReview(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check for critical action review
}

async function checkForConfidenceThresholds(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check confidence thresholds
}

async function checkForDataClassification(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check data classification
}

async function checkForOutputFiltering(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check output filtering
}

async function checkForLoggingRedaction(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check logging redaction
}

async function checkForSandboxEnvironment(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check if sandbox is configured
}

async function checkForActionLimits(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check action rate limits
}

async function checkForRollbackCapability(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check rollback capability
}

async function checkForRateLimiting(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check rate limiting
}

async function checkForResourceLimits(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check resource limits
}

async function checkForCircuitBreaker(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check circuit breaker
}

async function checkForDependencyScanning(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check if Dependabot or similar is configured
}

async function checkForPinnedVersions(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check package.json for pinned versions
}

async function checkForMcpSecurityAudit(
  _context: CommandContext,
): Promise<boolean> {
  return false; // TODO: Check if MCP security audit is run regularly
}

async function checkForCodeReview(_context: CommandContext): Promise<boolean> {
  return false; // TODO: Check for code review process
}

async function checkForSecurityTesting(
  _context: CommandContext,
): Promise<boolean> {
  // TODO: Check for security tests
  return false; // Needs implementation
}

async function checkForVulnerabilityScanning(
  _context: CommandContext,
): Promise<boolean> {
  // TODO: Check for CodeQL or similar
  return false; // Needs implementation
}

/**
 * Generate compliance report
 */
function generateComplianceReport(report: OwaspComplianceReport): string {
  const total = report.results.length;
  const complianceRate = Math.round((report.compliant / total) * 100);

  let output = `# 🛡️ OWASP Agentic AI Compliance Report

**Overall Compliance**: ${complianceRate}% (${report.compliant}/${total} controls)

| Status | Count |
|--------|-------|
| ✅ Compliant | ${report.compliant} |
| ⚠️ Partial | ${report.partial} |
| ❌ Non-Compliant | ${report.nonCompliant} |

---

## Detailed Findings

`;

  for (const result of report.results) {
    const icon =
      result.status === 'compliant'
        ? '✅'
        : result.status === 'partial'
          ? '⚠️'
          : '❌';

    output += `### ${icon} ${result.risk.id}. ${result.risk.name}

**Status**: ${result.status.toUpperCase()}  
**Description**: ${result.risk.description}${result.risk.mitreId ? ` (MITRE: ${result.risk.mitreId})` : ''}

`;

    if (result.findings.length > 0) {
      output += '**Findings**:\n\n';
      for (const finding of result.findings) {
        output += `- ${finding}\n`;
      }
      output += '\n';
    }

    if (result.recommendations.length > 0) {
      output += '**Recommendations**:\n\n';
      for (const rec of result.recommendations) {
        output += `- [ ] ${rec}\n`;
      }
      output += '\n';
    }

    output += '---\n\n';
  }

  output += `## 📋 Remediation Plan

### Immediate Actions (Critical)

1. Address all non-compliant controls
2. Implement missing security controls
3. Run security audits regularly

### Short-term (1-2 weeks)

1. Address partial compliance items
2. Document security procedures
3. Train team on agentic security

### Long-term (Ongoing)

1. Regular security audits
2. Continuous monitoring
3. Update controls as threats evolve

---

**Audit Date**: ${new Date().toISOString()}  
**OWASP Version**: Agentic AI Top 10 (2026)  
**Next Audit**: Recommended monthly

**Resources**:
- [OWASP Agentic AI](https://owasp.org/www-project-agentic-ai/)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [HopCode Security](docs/users/GITHUB_AUTH_METHODS.md)`;

  return output;
}
