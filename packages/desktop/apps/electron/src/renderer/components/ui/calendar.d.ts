/**
 * Calendar - Date picker calendar based on react-day-picker v9.
 *
 * Adapted from the official shadcn/ui Calendar component.
 * Supports single/range selection and dropdown month/year navigation.
 */
import * as React from 'react';
import { DayPicker } from 'react-day-picker';
declare function Calendar({ className, classNames, showOutsideDays, captionLayout, formatters, ...props }: React.ComponentProps<typeof DayPicker>): React.JSX.Element;
export { Calendar };
