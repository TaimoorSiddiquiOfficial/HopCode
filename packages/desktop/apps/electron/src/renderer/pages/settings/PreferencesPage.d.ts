/**
 * PreferencesPage
 *
 * Form-based editor for stored user preferences (~/.craft-agent/preferences.json).
 * Features:
 * - Fixed input fields for known preferences (name, timezone, location, language)
 * - Free-form textarea for notes
 * - Auto-saves on change with debouncing
 */
import * as React from 'react';
import type { DetailsPageMeta } from '@/lib/navigation-registry';
export declare const meta: DetailsPageMeta;
export default function PreferencesPage(): React.JSX.Element;
