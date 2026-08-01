/**
 * LabelsSettingsPage
 *
 * Displays workspace label configuration in two data tables:
 * 1. Label Hierarchy - tree table with expand/collapse showing all labels
 * 2. Auto-Apply Rules - flat table showing all regex rules across labels
 *
 * Each section has an Edit button that opens an EditPopover for AI-assisted editing
 * of the underlying labels/config.json file.
 *
 * Data is loaded via the useLabels hook which subscribes to live config changes.
 */
import * as React from 'react';
import type { DetailsPageMeta } from '@/lib/navigation-registry';
export declare const meta: DetailsPageMeta;
export default function LabelsSettingsPage(): React.JSX.Element;
