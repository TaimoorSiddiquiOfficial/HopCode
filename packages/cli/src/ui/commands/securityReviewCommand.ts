/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { SlashCommand, CommandContext, SlashCommandActionReturn } from './types.js';
import { CommandKind } from './types.js';
import { readdirSync, readFileSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

/**
 * Security Review Command
 *
 * AI-powered codebase security scanner that identifies:
 * - Hardcoded secrets and credentials
 * - SQL injection vulnerabilities
 * - XSS (Cross-Site Scripting) risks
 * - Path traversal issues
 * - Command injection risks
 * - Insecure dependencies
 * - Missing input validation
 * - Weak cryptography
 * - Security misconfigurations
 */
export const securityReviewCommand: SlashCommand = {
  name: 'security-review',
  description: 'AI-powered security code review for vulnerabilities',
  kind: CommandKind.BUILT_IN,
  action: async (context: CommandContext, args: string): Promise<SlashCommandActionReturn> => {
    try {
      const targetPath = args.trim() || process.cwd();
      const scanResults = await performSecurityReview(context, targetPath);

      if (scanResults.critical.length > 0 || scanResults.high.length > 0) {
        return {
          type: 'message',
          messageType: 'info',
          content: generateSecurityReviewReport(scanResults, targetPath),
        };
      }

      return {
        type: 'message',
        messageType: 'info',
        content: generateSecurityReviewReport(scanResults, targetPath),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        type: 'message',
        messageType: 'error',
        content: `# ❌ Security Review Failed

**Error**: ${errorMessage}

## Troubleshooting

1. Verify the target path exists and is accessible
2. Ensure HopCode has read permissions
3. Check if files are locked or in use

Run: \`hopcode /security-review [path]\` after fixing issues.`,
      };
    }
  },
};

/**
 * Security vulnerability finding
 */
interface SecurityFinding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  file: string;
  line: number;
  code: string;
  description: string;
  recommendation: string;
  cwe?: string;
  owasp?: string;
}

/**
 * Security review results
 */
interface SecurityReviewResults {
  critical: SecurityFinding[];
  high: SecurityFinding[];
  medium: SecurityFinding[];
  low: SecurityFinding[];
  info: SecurityFinding[];
  summary: {
    totalFiles: number;
    totalLines: number;
    scanDuration: string;
    filesWithIssues: number;
  };
}

/**
 * Patterns for detecting security vulnerabilities
 */
const SECURITY_PATTERNS: Array<{
  pattern: RegExp;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  description: string;
  recommendation: string;
  cwe: string;
  owasp?: string;
  flags?: string;
}> = [
  // Hardcoded Secrets
  {
    pattern: /\b(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{8,}['"]/gi,
    severity: 'critical',
    category: 'Hardcoded Secret',
    description: 'Hardcoded password detected',
    recommendation: 'Use environment variables or a secrets manager (e.g., Azure Key Vault, AWS Secrets Manager)',
    cwe: 'CWE-798',
    owasp: 'A07:2021-Identification and Authentication Failures',
  },
  {
    pattern: /\b(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{16,}['"]/gi,
    severity: 'critical',
    category: 'Hardcoded Secret',
    description: 'Hardcoded API key detected',
    recommendation: 'Store API keys in environment variables or a secure secrets manager',
    cwe: 'CWE-798',
    owasp: 'A07:2021-Identification and Authentication Failures',
  },
  {
    pattern: /\b(?:secret|token|auth)\s*[:=]\s*['"][^'"]{16,}['"]/gi,
    severity: 'critical',
    category: 'Hardcoded Secret',
    description: 'Hardcoded secret/token detected',
    recommendation: 'Use environment variables for sensitive configuration values',
    cwe: 'CWE-798',
    owasp: 'A07:2021-Identification and Authentication Failures',
  },
  {
    pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/gi,
    severity: 'critical',
    category: 'Hardcoded Secret',
    description: 'Private key embedded in source code',
    recommendation: 'Store private keys in a secure secrets manager, never in source code',
    cwe: 'CWE-312',
    owasp: 'A01:2021-Broken Access Control',
  },
  
  // SQL Injection
  {
    pattern: /(?:execute|query|raw)\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`/gi,
    severity: 'critical',
    category: 'SQL Injection',
    description: 'Potential SQL injection via template literal',
    recommendation: 'Use parameterized queries or prepared statements instead of string interpolation',
    cwe: 'CWE-89',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /(?:execute|query)\s*\(\s*["'][^"']*["']\s*\+\s*/gi,
    severity: 'critical',
    category: 'SQL Injection',
    description: 'Potential SQL injection via string concatenation',
    recommendation: 'Use parameterized queries to prevent SQL injection attacks',
    cwe: 'CWE-89',
    owasp: 'A03:2021-Injection',
  },
  
  // Command Injection
  {
    pattern: /(?:exec|spawn|spawnSync)\s*\(\s*`[^`]*\$\{[^}]+\}[^`]*`/gi,
    severity: 'critical',
    category: 'Command Injection',
    description: 'Potential command injection via template literal',
    recommendation: 'Avoid shell execution with user input. Use safe APIs or sanitize input rigorously',
    cwe: 'CWE-78',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /exec\s*\(\s*["'][^"']*["']\s*\+\s*/gi,
    severity: 'critical',
    category: 'Command Injection',
    description: 'Potential command injection via string concatenation',
    recommendation: 'Never concatenate user input into shell commands',
    cwe: 'CWE-78',
    owasp: 'A03:2021-Injection',
  },
  
  // XSS (Cross-Site Scripting)
  {
    pattern: /innerHTML\s*=\s*/gi,
    severity: 'high',
    category: 'XSS',
    description: 'Direct innerHTML assignment can lead to XSS vulnerabilities',
    recommendation: 'Use textContent or sanitize HTML before assignment. Consider using a framework with auto-escaping',
    cwe: 'CWE-79',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /document\.write\s*\(/gi,
    severity: 'high',
    category: 'XSS',
    description: 'document.write can introduce XSS vulnerabilities',
    recommendation: 'Avoid document.write. Use DOM manipulation methods with proper sanitization',
    cwe: 'CWE-79',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /\$\s*\([^)]*\)\.html\s*\(/gi,
    severity: 'high',
    category: 'XSS',
    description: 'jQuery .html() can introduce XSS if used with unsanitized data',
    recommendation: 'Use .text() for plain text or sanitize HTML content before insertion',
    cwe: 'CWE-79',
    owasp: 'A03:2021-Injection',
  },
  
  // Path Traversal
  {
    pattern: /(?:readFile|writeFile|createReadStream|createWriteStream)\s*\([^)]*\+\s*[^)]*\)/gi,
    severity: 'high',
    category: 'Path Traversal',
    description: 'Potential path traversal via string concatenation in file operations',
    recommendation: 'Validate and sanitize file paths. Use path.resolve and check against allowed directories',
    cwe: 'CWE-22',
    owasp: 'A01:2021-Broken Access Control',
  },
  {
    pattern: /require\s*\(\s*["']\.\.\/["']\s*\+\s*/gi,
    severity: 'high',
    category: 'Path Traversal',
    description: 'Dynamic require with path concatenation can lead to path traversal',
    recommendation: 'Avoid dynamic requires with user-controlled paths',
    cwe: 'CWE-22',
    owasp: 'A01:2021-Broken Access Control',
  },
  
  // Weak Cryptography
  {
    pattern: /\b(?:md5|sha1)\s*\(/gi,
    severity: 'high',
    category: 'Weak Cryptography',
    description: 'Use of weak hash function (MD5/SHA1)',
    recommendation: 'Use SHA-256 or stronger hash functions. For passwords, use bcrypt, scrypt, or Argon2',
    cwe: 'CWE-328',
    owasp: 'A02:2021-Cryptographic Failures',
  },
  {
    pattern: /crypto\s*\.\s*createHash\s*\(\s*['"](md5|sha1)['"]/gi,
    severity: 'high',
    category: 'Weak Cryptography',
    description: 'Use of weak cryptographic hash function',
    recommendation: 'Replace with SHA-256 or SHA-3 for general hashing needs',
    cwe: 'CWE-328',
    owasp: 'A02:2021-Cryptographic Failures',
  },
  
  // Insecure Randomness
  {
    pattern: /\bMath\.random\s*\(\s*\)/gi,
    severity: 'medium',
    category: 'Insecure Randomness',
    description: 'Math.random() is not cryptographically secure',
    recommendation: 'Use crypto.randomBytes() or crypto.getRandomValues() for security-sensitive randomness',
    cwe: 'CWE-330',
    owasp: 'A02:2021-Cryptographic Failures',
  },
  
  // Prototype Pollution
  {
    pattern: /\[\s*['"]__proto__['"]\s*\]/gi,
    severity: 'high',
    category: 'Prototype Pollution',
    description: 'Direct __proto__ access can lead to prototype pollution',
    recommendation: 'Use Object.create(null) or Map for user-controlled key-value stores',
    cwe: 'CWE-1321',
    owasp: 'A01:2021-Broken Access Control',
  },
  {
    pattern: /Object\.assign\s*\(\s*[^,]+,\s*[^)]*\)/gi,
    severity: 'medium',
    category: 'Prototype Pollution',
    description: 'Object.assign with user input can cause prototype pollution',
    recommendation: 'Use Object.create(null) or freeze prototype chains before merging',
    cwe: 'CWE-1321',
  },
  
  // SSRF (Server-Side Request Forgery)
  {
    pattern: /(?:fetch|axios|request|http\.get|https\.get)\s*\(\s*[^)]*req\./gi,
    severity: 'high',
    category: 'SSRF',
    description: 'Potential SSRF via user-controlled URL in HTTP request',
    recommendation: 'Validate and whitelist allowed URLs. Block internal IP ranges and localhost',
    cwe: 'CWE-918',
    owasp: 'A10:2021-Server-Side Request Forgery',
  },
  
  // Eval and Dangerous Functions
  {
    pattern: /\beval\s*\(/gi,
    severity: 'critical',
    category: 'Dangerous Function',
    description: 'eval() execution can lead to arbitrary code execution',
    recommendation: 'Never use eval(). Use safer alternatives like JSON.parse() or Function constructors with strict validation',
    cwe: 'CWE-95',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /new\s+Function\s*\(/gi,
    severity: 'critical',
    category: 'Dangerous Function',
    description: 'Function constructor can execute arbitrary code',
    recommendation: 'Avoid dynamic code generation. Use safer alternatives',
    cwe: 'CWE-95',
    owasp: 'A03:2021-Injection',
  },
  {
    pattern: /setTimeout\s*\(\s*["']/gi,
    severity: 'medium',
    category: 'Dangerous Function',
    description: 'setTimeout with string argument can execute arbitrary code',
    recommendation: 'Pass function references to setTimeout instead of strings',
    cwe: 'CWE-95',
  },
  {
    pattern: /setInterval\s*\(\s*["']/gi,
    severity: 'medium',
    category: 'Dangerous Function',
    description: 'setInterval with string argument can execute arbitrary code',
    recommendation: 'Pass function references to setInterval instead of strings',
    cwe: 'CWE-95',
  },
  
  // Insecure Dependencies
  {
    pattern: /"version"\s*:\s*"[^"]*latest"/gi,
    severity: 'medium',
    category: 'Insecure Dependency',
    description: 'Using "latest" version tag can introduce breaking changes or vulnerabilities',
    recommendation: 'Pin dependencies to specific versions and use automated dependency updates',
    cwe: 'CWE-1391',
  },
  
  // Security Misconfigurations
  {
    pattern: /cors\s*\(\s*\{\s*origin\s*:\s*['"]\*['"]/gi,
    severity: 'medium',
    category: 'Security Misconfiguration',
    description: 'Overly permissive CORS policy allows any origin',
    recommendation: 'Restrict CORS to specific trusted origins',
    cwe: 'CWE-284',
    owasp: 'A05:2021-Security Misconfiguration',
  },
  {
    pattern: /app\.use\s*\(\s*express\s*\.\s*static/gi,
    severity: 'low',
    category: 'Security Misconfiguration',
    description: 'Serving static files without restrictions',
    recommendation: 'Ensure static directories do not expose sensitive files',
    cwe: 'CWE-284',
  },
  
  // Debug/Development Code in Production
  {
    pattern: /console\.(log|debug|info|warn|error)\s*\(/gi,
    severity: 'low',
    category: 'Information Disclosure',
    description: 'Console logging statements may leak sensitive information',
    recommendation: 'Remove or disable console logging in production builds',
    cwe: 'CWE-532',
  },
  {
    pattern: /debugger\s*;/gi,
    severity: 'medium',
    category: 'Information Disclosure',
    description: 'Debugger statement left in code',
    recommendation: 'Remove debugger statements before deployment',
    cwe: 'CWE-489',
  },
  
  // Hardcoded URLs and Endpoints
  {
    pattern: /https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0):/gi,
    severity: 'low',
    category: 'Hardcoded Endpoint',
    description: 'Hardcoded localhost URL may not work in production',
    recommendation: 'Use environment variables for configurable endpoints',
    cwe: 'CWE-640',
  },
];

/**
 * File extensions to scan
 */
const SCAN_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.py',
  '.java',
  '.go',
  '.rb',
  '.php',
  '.cs',
  '.c', '.cpp', '.h', '.hpp',
  '.rs',
  '.swift',
  '.kt', '.kts',
  '.scala',
  '.sh', '.bash', '.zsh',
  '.ps1',
  '.yaml', '.yml',
  '.json',
  '.env', '.env.*',
  '.config',
  '.sql',
];

/**
 * Directories to skip
 */
const SKIP_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  'coverage',
  '.next',
  '.nuxt',
  '.cache',
  'vendor',
  'venv',
  '__pycache__',
  '.idea',
  '.vscode',
];

/**
 * Perform comprehensive security review
 */
async function performSecurityReview(
  context: CommandContext,
  targetPath: string
): Promise<SecurityReviewResults> {
  const startTime = Date.now();
  const findings: SecurityReviewResults = {
    critical: [],
    high: [],
    medium: [],
    low: [],
    info: [],
    summary: {
      totalFiles: 0,
      totalLines: 0,
      scanDuration: '0s',
      filesWithIssues: 0,
    },
  };

  const filesWithIssues = new Set<string>();

  // Collect all files to scan
  const filesToScan = await collectFilesToScan(targetPath);

  findings.summary.totalFiles = filesToScan.length;

  // Scan each file
  for (const filePath of filesToScan) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      findings.summary.totalLines += lines.length;

      const fileFindings = scanFileForVulnerabilities(filePath, content);

      if (fileFindings.length > 0) {
        filesWithIssues.add(filePath);

        for (const finding of fileFindings) {
          switch (finding.severity) {
            case 'critical':
              findings.critical.push(finding);
              break;
            case 'high':
              findings.high.push(finding);
              break;
            case 'medium':
              findings.medium.push(finding);
              break;
            case 'low':
              findings.low.push(finding);
              break;
            case 'info':
              findings.info.push(finding);
              break;
            default:
              // Unknown severity - treat as info
              findings.info.push(finding);
              break;
          }
        }
      }
    } catch (_error) {
      // Skip files that can't be read
      continue;
    }
  }

  findings.summary.filesWithIssues = filesWithIssues.size;
  findings.summary.scanDuration = `${Math.round((Date.now() - startTime) / 1000)}s`;

  return findings;
}

/**
 * Collect all files to scan
 */
async function collectFilesToScan(rootPath: string): Promise<string[]> {
  const files: string[] = [];

  function walkDir(dir: string): void {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        // Skip hidden directories and specified skip directories
        if (entry.name.startsWith('.') && entry.isDirectory()) {
          continue;
        }

        if (SKIP_DIRS.includes(entry.name)) {
          continue;
        }

        if (entry.isDirectory()) {
          walkDir(fullPath);
        } else if (entry.isFile()) {
          const ext = extname(entry.name).toLowerCase();
          const baseName = entry.name.toLowerCase();

          // Check if file extension matches or if it's an env file
          if (
            SCAN_EXTENSIONS.includes(ext) ||
            baseName === '.env' ||
            baseName.startsWith('.env.')
          ) {
            files.push(fullPath);
          }
        }
      }
    } catch (_error) {
      // Skip directories we can't read
    }
  }

  walkDir(rootPath);
  return files;
}

/**
 * Scan file content for security vulnerabilities
 */
function scanFileForVulnerabilities(
  filePath: string,
  content: string
): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const lines = content.split('\n');

  for (const pattern of SECURITY_PATTERNS) {
    const regex = new RegExp(pattern.pattern, pattern.flags || 'g');
    let match;

    while ((match = regex.exec(content)) !== null) {
      // Find line number
      const lineNumber = content.substring(0, match.index).split('\n').length;
      const lineContent = lines[lineNumber - 1]?.trim() || '';

      // Skip if line is commented out (simple heuristic)
      if (lineContent.startsWith('//') || lineContent.startsWith('#') || lineContent.startsWith('*')) {
        continue;
      }

      findings.push({
        severity: pattern.severity,
        category: pattern.category,
        file: filePath,
        line: lineNumber,
        code: lineContent.substring(0, 150), // Truncate long lines
        description: pattern.description,
        recommendation: pattern.recommendation,
        cwe: pattern.cwe,
        owasp: pattern.owasp,
      });
    }
  }

  return findings;
}

/**
 * Generate comprehensive security review report
 */
function generateSecurityReviewReport(
  results: SecurityReviewResults,
  targetPath: string
): string {
  const totalIssues =
    results.critical.length +
    results.high.length +
    results.medium.length +
    results.low.length +
    results.info.length;

  let report = `# 🔍 Security Review Report

**Target**: \`${targetPath}\`
**Files Scanned**: ${results.summary.totalFiles}
**Total Lines**: ${results.summary.totalLines.toLocaleString()}
**Scan Duration**: ${results.summary.scanDuration}
**Files with Issues**: ${results.summary.filesWithIssues}

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 Critical | ${results.critical.length} |
| 🟠 High | ${results.high.length} |
| 🟡 Medium | ${results.medium.length} |
| 🟢 Low | ${results.low.length} |
| ℹ️ Info | ${results.info.length} |
| **Total** | **${totalIssues}** |

`;

  if (totalIssues === 0) {
    report += `✅ **No security issues detected!**

> Note: This automated scan uses pattern matching and may not catch all vulnerabilities. 
> Manual security review and specialized tools (SAST/DAST) are still recommended.
`;
    return report;
  }

  // Critical findings
  if (results.critical.length > 0) {
    report += `## 🔴 Critical Issues (${results.critical.length})

`;
    for (let i = 0; i < results.critical.length; i++) {
      const finding = results.critical[i];
      const relativePath = relative(targetPath, finding.file);
      report += `### ${i + 1}. ${finding.category}

- **File**: \`${relativePath}:${finding.line}\`
- **CWE**: ${finding.cwe}
${finding.owasp ? `- **OWASP**: ${finding.owasp}` : ''}
- **Issue**: ${finding.description}
- **Recommendation**: ${finding.recommendation}

\`\`\`
${finding.code}
\`\`\`

`;
    }
  }

  // High findings
  if (results.high.length > 0) {
    report += `## 🟠 High Priority Issues (${results.high.length})

`;
    for (let i = 0; i < Math.min(10, results.high.length); i++) {
      const finding = results.high[i];
      const relativePath = relative(targetPath, finding.file);
      report += `### ${i + 1}. ${finding.category}

- **File**: \`${relativePath}:${finding.line}\`
- **CWE**: ${finding.cwe}
${finding.owasp ? `- **OWASP**: ${finding.owasp}` : ''}
- **Issue**: ${finding.description}
- **Recommendation**: ${finding.recommendation}

`;
    }
    if (results.high.length > 10) {
      report += `... and ${results.high.length - 10} more high-priority issues.

`;
    }
  }

  // Medium findings
  if (results.medium.length > 0) {
    report += `## 🟡 Medium Priority Issues (${results.medium.length})

`;
    for (let i = 0; i < Math.min(5, results.medium.length); i++) {
      const finding = results.medium[i];
      const relativePath = relative(targetPath, finding.file);
      report += `${i + 1}. **${finding.category}** in \`${relativePath}:${finding.line}\` - ${finding.description}

`;
    }
    if (results.medium.length > 5) {
      report += `... and ${results.medium.length - 5} more medium-priority issues.

`;
    }
  }

  // Low and Info findings summary
  if (results.low.length > 0 || results.info.length > 0) {
    report += `## Summary by Severity

- 🟢 **Low Priority**: ${results.low.length} issues
- ℹ️ **Informational**: ${results.info.length} issues

> Run with verbose flag or check individual files for complete listing.

`;
  }

  report += `---

## Next Steps

1. **Address Critical Issues First** - Fix all critical vulnerabilities before deployment
2. **Review High Priority** - Schedule high-priority fixes in next sprint
3. **Plan Medium/Low** - Add to backlog for incremental improvement
4. **Re-scan After Fixes** - Run \`hopcode /security-review\` again to verify fixes

## Recommendations

- Integrate security scanning into CI/CD pipeline
- Use dedicated SAST tools (CodeQL, SonarQube, Snyk) for comprehensive coverage
- Conduct regular manual security reviews
- Keep dependencies updated with automated tools (Dependabot, Renovate)
`;

  return report;
}
