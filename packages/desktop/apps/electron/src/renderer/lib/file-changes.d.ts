import type { ActivityItem, FileChange } from '@craft-agent/ui';
export declare function collectFileChangesFromActivities(activities: ActivityItem[]): FileChange[];
export declare function getFirstFileChangeIdForActivity(activityId: string, changes: FileChange[]): string | undefined;
