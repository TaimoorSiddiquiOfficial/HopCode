import type { InsightData } from './types';
import React from 'react';
export declare function DashboardCards({ insights }: {
    insights: InsightData;
}): React.JSX.Element;
export declare function ActiveHoursChart({ activeHours, cardClass, sectionTitleClass, }: {
    activeHours: Record<number, number>;
    cardClass: string;
    sectionTitleClass: string;
}): React.JSX.Element;
export declare function HeatmapSection({ heatmap, }: {
    heatmap: Record<string, number>;
}): React.JSX.Element;
