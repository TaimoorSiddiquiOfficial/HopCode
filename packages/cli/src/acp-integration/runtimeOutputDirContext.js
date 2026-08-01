import { Storage } from '@hoptrendy/hopcode-core';
export function runWithAcpRuntimeOutputDir(settings, cwd, fn) {
    return Storage.runWithRuntimeBaseDir(settings.merged.advanced?.runtimeOutputDir, cwd, fn);
}
//# sourceMappingURL=runtimeOutputDirContext.js.map