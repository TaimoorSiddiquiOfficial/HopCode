/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect } from 'vitest';
import { createArtifactPublisher } from './create-publisher.js';
import { LocalPublisher } from './local-publisher.js';
import { HostPublisher } from './host-publisher.js';
import { OssPublisher } from './oss-publisher.js';
const cfg = (kind, host) => ({
    getArtifactPublisherKind: () => kind,
    getArtifactHostConfig: () => host,
    getArtifactOssConfig: () => ({
        bucket: 'artifact-bucket',
        endpoint: 'oss-cn-hangzhou.aliyuncs.com',
    }),
});
describe('createArtifactPublisher', () => {
    it('returns LocalPublisher for the local kind', () => {
        expect(createArtifactPublisher(cfg('local'))).toBeInstanceOf(LocalPublisher);
    });
    it('returns HostPublisher for the host kind', () => {
        const pub = createArtifactPublisher(cfg('host', {
            uploadCommand: 'up {file}',
            urlTemplate: 'https://h/{key}',
        }));
        expect(pub).toBeInstanceOf(HostPublisher);
    });
    it('returns HostPublisher even when host config is missing (defers to publish-time error)', () => {
        expect(createArtifactPublisher(cfg('host'))).toBeInstanceOf(HostPublisher);
    });
    it('returns OssPublisher for the oss kind', () => {
        expect(createArtifactPublisher(cfg('oss'))).toBeInstanceOf(OssPublisher);
    });
    it('rejects unknown publisher kinds', () => {
        const config = {
            getArtifactPublisherKind: () => 's3',
        };
        expect(() => createArtifactPublisher(config)).toThrow(/unknown artifact publisher kind/i);
    });
});
//# sourceMappingURL=create-publisher.test.js.map