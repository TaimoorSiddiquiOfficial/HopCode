export interface StatusInfo {
    cliVersion: string;
    runtime: string;
    platform: string;
    auth: string;
    baseUrl: string;
    model: string;
    fastModel: string;
    sessionId: string;
    sandbox: string;
    proxy: string;
    memoryUsage: string;
}
declare const serializeStatusMessage: any, parseStatusMessage: any;
export { serializeStatusMessage, parseStatusMessage };
export declare function StatusMessage({ info }: {
    info: StatusInfo;
}): import("react").JSX.Element;
