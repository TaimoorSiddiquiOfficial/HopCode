/**
 * Renderer — plan_submitted handling for Telegram.
 *
 * Covers:
 *   - Telegram + short plan: single sendButtons with inline content
 *   - Telegram + long plan: sendButtons with summary + sendFile attachment
 *   - Telegram without token registry: falls back to plain text
 *   - WhatsApp: keeps the legacy plain-text pointer (no buttons, no file)
 *   - recordPlanMessage callback fires for Telegram buttons only
 */
export {};
