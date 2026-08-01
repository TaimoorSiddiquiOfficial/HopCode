import type { InsightData, QualitativeData } from './types';
import React from 'react';
export interface AtAGlanceTargetSections {
    wins: boolean;
    friction: boolean;
    features: boolean;
    horizon: boolean;
}
export declare function AtAGlance({ qualitative, targetSections, }: {
    qualitative: QualitativeData;
    targetSections: AtAGlanceTargetSections;
}): React.JSX.Element | null;
export interface NavTocSection {
    href: string;
    label: string;
}
export declare function NavToc({ sections }: {
    sections: NavTocSection[];
}): React.JSX.Element | null;
export declare function ProjectAreas({ qualitative, topGoals, topTools, }: {
    qualitative: QualitativeData;
    topGoals?: Record<string, number>;
    topTools?: Record<string, number> | Array<[string, number]>;
}): React.JSX.Element;
export declare function InteractionStyle({ qualitative, insights, }: {
    qualitative: QualitativeData;
    insights: InsightData;
}): React.JSX.Element | null;
export declare function ImpressiveWorkflows({ qualitative, primarySuccess, outcomes, }: {
    qualitative?: QualitativeData;
    primarySuccess: Record<string, number>;
    outcomes: Record<string, number>;
}): React.JSX.Element;
export declare function FrictionPoints({ qualitative, satisfaction, friction, }: {
    qualitative?: QualitativeData;
    satisfaction?: Record<string, number>;
    friction?: Record<string, number>;
}): React.JSX.Element;
export declare function Improvements({ qualitative, }: {
    qualitative: QualitativeData;
}): React.JSX.Element | null;
export declare function FutureOpportunities({ qualitative, }: {
    qualitative: QualitativeData;
}): React.JSX.Element | null;
export declare function MemorableMoment({ qualitative, }: {
    qualitative: QualitativeData;
}): React.JSX.Element | null;
