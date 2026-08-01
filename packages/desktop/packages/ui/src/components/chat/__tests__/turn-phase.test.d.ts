/**
 * Unit tests for TurnPhase derivation logic.
 *
 * These tests verify that deriveTurnPhase() correctly determines the
 * current lifecycle phase of an assistant turn from its data.
 *
 * The state machine phases are:
 * - pending: Turn created, waiting for first activity
 * - tool_active: At least one tool is running
 * - awaiting: All tools done, waiting for next action (THE GAP!)
 * - streaming: Final response text is streaming
 * - complete: Turn is finished
 */
export {};
