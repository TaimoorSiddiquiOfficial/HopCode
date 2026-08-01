/**
 * CronBuilder
 *
 * Visual cron expression builder with three synchronized layers:
 * 1. Preset buttons — common schedules
 * 2. Visual fields — 5 interactive fields with dropdowns
 * 3. Raw expression — editable text input
 *
 * Plus human-readable summary and next-run preview.
 */
import * as React from 'react';
export interface CronBuilderProps {
    value?: string;
    onChange?: (cron: string) => void;
    timezone?: string;
    onTimezoneChange?: (tz: string) => void;
    className?: string;
}
export declare function CronBuilder({ value, onChange, timezone, onTimezoneChange, className, }: CronBuilderProps): React.JSX.Element;
