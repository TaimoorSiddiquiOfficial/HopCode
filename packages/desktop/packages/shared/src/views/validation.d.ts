/**
 * View Validation
 *
 * Validates view expressions at config time (before they're used).
 * Catches syntax errors and provides helpful error messages with available fields.
 */
/**
 * Available fields for view expressions.
 * Used for documentation and error hints when expressions reference unknown fields.
 */
export declare const AVAILABLE_FIELDS: Array<{
    name: string;
    type: string;
    description: string;
}>;
/**
 * Available custom functions for view expressions.
 */
export declare const AVAILABLE_FUNCTIONS: Array<{
    name: string;
    signature: string;
    description: string;
    example: string;
}>;
/**
 * Result of expression validation.
 */
export interface ValidationResult {
    /** Whether the expression is valid */
    valid: boolean;
    /** Error message if invalid (Filtrex parse error) */
    error?: string;
}
/**
 * Validate a view expression by attempting compilation.
 * Returns validation result with error details if the expression is invalid.
 *
 * This is a pure syntax check — it doesn't evaluate the expression.
 * Runtime errors (e.g. accessing undefined nested props) are handled
 * gracefully by the evaluator via optional chaining.
 */
export declare function validateViewExpression(expression: string): ValidationResult;
