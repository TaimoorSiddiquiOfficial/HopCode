/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
export declare class InstallationManager {
    private getInstallationIdPath;
    private readInstallationIdFromFile;
    private writeInstallationIdToFile;
    /**
     * Retrieves the installation ID from a file, creating it if it doesn't exist.
     * This ID is used for unique user installation tracking.
     * @returns A UUID string for the user.
     */
    getInstallationId(): string;
}
