import React from 'react';
import type { InsightData } from './types';
export declare function Header({ data, dateRangeStr, }: {
    data: InsightData;
    dateRangeStr: string;
}): React.JSX.Element;
export declare function StatsRow({ data }: {
    data: InsightData;
}): React.JSX.Element;
