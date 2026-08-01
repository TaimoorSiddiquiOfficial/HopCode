export declare function formatTokenCount(count: number): string;
/**
 * Token count in megatokens — always `M` with one decimal (e.g. `810.7M`,
 * `9382.8M`), the usage dashboard's convention where even billions read as M.
 * Sub-1M values render raw with locale grouping (e.g. `80`, `12,345`).
 */
export declare function formatMegaTokens(count: number): string;
