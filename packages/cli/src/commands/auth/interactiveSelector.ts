/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import * as readline from 'node:readline';

/**
 * Minimal interactive terminal selector for choosing from a list of options.
 * Displays numbered items and prompts the user to select one by number.
 */
export class InteractiveSelector {
  private options: Array<{ value: string; label: string; description: string }>;
  private prompt: string;

  constructor(
    options: Array<{ value: string; label: string; description: string }>,
    prompt: string,
  ) {
    this.options = options;
    this.prompt = prompt;
  }

  async select(): Promise<string | undefined> {
    // If no TTY, fall back to the first option
    if (!process.stdin.isTTY) {
      return this.options[0]?.value;
    }

    process.stdout.write(`\n${this.prompt}\n\n`);
    for (let i = 0; i < this.options.length; i++) {
      const opt = this.options[i];
      const desc = opt.description ? `  ${opt.description}` : '';
      process.stdout.write(`  ${i + 1}. ${opt.label}${desc}\n`);
    }
    process.stdout.write('\n');

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question('Enter number: ', (answer) => {
        rl.close();
        const num = parseInt(answer.trim(), 10);
        if (Number.isNaN(num) || num < 1 || num > this.options.length) {
          resolve(undefined);
          return;
        }
        resolve(this.options[num - 1]!.value);
      });
    });
  }
}
