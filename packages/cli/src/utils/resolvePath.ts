/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

import { expandHomeDir } from '@hoptrendy/hopcode-core';

export function resolvePath(p: string): string {
  return expandHomeDir(p);
}
