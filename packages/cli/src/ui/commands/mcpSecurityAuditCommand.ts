/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext, SlashCommandActionReturn } from './types.js';
import { CommandKind } from './types.js';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * MCP Security Audit Command
 * 
 * Audits MCP server configurations for security issues:
 * - Hardcoded secrets and API keys
 * - Unpinned versions (supply chain risk)
 * - Insecure permissions
 * - Missing validation
 * - Dangerous command execution
 */
export const mcpSecurityAuditCommand: SlashCommand = {
  name: 'mcp-security-audit',
  description: 'Audit MCP server configurations for security vulnerabilities',
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, _args: string): Promise<SlashCommandActionReturn> => {
    try {
      const auditResults = await performMcpSecurityAudit(context);

      if (auditResults.critical.length > 0 || auditResults.high.length > 0) {
        return {
          type: 'message',
          messageType: 'warning',
          content: generateSecurityReport(auditResults),
        };
      }

      return {
        type: 'message',
        messageType: 'success',
        content: generateSecurityReport(auditResults),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        type: 'message',
        messageType: 'error',
        content: `# ❌ MCP Security Audit Failed

**Error**: ${errorMessage}

## Troubleshooting

1. Check MCP configuration files exist
2. Verify file permissions
3. Ensure HopCode has read access to MCP configs

Run: \`hopcode /mcp-security-audit\` after fixing issues.`,
      };
    }
  },
};

/**
 * Security audit findings
 */
interface SecurityFindings {
  critical: Finding[];
  high: Finding[];
  medium: Finding[];
  low: Finding[];
  info: Finding[];
}

interface Finding {
  rule: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  file: string;
  line?: number;
  description: string;
  recommendation: string;
  evidence?: string;
}

/**
 * Perform comprehensive MCP security audit
 */
async function performMcpSecurityAudit(context: CommandContext): Promise<SecurityFindings> {
  const findings: SecurityFindings = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: [],
  };

  // Find MCP configuration files
  const mcpConfigs = await findMcpConfigFiles(context);

  for (const configFile of mcpConfigs) {
    await auditMcpConfigFile(configFile, findings);
  }

  // Check for hardcoded secrets in MCP server code
  const mcpServers = await findMcpServerFiles(context);
  for (const serverFile of mcpServers) {
    await auditMcpServerFile(serverFile, findings);
  }

  return findings;
}

/**
 * Find MCP configuration files
 */
async function findMcpConfigFiles(_context: CommandContext): Promise<string[]> {
  const configFiles: string[] = [];
  const possiblePaths = [
    '.hopcode/mcp.json',
    '.qwen/mcp.json',
    'mcp.json',
    '.mcp.json',
    join(process.cwd(), '.hopcode', 'mcp.json'),
    join(process.cwd(), '.qwen', 'mcp.json'),
  ];

  for (const path of possiblePaths) {
    if (existsSync(path)) {
      configFiles.push(path);
    }
  }

  return configFiles;
}

/**
 * Find MCP server source files
 */
async function findMcpServerFiles(_context: CommandContext): Promise<string[]> {
  const serverFiles: string[] = [];

  // TODO: Implement glob search when available
  // For now, check common locations
  const commonPaths = [
    'packages/core/src/mcp',
    'packages/mcp-server/src',
    'mcp-server/src',
  ];

  for (const dir of commonPaths) {
    if (existsSync(dir)) {
      // Add TypeScript files in directory
      const files = await readDirectoryRecursive(dir);
      serverFiles.push(...files.filter(f => f.endsWith('.ts') || f.endsWith('.js')));
    }
  }

  return serverFiles;
}

/**
 * Recursively read directory for files
 */
async function readDirectoryRecursive(dir: string): Promise<string[]> {
  const { readdir } = await import('node:fs/promises');
  const { stat } = await import('node:fs/promises');
  const { join } = await import('node:path');

  const files: string[] = [];

  try {
    const entries = await readdir(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stats = await stat(fullPath);

      if (stats.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
        const subFiles = await readDirectoryRecursive(fullPath);
        files.push(...subFiles);
      } else if (stats.isFile()) {
        files.push(fullPath);
      }
    }
  } catch {
    // Ignore errors
  }

  return files;
}

/**
 * Audit MCP configuration file
 */
async function auditMcpConfigFile(configPath: string, findings: SecurityFindings): Promise<void> {
  try {
    const content = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content);

    // Check for hardcoded secrets
    auditForSecrets(configPath, content, findings);

    // Check for unpinned versions
    auditForUnpinnedVersions(configPath, config, findings);

    // Check for insecure command execution
    auditForInsecureCommands(configPath, config, findings);

    // Check for missing validation
    auditForMissingValidation(configPath, config, findings);

    // Check for dangerous permissions
    auditForPermissions(configPath, config, findings);
  } catch (error) {
    findings.info.push({
      rule: 'CONFIG_PARSE_ERROR',
      severity: 'info',
      file: configPath,
      description: 'Could not parse MCP configuration file',
      recommendation: 'Verify JSON syntax is correct',
      evidence: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Audit MCP server source files
 */
async function auditMcpServerFile(serverPath: string, findings: SecurityFindings): Promise<void> {
  try {
    const content = readFileSync(serverPath, 'utf-8');
    const lines = content.split('\n');

    // Check for hardcoded secrets
    auditForSecrets(serverPath, content, findings);

    // Check for dangerous patterns
    auditForDangerousPatterns(serverPath, content, lines, findings);

    // Check for missing input validation
    auditForInputValidation(serverPath, content, findings);

    // Check for insecure temp file usage
    auditForInsecureTempFiles(serverPath, content, findings);
  } catch (error) {
    findings.info.push({
      rule: 'FILE_READ_ERROR',
      severity: 'info',
      file: serverPath,
      description: 'Could not read MCP server file',
      recommendation: 'Verify file exists and is readable',
      evidence: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Check for hardcoded secrets
 */
function auditForSecrets(filePath: string, content: string, findings: SecurityFindings): void {
  const secretPatterns = [
    {
      pattern: /api[_-]?key\s*[=:]\s*["'][^"']+["']/gi,
      rule: 'HARDCODED_API_KEY',
      severity: 'critical' as const,
      description: 'Hardcoded API key detected',
    },
    {
      pattern: /secret\s*[=:]\s*["'][^"']+["']/gi,
      rule: 'HARDCODED_SECRET',
      severity: 'critical' as const,
      description: 'Hardcoded secret detected',
    },
    {
      pattern: /password\s*[=:]\s*["'][^"']+["']/gi,
      rule: 'HARDCODED_PASSWORD',
      severity: 'critical' as const,
      description: 'Hardcoded password detected',
    },
    {
      pattern: /token\s*[=:]\s*["'][^"']+["']/gi,
      rule: 'HARDCODED_TOKEN',
      severity: 'high' as const,
      description: 'Hardcoded token detected',
    },
    {
      pattern: /Bearer\s+[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/g,
      rule: 'HARDCODED_JWT',
      severity: 'critical' as const,
      description: 'Hardcoded JWT token detected',
    },
    {
      pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g,
      rule: 'HARDCODED_PRIVATE_KEY',
      severity: 'critical' as const,
      description: 'Hardcoded private key detected',
    },
    {
      pattern: /ghp_[a-zA-Z0-9]{36}/g,
      rule: 'GITHUB_PAT',
      severity: 'critical' as const,
      description: 'GitHub Personal Access Token detected',
    },
    {
      pattern: /gho_[a-zA-Z0-9]{36}/g,
      rule: 'GITHUB_OAUTH',
      severity: 'critical' as const,
      description: 'GitHub OAuth token detected',
    },
  ];

  const lines = content.split('\n');

  for (const { pattern, rule, severity, description } of secretPatterns) {
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(pattern);
      if (match && !lines[i].trim().startsWith('//') && !lines[i].trim().startsWith('#')) {
        findings[severity].push({
          rule,
          severity,
          file: filePath,
          line: i + 1,
          description,
          recommendation: 'Use environment variables or a secrets manager instead',
          evidence: lines[i].trim(),
        });
      }
    }
  }
}

/**
 * Check for unpinned versions (supply chain risk)
 */
function auditForUnpinnedVersions(
  filePath: string,
  config: Record<string, unknown>,
  findings: SecurityFindings,
): void {
  if (!config.mcpServers) {
    return;
  }

  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    const cfg = serverConfig as Record<string, unknown>;

    // Check for 'latest' tag
    if (typeof cfg.image === 'string' && cfg.image.includes(':latest')) {
      findings.high.push({
        rule: 'UNPINNED_DOCKER_IMAGE',
        severity: 'high',
        file: filePath,
        description: `MCP server "${serverName}" uses unpinned 'latest' tag`,
        recommendation: 'Pin to specific version or SHA digest for reproducibility',
        evidence: cfg.image,
      });
    }

    // Check for missing SHA digest
    if (typeof cfg.image === 'string' && !cfg.image.includes('@sha256:')) {
      findings.medium.push({
        rule: 'MISSING_SHA_DIGEST',
        severity: 'medium',
        file: filePath,
        description: `MCP server "${serverName}" missing SHA digest`,
        recommendation: 'Add SHA digest for immutable image reference',
        evidence: cfg.image,
      });
    }

    // Check for unpinned npm versions
    if (typeof cfg.command === 'string' && (cfg.command.includes('npx') || cfg.command.includes('npm'))) {
      const versionPattern = /@(latest|\^|~)/g;
      if (versionPattern.test(cfg.command)) {
        findings.medium.push({
          rule: 'UNPINNED_NPM_VERSION',
          severity: 'medium',
          file: filePath,
          description: `MCP server "${serverName}" uses unpinned npm version`,
          recommendation: 'Pin to specific version (e.g., package@1.2.3)',
          evidence: cfg.command,
        });
      }
    }
  }
}

/**
 * Check for insecure command execution
 */
function auditForInsecureCommands(
  filePath: string,
  config: Record<string, unknown>,
  findings: SecurityFindings,
): void {
  if (!config.mcpServers) {
    return;
  }

  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    const cfg = serverConfig as Record<string, unknown>;

    // Check for shell execution
    if (typeof cfg.command === 'string' && (cfg.command.includes('sh -c') || cfg.command.includes('bash -c'))) {
      findings.high.push({
        rule: 'SHELL_EXECUTION',
        severity: 'high',
        file: filePath,
        description: `MCP server "${serverName}" uses shell execution`,
        recommendation: 'Use direct binary execution to avoid shell injection',
        evidence: cfg.command,
      });
    }

    // Check for dangerous commands
    const dangerousCommands = ['rm -rf', 'curl | bash', 'wget | bash', 'chmod 777'];
    for (const dangerous of dangerousCommands) {
      if (typeof cfg.command === 'string' && cfg.command.includes(dangerous)) {
        findings.critical.push({
          rule: 'DANGEROUS_COMMAND',
          severity: 'critical',
          file: filePath,
          description: `MCP server "${serverName}" uses dangerous command: ${dangerous}`,
          recommendation: 'Remove dangerous command and use safer alternatives',
          evidence: cfg.command,
        });
      }
    }
  }
}

/**
 * Check for missing input validation
 */
function auditForMissingValidation(
  filePath: string,
  config: Record<string, unknown>,
  findings: SecurityFindings,
): void {
  if (!config.mcpServers) {
    return;
  }

  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    const cfg = serverConfig as Record<string, unknown>;

    // Check for missing env validation
    if (cfg.env && typeof cfg.env === 'object') {
      const envObj = cfg.env as Record<string, unknown>;
      const hasSecrets = Object.keys(envObj).some(
        k => k.toLowerCase().includes('key') || k.toLowerCase().includes('secret'),
      );
      if (hasSecrets && !envObj.HOPCODE_VALIDATE_ENV) {
        findings.low.push({
          rule: 'MISSING_ENV_VALIDATION',
          severity: 'low',
          file: filePath,
          description: `MCP server "${serverName}" has secrets in env but no validation`,
          recommendation: 'Add environment variable validation on startup',
          evidence: JSON.stringify(cfg.env),
        });
      }
    }
  }
}

/**
 * Check for permissions
 */
function auditForPermissions(
  filePath: string,
  config: Record<string, unknown>,
  findings: SecurityFindings,
): void {
  if (!config.mcpServers) {
    return;
  }

  for (const [serverName, serverConfig] of Object.entries(config.mcpServers)) {
    const cfg = serverConfig as Record<string, unknown>;

    // Check for privileged containers
    if (cfg.privileged === true) {
      findings.critical.push({
        rule: 'PRIVILEGED_CONTAINER',
        severity: 'critical',
        file: filePath,
        description: `MCP server "${serverName}" runs in privileged mode`,
        recommendation: 'Remove privileged flag and use specific capabilities',
        evidence: 'privileged: true',
      });
    }

    // Check for root user
    if (cfg.user === 'root' || cfg.user === '0') {
      findings.high.push({
        rule: 'ROOT_USER',
        severity: 'high',
        file: filePath,
        description: `MCP server "${serverName}" runs as root user`,
        recommendation: 'Run as non-root user for security',
        evidence: `user: ${String(cfg.user)}`,
      });
    }
  }
}

/**
 * Check for dangerous patterns in server code
 */
function auditForDangerousPatterns(
  filePath: string,
  content: string,
  lines: string[],
  findings: SecurityFindings,
): void {
  const dangerousPatterns = [
    {
      pattern: /eval\s*\(/g,
      rule: 'DANGEROUS_EVAL',
      severity: 'critical' as const,
      description: 'Use of eval() detected - code injection risk',
    },
    {
      pattern: /Function\s*\(/g,
      rule: 'DANGEROUS_FUNCTION_CONSTRUCTOR',
      severity: 'critical' as const,
      description: 'Use of Function constructor - code injection risk',
    },
    {
      pattern: /child_process\.exec\s*\(/g,
      rule: 'UNSAFE_EXEC',
      severity: 'high' as const,
      description: 'Use of child_process.exec - shell injection risk',
    },
    {
      pattern: /fs\.writeFileSync.*\.\.env/g,
      rule: 'ENV_FILE_WRITE',
      severity: 'high' as const,
      description: 'Writing to .env file - potential secret exposure',
    },
  ];

  for (const { pattern, rule, severity, description } of dangerousPatterns) {
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(pattern);
      if (match && !lines[i].trim().startsWith('//')) {
        findings[severity].push({
          rule,
          severity,
          file: filePath,
          line: i + 1,
          description,
          recommendation: 'Use safer alternatives (e.g., child_process.execFile)',
          evidence: lines[i].trim(),
        });
      }
    }
  }
}

/**
 * Check for input validation
 */
function auditForInputValidation(
  filePath: string,
  content: string,
  findings: SecurityFindings,
): void {
  // Check if tool handlers validate input
  const hasToolHandlers = /tools\.setToolHandler|server\.tool/g.test(content);
  const hasInputValidation =
    /z\.object|yup\.object|joi\.object|validateInput|assertInput/g.test(content);

  if (hasToolHandlers && !hasInputValidation) {
    findings.medium.push({
      rule: 'MISSING_INPUT_VALIDATION',
      severity: 'medium',
      file: filePath,
      description: 'MCP server has tool handlers without input validation',
      recommendation: 'Add input validation using Zod, Yup, or Joi',
      evidence: 'No validation library detected',
    });
  }
}

/**
 * Check for insecure temp file usage
 */
function auditForInsecureTempFiles(
  filePath: string,
  content: string,
  findings: SecurityFindings,
): void {
  const insecureTempPatterns = [
    {
      pattern: /fs\.writeFileSync\s*\(\s*["']\/tmp\//g,
      rule: 'INSECURE_TEMP_FILE',
      severity: 'medium' as const,
      description: 'Writing to /tmp without secure filename',
    },
  ];

  for (const { pattern, rule, severity, description } of insecureTempPatterns) {
    if (pattern.test(content)) {
      findings[severity].push({
        rule,
        severity,
        file: filePath,
        description,
        recommendation: 'Use fs.mkdtemp() or crypto.randomUUID() for temp files',
        evidence: 'Hardcoded /tmp path detected',
      });
    }
  }
}

/**
 * Generate security audit report
 */
function generateSecurityReport(findings: SecurityFindings): string {
  const total =
    findings.critical.length +
    findings.high.length +
    findings.medium.length +
    findings.low.length +
    findings.info.length;

  if (total === 0) {
    return `# ✅ MCP Security Audit - All Clear!

**No security issues found** in MCP configurations or server code.

## Best Practices Followed

✅ No hardcoded secrets  
✅ Versions are pinned  
✅ No dangerous commands  
✅ Proper input validation  
✅ Secure permissions  

Continue monitoring regularly!`;
  }

  let report = `# 🔍 MCP Security Audit Report

**Total Findings**: ${total}

| Severity | Count |
|----------|-------|
| 🔴 Critical | ${findings.critical.length} |
| 🟠 High | ${findings.high.length} |
| 🟡 Medium | ${findings.medium.length} |
| 🔵 Low | ${findings.low.length} |
| ⚪ Info | ${findings.info.length} |

---

`;

  if (findings.critical.length > 0) {
    report += `## 🔴 Critical Issues (${findings.critical.length})\n\n`;
    for (const finding of findings.critical) {
      report += formatFinding(finding);
    }
    report += '\n';
  }

  if (findings.high.length > 0) {
    report += `## 🟠 High Severity (${findings.high.length})\n\n`;
    for (const finding of findings.high) {
      report += formatFinding(finding);
    }
    report += '\n';
  }

  if (findings.medium.length > 0) {
    report += `## 🟡 Medium Severity (${findings.medium.length})\n\n`;
    for (const finding of findings.medium) {
      report += formatFinding(finding);
    }
    report += '\n';
  }

  if (findings.low.length > 0) {
    report += `## 🔵 Low Severity (${findings.low.length})\n\n`;
    for (const finding of findings.low) {
      report += formatFinding(finding);
    }
    report += '\n';
  }

  report += `---

## 📋 Remediation Steps

1. **Address Critical Issues First** - Fix hardcoded secrets immediately
2. **Rotate Exposed Credentials** - If secrets were found, rotate them
3. **Pin Versions** - Use SHA digests for containers, specific versions for npm
4. **Add Input Validation** - Use Zod/Yup/Joi for all tool handlers
5. **Remove Dangerous Commands** - Replace with safer alternatives

## 🔒 Security Checklist

- [ ] Remove all hardcoded secrets
- [ ] Pin all dependency versions
- [ ] Remove dangerous shell commands
- [ ] Add input validation to all tools
- [ ] Run as non-root user
- [ ] Use capabilities instead of privileged mode

---

**Audit Date**: ${new Date().toISOString()}  
**Files Scanned**: MCP configs + server code  
**Next Audit**: Recommended monthly`;

  return report;
}

/**
 * Format individual finding
 */
function formatFinding(finding: Finding): string {
  return `### ${finding.rule}

**File**: \`${finding.file}\`${finding.line ? ` (line ${finding.line})` : ''}  
**Description**: ${finding.description}  
**Evidence**: \`${finding.evidence || 'N/A'}\`

**Recommendation**: ${finding.recommendation}

---

`;
}
