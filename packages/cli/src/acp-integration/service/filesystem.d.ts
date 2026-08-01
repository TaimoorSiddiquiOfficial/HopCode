/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
import type { AgentSideConnection, FileSystemCapability, WriteTextFileRequest, WriteTextFileResponse } from '@agentclientprotocol/sdk';
import type { CoreReadTextFileRequest, FileSystemService, ReadTextFileResponse } from '@hoptrendy/hopcode-core';
interface AcpFileSystemServiceOptions {
    localReadRoots?: readonly string[];
}
export declare class AcpFileSystemService implements FileSystemService {
    private readonly connection;
    private readonly sessionId;
    private readonly capabilities;
    private readonly fallback;
    private readonly options;
    constructor(connection: AgentSideConnection, sessionId: string, capabilities: FileSystemCapability, fallback: FileSystemService, options?: AcpFileSystemServiceOptions);
    readTextFile(params: CoreReadTextFileRequest): Promise<ReadTextFileResponse>;
    writeTextFile(params: Omit<WriteTextFileRequest, 'sessionId'>): Promise<WriteTextFileResponse>;
    findFiles(fileName: string, searchPaths: readonly string[]): string[];
    private getResolvedLocalReadRoots;
    private getLocalReadFallbackPath;
}
export {};
