export interface VCRedistCheckResult {
    installed: boolean;
    /** Human-readable message suitable for logging or dialogs */
    message: string;
    /** Download URL for the correct VC++ Redistributable installer (set when installed=false) */
    downloadUrl?: string;
}
/**
 * Check whether the Microsoft Visual C++ Redistributable is installed on Windows.
 *
 * This is required for onnxruntime (used by markitdown's magika file classifier)
 * to load its native DLLs. Without it, markitdown crashes with a DLL-not-found error
 * when converting PDF, PPTX, DOCX, and XLSX files.
 *
 * On non-Windows platforms, always returns { installed: true } since vcruntime
 * is not relevant (shared libs are managed by the system package manager).
 */
export declare function checkVCRedistInstalled(): VCRedistCheckResult;
