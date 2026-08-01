export declare const actions: {
    readonly 'app.newChat': {
        readonly id: "app.newChat";
        readonly label: "New Chat";
        readonly description: "Create a new chat session";
        readonly defaultHotkey: "mod+n";
        readonly category: "General";
    };
    readonly 'app.newChatInPanel': {
        readonly id: "app.newChatInPanel";
        readonly label: "New Chat in Panel";
        readonly description: "Create a new chat session in a new panel";
        readonly defaultHotkey: "mod+t";
        readonly category: "General";
    };
    readonly 'app.settings': {
        readonly id: "app.settings";
        readonly label: "Settings";
        readonly description: "Open application settings";
        readonly defaultHotkey: "mod+,";
        readonly category: "General";
    };
    readonly 'app.toggleTheme': {
        readonly id: "app.toggleTheme";
        readonly label: "Toggle Theme";
        readonly description: "Switch between light and dark mode";
        readonly defaultHotkey: "mod+shift+a";
        readonly category: "General";
    };
    readonly 'app.search': {
        readonly id: "app.search";
        readonly label: "Search";
        readonly description: "Open search panel";
        readonly defaultHotkey: "mod+f";
        readonly category: "General";
    };
    readonly 'app.keyboardShortcuts': {
        readonly id: "app.keyboardShortcuts";
        readonly label: "Keyboard Shortcuts";
        readonly description: "Show keyboard shortcuts reference";
        readonly defaultHotkey: "mod+/";
        readonly category: "General";
    };
    readonly 'app.newWindow': {
        readonly id: "app.newWindow";
        readonly label: "New Window";
        readonly description: "Open a new window";
        readonly defaultHotkey: "mod+shift+n";
        readonly category: "General";
    };
    readonly 'app.quit': {
        readonly id: "app.quit";
        readonly label: "Quit";
        readonly description: "Quit the application";
        readonly defaultHotkey: "mod+q";
        readonly category: "General";
    };
    readonly 'nav.focusSidebar': {
        readonly id: "nav.focusSidebar";
        readonly label: "Focus Sidebar";
        readonly defaultHotkey: "mod+1";
        readonly category: "Navigation";
    };
    readonly 'nav.focusNavigator': {
        readonly id: "nav.focusNavigator";
        readonly label: "Focus Navigator";
        readonly defaultHotkey: "mod+2";
        readonly category: "Navigation";
    };
    readonly 'nav.focusChat': {
        readonly id: "nav.focusChat";
        readonly label: "Focus Chat";
        readonly defaultHotkey: "mod+3";
        readonly category: "Navigation";
    };
    readonly 'nav.nextZone': {
        readonly id: "nav.nextZone";
        readonly label: "Focus Next Zone";
        readonly defaultHotkey: "tab";
        readonly category: "Navigation";
        readonly when: "!inputFocus";
    };
    readonly 'nav.goBack': {
        readonly id: "nav.goBack";
        readonly label: "Go Back";
        readonly description: "Navigate to previous session";
        readonly defaultHotkey: "mod+[";
        readonly category: "Navigation";
    };
    readonly 'nav.goForward': {
        readonly id: "nav.goForward";
        readonly label: "Go Forward";
        readonly description: "Navigate to next session";
        readonly defaultHotkey: "mod+]";
        readonly category: "Navigation";
    };
    readonly 'nav.goBackAlt': {
        readonly id: "nav.goBackAlt";
        readonly label: "Go Back";
        readonly description: "Navigate to previous session (arrow key)";
        readonly defaultHotkey: "mod+left";
        readonly category: "Navigation";
        readonly when: "!inputFocus";
    };
    readonly 'nav.goForwardAlt': {
        readonly id: "nav.goForwardAlt";
        readonly label: "Go Forward";
        readonly description: "Navigate to next session (arrow key)";
        readonly defaultHotkey: "mod+right";
        readonly category: "Navigation";
        readonly when: "!inputFocus";
    };
    readonly 'view.toggleSidebar': {
        readonly id: "view.toggleSidebar";
        readonly label: "Toggle Sidebar";
        readonly defaultHotkey: "mod+b";
        readonly category: "View";
    };
    readonly 'view.toggleFocusMode': {
        readonly id: "view.toggleFocusMode";
        readonly label: "Toggle Focus Mode";
        readonly description: "Hide both sidebars for distraction-free work";
        readonly defaultHotkey: "mod+.";
        readonly category: "View";
    };
    readonly 'navigator.selectAll': {
        readonly id: "navigator.selectAll";
        readonly label: "Select All";
        readonly defaultHotkey: "mod+a";
        readonly category: "Navigator";
        readonly scope: "navigator";
        readonly when: "navigatorFocus";
    };
    readonly 'navigator.clearSelection': {
        readonly id: "navigator.clearSelection";
        readonly label: "Clear Selection";
        readonly defaultHotkey: "escape";
        readonly category: "Navigator";
        readonly scope: "navigator";
        readonly when: "navigatorFocus";
    };
    readonly 'panel.focusNext': {
        readonly id: "panel.focusNext";
        readonly label: "Focus Next Panel";
        readonly description: "Move focus to the next panel";
        readonly defaultHotkey: "mod+shift+]";
        readonly category: "Navigation";
    };
    readonly 'panel.focusPrev': {
        readonly id: "panel.focusPrev";
        readonly label: "Focus Previous Panel";
        readonly description: "Move focus to the previous panel";
        readonly defaultHotkey: "mod+shift+[";
        readonly category: "Navigation";
    };
    readonly 'chat.stopProcessing': {
        readonly id: "chat.stopProcessing";
        readonly label: "Stop Processing";
        readonly description: "Cancel the current agent task (double-press)";
        readonly defaultHotkey: "escape";
        readonly category: "Chat";
        readonly scope: "chat";
        readonly when: "!hasSelection";
    };
    readonly 'chat.cyclePermissionMode': {
        readonly id: "chat.cyclePermissionMode";
        readonly label: "Cycle Permission Mode";
        readonly description: "Switch between IZN, Plan mode, Ask before edits, and Edit automatically";
        readonly defaultHotkey: "shift+tab";
        readonly category: "Chat";
        readonly when: "!inputFocus && !menuOpen";
    };
    readonly 'chat.nextSearchMatch': {
        readonly id: "chat.nextSearchMatch";
        readonly label: "Next Search Match";
        readonly defaultHotkey: "mod+g";
        readonly category: "Chat";
    };
    readonly 'chat.prevSearchMatch': {
        readonly id: "chat.prevSearchMatch";
        readonly label: "Previous Search Match";
        readonly defaultHotkey: "mod+shift+g";
        readonly category: "Chat";
    };
};
export type ActionId = keyof typeof actions;
export declare const actionList: ({
    readonly id: "app.newChat";
    readonly label: "New Chat";
    readonly description: "Create a new chat session";
    readonly defaultHotkey: "mod+n";
    readonly category: "General";
} | {
    readonly id: "app.newChatInPanel";
    readonly label: "New Chat in Panel";
    readonly description: "Create a new chat session in a new panel";
    readonly defaultHotkey: "mod+t";
    readonly category: "General";
} | {
    readonly id: "app.settings";
    readonly label: "Settings";
    readonly description: "Open application settings";
    readonly defaultHotkey: "mod+,";
    readonly category: "General";
} | {
    readonly id: "app.toggleTheme";
    readonly label: "Toggle Theme";
    readonly description: "Switch between light and dark mode";
    readonly defaultHotkey: "mod+shift+a";
    readonly category: "General";
} | {
    readonly id: "app.search";
    readonly label: "Search";
    readonly description: "Open search panel";
    readonly defaultHotkey: "mod+f";
    readonly category: "General";
} | {
    readonly id: "app.keyboardShortcuts";
    readonly label: "Keyboard Shortcuts";
    readonly description: "Show keyboard shortcuts reference";
    readonly defaultHotkey: "mod+/";
    readonly category: "General";
} | {
    readonly id: "app.newWindow";
    readonly label: "New Window";
    readonly description: "Open a new window";
    readonly defaultHotkey: "mod+shift+n";
    readonly category: "General";
} | {
    readonly id: "app.quit";
    readonly label: "Quit";
    readonly description: "Quit the application";
    readonly defaultHotkey: "mod+q";
    readonly category: "General";
} | {
    readonly id: "nav.focusSidebar";
    readonly label: "Focus Sidebar";
    readonly defaultHotkey: "mod+1";
    readonly category: "Navigation";
} | {
    readonly id: "nav.focusNavigator";
    readonly label: "Focus Navigator";
    readonly defaultHotkey: "mod+2";
    readonly category: "Navigation";
} | {
    readonly id: "nav.focusChat";
    readonly label: "Focus Chat";
    readonly defaultHotkey: "mod+3";
    readonly category: "Navigation";
} | {
    readonly id: "nav.nextZone";
    readonly label: "Focus Next Zone";
    readonly defaultHotkey: "tab";
    readonly category: "Navigation";
    readonly when: "!inputFocus";
} | {
    readonly id: "nav.goBack";
    readonly label: "Go Back";
    readonly description: "Navigate to previous session";
    readonly defaultHotkey: "mod+[";
    readonly category: "Navigation";
} | {
    readonly id: "nav.goForward";
    readonly label: "Go Forward";
    readonly description: "Navigate to next session";
    readonly defaultHotkey: "mod+]";
    readonly category: "Navigation";
} | {
    readonly id: "nav.goBackAlt";
    readonly label: "Go Back";
    readonly description: "Navigate to previous session (arrow key)";
    readonly defaultHotkey: "mod+left";
    readonly category: "Navigation";
    readonly when: "!inputFocus";
} | {
    readonly id: "nav.goForwardAlt";
    readonly label: "Go Forward";
    readonly description: "Navigate to next session (arrow key)";
    readonly defaultHotkey: "mod+right";
    readonly category: "Navigation";
    readonly when: "!inputFocus";
} | {
    readonly id: "view.toggleSidebar";
    readonly label: "Toggle Sidebar";
    readonly defaultHotkey: "mod+b";
    readonly category: "View";
} | {
    readonly id: "view.toggleFocusMode";
    readonly label: "Toggle Focus Mode";
    readonly description: "Hide both sidebars for distraction-free work";
    readonly defaultHotkey: "mod+.";
    readonly category: "View";
} | {
    readonly id: "navigator.selectAll";
    readonly label: "Select All";
    readonly defaultHotkey: "mod+a";
    readonly category: "Navigator";
    readonly scope: "navigator";
    readonly when: "navigatorFocus";
} | {
    readonly id: "navigator.clearSelection";
    readonly label: "Clear Selection";
    readonly defaultHotkey: "escape";
    readonly category: "Navigator";
    readonly scope: "navigator";
    readonly when: "navigatorFocus";
} | {
    readonly id: "panel.focusNext";
    readonly label: "Focus Next Panel";
    readonly description: "Move focus to the next panel";
    readonly defaultHotkey: "mod+shift+]";
    readonly category: "Navigation";
} | {
    readonly id: "panel.focusPrev";
    readonly label: "Focus Previous Panel";
    readonly description: "Move focus to the previous panel";
    readonly defaultHotkey: "mod+shift+[";
    readonly category: "Navigation";
} | {
    readonly id: "chat.stopProcessing";
    readonly label: "Stop Processing";
    readonly description: "Cancel the current agent task (double-press)";
    readonly defaultHotkey: "escape";
    readonly category: "Chat";
    readonly scope: "chat";
    readonly when: "!hasSelection";
} | {
    readonly id: "chat.cyclePermissionMode";
    readonly label: "Cycle Permission Mode";
    readonly description: "Switch between IZN, Plan mode, Ask before edits, and Edit automatically";
    readonly defaultHotkey: "shift+tab";
    readonly category: "Chat";
    readonly when: "!inputFocus && !menuOpen";
} | {
    readonly id: "chat.nextSearchMatch";
    readonly label: "Next Search Match";
    readonly defaultHotkey: "mod+g";
    readonly category: "Chat";
} | {
    readonly id: "chat.prevSearchMatch";
    readonly label: "Previous Search Match";
    readonly defaultHotkey: "mod+shift+g";
    readonly category: "Chat";
})[];
export declare const actionsByCategory: Record<string, ActionDefinition[]>;
