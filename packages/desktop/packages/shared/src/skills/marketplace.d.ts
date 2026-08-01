export type SkillMarketplaceIconKey = 'bailian-cli' | 'bailian-docs' | 'spark-video';
export interface SkillMarketplaceExample {
    title: string;
    prompt: string;
}
export interface SkillMarketplaceDefinition {
    id: string;
    slug: string;
    name: string;
    tagline: string;
    description: string;
    iconKey: SkillMarketplaceIconKey;
    websiteUrl?: string;
    sourceUrl: string;
    examples: SkillMarketplaceExample[];
    heroImage?: string;
}
export declare const SKILL_MARKETPLACE_DEFINITIONS: readonly SkillMarketplaceDefinition[];
export declare function getSkillMarketplaceDefinition(skillId: string): SkillMarketplaceDefinition | undefined;
