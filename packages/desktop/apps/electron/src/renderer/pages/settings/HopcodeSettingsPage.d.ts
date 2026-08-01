export type hopcodeSettingsTab = 'general' | 'mcpServers' | 'hooks' | 'extensions';
export declare const generalMeta: DetailsPageMeta;
export declare const mcpServersMeta: DetailsPageMeta;
export declare const hooksMeta: DetailsPageMeta;
export declare const extensionsMeta: DetailsPageMeta;
export default function HopCodeSettingsPage({ tab }: {
    tab: hopcodeSettingsTab;
}): import("react").JSX.Element;
