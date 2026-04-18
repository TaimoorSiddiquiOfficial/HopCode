/**
 * Shared prompt utilities for secure CLI input.
 * Uses readline-based approach to handle paste correctly on all platforms.
 */
import { createInterface } from 'node:readline';

/**
 * Prompts the user for a secret value (API key, password) with masked output.
 * Each character is echoed as '*'. Handles paste correctly on Windows and Unix.
 *
 * @param prompt - Text to display before the input cursor
 * @returns The entered string
 */
export async function promptForSecretInput(prompt: string): Promise<string> {
  process.stdout.write(prompt);

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  // Mask all typed/pasted characters as '*'
  (rl as unknown as { _writeToOutput: (s: string) => void })._writeToOutput = (
    s: string,
  ) => {
    if (s === '\r\n' || s === '\n' || s === '\r') {
      process.stdout.write('\n');
    } else if (s.trim().length > 0) {
      // Count Unicode code points (handles multi-byte chars correctly)
      process.stdout.write('*'.repeat([...s].length));
    }
  };

  return new Promise<string>((resolve, reject) => {
    rl.question('', (answer) => {
      rl.close();
      resolve(answer.trim());
    });
    rl.on('SIGINT', () => {
      rl.close();
      process.stdout.write('^C\n');
      reject(new Error('Interrupted'));
    });
  });
}
