/**
 * PreferencesPage
 *
 * Form-based editor for stored user preferences (~/.craft-agent/preferences.json).
 * Features:
 * - Fixed input fields for known preferences (name, timezone, location, language)
 * - Free-form textarea for notes
 * - Parses JSON on load, serializes back on save
 * - Save/Revert buttons
 */
import * as React from 'react';
export default function PreferencesPage(): React.JSX.Element;
