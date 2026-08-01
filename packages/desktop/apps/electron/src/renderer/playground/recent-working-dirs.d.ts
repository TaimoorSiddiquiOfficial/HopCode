export type RecentDirScenario = 'none' | 'few' | 'many';
/** Return a copy of the fixture list for the selected scenario. */
export declare function getRecentDirsForScenario(scenario: RecentDirScenario): string[];
