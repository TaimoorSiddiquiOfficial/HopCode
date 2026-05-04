/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

// German translations for HopCode CLI
// Deutsche �bersetzungen f�r HopCode CLI

export default {
  // ============================================================================
  // Help / UI Components
  // ============================================================================
  // Attachment hints
  '? to manage attachments': '? Anh�nge verwalten',
  '? ? select, Delete to remove, ? to exit':
    '? ? ausw�hlen, Entf zum L�schen, ? beenden',
  'Attachments: ': 'Anh�nge: ',

  'Basics:': 'Grundlagen:',
  'Add context': 'Kontext hinzuf�gen',
  'Use {{symbol}} to specify files for context (e.g., {{example}}) to target specific files or folders.':
    'Verwenden Sie {{symbol}}, um Dateien als Kontext anzugeben (z.B. {{example}}), um bestimmte Dateien oder Ordner auszuw�hlen.',
  '@': '@',
  '@src/myFile.ts': '@src/myFile.ts',
  'Shell mode': 'Shell-Modus',
  'IZN mode': 'IZN-Modus',
  'plan mode': 'Planungsmodus',
  'auto-accept edits': '�nderungen automatisch akzeptieren',
  'Accepting edits': '�nderungen werden akzeptiert',
  '(shift + tab to cycle)': '(Umschalt + Tab zum Wechseln)',
  '(tab to cycle)': '(Tab zum Wechseln)',
  'Execute shell commands via {{symbol}} (e.g., {{example1}}) or use natural language (e.g., {{example2}}).':
    'Shell-Befehle �ber {{symbol}} ausf�hren (z.B. {{example1}}) oder nat�rliche Sprache verwenden (z.B. {{example2}}).',
  '!': '!',
  '!npm run start': '!npm run start',
  'start server': 'Server starten',
  'Commands:': 'Befehle:',
  'shell command': 'Shell-Befehl',
  'Model Context Protocol command (from external servers)':
    'Model Context Protocol Befehl (von externen Servern)',
  'Keyboard Shortcuts:': 'Tastenk�rzel:',
  'Jump through words in the input': 'W�rter in der Eingabe �berspringen',
  'Close dialogs, cancel requests, or quit application':
    'Dialoge schlie�en, Anfragen abbrechen oder Anwendung beenden',
  'New line': 'Neue Zeile',
  'New line (Alt+Enter works for certain linux distros)':
    'Neue Zeile (Alt+Enter funktioniert bei bestimmten Linux-Distributionen)',
  'Clear the screen': 'Bildschirm l�schen',
  'Open input in external editor': 'Eingabe in externem Editor �ffnen',
  'Send message': 'Nachricht senden',
  'Initializing...': 'Initialisierung...',
  'Connecting to MCP servers... ({{connected}}/{{total}})':
    'Verbindung zu MCP-Servern wird hergestellt... ({{connected}}/{{total}})',
  'Type your message or @path/to/file':
    'Nachricht eingeben oder @Pfad/zur/Datei',
  "Press 'i' for INSERT mode and 'Esc' for NORMAL mode.":
    "Dr�cken Sie 'i' f�r den EINF�GE-Modus und 'Esc' f�r den NORMAL-Modus.",
  'Cancel operation / Clear input (double press)':
    'Vorgang abbrechen / Eingabe l�schen (doppelt dr�cken)',
  'Cycle approval modes': 'Genehmigungsmodi durchschalten',
  'Cycle through your prompt history': 'Eingabeverlauf durchbl�ttern',
  'For a full list of shortcuts, see {{docPath}}':
    'Eine vollst�ndige Liste der Tastenk�rzel finden Sie unter {{docPath}}',
  'docs/keyboard-shortcuts.md': 'docs/keyboard-shortcuts.md',
  'for help on HopCode': 'f�r Hilfe zu HopCode',
  'show version info': 'Versionsinformationen anzeigen',
  'submit a bug report': 'Fehlerbericht einreichen',
  'About HopCode': '�ber HopCode',
  Status: 'Status',

  // ============================================================================
  // System Information Fields
  // ============================================================================
  HopCode: 'HopCode',
  Runtime: 'Laufzeit',
  OS: 'Betriebssystem',
  Auth: 'Authentifizierung',
  'CLI Version': 'CLI-Version',
  'Git Commit': 'Git-Commit',
  Model: 'Modell',
  'Fast Model': 'Schnelles Modell',
  Sandbox: 'Sandbox',
  'OS Platform': 'Betriebssystem',
  'OS Arch': 'OS-Architektur',
  'OS Release': 'OS-Version',
  'Node.js Version': 'Node.js-Version',
  'NPM Version': 'NPM-Version',
  'Session ID': 'Sitzungs-ID',
  'Auth Method': 'Authentifizierungsmethode',
  'Base URL': 'Basis-URL',
  Proxy: 'Proxy',
  'Memory Usage': 'Speichernutzung',
  'IDE Client': 'IDE-Client',

  // ============================================================================
  // Commands - General
  // ============================================================================
  'Analyzes the project and creates a tailored HOPCODE.md file.':
    'Analysiert das Projekt und erstellt eine ma�geschneiderte HOPCODE.md-Datei.',
  'List available HopCode tools. Usage: /tools [desc]':
    'Verf�gbare HopCode Werkzeuge auflisten. Verwendung: /tools [desc]',
  'List available skills.': 'Verf�gbare Skills auflisten.',
  'Available HopCode CLI tools:': 'Verf�gbare HopCode CLI-Werkzeuge:',
  'No tools available': 'Keine Werkzeuge verf�gbar',
  'View or change the approval mode for tool usage':
    'Genehmigungsmodus f�r Werkzeugnutzung anzeigen oder �ndern',
  'View or change the language setting':
    'Spracheinstellung anzeigen oder �ndern',
  'change the theme': 'Design �ndern',
  'Select Theme': 'Design ausw�hlen',
  Preview: 'Vorschau',
  '(Use Enter to select, Tab to configure scope)':
    '(Enter zum Ausw�hlen, Tab zum Konfigurieren des Bereichs)',
  '(Use Enter to apply scope, Tab to go back)':
    '(Enter zum Anwenden des Bereichs, Tab zum Zur�ckgehen)',
  'Theme configuration unavailable due to NO_COLOR env variable.':
    'Design-Konfiguration aufgrund der NO_COLOR-Umgebungsvariable nicht verf�gbar.',
  'Theme "{{themeName}}" not found.': 'Design "{{themeName}}" nicht gefunden.',
  'Theme "{{themeName}}" not found in selected scope.':
    'Design "{{themeName}}" im ausgew�hlten Bereich nicht gefunden.',
  'Clear conversation history and free up context':
    'Gespr�chsverlauf l�schen und Kontext freigeben',
  'Compresses the context by replacing it with a summary.':
    'Komprimiert den Kontext durch Ersetzen mit einer Zusammenfassung.',
  'open full HopCode documentation in your browser':
    'Vollst�ndige HopCode Dokumentation im Browser �ffnen',
  'Configuration not available.': 'Konfiguration nicht verf�gbar.',
  'change the auth method': 'Authentifizierungsmethode �ndern',
  'Configure authentication information for login':
    'Authentifizierungsinformationen f�r die Anmeldung konfigurieren',
  'Copy the last result or code snippet to clipboard':
    'Letztes Ergebnis oder Codeausschnitt in die Zwischenablage kopieren',

  // ============================================================================
  // Commands - Agents
  // ============================================================================
  'Manage subagents for specialized task delegation.':
    'Unteragenten f�r spezialisierte Aufgabendelegation verwalten.',
  'Manage existing subagents (view, edit, delete).':
    'Bestehende Unteragenten verwalten (anzeigen, bearbeiten, l�schen).',
  'Create a new subagent with guided setup.':
    'Neuen Unteragenten mit gef�hrter Einrichtung erstellen.',

  // ============================================================================
  // Agents - Management Dialog
  // ============================================================================
  Agents: 'Agenten',
  'Choose Action': 'Aktion w�hlen',
  'Edit {{name}}': '{{name}} bearbeiten',
  'Edit Tools: {{name}}': 'Werkzeuge bearbeiten: {{name}}',
  'Edit Color: {{name}}': 'Farbe bearbeiten: {{name}}',
  'Delete {{name}}': '{{name}} l�schen',
  'Unknown Step': 'Unbekannter Schritt',
  'Esc to close': 'Esc zum Schlie�en',
  'Enter to select, ?? to navigate, Esc to close':
    'Enter zum Ausw�hlen, ?? zum Navigieren, Esc zum Schlie�en',
  'Esc to go back': 'Esc zum Zur�ckgehen',
  'Enter to confirm, Esc to cancel': 'Enter zum Best�tigen, Esc zum Abbrechen',
  'Enter to select, ?? to navigate, Esc to go back':
    'Enter zum Ausw�hlen, ?? zum Navigieren, Esc zum Zur�ckgehen',
  'Enter to submit, Esc to go back': 'Enter zum Absenden, Esc zum Zur�ckgehen',
  'Invalid step: {{step}}': 'Ung�ltiger Schritt: {{step}}',
  'No subagents found.': 'Keine Unteragenten gefunden.',
  "Use '/agents create' to create your first subagent.":
    "Verwenden Sie '/agents create', um Ihren ersten Unteragenten zu erstellen.",
  '(built-in)': '(integriert)',
  '(overridden by project level agent)': '(�berschrieben durch Projektagent)',
  'Project Level ({{path}})': 'Projektebene ({{path}})',
  'User Level ({{path}})': 'Benutzerebene ({{path}})',
  'Built-in Agents': 'Integrierte Agenten',
  'Extension Agents': 'Erweiterungs-Agenten',
  'Using: {{count}} agents': 'Verwendet: {{count}} Agenten',
  'View Agent': 'Agent anzeigen',
  'Edit Agent': 'Agent bearbeiten',
  'Delete Agent': 'Agent l�schen',
  Back: 'Zur�ck',
  'No agent selected': 'Kein Agent ausgew�hlt',
  'File Path: ': 'Dateipfad: ',
  'Tools: ': 'Werkzeuge: ',
  'Color: ': 'Farbe: ',
  'Description:': 'Beschreibung:',
  'System Prompt:': 'System-Prompt:',
  'Open in editor': 'Im Editor �ffnen',
  'Edit tools': 'Werkzeuge bearbeiten',
  'Edit color': 'Farbe bearbeiten',
  '? Error:': '? Fehler:',
  'Are you sure you want to delete agent "{{name}}"?':
    'Sind Sie sicher, dass Sie den Agenten "{{name}}" l�schen m�chten?',
  // ============================================================================
  // Agents - Creation Wizard
  // ============================================================================
  'Project Level (.hopcode/agents/)': 'Projektebene (.hopcode/agents/)',
  'User Level (~/.hopcode/agents/)': 'Benutzerebene (~/.hopcode/agents/)',
  '? Subagent Created Successfully!': '? Unteragent erfolgreich erstellt!',
  'Subagent "{{name}}" has been saved to {{level}} level.':
    'Unteragent "{{name}}" wurde auf {{level}}-Ebene gespeichert.',
  'Name: ': 'Name: ',
  'Location: ': 'Speicherort: ',
  '? Error saving subagent:': '? Fehler beim Speichern des Unteragenten:',
  'Warnings:': 'Warnungen:',
  'Name "{{name}}" already exists at {{level}} level - will overwrite existing subagent':
    'Name "{{name}}" existiert bereits auf {{level}}-Ebene - bestehender Unteragent wird �berschrieben',
  'Name "{{name}}" exists at user level - project level will take precedence':
    'Name "{{name}}" existiert auf Benutzerebene - Projektebene hat Vorrang',
  'Name "{{name}}" exists at project level - existing subagent will take precedence':
    'Name "{{name}}" existiert auf Projektebene - bestehender Unteragent hat Vorrang',
  'Description is over {{length}} characters':
    'Beschreibung ist �ber {{length}} Zeichen',
  'System prompt is over {{length}} characters':
    'System-Prompt ist �ber {{length}} Zeichen',
  // Agents - Creation Wizard Steps
  'Step {{n}}: Choose Location': 'Schritt {{n}}: Speicherort w�hlen',
  'Step {{n}}: Choose Generation Method':
    'Schritt {{n}}: Generierungsmethode w�hlen',
  'Generate with HopCode (Recommended)': 'Mit HopCode generieren (Empfohlen)',
  'Manual Creation': 'Manuelle Erstellung',
  'Describe what this subagent should do and when it should be used. (Be comprehensive for best results)':
    'Beschreiben Sie, was dieser Unteragent tun soll und wann er verwendet werden soll. (Ausf�hrliche Beschreibung f�r beste Ergebnisse)',
  'e.g., Expert code reviewer that reviews code based on best practices...':
    'z.B. Experte f�r Code-Reviews, der Code nach Best Practices �berpr�ft...',
  'Generating subagent configuration...':
    'Unteragent-Konfiguration wird generiert...',
  'Failed to generate subagent: {{error}}':
    'Fehler beim Generieren des Unteragenten: {{error}}',
  'Step {{n}}: Describe Your Subagent': 'Schritt {{n}}: Unteragent beschreiben',
  'Step {{n}}: Enter Subagent Name': 'Schritt {{n}}: Unteragent-Name eingeben',
  'Step {{n}}: Enter System Prompt': 'Schritt {{n}}: System-Prompt eingeben',
  'Step {{n}}: Enter Description': 'Schritt {{n}}: Beschreibung eingeben',
  // Agents - Tool Selection
  'Step {{n}}: Select Tools': 'Schritt {{n}}: Werkzeuge ausw�hlen',
  'All Tools (Default)': 'Alle Werkzeuge (Standard)',
  'All Tools': 'Alle Werkzeuge',
  'Read-only Tools': 'Nur-Lese-Werkzeuge',
  'Read & Edit Tools': 'Lese- und Bearbeitungswerkzeuge',
  'Read & Edit & Execution Tools':
    'Lese-, Bearbeitungs- und Ausf�hrungswerkzeuge',
  'All tools selected, including MCP tools':
    'Alle Werkzeuge ausgew�hlt, einschlie�lich MCP-Werkzeuge',
  'Selected tools:': 'Ausgew�hlte Werkzeuge:',
  'Read-only tools:': 'Nur-Lese-Werkzeuge:',
  'Edit tools:': 'Bearbeitungswerkzeuge:',
  'Execution tools:': 'Ausf�hrungswerkzeuge:',
  'Step {{n}}: Choose Background Color':
    'Schritt {{n}}: Hintergrundfarbe w�hlen',
  'Step {{n}}: Confirm and Save': 'Schritt {{n}}: Best�tigen und Speichern',
  // Agents - Navigation & Instructions
  'Esc to cancel': 'Esc zum Abbrechen',
  'Press Enter to save, e to save and edit, Esc to go back':
    'Enter zum Speichern, e zum Speichern und Bearbeiten, Esc zum Zur�ckgehen',
  'Press Enter to continue, {{navigation}}Esc to {{action}}':
    'Enter zum Fortfahren, {{navigation}}Esc zum {{action}}',
  cancel: 'Abbrechen',
  'go back': 'Zur�ckgehen',
  '?? to navigate, ': '?? zum Navigieren, ',
  'Enter a clear, unique name for this subagent.':
    'Geben Sie einen eindeutigen Namen f�r diesen Unteragenten ein.',
  'e.g., Code Reviewer': 'z.B. Code-Reviewer',
  'Name cannot be empty.': 'Name darf nicht leer sein.',
  "Write the system prompt that defines this subagent's behavior. Be comprehensive for best results.":
    'Schreiben Sie den System-Prompt, der das Verhalten dieses Unteragenten definiert. Ausf�hrlich f�r beste Ergebnisse.',
  'e.g., You are an expert code reviewer...':
    'z.B. Sie sind ein Experte f�r Code-Reviews...',
  'System prompt cannot be empty.': 'System-Prompt darf nicht leer sein.',
  'Describe when and how this subagent should be used.':
    'Beschreiben Sie, wann und wie dieser Unteragent verwendet werden soll.',
  'e.g., Reviews code for best practices and potential bugs.':
    'z.B. �berpr�ft Code auf Best Practices und m�gliche Fehler.',
  'Description cannot be empty.': 'Beschreibung darf nicht leer sein.',
  'Failed to launch editor: {{error}}':
    'Fehler beim Starten des Editors: {{error}}',
  'Failed to save and edit subagent: {{error}}':
    'Fehler beim Speichern und Bearbeiten des Unteragenten: {{error}}',

  // ============================================================================
  // Commands - General (continued)
  // ============================================================================
  'View and edit HopCode settings':
    'HopCode Einstellungen anzeigen und bearbeiten',
  Settings: 'Einstellungen',
  'To see changes, HopCode must be restarted. Press r to exit and apply changes now.':
    'Um �nderungen zu sehen, muss HopCode neu gestartet werden. Dr�cken Sie r, um jetzt zu beenden und �nderungen anzuwenden.',
  'The command "/{{command}}" is not supported in non-interactive mode.':
    'Der Befehl "/{{command}}" wird im nicht-interaktiven Modus nicht unterst�tzt.',
  // ============================================================================
  // Settings Labels
  // ============================================================================
  'Vim Mode': 'Vim-Modus',
  'Disable Auto Update': 'Automatische Updates deaktivieren',
  'Attribution: commit': 'Attribution: Commit',
  'Terminal Bell Notification': 'Terminal-Signalton',
  'Enable Usage Statistics': 'Nutzungsstatistiken aktivieren',
  Theme: 'Farbschema',
  'Preferred Editor': 'Bevorzugter Editor',
  'Auto-connect to IDE': 'Automatische Verbindung zur IDE',
  'Enable Prompt Completion': 'Eingabevervollst�ndigung aktivieren',
  'Debug Keystroke Logging': 'Debug-Protokollierung von Tastatureingaben',
  'Language: UI': 'Sprache: Benutzeroberfl�che',
  'Language: Model': 'Sprache: Modell',
  'Output Format': 'Ausgabeformat',
  'Hide Window Title': 'Fenstertitel ausblenden',
  'Show Status in Title': 'Status im Titel anzeigen',
  'Hide Tips': 'Tipps ausblenden',
  'Show Line Numbers in Code': 'Zeilennummern im Code anzeigen',
  'Show Citations': 'Quellenangaben anzeigen',
  'Custom Witty Phrases': 'Benutzerdefinierte Witzige Spr�che',
  'Show Welcome Back Dialog': 'Willkommen-zur�ck-Dialog anzeigen',
  'Enable User Feedback': 'Benutzerfeedback aktivieren',
  'How is HopCode doing this session? (optional)':
    'Wie macht sich HopCode in dieser Sitzung? (optional)',
  Bad: 'Schlecht',
  Fine: 'In Ordnung',
  Good: 'Gut',
  Dismiss: 'Ignorieren',
  'Not Sure Yet': 'Noch nicht sicher',
  'Any other key': 'Beliebige andere Taste',
  'Disable Loading Phrases': 'Ladespr�che deaktivieren',
  'Screen Reader Mode': 'Bildschirmleser-Modus',
  'IDE Mode': 'IDE-Modus',
  'Max Session Turns': 'Maximale Sitzungsrunden',
  'Skip Next Speaker Check': 'N�chste-Sprecher-Pr�fung �berspringen',
  'Skip Loop Detection': 'Schleifenerkennung �berspringen',
  'Skip Startup Context': 'Startkontext �berspringen',
  'Enable OpenAI Logging': 'OpenAI-Protokollierung aktivieren',
  'OpenAI Logging Directory': 'OpenAI-Protokollierungsverzeichnis',
  Timeout: 'Zeitlimit',
  'Max Retries': 'Maximale Wiederholungen',
  'Disable Cache Control': 'Cache-Steuerung deaktivieren',
  'Memory Discovery Max Dirs': 'Maximale Verzeichnisse f�r Speichererkennung',
  'Load Memory From Include Directories':
    'Speicher aus Include-Verzeichnissen laden',
  'Respect .gitignore': '.gitignore beachten',
  'Respect .hopcodeignore': '.hopcodeignore beachten',
  'Enable Recursive File Search': 'Rekursive Dateisuche aktivieren',
  'Disable Fuzzy Search': 'Unscharfe Suche deaktivieren',
  'Interactive Shell (PTY)': 'Interaktive Shell (PTY)',
  'Show Color': 'Farbe anzeigen',
  'Auto Accept': 'Automatisch akzeptieren',
  'Use Ripgrep': 'Ripgrep verwenden',
  'Use Builtin Ripgrep': 'Integriertes Ripgrep verwenden',
  'Enable Tool Output Truncation': 'Werkzeugausgabe-K�rzung aktivieren',
  'Tool Output Truncation Threshold':
    'Schwellenwert f�r Werkzeugausgabe-K�rzung',
  'Tool Output Truncation Lines': 'Zeilen f�r Werkzeugausgabe-K�rzung',
  'Folder Trust': 'Ordnervertrauen',
  'Vision Model Preview': 'Vision-Modell-Vorschau',
  'Tool Schema Compliance': 'Werkzeug-Schema-Konformit�t',
  // Settings enum options
  'Auto (detect from system)': 'Automatisch (vom System erkennen)',
  'Auto (detect terminal theme)': 'Automatisch (Terminal-Theme erkennen)',
  Auto: 'Automatisch',
  Text: 'Text',
  JSON: 'JSON',
  Plan: 'Plan',
  Default: 'Standard',
  'Auto Edit': 'Automatisch bearbeiten',
  IZN: 'IZN',
  'toggle vim mode on/off': 'Vim-Modus ein-/ausschalten',
  'check session stats. Usage: /stats [model|tools]':
    'Sitzungsstatistiken pr�fen. Verwendung: /stats [model|tools]',
  'Show model-specific usage statistics.':
    'Modellspezifische Nutzungsstatistiken anzeigen.',
  'Show tool-specific usage statistics.':
    'Werkzeugspezifische Nutzungsstatistiken anzeigen.',
  'exit the cli': 'CLI beenden',
  'Open MCP management dialog, or authenticate with OAuth-enabled servers':
    'MCP-Verwaltungsdialog �ffnen oder mit OAuth-f�higem Server authentifizieren',
  'List configured MCP servers and tools, or authenticate with OAuth-enabled servers':
    'Konfigurierte MCP-Server und Werkzeuge auflisten oder mit OAuth-f�higen Servern authentifizieren',
  'Manage workspace directories': 'Arbeitsbereichsverzeichnisse verwalten',
  'Add directories to the workspace. Use comma to separate multiple paths':
    'Verzeichnisse zum Arbeitsbereich hinzuf�gen. Komma zum Trennen mehrerer Pfade verwenden',
  'Show all directories in the workspace':
    'Alle Verzeichnisse im Arbeitsbereich anzeigen',
  'set external editor preference': 'Externen Editor festlegen',
  'Select Editor': 'Editor ausw�hlen',
  'Editor Preference': 'Editor-Einstellung',
  'These editors are currently supported. Please note that some editors cannot be used in sandbox mode.':
    'Diese Editoren werden derzeit unterst�tzt. Bitte beachten Sie, dass einige Editoren nicht im Sandbox-Modus verwendet werden k�nnen.',
  'Your preferred editor is:': 'Ihr bevorzugter Editor ist:',
  'Manage extensions': 'Erweiterungen verwalten',
  'Manage installed extensions': 'Installierte Erweiterungen verwalten',
  'List active extensions': 'Aktive Erweiterungen auflisten',
  'Update extensions. Usage: update <extension-names>|--all':
    'Erweiterungen aktualisieren. Verwendung: update <Erweiterungsnamen>|--all',
  'Disable an extension': 'Erweiterung deaktivieren',
  'Enable an extension': 'Erweiterung aktivieren',
  'Install an extension from a git repo or local path':
    'Erweiterung aus Git-Repository oder lokalem Pfad installieren',
  'Uninstall an extension': 'Erweiterung deinstallieren',
  'No extensions installed.': 'Keine Erweiterungen installiert.',
  'Usage: /extensions update <extension-names>|--all':
    'Verwendung: /extensions update <Erweiterungsnamen>|--all',
  'Extension "{{name}}" not found.': 'Erweiterung "{{name}}" nicht gefunden.',
  'No extensions to update.': 'Keine Erweiterungen zum Aktualisieren.',
  'Usage: /extensions install <source>':
    'Verwendung: /extensions install <Quelle>',
  'Installing extension from "{{source}}"...':
    'Installiere Erweiterung von "{{source}}"...',
  'Extension "{{name}}" installed successfully.':
    'Erweiterung "{{name}}" erfolgreich installiert.',
  'Failed to install extension from "{{source}}": {{error}}':
    'Fehler beim Installieren der Erweiterung von "{{source}}": {{error}}',
  'Usage: /extensions uninstall <extension-name>':
    'Verwendung: /extensions uninstall <Erweiterungsname>',
  'Uninstalling extension "{{name}}"...':
    'Deinstalliere Erweiterung "{{name}}"...',
  'Extension "{{name}}" uninstalled successfully.':
    'Erweiterung "{{name}}" erfolgreich deinstalliert.',
  'Failed to uninstall extension "{{name}}": {{error}}':
    'Fehler beim Deinstallieren der Erweiterung "{{name}}": {{error}}',
  'Usage: /extensions {{command}} <extension> [--scope=<user|workspace>]':
    'Verwendung: /extensions {{command}} <Erweiterung> [--scope=<user|workspace>]',
  'Unsupported scope "{{scope}}", should be one of "user" or "workspace"':
    'Nicht unterst�tzter Bereich "{{scope}}", sollte "user" oder "workspace" sein',
  'Extension "{{name}}" disabled for scope "{{scope}}"':
    'Erweiterung "{{name}}" f�r Bereich "{{scope}}" deaktiviert',
  'Extension "{{name}}" enabled for scope "{{scope}}"':
    'Erweiterung "{{name}}" f�r Bereich "{{scope}}" aktiviert',
  'Do you want to continue? [Y/n]: ': 'M�chten Sie fortfahren? [Y/n]: ',
  'Do you want to continue?': 'M�chten Sie fortfahren?',
  'Installing extension "{{name}}".':
    'Erweiterung "{{name}}" wird installiert.',
  '**Extensions may introduce unexpected behavior. Ensure you have investigated the extension source and trust the author.**':
    '**Erweiterungen k�nnen unerwartetes Verhalten verursachen. Stellen Sie sicher, dass Sie die Erweiterungsquelle untersucht haben und dem Autor vertrauen.**',
  'This extension will run the following MCP servers:':
    'Diese Erweiterung wird folgende MCP-Server ausf�hren:',
  local: 'lokal',
  remote: 'remote',
  'This extension will add the following commands: {{commands}}.':
    'Diese Erweiterung wird folgende Befehle hinzuf�gen: {{commands}}.',
  'This extension will append info to your HOPCODE.md context using {{fileName}}':
    'Diese Erweiterung wird Informationen zu Ihrem HOPCODE.md-Kontext mit {{fileName}} hinzuf�gen',
  'This extension will exclude the following core tools: {{tools}}':
    'Diese Erweiterung wird folgende Kernwerkzeuge ausschlie�en: {{tools}}',
  'This extension will install the following skills:':
    'Diese Erweiterung wird folgende F�higkeiten installieren:',
  'This extension will install the following subagents:':
    'Diese Erweiterung wird folgende Unteragenten installieren:',
  'Installation cancelled for "{{name}}".':
    'Installation von "{{name}}" abgebrochen.',
  'You are installing an extension from {{originSource}}. Some features may not work perfectly with HopCode.':
    'Sie installieren eine Erweiterung von {{originSource}}. Einige Funktionen funktionieren m�glicherweise nicht perfekt mit HopCode.',
  '--ref and --auto-update are not applicable for marketplace extensions.':
    '--ref und --auto-update sind nicht anwendbar f�r Marketplace-Erweiterungen.',
  'Extension "{{name}}" installed successfully and enabled.':
    'Erweiterung "{{name}}" erfolgreich installiert und aktiviert.',
  'Installs an extension from a git repository URL, local path, or claude marketplace (marketplace-url:plugin-name).':
    'Installiert eine Erweiterung von einer Git-Repository-URL, einem lokalen Pfad oder dem Claude-Marketplace (marketplace-url:plugin-name).',
  'The github URL, local path, or marketplace source (marketplace-url:plugin-name) of the extension to install.':
    'Die GitHub-URL, der lokale Pfad oder die Marketplace-Quelle (marketplace-url:plugin-name) der zu installierenden Erweiterung.',
  'The git ref to install from.': 'Die Git-Referenz f�r die Installation.',
  'Enable auto-update for this extension.':
    'Automatisches Update f�r diese Erweiterung aktivieren.',
  'Enable pre-release versions for this extension.':
    'Pre-Release-Versionen f�r diese Erweiterung aktivieren.',
  'Acknowledge the security risks of installing an extension and skip the confirmation prompt.':
    'Sicherheitsrisiken der Erweiterungsinstallation best�tigen und Best�tigungsaufforderung �berspringen.',
  'The source argument must be provided.':
    'Das Quellargument muss angegeben werden.',
  'Extension "{{name}}" successfully uninstalled.':
    'Erweiterung "{{name}}" erfolgreich deinstalliert.',
  'Uninstalls an extension.': 'Deinstalliert eine Erweiterung.',
  'The name or source path of the extension to uninstall.':
    'Der Name oder Quellpfad der zu deinstallierenden Erweiterung.',
  'Please include the name of the extension to uninstall as a positional argument.':
    'Bitte geben Sie den Namen der zu deinstallierenden Erweiterung als Positionsargument an.',
  'Enables an extension.': 'Aktiviert eine Erweiterung.',
  'The name of the extension to enable.':
    'Der Name der zu aktivierenden Erweiterung.',
  'The scope to enable the extenison in. If not set, will be enabled in all scopes.':
    'Der Bereich, in dem die Erweiterung aktiviert werden soll. Wenn nicht gesetzt, wird sie in allen Bereichen aktiviert.',
  'Extension "{{name}}" successfully enabled for scope "{{scope}}".':
    'Erweiterung "{{name}}" erfolgreich f�r Bereich "{{scope}}" aktiviert.',
  'Extension "{{name}}" successfully enabled in all scopes.':
    'Erweiterung "{{name}}" erfolgreich in allen Bereichen aktiviert.',
  'Invalid scope: {{scope}}. Please use one of {{scopes}}.':
    'Ung�ltiger Bereich: {{scope}}. Bitte verwenden Sie einen von {{scopes}}.',
  'Disables an extension.': 'Deaktiviert eine Erweiterung.',
  'The name of the extension to disable.':
    'Der Name der zu deaktivierenden Erweiterung.',
  'The scope to disable the extenison in.':
    'Der Bereich, in dem die Erweiterung deaktiviert werden soll.',
  'Extension "{{name}}" successfully disabled for scope "{{scope}}".':
    'Erweiterung "{{name}}" erfolgreich f�r Bereich "{{scope}}" deaktiviert.',
  'Extension "{{name}}" successfully updated: {{oldVersion}} ? {{newVersion}}.':
    'Erweiterung "{{name}}" erfolgreich aktualisiert: {{oldVersion}} ? {{newVersion}}.',
  'Unable to install extension "{{name}}" due to missing install metadata':
    'Erweiterung "{{name}}" kann aufgrund fehlender Installationsmetadaten nicht installiert werden',
  'Extension "{{name}}" is already up to date.':
    'Erweiterung "{{name}}" ist bereits aktuell.',
  'Updates all extensions or a named extension to the latest version.':
    'Aktualisiert alle Erweiterungen oder eine benannte Erweiterung auf die neueste Version.',
  'The name of the extension to update.':
    'Der Name der zu aktualisierenden Erweiterung.',
  'Update all extensions.': 'Alle Erweiterungen aktualisieren.',
  'Either an extension name or --all must be provided':
    'Entweder ein Erweiterungsname oder --all muss angegeben werden',
  'Lists installed extensions.': 'Listet installierte Erweiterungen auf.',
  'Path:': 'Pfad:',
  'Source:': 'Quelle:',
  'Type:': 'Typ:',
  'Ref:': 'Ref:',
  'Release tag:': 'Release-Tag:',
  'Enabled (User):': 'Aktiviert (Benutzer):',
  'Enabled (Workspace):': 'Aktiviert (Arbeitsbereich):',
  'Context files:': 'Kontextdateien:',
  'Skills:': 'Skills:',
  'Agents:': 'Agents:',
  'MCP servers:': 'MCP-Server:',
  'Link extension failed to install.':
    'Verkn�pfte Erweiterung konnte nicht installiert werden.',
  'Extension "{{name}}" linked successfully and enabled.':
    'Erweiterung "{{name}}" erfolgreich verkn�pft und aktiviert.',
  'Links an extension from a local path. Updates made to the local path will always be reflected.':
    'Verkn�pft eine Erweiterung von einem lokalen Pfad. �nderungen am lokalen Pfad werden immer widergespiegelt.',
  'The name of the extension to link.':
    'Der Name der zu verkn�pfenden Erweiterung.',
  'Set a specific setting for an extension.':
    'Legt eine bestimmte Einstellung f�r eine Erweiterung fest.',
  'Name of the extension to configure.':
    'Name der zu konfigurierenden Erweiterung.',
  'The setting to configure (name or env var).':
    'Die zu konfigurierende Einstellung (Name oder Umgebungsvariable).',
  'The scope to set the setting in.':
    'Der Bereich, in dem die Einstellung gesetzt werden soll.',
  'List all settings for an extension.':
    'Listet alle Einstellungen einer Erweiterung auf.',
  'Name of the extension.': 'Name der Erweiterung.',
  'Extension "{{name}}" has no settings to configure.':
    'Erweiterung "{{name}}" hat keine zu konfigurierenden Einstellungen.',
  'Settings for "{{name}}":': 'Einstellungen f�r "{{name}}":',
  '(workspace)': '(Arbeitsbereich)',
  '(user)': '(Benutzer)',
  '[not set]': '[nicht gesetzt]',
  '[value stored in keychain]': '[Wert in Schl�sselbund gespeichert]',
  'Manage extension settings.': 'Erweiterungseinstellungen verwalten.',
  'You need to specify a command (set or list).':
    'Sie m�ssen einen Befehl angeben (set oder list).',
  // ============================================================================
  // Plugin Choice / Marketplace
  // ============================================================================
  'No plugins available in this marketplace.':
    'In diesem Marktplatz sind keine Plugins verf�gbar.',
  'Select a plugin to install from marketplace "{{name}}":':
    'W�hlen Sie ein Plugin zur Installation aus Marktplatz "{{name}}":',
  'Plugin selection cancelled.': 'Plugin-Auswahl abgebrochen.',
  'Select a plugin from "{{name}}"': 'Plugin aus "{{name}}" ausw�hlen',
  'Use ?? or j/k to navigate, Enter to select, Escape to cancel':
    'Verwenden Sie ?? oder j/k zum Navigieren, Enter zum Ausw�hlen, Escape zum Abbrechen',
  '{{count}} more above': '{{count}} weitere oben',
  '{{count}} more below': '{{count}} weitere unten',
  'manage IDE integration': 'IDE-Integration verwalten',
  'check status of IDE integration': 'Status der IDE-Integration pr�fen',
  'install required IDE companion for {{ideName}}':
    'Erforderlichen IDE-Begleiter f�r {{ideName}} installieren',
  'enable IDE integration': 'IDE-Integration aktivieren',
  'disable IDE integration': 'IDE-Integration deaktivieren',
  'IDE integration is not supported in your current environment. To use this feature, run HopCode in one of these supported IDEs: VS Code or VS Code forks.':
    'IDE-Integration wird in Ihrer aktuellen Umgebung nicht unterst�tzt. Um diese Funktion zu nutzen, f�hren Sie HopCode in einer dieser unterst�tzten IDEs aus: VS Code oder VS Code-Forks.',
  'Set up GitHub Actions': 'GitHub Actions einrichten',
  'Configure terminal keybindings for multiline input (VS Code, Cursor, Windsurf, Trae)':
    'Terminal-Tastenbelegungen f�r mehrzeilige Eingabe konfigurieren (VS Code, Cursor, Windsurf, Trae)',
  'Please restart your terminal for the changes to take effect.':
    'Bitte starten Sie Ihr Terminal neu, damit die �nderungen wirksam werden.',
  'Failed to configure terminal: {{error}}':
    'Fehler beim Konfigurieren des Terminals: {{error}}',
  'Could not determine {{terminalName}} config path on Windows: APPDATA environment variable is not set.':
    'Konnte {{terminalName}}-Konfigurationspfad unter Windows nicht ermitteln: APPDATA-Umgebungsvariable ist nicht gesetzt.',
  '{{terminalName}} keybindings.json exists but is not a valid JSON array. Please fix the file manually or delete it to allow automatic configuration.':
    '{{terminalName}} keybindings.json existiert, ist aber kein g�ltiges JSON-Array. Bitte korrigieren Sie die Datei manuell oder l�schen Sie sie, um automatische Konfiguration zu erm�glichen.',
  'File: {{file}}': 'Datei: {{file}}',
  'Failed to parse {{terminalName}} keybindings.json. The file contains invalid JSON. Please fix the file manually or delete it to allow automatic configuration.':
    'Fehler beim Parsen von {{terminalName}} keybindings.json. Die Datei enth�lt ung�ltiges JSON. Bitte korrigieren Sie die Datei manuell oder l�schen Sie sie, um automatische Konfiguration zu erm�glichen.',
  'Error: {{error}}': 'Fehler: {{error}}',
  'Shift+Enter binding already exists':
    'Umschalt+Enter-Belegung existiert bereits',
  'Ctrl+Enter binding already exists': 'Strg+Enter-Belegung existiert bereits',
  'Existing keybindings detected. Will not modify to avoid conflicts.':
    'Bestehende Tastenbelegungen erkannt. Keine �nderungen, um Konflikte zu vermeiden.',
  'Please check and modify manually if needed: {{file}}':
    'Bitte pr�fen und bei Bedarf manuell �ndern: {{file}}',
  'Added Shift+Enter and Ctrl+Enter keybindings to {{terminalName}}.':
    'Umschalt+Enter und Strg+Enter Tastenbelegungen zu {{terminalName}} hinzugef�gt.',
  'Modified: {{file}}': 'Ge�ndert: {{file}}',
  '{{terminalName}} keybindings already configured.':
    '{{terminalName}}-Tastenbelegungen bereits konfiguriert.',
  'Failed to configure {{terminalName}}.':
    'Fehler beim Konfigurieren von {{terminalName}}.',
  'Your terminal is already configured for an optimal experience with multiline input (Shift+Enter and Ctrl+Enter).':
    'Ihr Terminal ist bereits f�r optimale Erfahrung mit mehrzeiliger Eingabe konfiguriert (Umschalt+Enter und Strg+Enter).',
  // ============================================================================
  // Commands - Hooks
  // ============================================================================
  'Manage HopCode hooks': 'HopCode-Hooks verwalten',
  'List all configured hooks': 'Alle konfigurierten Hooks auflisten',
  'Enable a disabled hook': 'Einen deaktivierten Hook aktivieren',
  'Disable an active hook': 'Einen aktiven Hook deaktivieren',
  // Hooks - Dialog
  Hooks: 'Hooks',
  'Loading hooks...': 'Hooks werden geladen...',
  'Error loading hooks:': 'Fehler beim Laden der Hooks:',
  'Press Escape to close': 'Escape zum Schlie�en dr�cken',
  'Press Escape, Ctrl+C, or Ctrl+D to cancel':
    'Escape, Ctrl+C oder Ctrl+D zum Abbrechen',
  'Press Space, Enter, or Escape to dismiss':
    'Leertaste, Enter oder Escape zum Schlie�en',
  'No hook selected': 'Kein Hook ausgew�hlt',
  // Hooks - List Step
  'No hook events found.': 'Keine Hook-Ereignisse gefunden.',
  '{{count}} hook configured': '{{count}} Hook konfiguriert',
  '{{count}} hooks configured': '{{count}} Hooks konfiguriert',
  'This menu is read-only. To add or modify hooks, edit settings.json directly or ask HopCode.':
    'Dieses Men� ist schreibgesch�tzt. Um Hooks hinzuzuf�gen oder zu �ndern, bearbeiten Sie settings.json direkt oder fragen Sie HopCode.',
  'Enter to select � Esc to cancel': 'Enter zum Ausw�hlen � Esc zum Abbrechen',
  // Hooks - Detail Step
  'Exit codes:': 'Exit-Codes:',
  'Configured hooks:': 'Konfigurierte Hooks:',
  'No hooks configured for this event.':
    'F�r dieses Ereignis sind keine Hooks konfiguriert.',
  'To add hooks, edit settings.json directly or ask HopCode.':
    'Um Hooks hinzuzuf�gen, bearbeiten Sie settings.json direkt oder fragen Sie HopCode.',
  'Enter to select � Esc to go back': 'Enter zum Ausw�hlen � Esc zum Zur�ck',
  // Hooks - Config Detail Step
  'Hook details': 'Hook-Details',
  'Event:': 'Ereignis:',
  'Extension:': 'Erweiterung:',
  'Desc:': 'Beschreibung:',
  'No hook config selected': 'Keine Hook-Konfiguration ausgew�hlt',
  'To modify or remove this hook, edit settings.json directly or ask HopCode to help.':
    'Um diesen Hook zu �ndern oder zu entfernen, bearbeiten Sie settings.json direkt oder fragen Sie HopCode.',
  // Hooks - Disabled Step
  'Hook Configuration - Disabled': 'Hook-Konfiguration - Deaktiviert',
  'All hooks are currently disabled. You have {{count}} that are not running.':
    'Alle Hooks sind derzeit deaktiviert. Sie haben {{count}} die nicht ausgef�hrt werden.',
  '{{count}} configured hook': '{{count}} konfigurierter Hook',
  '{{count}} configured hooks': '{{count}} konfigurierte Hooks',
  'When hooks are disabled:': 'Wenn Hooks deaktiviert sind:',
  'No hook commands will execute': 'Keine Hook-Befehle werden ausgef�hrt',
  'StatusLine will not be displayed': 'StatusLine wird nicht angezeigt',
  'Tool operations will proceed without hook validation':
    'Tool-Operationen werden ohne Hook-Validierung fortgesetzt',
  'To re-enable hooks, remove "disableAllHooks" from settings.json or ask HopCode.':
    'Um Hooks wieder zu aktivieren, entfernen Sie "disableAllHooks" aus settings.json oder fragen Sie HopCode.',
  // Hooks - Source
  Project: 'Projekt',
  User: 'Benutzer',
  System: 'System',
  Extension: 'Erweiterung',
  'Local Settings': 'Lokale Einstellungen',
  'User Settings': 'Benutzereinstellungen',
  'System Settings': 'Systemeinstellungen',
  Extensions: 'Erweiterungen',
  'Session (temporary)': 'Sitzung (tempor�r)',
  // Hooks - Status
  '? Enabled': '? Aktiviert',
  '? Disabled': '? Deaktiviert',
  // Hooks - Event Descriptions (short)
  'Before tool execution': 'Vor der Tool-Ausf�hrung',
  'After tool execution': 'Nach der Tool-Ausf�hrung',
  'After tool execution fails': 'Wenn die Tool-Ausf�hrung fehlschl�gt',
  'When notifications are sent': 'Wenn Benachrichtigungen gesendet werden',
  'When the user submits a prompt': 'Wenn der Benutzer einen Prompt absendet',
  'When a new session is started': 'Wenn eine neue Sitzung gestartet wird',
  'Right before HopCode concludes its response':
    'Direkt bevor HopCode seine Antwort abschlie�t',
  'When a subagent (Agent tool call) is started':
    'Wenn ein Subagent (Agent-Tool-Aufruf) gestartet wird',
  'Right before a subagent concludes its response':
    'Direkt bevor ein Subagent seine Antwort abschlie�t',
  'Before conversation compaction': 'Vor der Gespr�chskomprimierung',
  'When a session is ending': 'Wenn eine Sitzung endet',
  'When a permission dialog is displayed':
    'Wenn ein Berechtigungsdialog angezeigt wird',
  // Hooks - Event Descriptions (detailed)
  'Input to command is JSON of tool call arguments.':
    'Die Eingabe an den Befehl ist JSON der Tool-Aufruf-Argumente.',
  'Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).':
    'Die Eingabe an den Befehl ist JSON mit den Feldern "inputs" (Tool-Aufruf-Argumente) und "response" (Tool-Aufruf-Antwort).',
  'Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.':
    'Die Eingabe an den Befehl ist JSON mit tool_name, tool_input, tool_use_id, error, error_type, is_interrupt und is_timeout.',
  'Input to command is JSON with notification message and type.':
    'Die Eingabe an den Befehl ist JSON mit Benachrichtigungsnachricht und -typ.',
  'Input to command is JSON with original user prompt text.':
    'Die Eingabe an den Befehl ist JSON mit dem urspr�nglichen Benutzer-Prompt-Text.',
  'Input to command is JSON with session start source.':
    'Die Eingabe an den Befehl ist JSON mit der Sitzungsstart-Quelle.',
  'Input to command is JSON with session end reason.':
    'Die Eingabe an den Befehl ist JSON mit dem Sitzungsende-Grund.',
  'Input to command is JSON with agent_id and agent_type.':
    'Die Eingabe an den Befehl ist JSON mit agent_id und agent_type.',
  'Input to command is JSON with agent_id, agent_type, and agent_transcript_path.':
    'Die Eingabe an den Befehl ist JSON mit agent_id, agent_type und agent_transcript_path.',
  'Input to command is JSON with compaction details.':
    'Die Eingabe an den Befehl ist JSON mit Komprimierungsdetails.',
  'Input to command is JSON with tool_name, tool_input, and tool_use_id. Output JSON with hookSpecificOutput containing decision to allow or deny.':
    'Die Eingabe an den Befehl ist JSON mit tool_name, tool_input und tool_use_id. Ausgabe ist JSON mit hookSpecificOutput, das die Entscheidung zum Zulassen oder Ablehnen enth�lt.',
  // Hooks - Exit Code Descriptions
  'stdout/stderr not shown': 'stdout/stderr nicht angezeigt',
  'show stderr to model and continue conversation':
    'stderr dem Modell anzeigen und Konversation fortsetzen',
  'show stderr to user only': 'stderr nur dem Benutzer anzeigen',
  'stdout shown in transcript mode (ctrl+o)':
    'stdout im Transkriptmodus angezeigt (ctrl+o)',
  'show stderr to model immediately': 'stderr sofort dem Modell anzeigen',
  'show stderr to user only but continue with tool call':
    'stderr nur dem Benutzer anzeigen, aber mit Tool-Aufruf fortfahren',
  'block processing, erase original prompt, and show stderr to user only':
    'Verarbeitung blockieren, urspr�nglichen Prompt l�schen und stderr nur dem Benutzer anzeigen',
  'stdout shown to HopCode': 'stdout dem HopCode anzeigen',
  'show stderr to user only (blocking errors ignored)':
    'stderr nur dem Benutzer anzeigen (Blockierungsfehler ignoriert)',
  'command completes successfully': 'Befehl erfolgreich abgeschlossen',
  'stdout shown to subagent': 'stdout dem Subagenten anzeigen',
  'show stderr to subagent and continue having it run':
    'stderr dem Subagenten anzeigen und ihn weiterlaufen lassen',
  'stdout appended as custom compact instructions':
    'stdout als benutzerdefinierte Komprimierungsanweisungen angeh�ngt',
  'block compaction': 'Komprimierung blockieren',
  'show stderr to user only but continue with compaction':
    'stderr nur dem Benutzer anzeigen, aber mit Komprimierung fortfahren',
  'use hook decision if provided':
    'Hook-Entscheidung verwenden, falls bereitgestellt',
  // Hooks - Messages
  'Config not loaded.': 'Konfiguration nicht geladen.',
  'Hooks are not enabled. Enable hooks in settings to use this feature.':
    'Hooks sind nicht aktiviert. Aktivieren Sie Hooks in den Einstellungen, um diese Funktion zu nutzen.',
  'No hooks configured. Add hooks in your settings.json file.':
    'Keine Hooks konfiguriert. F�gen Sie Hooks in Ihrer settings.json-Datei hinzu.',
  'Configured Hooks ({{count}} total)':
    'Konfigurierte Hooks ({{count}} insgesamt)',

  // ============================================================================
  // Commands - Session Export
  // ============================================================================
  'Export current session message history to a file':
    'Den Nachrichtenverlauf der aktuellen Sitzung in eine Datei exportieren',
  'Export session to HTML format': 'Sitzung in das HTML-Format exportieren',
  'Export session to JSON format': 'Sitzung in das JSON-Format exportieren',
  'Export session to JSONL format (one message per line)':
    'Sitzung in das JSONL-Format exportieren (eine Nachricht pro Zeile)',
  'Export session to markdown format':
    'Sitzung in das Markdown-Format exportieren',

  // ============================================================================
  // Commands - Insights
  // ============================================================================
  'generate personalized programming insights from your chat history':
    'Personalisierte Programmier-Einblicke aus Ihrem Chatverlauf generieren',

  // ============================================================================
  // Commands - Session History
  // ============================================================================
  'Resume a previous session': 'Eine vorherige Sitzung fortsetzen',
  'Restore a tool call. This will reset the conversation and file history to the state it was in when the tool call was suggested':
    'Einen Tool-Aufruf wiederherstellen. Dadurch werden Konversations- und Dateiverlauf auf den Zustand zur�ckgesetzt, in dem der Tool-Aufruf vorgeschlagen wurde',
  'Could not detect terminal type. Supported terminals: VS Code, Cursor, Windsurf, and Trae.':
    'Terminal-Typ konnte nicht erkannt werden. Unterst�tzte Terminals: VS Code, Cursor, Windsurf und Trae.',
  'Terminal "{{terminal}}" is not supported yet.':
    'Terminal "{{terminal}}" wird noch nicht unterst�tzt.',

  // ============================================================================
  // Commands - Language
  // ============================================================================
  'Invalid language. Available: {{options}}':
    'Ung�ltige Sprache. Verf�gbar: {{options}}',
  'Language subcommands do not accept additional arguments.':
    'Sprach-Unterbefehle akzeptieren keine zus�tzlichen Argumente.',
  'Current UI language: {{lang}}': 'Aktuelle UI-Sprache: {{lang}}',
  'Current LLM output language: {{lang}}':
    'Aktuelle LLM-Ausgabesprache: {{lang}}',
  'LLM output language not set': 'LLM-Ausgabesprache nicht festgelegt',
  'Set UI language': 'UI-Sprache festlegen',
  'Set LLM output language': 'LLM-Ausgabesprache festlegen',
  'Usage: /language ui [{{options}}]': 'Verwendung: /language ui [{{options}}]',
  'Usage: /language output <language>':
    'Verwendung: /language output <Sprache>',
  'Example: /language output ??': 'Beispiel: /language output Deutsch',
  'Example: /language output English': 'Beispiel: /language output Englisch',
  'Example: /language output ???': 'Beispiel: /language output Japanisch',
  'Example: /language output Portugu�s':
    'Beispiel: /language output Portugiesisch',
  'UI language changed to {{lang}}': 'UI-Sprache ge�ndert zu {{lang}}',
  'LLM output language set to {{lang}}':
    'LLM-Ausgabesprache auf {{lang}} gesetzt',
  'LLM output language rule file generated at {{path}}':
    'LLM-Ausgabesprach-Regeldatei generiert unter {{path}}',
  'Please restart the application for the changes to take effect.':
    'Bitte starten Sie die Anwendung neu, damit die �nderungen wirksam werden.',
  'Failed to generate LLM output language rule file: {{error}}':
    'Fehler beim Generieren der LLM-Ausgabesprach-Regeldatei: {{error}}',
  'Invalid command. Available subcommands:':
    'Ung�ltiger Befehl. Verf�gbare Unterbefehle:',
  'Available subcommands:': 'Verf�gbare Unterbefehle:',
  'To request additional UI language packs, please open an issue on GitHub.':
    'Um zus�tzliche UI-Sprachpakete anzufordern, �ffnen Sie bitte ein Issue auf GitHub.',
  'Available options:': 'Verf�gbare Optionen:',
  'Set UI language to {{name}}': 'UI-Sprache auf {{name}} setzen',

  // ============================================================================
  // Commands - Approval Mode
  // ============================================================================
  'Tool Approval Mode': 'Werkzeug-Genehmigungsmodus',
  'Current approval mode: {{mode}}': 'Aktueller Genehmigungsmodus: {{mode}}',
  'Available approval modes:': 'Verf�gbare Genehmigungsmodi:',
  'Approval mode changed to: {{mode}}':
    'Genehmigungsmodus ge�ndert zu: {{mode}}',
  'Approval mode changed to: {{mode}} (saved to {{scope}} settings{{location}})':
    'Genehmigungsmodus ge�ndert zu: {{mode}} (gespeichert in {{scope}} Einstellungen{{location}})',
  'Usage: /approval-mode <mode> [--session|--user|--project]':
    'Verwendung: /approval-mode <Modus> [--session|--user|--project]',

  'Scope subcommands do not accept additional arguments.':
    'Bereichs-Unterbefehle akzeptieren keine zus�tzlichen Argumente.',
  'Plan mode - Analyze only, do not modify files or execute commands':
    'Planungsmodus - Nur analysieren, keine Dateien �ndern oder Befehle ausf�hren',
  'Default mode - Require approval for file edits or shell commands':
    'Standardmodus - Genehmigung f�r Dateibearbeitungen oder Shell-Befehle erforderlich',
  'Auto-edit mode - Automatically approve file edits':
    'Automatischer Bearbeitungsmodus - Dateibearbeitungen automatisch genehmigen',
  'IZN mode - Automatically approve all tools':
    'IZN-Modus - Alle Werkzeuge automatisch genehmigen',
  '{{mode}} mode': '{{mode}}-Modus',
  'Settings service is not available; unable to persist the approval mode.':
    'Einstellungsdienst nicht verf�gbar; Genehmigungsmodus kann nicht gespeichert werden.',
  'Failed to save approval mode: {{error}}':
    'Fehler beim Speichern des Genehmigungsmodus: {{error}}',
  'Failed to change approval mode: {{error}}':
    'Fehler beim �ndern des Genehmigungsmodus: {{error}}',
  'Apply to current session only (temporary)':
    'Nur auf aktuelle Sitzung anwenden (tempor�r)',
  'Persist for this project/workspace':
    'F�r dieses Projekt/Arbeitsbereich speichern',
  'Persist for this user on this machine':
    'F�r diesen Benutzer auf diesem Computer speichern',
  'Analyze only, do not modify files or execute commands':
    'Nur analysieren, keine Dateien �ndern oder Befehle ausf�hren',
  'Require approval for file edits or shell commands':
    'Genehmigung f�r Dateibearbeitungen oder Shell-Befehle erforderlich',
  'Automatically approve file edits':
    'Dateibearbeitungen automatisch genehmigen',
  'Automatically approve all tools': 'Alle Werkzeuge automatisch genehmigen',
  'Workspace approval mode exists and takes priority. User-level change will have no effect.':
    'Arbeitsbereich-Genehmigungsmodus existiert und hat Vorrang. Benutzerebene-�nderung hat keine Wirkung.',
  'Apply To': 'Anwenden auf',
  'Workspace Settings': 'Arbeitsbereich-Einstellungen',

  // ============================================================================
  // Commands - Memory
  // ============================================================================
  'Commands for interacting with memory.':
    'Befehle f�r die Interaktion mit dem Speicher.',
  'Show the current memory contents.': 'Aktuellen Speicherinhalt anzeigen.',
  'Show project-level memory contents.':
    'Projektebene-Speicherinhalt anzeigen.',
  'Show global memory contents.': 'Globalen Speicherinhalt anzeigen.',
  'Add content to project-level memory.':
    'Inhalt zum Projektebene-Speicher hinzuf�gen.',
  'Add content to global memory.': 'Inhalt zum globalen Speicher hinzuf�gen.',
  'Refresh the memory from the source.':
    'Speicher aus der Quelle aktualisieren.',
  'Usage: /memory add --project <text to remember>':
    'Verwendung: /memory add --project <zu merkender Text>',
  'Usage: /memory add --global <text to remember>':
    'Verwendung: /memory add --global <zu merkender Text>',
  'Attempting to save to project memory: "{{text}}"':
    'Versuche im Projektspeicher zu speichern: "{{text}}"',
  'Attempting to save to global memory: "{{text}}"':
    'Versuche im globalen Speicher zu speichern: "{{text}}"',
  'Current memory content from {{count}} file(s):':
    'Aktueller Speicherinhalt aus {{count}} Datei(en):',
  'Memory is currently empty.': 'Speicher ist derzeit leer.',
  'Project memory file not found or is currently empty.':
    'Projektspeicherdatei nicht gefunden oder derzeit leer.',
  'Global memory file not found or is currently empty.':
    'Globale Speicherdatei nicht gefunden oder derzeit leer.',
  'Global memory is currently empty.': 'Globaler Speicher ist derzeit leer.',
  'Global memory content:\n\n---\n{{content}}\n---':
    'Globaler Speicherinhalt:\n\n---\n{{content}}\n---',
  'Project memory content from {{path}}:\n\n---\n{{content}}\n---':
    'Projektspeicherinhalt von {{path}}:\n\n---\n{{content}}\n---',
  'Project memory is currently empty.': 'Projektspeicher ist derzeit leer.',
  'Refreshing memory from source files...':
    'Speicher wird aus Quelldateien aktualisiert...',
  'Add content to the memory. Use --global for global memory or --project for project memory.':
    'Inhalt zum Speicher hinzuf�gen. --global f�r globalen Speicher oder --project f�r Projektspeicher verwenden.',
  'Usage: /memory add [--global|--project] <text to remember>':
    'Verwendung: /memory add [--global|--project] <zu merkender Text>',
  'Attempting to save to memory {{scope}}: "{{fact}}"':
    'Versuche im Speicher {{scope}} zu speichern: "{{fact}}"',
  'Open auto-memory folder': 'Auto-Speicher-Ordner �ffnen',
  'Auto-memory: {{status}}': 'Auto-Speicher: {{status}}',
  'Auto-dream: {{status}} � {{lastDream}} � /dream to run':
    'Auto-Konsolidierung: {{status}} � {{lastDream}} � /dream zum Ausf�hren',
  never: 'nie',
  on: 'ein',
  off: 'aus',
  '? dreaming': '? konsolidiert',
  'Remove matching entries from managed auto-memory.':
    'Passende Eintr�ge aus dem verwalteten Auto-Speicher entfernen.',
  'Usage: /forget <memory text to remove>':
    'Verwendung: /forget <zu entfernender Erinnerungstext>',
  'No managed auto-memory entries matched: {{query}}':
    'Keine verwalteten Auto-Speicher-Eintr�ge gefunden: {{query}}',
  'Show managed auto-memory status.':
    'Status des verwalteten Auto-Speichers anzeigen.',
  'Run managed auto-memory extraction for the current session.':
    'Verwaltete Auto-Speicher-Extraktion f�r die aktuelle Sitzung ausf�hren.',
  'Managed auto-memory root: {{root}}':
    'Verwalteter Auto-Speicher-Stamm: {{root}}',
  'Managed auto-memory topics:': 'Verwaltete Auto-Speicher-Themen:',
  'No extraction cursor found yet.': 'Noch kein Extraktions-Cursor gefunden.',
  'Cursor: session={{sessionId}}, offset={{offset}}, updated={{updatedAt}}':
    'Cursor: Sitzung={{sessionId}}, Offset={{offset}}, Aktualisiert={{updatedAt}}',
  'No chat client available to extract memory.':
    'Kein Chat-Client verf�gbar, um Erinnerungen zu extrahieren.',
  'Managed auto-memory extraction is already running.':
    'Verwaltete Auto-Speicher-Extraktion l�uft bereits.',
  'Managed auto-memory extraction found no new durable memories.':
    'Verwaltete Auto-Speicher-Extraktion hat keine neuen dauerhaften Erinnerungen gefunden.',
  'Consolidate managed auto-memory topic files.':
    'Verwaltete Auto-Speicher-Themendateien konsolidieren.',
  'Managed auto-memory dream found nothing to improve.':
    'Auto-Speicher-Konsolidierung hat nichts zu verbessern gefunden.',
  'Deduplicated entries: {{count}}': 'Deduplizierte Eintr�ge: {{count}}',
  'Save a durable memory using the save_memory tool.':
    'Eine dauerhafte Erinnerung mit dem save_memory-Tool speichern.',
  'Usage: /remember [--global|--project] <text to remember>':
    'Verwendung: /remember [--global|--project] <zu merkender Text>',

  // ============================================================================
  // Commands - MCP
  // ============================================================================
  'Authenticate with an OAuth-enabled MCP server':
    'Mit einem OAuth-f�higen MCP-Server authentifizieren',
  'List configured MCP servers and tools':
    'Konfigurierte MCP-Server und Werkzeuge auflisten',
  'Restarts MCP servers.': 'MCP-Server neu starten.',
  'Could not retrieve tool registry.':
    'Werkzeugregister konnte nicht abgerufen werden.',
  'No MCP servers configured with OAuth authentication.':
    'Keine MCP-Server mit OAuth-Authentifizierung konfiguriert.',
  'MCP servers with OAuth authentication:':
    'MCP-Server mit OAuth-Authentifizierung:',
  'Use /mcp auth <server-name> to authenticate.':
    'Verwenden Sie /mcp auth <Servername> zur Authentifizierung.',
  "MCP server '{{name}}' not found.": "MCP-Server '{{name}}' nicht gefunden.",
  "Successfully authenticated and refreshed tools for '{{name}}'.":
    "Erfolgreich authentifiziert und Werkzeuge f�r '{{name}}' aktualisiert.",
  "Failed to authenticate with MCP server '{{name}}': {{error}}":
    "Authentifizierung mit MCP-Server '{{name}}' fehlgeschlagen: {{error}}",
  "Re-discovering tools from '{{name}}'...":
    "Werkzeuge von '{{name}}' werden neu erkannt...",
  "Discovered {{count}} tool(s) from '{{name}}'.":
    "{{count}} Werkzeug(e) von '{{name}}' entdeckt.",
  'Authentication complete. Returning to server details...':
    'Authentifizierung abgeschlossen. Zur�ck zu den Serverdetails...',
  'Authentication successful.': 'Authentifizierung erfolgreich.',
  'If the browser does not open, copy and paste this URL into your browser:':
    'Falls der Browser sich nicht �ffnet, kopieren Sie diese URL und f�gen Sie sie in Ihren Browser ein:',
  'Make sure to copy the COMPLETE URL - it may wrap across multiple lines.':
    '??  Stellen Sie sicher, dass Sie die VOLLST�NDIGE URL kopieren � sie kann �ber mehrere Zeilen gehen.',

  // ============================================================================
  // Commands - Chat
  // ============================================================================
  'Manage conversation history.': 'Gespr�chsverlauf verwalten.',
  'List saved conversation checkpoints':
    'Gespeicherte Gespr�chspr�fpunkte auflisten',
  'No saved conversation checkpoints found.':
    'Keine gespeicherten Gespr�chspr�fpunkte gefunden.',
  'List of saved conversations:': 'Liste gespeicherter Gespr�che:',
  'Note: Newest last, oldest first': 'Hinweis: Neueste zuletzt, �lteste zuerst',
  'Save the current conversation as a checkpoint. Usage: /chat save <tag>':
    'Aktuelles Gespr�ch als Pr�fpunkt speichern. Verwendung: /chat save <Tag>',
  'Missing tag. Usage: /chat save <tag>':
    'Tag fehlt. Verwendung: /chat save <Tag>',
  'Delete a conversation checkpoint. Usage: /chat delete <tag>':
    'Gespr�chspr�fpunkt l�schen. Verwendung: /chat delete <Tag>',
  'Missing tag. Usage: /chat delete <tag>':
    'Tag fehlt. Verwendung: /chat delete <Tag>',
  "Conversation checkpoint '{{tag}}' has been deleted.":
    "Gespr�chspr�fpunkt '{{tag}}' wurde gel�scht.",
  "Error: No checkpoint found with tag '{{tag}}'.":
    "Fehler: Kein Pr�fpunkt mit Tag '{{tag}}' gefunden.",
  'Resume a conversation from a checkpoint. Usage: /chat resume <tag>':
    'Gespr�ch von einem Pr�fpunkt fortsetzen. Verwendung: /chat resume <Tag>',
  'Missing tag. Usage: /chat resume <tag>':
    'Tag fehlt. Verwendung: /chat resume <Tag>',
  'No saved checkpoint found with tag: {{tag}}.':
    'Kein gespeicherter Pr�fpunkt mit Tag gefunden: {{tag}}.',
  'A checkpoint with the tag {{tag}} already exists. Do you want to overwrite it?':
    'Ein Pr�fpunkt mit dem Tag {{tag}} existiert bereits. M�chten Sie ihn �berschreiben?',
  'No chat client available to save conversation.':
    'Kein Chat-Client verf�gbar, um Gespr�ch zu speichern.',
  'Conversation checkpoint saved with tag: {{tag}}.':
    'Gespr�chspr�fpunkt gespeichert mit Tag: {{tag}}.',
  'No conversation found to save.': 'Kein Gespr�ch zum Speichern gefunden.',
  'No chat client available to share conversation.':
    'Kein Chat-Client verf�gbar, um Gespr�ch zu teilen.',
  'Invalid file format. Only .md and .json are supported.':
    'Ung�ltiges Dateiformat. Nur .md und .json werden unterst�tzt.',
  'Error sharing conversation: {{error}}':
    'Fehler beim Teilen des Gespr�chs: {{error}}',
  'Conversation shared to {{filePath}}': 'Gespr�ch geteilt nach {{filePath}}',
  'No conversation found to share.': 'Kein Gespr�ch zum Teilen gefunden.',
  'Share the current conversation to a markdown or json file. Usage: /chat share <file>':
    'Aktuelles Gespr�ch in eine Markdown- oder JSON-Datei teilen. Verwendung: /chat share <Datei>',

  // ============================================================================
  // Commands - Summary
  // ============================================================================
  'Generate a project summary and save it to .hopcode/PROJECT_SUMMARY.md':
    'Projektzusammenfassung generieren und in .hopcode/PROJECT_SUMMARY.md speichern',
  'No chat client available to generate summary.':
    'Kein Chat-Client verf�gbar, um Zusammenfassung zu generieren.',
  'Already generating summary, wait for previous request to complete':
    'Zusammenfassung wird bereits generiert, warten Sie auf Abschluss der vorherigen Anfrage',
  'No conversation found to summarize.':
    'Kein Gespr�ch zum Zusammenfassen gefunden.',
  'Failed to generate project context summary: {{error}}':
    'Fehler beim Generieren der Projektkontextzusammenfassung: {{error}}',
  'Saved project summary to {{filePathForDisplay}}.':
    'Projektzusammenfassung gespeichert unter {{filePathForDisplay}}.',
  'Saving project summary...': 'Projektzusammenfassung wird gespeichert...',
  'Generating project summary...': 'Projektzusammenfassung wird generiert...',
  'Failed to generate summary - no text content received from LLM response':
    'Fehler beim Generieren der Zusammenfassung - kein Textinhalt von LLM-Antwort erhalten',

  // ============================================================================
  // Commands - Model
  // ============================================================================
  'Switch the model for this session (--fast for suggestion model)':
    'Modell f�r diese Sitzung wechseln (--fast f�r Vorschlagsmodell)',
  'Set a lighter model for prompt suggestions and speculative execution':
    'Leichteres Modell f�r Eingabevorschl�ge und spekulative Ausf�hrung festlegen',
  'Content generator configuration not available.':
    'Inhaltsgenerator-Konfiguration nicht verf�gbar.',
  'Authentication type not available.':
    'Authentifizierungstyp nicht verf�gbar.',
  'No models available for the current authentication type ({{authType}}).':
    'Keine Modelle f�r den aktuellen Authentifizierungstyp ({{authType}}) verf�gbar.',

  // ============================================================================
  // Commands - Clear
  // ============================================================================
  'Starting a new session, resetting chat, and clearing terminal.':
    'Neue Sitzung wird gestartet, Chat wird zur�ckgesetzt und Terminal wird gel�scht.',
  'Starting a new session and clearing.':
    'Neue Sitzung wird gestartet und gel�scht.',

  // ============================================================================
  // Commands - Compress
  // ============================================================================
  'Already compressing, wait for previous request to complete':
    'Komprimierung l�uft bereits, warten Sie auf Abschluss der vorherigen Anfrage',
  'Failed to compress chat history.':
    'Fehler beim Komprimieren des Chatverlaufs.',
  'Failed to compress chat history: {{error}}':
    'Fehler beim Komprimieren des Chatverlaufs: {{error}}',
  'Compressing chat history': 'Chatverlauf wird komprimiert',
  'Chat history compressed from {{originalTokens}} to {{newTokens}} tokens.':
    'Chatverlauf komprimiert von {{originalTokens}} auf {{newTokens}} Token.',
  'Compression was not beneficial for this history size.':
    'Komprimierung war f�r diese Verlaufsgr��e nicht vorteilhaft.',
  'Chat history compression did not reduce size. This may indicate issues with the compression prompt.':
    'Chatverlauf-Komprimierung hat die Gr��e nicht reduziert. Dies kann auf Probleme mit dem Komprimierungs-Prompt hindeuten.',
  'Could not compress chat history due to a token counting error.':
    'Chatverlauf konnte aufgrund eines Token-Z�hlfehlers nicht komprimiert werden.',
  'Chat history is already compressed.': 'Chatverlauf ist bereits komprimiert.',

  // ============================================================================
  // Commands - Directory
  // ============================================================================
  'Configuration is not available.': 'Konfiguration ist nicht verf�gbar.',
  'Please provide at least one path to add.':
    'Bitte geben Sie mindestens einen Pfad zum Hinzuf�gen an.',
  'The /directory add command is not supported in restrictive sandbox profiles. Please use --include-directories when starting the session instead.':
    'Der Befehl /directory add wird in restriktiven Sandbox-Profilen nicht unterst�tzt. Bitte verwenden Sie --include-directories beim Starten der Sitzung.',
  "Error adding '{{path}}': {{error}}":
    "Fehler beim Hinzuf�gen von '{{path}}': {{error}}",
  'Successfully added HOPCODE.md files from the following directories if there are:\n- {{directories}}':
    'HOPCODE.md-Dateien aus folgenden Verzeichnissen erfolgreich hinzugef�gt, falls vorhanden:\n- {{directories}}',
  'Error refreshing memory: {{error}}':
    'Fehler beim Aktualisieren des Speichers: {{error}}',
  'Successfully added directories:\n- {{directories}}':
    'Verzeichnisse erfolgreich hinzugef�gt:\n- {{directories}}',
  'Current workspace directories:\n{{directories}}':
    'Aktuelle Arbeitsbereichsverzeichnisse:\n{{directories}}',

  // ============================================================================
  // Commands - Docs
  // ============================================================================
  'Please open the following URL in your browser to view the documentation:\n{{url}}':
    'Bitte �ffnen Sie folgende URL in Ihrem Browser, um die Dokumentation anzusehen:\n{{url}}',
  'Opening documentation in your browser: {{url}}':
    'Dokumentation wird in Ihrem Browser ge�ffnet: {{url}}',

  // ============================================================================
  // Dialogs - Tool Confirmation
  // ============================================================================
  'Do you want to proceed?': 'M�chten Sie fortfahren?',
  'Yes, allow once': 'Ja, einmal erlauben',
  'Allow always': 'Immer erlauben',
  Yes: 'Ja',
  No: 'Nein',
  'No (esc)': 'Nein (Esc)',
  'Yes, allow always for this session': 'Ja, f�r diese Sitzung immer erlauben',

  // MCP Management Dialog (translations for MCP UI components)
  'Manage MCP servers': 'MCP-Server verwalten',
  'Server Detail': 'Serverdetails',
  'Disable Server': 'Server deaktivieren',
  Tools: 'Werkzeuge',
  'Tool Detail': 'Werkzeugdetails',
  'MCP Management': 'MCP-Verwaltung',
  'Loading...': 'L�dt...',
  'Unknown step': 'Unbekannter Schritt',
  'Esc to back': 'Esc zur�ck',
  '?? to navigate � Enter to select � Esc to close':
    '?? navigieren � Enter ausw�hlen � Esc schlie�en',
  '?? to navigate � Enter to select � Esc to back':
    '?? navigieren � Enter ausw�hlen � Esc zur�ck',
  '?? to navigate � Enter to confirm � Esc to back':
    '?? navigieren � Enter best�tigen � Esc zur�ck',
  'User Settings (global)': 'Benutzereinstellungen (global)',
  'Workspace Settings (project-specific)':
    'Arbeitsbereichseinstellungen (projektspezifisch)',
  'Disable server:': 'Server deaktivieren:',
  'Select where to add the server to the exclude list:':
    'W�hlen Sie, wo der Server zur Ausschlussliste hinzugef�gt werden soll:',
  'Press Enter to confirm, Esc to cancel':
    'Enter zum Best�tigen, Esc zum Abbrechen',
  Disable: 'Deaktivieren',
  Enable: 'Aktivieren',
  Authenticate: 'Authentifizieren',
  'Re-authenticate': 'Erneut authentifizieren',
  'Clear Authentication': 'Authentifizierung l�schen',
  disabled: 'deaktiviert',
  'Server:': 'Server:',
  Reconnect: 'Neu verbinden',
  'View tools': 'Werkzeuge anzeigen',
  'Status:': 'Status:',
  'Command:': 'Befehl:',
  'Working Directory:': 'Arbeitsverzeichnis:',
  'Capabilities:': 'F�higkeiten:',
  'No server selected': 'Kein Server ausgew�hlt',
  '(disabled)': '(deaktiviert)',
  'Error:': 'Fehler:',
  tool: 'Werkzeug',
  tools: 'Werkzeuge',
  connected: 'verbunden',
  connecting: 'verbindet',
  disconnected: 'getrennt',
  error: 'Fehler',

  // MCP Server List
  'User MCPs': 'Benutzer-MCPs',
  'Project MCPs': 'Projekt-MCPs',
  'Extension MCPs': 'Erweiterungs-MCPs',
  server: 'Server',
  servers: 'Server',
  'Add MCP servers to your settings to get started.':
    'F�gen Sie MCP-Server zu Ihren Einstellungen hinzu, um zu beginnen.',
  'Run hopcode --debug to see error logs':
    'F�hren Sie hopcode --debug aus, um Fehlerprotokolle anzuzeigen',

  // MCP OAuth Authentication
  'OAuth Authentication': 'OAuth-Authentifizierung',
  'Press Enter to start authentication, Esc to go back':
    'Dr�cken Sie Enter, um die Authentifizierung zu starten, Esc zum Zur�ckgehen',
  'Authenticating... Please complete the login in your browser.':
    'Authentifizierung l�uft... Bitte schlie�en Sie die Anmeldung in Ihrem Browser ab.',
  'Press Enter or Esc to go back': 'Dr�cken Sie Enter oder Esc zum Zur�ckgehen',

  // MCP Tool List
  'No tools available for this server.':
    'Keine Werkzeuge f�r diesen Server verf�gbar.',
  destructive: 'destruktiv',
  'read-only': 'schreibgesch�tzt',
  'open-world': 'offene Welt',
  idempotent: 'idempotent',
  'Tools for {{name}}': 'Werkzeuge f�r {{name}}',
  'Tools for {{serverName}}': 'Werkzeuge f�r {{serverName}}',
  '{{current}}/{{total}}': '{{current}}/{{total}}',

  // MCP Tool Detail
  required: 'erforderlich',
  Type: 'Typ',
  Enum: 'Aufz�hlung',
  Parameters: 'Parameter',
  'No tool selected': 'Kein Werkzeug ausgew�hlt',
  Annotations: 'Anmerkungen',
  Title: 'Titel',
  'Read Only': 'Schreibgesch�tzt',
  Destructive: 'Destruktiv',
  Idempotent: 'Idempotent',
  'Open World': 'Offene Welt',
  Server: 'Server',

  // Invalid tool related translations
  '{{count}} invalid tools': '{{count}} ung�ltige Werkzeuge',
  invalid: 'ung�ltig',
  'invalid: {{reason}}': 'ung�ltig: {{reason}}',
  'missing name': 'Name fehlt',
  'missing description': 'Beschreibung fehlt',
  '(unnamed)': '(unbenannt)',
  'Warning: This tool cannot be called by the LLM':
    'Warnung: Dieses Werkzeug kann nicht vom LLM aufgerufen werden',
  Reason: 'Grund',
  'Tools must have both name and description to be used by the LLM.':
    'Werkzeuge m�ssen sowohl einen Namen als auch eine Beschreibung haben, um vom LLM verwendet zu werden.',
  'Modify in progress:': '�nderung in Bearbeitung:',
  'Save and close external editor to continue':
    'Speichern und externen Editor schlie�en, um fortzufahren',
  'Apply this change?': 'Diese �nderung anwenden?',
  'Yes, allow always': 'Ja, immer erlauben',
  'Modify with external editor': 'Mit externem Editor bearbeiten',
  'No, suggest changes (esc)': 'Nein, �nderungen vorschlagen (Esc)',
  "Allow execution of: '{{command}}'?":
    "Ausf�hrung erlauben von: '{{command}}'?",
  'Yes, allow always ...': 'Ja, immer erlauben ...',
  'Always allow in this project': 'In diesem Projekt immer erlauben',
  'Always allow {{action}} in this project':
    '{{action}} in diesem Projekt immer erlauben',
  'Always allow for this user': 'F�r diesen Benutzer immer erlauben',
  'Always allow {{action}} for this user':
    '{{action}} f�r diesen Benutzer immer erlauben',
  'Yes, restore previous mode ({{mode}})':
    'Ja, vorherigen Modus wiederherstellen ({{mode}})',
  'Yes, and auto-accept edits': 'Ja, und �nderungen automatisch akzeptieren',
  'Yes, and manually approve edits': 'Ja, und �nderungen manuell genehmigen',
  'No, keep planning (esc)': 'Nein, weiter planen (Esc)',
  'URLs to fetch:': 'Abzurufende URLs:',
  'MCP Server: {{server}}': 'MCP-Server: {{server}}',
  'Tool: {{tool}}': 'Werkzeug: {{tool}}',
  'Allow execution of MCP tool "{{tool}}" from server "{{server}}"?':
    'Ausf�hrung des MCP-Werkzeugs "{{tool}}" von Server "{{server}}" erlauben?',
  'Yes, always allow tool "{{tool}}" from server "{{server}}"':
    'Ja, Werkzeug "{{tool}}" von Server "{{server}}" immer erlauben',
  'Yes, always allow all tools from server "{{server}}"':
    'Ja, alle Werkzeuge von Server "{{server}}" immer erlauben',

  // ============================================================================
  // Dialogs - Shell Confirmation
  // ============================================================================
  'Shell Command Execution': 'Shell-Befehlsausf�hrung',
  'A custom command wants to run the following shell commands:':
    'Ein benutzerdefinierter Befehl m�chte folgende Shell-Befehle ausf�hren:',

  // ============================================================================
  // Dialogs - Pro Quota
  // ============================================================================
  'Pro quota limit reached for {{model}}.':
    'Pro-Kontingentlimit f�r {{model}} erreicht.',
  'Change auth (executes the /auth command)':
    'Authentifizierung �ndern (f�hrt den /auth-Befehl aus)',
  'Continue with {{model}}': 'Mit {{model}} fortfahren',

  // ============================================================================
  // Dialogs - Welcome Back
  // ============================================================================
  'Current Plan:': 'Aktueller Plan:',
  'Progress: {{done}}/{{total}} tasks completed':
    'Fortschritt: {{done}}/{{total}} Aufgaben abgeschlossen',
  ', {{inProgress}} in progress': ', {{inProgress}} in Bearbeitung',
  'Pending Tasks:': 'Ausstehende Aufgaben:',
  'What would you like to do?': 'Was m�chten Sie tun?',
  'Choose how to proceed with your session:':
    'W�hlen Sie, wie Sie mit Ihrer Sitzung fortfahren m�chten:',
  'Start new chat session': 'Neue Chat-Sitzung starten',
  'Continue previous conversation': 'Vorheriges Gespr�ch fortsetzen',
  '?? Welcome back! (Last updated: {{timeAgo}})':
    '?? Willkommen zur�ck! (Zuletzt aktualisiert: {{timeAgo}})',
  '?? Overall Goal:': '?? Gesamtziel:',

  // ============================================================================
  // Dialogs - Auth
  // ============================================================================
  'Get started': 'Loslegen',
  'Select Authentication Method': 'Authentifizierungsmethode ausw�hlen',
  'OpenAI API key is required to use OpenAI authentication.':
    'OpenAI API-Schl�ssel ist f�r die OpenAI-Authentifizierung erforderlich.',
  'You must select an auth method to proceed. Press Ctrl+C again to exit.':
    'Sie m�ssen eine Authentifizierungsmethode w�hlen, um fortzufahren. Dr�cken Sie erneut Strg+C zum Beenden.',
  'Terms of Services and Privacy Notice':
    'Nutzungsbedingungen und Datenschutzhinweis',
  'Qwen OAuth': 'Legacy OAuth',
  'Discontinued � switch to Coding Plan or API Key':
    'Eingestellt � wechseln Sie zu Coding Plan oder API Key',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Run /auth to switch provider.':
    'Das kostenlose Legacy OAuth-Kontingent wurde am 2026-04-15 eingestellt. F�hren Sie /auth aus, um den Anbieter zu wechseln.',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Please select Coding Plan or API Key instead.':
    'Das kostenlose Legacy OAuth-Kontingent wurde am 2026-04-15 eingestellt. Bitte w�hlen Sie Coding Plan oder API Key.',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Please select a model from another provider or run /auth to switch.':
    'Das kostenlose Legacy OAuth-Angebot wurde am 2026-04-15 eingestellt. Bitte w�hlen Sie ein Modell eines anderen Anbieter oder f�hren Sie /auth aus, um zu wechseln.',
  '\n? Qwen OAuth free tier was discontinued on 2026-04-15. Please select another option.\n':
    '\n? Das kostenlose Legacy OAuth-Kontingent wurde am 2026-04-15 eingestellt. Bitte w�hlen Sie eine andere Option.\n',
  'Paid \u00B7 Up to 6,000 requests/5 hrs \u00B7 All Alibaba Cloud Coding Plan Models':
    'Kostenpflichtig \u00B7 Bis zu 6.000 Anfragen/5 Std. \u00B7 Alle Alibaba Cloud Coding Plan Modelle',
  'Alibaba Cloud Coding Plan': 'Alibaba Cloud Coding Plan',
  'Bring your own API key': 'Eigenen API-Schl�ssel verwenden',
  'Browser-based authentication with third-party providers (e.g. OpenRouter, ModelScope)':
    'Browserbasierte Authentifizierung mit externen Anbietern (z. B. OpenRouter, ModelScope)',
  'API-KEY': 'API-KEY',
  'Use coding plan credentials or your own api-keys/providers.':
    'Verwenden Sie Coding Plan-Anmeldedaten oder Ihre eigenen API-Schl�ssel/Anbieter.',
  OpenAI: 'OpenAI',
  'Failed to login. Message: {{message}}':
    'Anmeldung fehlgeschlagen. Meldung: {{message}}',
  'Authentication is enforced to be {{enforcedType}}, but you are currently using {{currentType}}.':
    'Authentifizierung ist auf {{enforcedType}} festgelegt, aber Sie verwenden derzeit {{currentType}}.',
  'Qwen OAuth authentication timed out. Please try again.':
    'Legacy OAuth-Authentifizierung abgelaufen. Bitte versuchen Sie es erneut.',
  'Qwen OAuth authentication cancelled.':
    'Legacy OAuth-Authentifizierung abgebrochen.',
  'Qwen OAuth Authentication': 'Legacy OAuth-Authentifizierung',
  'Please visit this URL to authorize:':
    'Bitte besuchen Sie diese URL zur Autorisierung:',
  'Or scan the QR code below:': 'Oder scannen Sie den QR-Code unten:',
  'Waiting for authorization': 'Warten auf Autorisierung',
  'Time remaining:': 'Verbleibende Zeit:',
  '(Press ESC or CTRL+C to cancel)': '(ESC oder STRG+C zum Abbrechen dr�cken)',
  'Qwen OAuth Authentication Timeout':
    'Legacy OAuth-Authentifizierung abgelaufen',
  'OAuth token expired (over {{seconds}} seconds). Please select authentication method again.':
    'OAuth-Token abgelaufen (�ber {{seconds}} Sekunden). Bitte w�hlen Sie erneut eine Authentifizierungsmethode.',
  'Press any key to return to authentication type selection.':
    'Dr�cken Sie eine beliebige Taste, um zur Authentifizierungstypauswahl zur�ckzukehren.',
  'Waiting for Qwen OAuth authentication...':
    'Warten auf Legacy OAuth-Authentifizierung...',
  'Note: Your existing API key in settings.json will not be cleared when using Qwen OAuth. You can switch back to OpenAI authentication later if needed.':
    'Hinweis: Ihr bestehender API-Schl�ssel in settings.json wird bei Verwendung von Legacy OAuth nicht gel�scht. Sie k�nnen sp�ter bei Bedarf zur OpenAI-Authentifizierung zur�ckwechseln.',
  'Note: Your existing API key will not be cleared when using Qwen OAuth.':
    'Hinweis: Ihr bestehender API-Schl�ssel wird bei Verwendung von Legacy OAuth nicht gel�scht.',
  'Authentication timed out. Please try again.':
    'Authentifizierung abgelaufen. Bitte versuchen Sie es erneut.',
  'Waiting for auth... (Press ESC or CTRL+C to cancel)':
    'Warten auf Authentifizierung... (ESC oder STRG+C zum Abbrechen dr�cken)',
  'Missing API key for OpenAI-compatible auth. Set settings.security.auth.apiKey, or set the {{envKeyHint}} environment variable.':
    'API-Schl�ssel f�r OpenAI-kompatible Authentifizierung fehlt. Setzen Sie settings.security.auth.apiKey oder die Umgebungsvariable {{envKeyHint}}.',
  '{{envKeyHint}} environment variable not found.':
    'Umgebungsvariable {{envKeyHint}} wurde nicht gefunden.',
  '{{envKeyHint}} environment variable not found. Please set it in your .env file or environment variables.':
    'Umgebungsvariable {{envKeyHint}} wurde nicht gefunden. Bitte legen Sie sie in Ihrer .env-Datei oder den Systemumgebungsvariablen fest.',
  '{{envKeyHint}} environment variable not found (or set settings.security.auth.apiKey). Please set it in your .env file or environment variables.':
    'Umgebungsvariable {{envKeyHint}} wurde nicht gefunden (oder setzen Sie settings.security.auth.apiKey). Bitte legen Sie sie in Ihrer .env-Datei oder den Systemumgebungsvariablen fest.',
  'Missing API key for OpenAI-compatible auth. Set the {{envKeyHint}} environment variable.':
    'API-Schl�ssel f�r OpenAI-kompatible Authentifizierung fehlt. Setzen Sie die Umgebungsvariable {{envKeyHint}}.',
  'Anthropic provider missing required baseUrl in modelProviders[].baseUrl.':
    'Anthropic-Anbieter fehlt erforderliche baseUrl in modelProviders[].baseUrl.',
  'ANTHROPIC_BASE_URL environment variable not found.':
    'Umgebungsvariable ANTHROPIC_BASE_URL wurde nicht gefunden.',
  'Invalid auth method selected.':
    'Ung�ltige Authentifizierungsmethode ausgew�hlt.',
  'Failed to authenticate. Message: {{message}}':
    'Authentifizierung fehlgeschlagen. Meldung: {{message}}',
  'Authenticated successfully with {{authType}} credentials.':
    'Erfolgreich mit {{authType}}-Anmeldedaten authentifiziert.',
  'Invalid HOPCODE_DEFAULT_AUTH_TYPE value: "{{value}}". Valid values are: {{validValues}}':
    'Ung�ltiger HOPCODE_DEFAULT_AUTH_TYPE-Wert: "{{value}}". G�ltige Werte sind: {{validValues}}',
  'OpenAI Configuration Required': 'OpenAI-Konfiguration erforderlich',
  'Please enter your OpenAI configuration. You can get an API key from':
    'Bitte geben Sie Ihre OpenAI-Konfiguration ein. Sie k�nnen einen API-Schl�ssel erhalten von',
  'API Key:': 'API-Schl�ssel:',
  'Invalid credentials: {{errorMessage}}':
    'Ung�ltige Anmeldedaten: {{errorMessage}}',
  'Failed to validate credentials':
    'Anmeldedaten konnten nicht validiert werden',
  'Press Enter to continue, Tab/?? to navigate, Esc to cancel':
    'Enter zum Fortfahren, Tab/?? zum Navigieren, Esc zum Abbrechen',

  // ============================================================================
  // Dialogs - Model
  // ============================================================================
  'Select Model': 'Modell ausw�hlen',
  '(Press Esc to close)': '(Esc zum Schlie�en dr�cken)',
  'Current (effective) configuration': 'Aktuelle (wirksame) Konfiguration',
  AuthType: 'Authentifizierungstyp',
  'API Key': 'API-Schl�ssel',
  unset: 'nicht gesetzt',
  '(default)': '(Standard)',
  '(set)': '(gesetzt)',
  '(not set)': '(nicht gesetzt)',
  Modality: 'Modalit�t',
  'Context Window': 'Kontextfenster',
  text: 'Text',
  'text-only': 'nur Text',
  image: 'Bild',
  pdf: 'PDF',
  audio: 'Audio',
  video: 'Video',
  'not set': 'nicht gesetzt',
  none: 'keine',
  unknown: 'unbekannt',
  "Failed to switch model to '{{modelId}}'.\n\n{{error}}":
    "Modell konnte nicht auf '{{modelId}}' umgestellt werden.\n\n{{error}}",
  'Qwen 3.6 Plus � efficient hybrid model with leading coding performance':
    'Qwen 3.6 Plus � effizientes Hybridmodell mit f�hrender Programmierleistung',
  'The latest Qwen Vision model from Alibaba Cloud ModelStudio (version: qwen3-vl-plus-2025-09-23)':
    'Das neueste Qwen Vision Modell von Alibaba Cloud ModelStudio (Version: qwen3-vl-plus-2025-09-23)',

  // ============================================================================
  // Dialogs - Permissions
  // ============================================================================
  'Manage folder trust settings': 'Ordnervertrauenseinstellungen verwalten',
  'Manage permission rules': 'Berechtigungsregeln verwalten',
  Allow: 'Erlauben',
  Ask: 'Fragen',
  Deny: 'Verweigern',
  Workspace: 'Arbeitsbereich',
  "HopCode won't ask before using allowed tools.":
    'HopCode fragt nicht, bevor erlaubte Tools verwendet werden.',
  'HopCode will ask before using these tools.':
    'HopCode fragt, bevor diese Tools verwendet werden.',
  'HopCode is not allowed to use denied tools.':
    'HopCode darf verweigerte Tools nicht verwenden.',
  'Manage trusted directories for this workspace.':
    'Vertrauensw�rdige Verzeichnisse f�r diesen Arbeitsbereich verwalten.',
  'Any use of the {{tool}} tool': 'Jede Verwendung des {{tool}}-Tools',
  "{{tool}} commands matching '{{pattern}}'":
    "{{tool}}-Befehle, die '{{pattern}}' entsprechen",
  'From user settings': 'Aus Benutzereinstellungen',
  'From project settings': 'Aus Projekteinstellungen',
  'From session': 'Aus Sitzung',
  'Project settings (local)': 'Projekteinstellungen (lokal)',
  'Saved in .hopcode/settings.local.json':
    'Gespeichert in .hopcode/settings.local.json',
  'Project settings': 'Projekteinstellungen',
  'Checked in at .hopcode/settings.json':
    'Eingecheckt in .hopcode/settings.json',
  'User settings': 'Benutzereinstellungen',
  'Saved in at ~/.hopcode/settings.json':
    'Gespeichert in ~/.hopcode/settings.json',
  'Add a new rule�': 'Neue Regel hinzuf�gen�',
  'Add {{type}} permission rule': '{{type}}-Berechtigungsregel hinzuf�gen',
  'Permission rules are a tool name, optionally followed by a specifier in parentheses.':
    'Berechtigungsregeln sind ein Toolname, optional gefolgt von einem Bezeichner in Klammern.',
  'e.g.,': 'z.B.',
  or: 'oder',
  'Enter permission rule�': 'Berechtigungsregel eingeben�',
  'Enter to submit � Esc to cancel': 'Enter zum Absenden � Esc zum Abbrechen',
  'Where should this rule be saved?': 'Wo soll diese Regel gespeichert werden?',
  'Enter to confirm � Esc to cancel':
    'Enter zum Best�tigen � Esc zum Abbrechen',
  'Delete {{type}} rule?': '{{type}}-Regel l�schen?',
  'Are you sure you want to delete this permission rule?':
    'Sind Sie sicher, dass Sie diese Berechtigungsregel l�schen m�chten?',
  'Permissions:': 'Berechtigungen:',
  '(?/? or tab to cycle)': '(?/? oder Tab zum Wechseln)',
  'Press ?? to navigate � Enter to select � Type to search � Esc to cancel':
    '?? navigieren � Enter ausw�hlen � Tippen suchen � Esc abbrechen',
  'Search�': 'Suche�',
  'Use /trust to manage folder trust settings for this workspace.':
    'Verwenden Sie /trust, um die Ordnervertrauenseinstellungen f�r diesen Arbeitsbereich zu verwalten.',
  // Workspace directory management
  'Add directory�': 'Verzeichnis hinzuf�gen�',
  'Add directory to workspace': 'Verzeichnis zum Arbeitsbereich hinzuf�gen',
  'HopCode can read files in the workspace, and make edits when auto-accept edits is on.':
    'HopCode kann Dateien im Arbeitsbereich lesen und Bearbeitungen vornehmen, wenn die automatische Akzeptierung aktiviert ist.',
  'HopCode will be able to read files in this directory and make edits when auto-accept edits is on.':
    'HopCode kann Dateien in diesem Verzeichnis lesen und Bearbeitungen vornehmen, wenn die automatische Akzeptierung aktiviert ist.',
  'Enter the path to the directory:': 'Pfad zum Verzeichnis eingeben:',
  'Enter directory path�': 'Verzeichnispfad eingeben�',
  'Tab to complete � Enter to add � Esc to cancel':
    'Tab zum Vervollst�ndigen � Enter zum Hinzuf�gen � Esc zum Abbrechen',
  'Remove directory?': 'Verzeichnis entfernen?',
  'Are you sure you want to remove this directory from the workspace?':
    'M�chten Sie dieses Verzeichnis wirklich aus dem Arbeitsbereich entfernen?',
  '  (Original working directory)': '  (Urspr�ngliches Arbeitsverzeichnis)',
  '  (from settings)': '  (aus Einstellungen)',
  'Directory does not exist.': 'Verzeichnis existiert nicht.',
  'Path is not a directory.': 'Pfad ist kein Verzeichnis.',
  'This directory is already in the workspace.':
    'Dieses Verzeichnis ist bereits im Arbeitsbereich.',
  'Already covered by existing directory: {{dir}}':
    'Bereits durch vorhandenes Verzeichnis abgedeckt: {{dir}}',

  // ============================================================================
  // Status Bar
  // ============================================================================
  'Using:': 'Verwendet:',
  '{{count}} open file': '{{count}} ge�ffnete Datei',
  '{{count}} open files': '{{count}} ge�ffnete Dateien',
  '(ctrl+g to view)': '(Strg+G zum Anzeigen)',
  '{{count}} {{name}} file': '{{count}} {{name}}-Datei',
  '{{count}} {{name}} files': '{{count}} {{name}}-Dateien',
  '{{count}} MCP server': '{{count}} MCP-Server',
  '{{count}} MCP servers': '{{count}} MCP-Server',
  '{{count}} Blocked': '{{count}} blockiert',
  '(ctrl+t to view)': '(Strg+T zum Anzeigen)',
  '(ctrl+t to toggle)': '(Strg+T zum Umschalten)',
  'Press Ctrl+C again to exit.': 'Dr�cken Sie erneut Strg+C zum Beenden.',
  'Press Ctrl+D again to exit.': 'Dr�cken Sie erneut Strg+D zum Beenden.',
  'Press Esc again to clear.': 'Dr�cken Sie erneut Esc zum L�schen.',
  'Press ? to edit queued messages':
    'Dr�cken Sie ?, um Nachrichten in der Warteschlange zu bearbeiten',

  // ============================================================================
  // MCP Status
  // ============================================================================
  'No MCP servers configured.': 'Keine MCP-Server konfiguriert.',
  '? MCP servers are starting up ({{count}} initializing)...':
    '? MCP-Server werden gestartet ({{count}} werden initialisiert)...',
  'Note: First startup may take longer. Tool availability will update automatically.':
    'Hinweis: Der erste Start kann l�nger dauern. Werkzeugverf�gbarkeit wird automatisch aktualisiert.',
  'Configured MCP servers:': 'Konfigurierte MCP-Server:',
  Ready: 'Bereit',
  'Starting... (first startup may take longer)':
    'Wird gestartet... (erster Start kann l�nger dauern)',
  Disconnected: 'Getrennt',
  '{{count}} tool': '{{count}} Werkzeug',
  '{{count}} tools': '{{count}} Werkzeuge',
  '{{count}} prompt': '{{count}} Prompt',
  '{{count}} prompts': '{{count}} Prompts',
  '(from {{extensionName}})': '(von {{extensionName}})',
  OAuth: 'OAuth',
  'OAuth expired': 'OAuth abgelaufen',
  'OAuth not authenticated': 'OAuth nicht authentifiziert',
  'tools and prompts will appear when ready':
    'Werkzeuge und Prompts werden angezeigt, wenn bereit',
  '{{count}} tools cached': '{{count}} Werkzeuge zwischengespeichert',
  'Tools:': 'Werkzeuge:',
  'Parameters:': 'Parameter:',
  'Prompts:': 'Prompts:',
  Blocked: 'Blockiert',
  '?? Tips:': '?? Tipps:',
  Use: 'Verwenden',
  'to show server and tool descriptions':
    'um Server- und Werkzeugbeschreibungen anzuzeigen',
  'to show tool parameter schemas': 'um Werkzeug-Parameter-Schemas anzuzeigen',
  'to hide descriptions': 'um Beschreibungen auszublenden',
  'to authenticate with OAuth-enabled servers':
    'um sich bei OAuth-f�higen Servern zu authentifizieren',
  Press: 'Dr�cken Sie',
  'to toggle tool descriptions on/off':
    'um Werkzeugbeschreibungen ein-/auszuschalten',
  "Starting OAuth authentication for MCP server '{{name}}'...":
    "OAuth-Authentifizierung f�r MCP-Server '{{name}}' wird gestartet...",
  'Restarting MCP servers...': 'MCP-Server werden neu gestartet...',

  // ============================================================================
  // Startup Tips
  // ============================================================================
  'Tips for getting started:': 'Tipps zum Einstieg:',
  '1. Ask questions, edit files, or run commands.':
    '1. Stellen Sie Fragen, bearbeiten Sie Dateien oder f�hren Sie Befehle aus.',
  '2. Be specific for the best results.':
    '2. Seien Sie spezifisch f�r die besten Ergebnisse.',
  'files to customize your interactions with HopCode.':
    'Dateien, um Ihre Interaktionen mit HopCode anzupassen.',
  'for more information.': 'f�r weitere Informationen.',

  // ============================================================================
  // Exit Screen / Stats
  // ============================================================================
  'Agent powering down. Goodbye!':
    'Agent wird heruntergefahren. Auf Wiedersehen!',
  'To continue this session, run':
    'Um diese Sitzung fortzusetzen, f�hren Sie aus',
  'Interaction Summary': 'Interaktionszusammenfassung',
  'Session ID:': 'Sitzungs-ID:',
  'Tool Calls:': 'Werkzeugaufrufe:',
  'Success Rate:': 'Erfolgsrate:',
  'User Agreement:': 'Benutzerzustimmung:',
  reviewed: '�berpr�ft',
  'Code Changes:': 'Code�nderungen:',
  Performance: 'Leistung',
  'Wall Time:': 'Gesamtzeit:',
  'Agent Active:': 'Agent aktiv:',
  'API Time:': 'API-Zeit:',
  'Tool Time:': 'Werkzeugzeit:',
  'Session Stats': 'Sitzungsstatistiken',
  'Model Usage': 'Modellnutzung',
  Reqs: 'Anfragen',
  'Input Tokens': 'Eingabe-Token',
  'Output Tokens': 'Ausgabe-Token',
  'Savings Highlight:': 'Einsparungen:',
  'of input tokens were served from the cache, reducing costs.':
    'der Eingabe-Token wurden aus dem Cache bedient, was die Kosten reduziert.',
  'Tip: For a full token breakdown, run `/stats model`.':
    'Tipp: F�r eine vollst�ndige Token-Aufschl�sselung f�hren Sie `/stats model` aus.',
  'Model Stats For Nerds': 'Modellstatistiken f�r Nerds',
  'Tool Stats For Nerds': 'Werkzeugstatistiken f�r Nerds',
  Metric: 'Metrik',
  API: 'API',
  Requests: 'Anfragen',
  Errors: 'Fehler',
  'Avg Latency': 'Durchschn. Latenz',
  Tokens: 'Token',
  Total: 'Gesamt',
  Prompt: 'Prompt',
  Cached: 'Zwischengespeichert',
  Thoughts: 'Gedanken',
  Tool: 'Werkzeug',
  Output: 'Ausgabe',
  'No API calls have been made in this session.':
    'In dieser Sitzung wurden keine API-Aufrufe gemacht.',
  'Tool Name': 'Werkzeugname',
  Calls: 'Aufrufe',
  'Success Rate': 'Erfolgsrate',
  'Avg Duration': 'Durchschn. Dauer',
  'User Decision Summary': 'Benutzerentscheidungs-Zusammenfassung',
  'Total Reviewed Suggestions:': 'Insgesamt �berpr�fter Vorschl�ge:',
  ' � Accepted:': ' � Akzeptiert:',
  ' � Rejected:': ' � Abgelehnt:',
  ' � Modified:': ' � Ge�ndert:',
  ' Overall Agreement Rate:': ' Gesamtzustimmungsrate:',
  'No tool calls have been made in this session.':
    'In dieser Sitzung wurden keine Werkzeugaufrufe gemacht.',
  'Session start time is unavailable, cannot calculate stats.':
    'Sitzungsstartzeit nicht verf�gbar, Statistiken k�nnen nicht berechnet werden.',

  // ============================================================================
  // Command Format Migration
  // ============================================================================
  'Command Format Migration': 'Befehlsformat-Migration',
  'Found {{count}} TOML command file:': '{{count}} TOML-Befehlsdatei gefunden:',
  'Found {{count}} TOML command files:':
    '{{count}} TOML-Befehlsdateien gefunden:',
  'Current tasks': 'Aktuelle Aufgaben',
  '... and {{count}} more': '... und {{count}} weitere',
  'The TOML format is deprecated. Would you like to migrate them to Markdown format?':
    'Das TOML-Format ist veraltet. M�chten Sie sie ins Markdown-Format migrieren?',
  '(Backups will be created and original files will be preserved)':
    '(Backups werden erstellt und Originaldateien werden beibehalten)',

  // ============================================================================
  // Loading Phrases
  // ============================================================================
  'Waiting for user confirmation...': 'Warten auf Benutzerbest�tigung...',
  '(esc to cancel, {{time}})': '(Esc zum Abbrechen, {{time}})',

  // ============================================================================
  // Loading Phrases
  // ============================================================================
  WITTY_LOADING_PHRASES: [
    'Auf gut Gl�ck!',
    'Genialit�t wird ausgeliefert...',
    'Die Serifen werden aufgemalt...',
    'Durch den Schleimpilz navigieren...',
    'Die digitalen Geister werden befragt...',
    'Splines werden retikuliert...',
    'Die KI-Hamster werden aufgew�rmt...',
    'Die Zaubermuschel wird befragt...',
    'Witzige Erwiderung wird generiert...',
    'Die Algorithmen werden poliert...',
    'Perfektion braucht Zeit (mein Code auch)...',
    'Frische Bytes werden gebr�ht...',
    'Elektronen werden gez�hlt...',
    'Kognitive Prozessoren werden aktiviert...',
    'Auf Syntaxfehler im Universum wird gepr�ft...',
    'Einen Moment, Humor wird optimiert...',
    'Pointen werden gemischt...',
    'Neuronale Netze werden entwirrt...',
    'Brillanz wird kompiliert...',
    'wit.exe wird geladen...',
    'Die Wolke der Weisheit wird beschworen...',
    'Eine witzige Antwort wird vorbereitet...',
    'Einen Moment, ich debugge die Realit�t...',
    'Die Optionen werden verwirrt...',
    'Kosmische Frequenzen werden eingestellt...',
    'Eine Antwort wird erstellt, die Ihrer Geduld w�rdig ist...',
    'Die Einsen und Nullen werden kompiliert...',
    'Abh�ngigkeiten werden aufgel�st... und existenzielle Krisen...',
    'Erinnerungen werden defragmentiert... sowohl RAM als auch pers�nliche...',
    'Das Humor-Modul wird neu gestartet...',
    'Das Wesentliche wird zwischengespeichert (haupts�chlich Katzen-Memes)...',
    'F�r l�cherliche Geschwindigkeit wird optimiert',
    'Bits werden getauscht... sagen Sie es nicht den Bytes...',
    'Garbage Collection l�uft... bin gleich zur�ck...',
    'Das Internet wird zusammengebaut...',
    'Kaffee wird in Code umgewandelt...',
    'Die Syntax der Realit�t wird aktualisiert...',
    'Die Synapsen werden neu verdrahtet...',
    'Ein verlegtes Semikolon wird gesucht...',
    'Die Zahnr�der werden geschmiert...',
    'Die Server werden vorgeheizt...',
    'Der Fluxkompensator wird kalibriert...',
    'Der Unwahrscheinlichkeitsantrieb wird aktiviert...',
    'Die Macht wird kanalisiert...',
    'Die Sterne werden f�r optimale Antwort ausgerichtet...',
    'So sagen wir alle...',
    'Die n�chste gro�e Idee wird geladen...',
    'Einen Moment, ich bin in der Zone...',
    'Bereite mich vor, Sie mit Brillanz zu blenden...',
    'Einen Augenblick, ich poliere meinen Witz...',
    'Halten Sie durch, ich erschaffe ein Meisterwerk...',
    'Einen Moment, ich debugge das Universum...',
    'Einen Moment, ich richte die Pixel aus...',
    'Einen Moment, ich optimiere den Humor...',
    'Einen Moment, ich tune die Algorithmen...',
    'Warp-Geschwindigkeit aktiviert...',
    'Mehr Dilithium-Kristalle werden gesucht...',
    'Keine Panik...',
    'Dem wei�en Kaninchen wird gefolgt...',
    'Die Wahrheit ist hier drin... irgendwo...',
    'Auf die Kassette wird gepustet...',
    'Ladevorgang... Machen Sie eine Fassrolle!',
    'Auf den Respawn wird gewartet...',
    'Der Kessel-Flug wird in weniger als 12 Parsec beendet...',
    'Der Kuchen ist keine L�ge, er l�dt nur noch...',
    'Am Charaktererstellungsbildschirm wird herumgefummelt...',
    'Einen Moment, ich suche das richtige Meme...',
    "'A' wird zum Fortfahren gedr�ckt...",
    'Digitale Katzen werden geh�tet...',
    'Die Pixel werden poliert...',
    'Ein passender Ladebildschirm-Witz wird gesucht...',
    'Ich lenke Sie mit diesem witzigen Spruch ab...',
    'Fast da... wahrscheinlich...',
    'Unsere Hamster arbeiten so schnell sie k�nnen...',
    'Cloudy wird am Kopf gestreichelt...',
    'Die Katze wird gestreichelt...',
    'Meinen Chef rickrollen...',
    'Never gonna give you up, never gonna let you down...',
    'Auf den Bass wird geschlagen...',
    'Die Schnozbeeren werden probiert...',
    "I'm going the distance, I'm going for speed...",
    'Ist dies das wahre Leben? Ist dies nur Fantasie?...',
    'Ich habe ein gutes Gef�hl dabei...',
    'Den B�ren wird gestupst...',
    'Recherche zu den neuesten Memes...',
    '�berlege, wie ich das witziger machen kann...',
    'Hmmm... lassen Sie mich nachdenken...',
    'Wie nennt man einen Fisch ohne Augen? Ein Fsh...',
    'Warum ging der Computer zur Therapie? Er hatte zu viele Bytes...',
    'Warum m�gen Programmierer keine Natur? Sie hat zu viele Bugs...',
    'Warum bevorzugen Programmierer den Dunkelmodus? Weil Licht Bugs anzieht...',
    'Warum ging der Entwickler pleite? Er hat seinen ganzen Cache aufgebraucht...',
    'Was kann man mit einem kaputten Bleistift machen? Nichts, er ist sinnlos...',
    'Perkussive Wartung wird angewendet...',
    'Die richtige USB-Ausrichtung wird gesucht...',
    'Es wird sichergestellt, dass der magische Rauch in den Kabeln bleibt...',
    'Versuche Vim zu beenden...',
    'Das Hamsterrad wird angeworfen...',
    'Das ist kein Bug, das ist ein undokumentiertes Feature...',
    'Engage.',
    'Ich komme wieder... mit einer Antwort.',
    'Mein anderer Prozess ist eine TARDIS...',
    'Mit dem Maschinengeist wird kommuniziert...',
    'Die Gedanken marinieren lassen...',
    'Gerade erinnert, wo ich meine Schl�ssel hingelegt habe...',
    '�ber die Kugel wird nachgedacht...',
    'Ich habe Dinge gesehen, die Sie nicht glauben w�rden... wie einen Benutzer, der Lademeldungen liest.',
    'Nachdenklicher Blick wird initiiert...',
    'Was ist der Lieblingssnack eines Computers? Mikrochips.',
    'Warum tragen Java-Entwickler Brillen? Weil sie nicht C#.',
    'Der Laser wird aufgeladen... pew pew!',
    'Durch Null wird geteilt... nur Spa�!',
    'Suche nach einem erwachsenen Aufseh... ich meine, Verarbeitung.',
    'Es piept und boopt.',
    'Pufferung... weil auch KIs einen Moment brauchen.',
    'Quantenteilchen werden f�r schnellere Antwort verschr�nkt...',
    'Das Chrom wird poliert... an den Algorithmen.',
    'Sind Sie nicht unterhalten? (Arbeite daran!)',
    'Die Code-Gremlins werden beschworen... zum Helfen, nat�rlich.',
    'Warte nur auf das Einwahlton-Ende...',
    'Das Humor-O-Meter wird neu kalibriert.',
    'Mein anderer Ladebildschirm ist noch lustiger.',
    'Ziemlich sicher, dass irgendwo eine Katze �ber die Tastatur l�uft...',
    'Verbessern... Verbessern... L�dt noch.',
    'Das ist kein Bug, das ist ein Feature... dieses Ladebildschirms.',
    'Haben Sie versucht, es aus- und wieder einzuschalten? (Den Ladebildschirm, nicht mich.)',
    'Zus�tzliche Pylonen werden gebaut...',
  ],

  // ============================================================================
  // Extension Settings Input
  // ============================================================================
  'Enter value...': 'Wert eingeben...',
  'Enter sensitive value...': 'Sensiblen Wert eingeben...',
  'Press Enter to submit, Escape to cancel':
    'Enter zum Absenden, Escape zum Abbrechen dr�cken',

  // ============================================================================
  // Command Migration Tool
  // ============================================================================
  'Markdown file already exists: {{filename}}':
    'Markdown-Datei existiert bereits: {{filename}}',
  'TOML Command Format Deprecation Notice':
    'TOML-Befehlsformat Veraltet-Hinweis',
  'Found {{count}} command file(s) in TOML format:':
    '{{count}} Befehlsdatei(en) im TOML-Format gefunden:',
  'The TOML format for commands is being deprecated in favor of Markdown format.':
    'Das TOML-Format f�r Befehle wird zugunsten des Markdown-Formats eingestellt.',
  'Markdown format is more readable and easier to edit.':
    'Das Markdown-Format ist lesbarer und einfacher zu bearbeiten.',
  'You can migrate these files automatically using:':
    'Sie k�nnen diese Dateien automatisch migrieren mit:',
  'Or manually convert each file:': 'Oder jede Datei manuell konvertieren:',
  'TOML: prompt = "..." / description = "..."':
    'TOML: prompt = "..." / description = "..."',
  'Markdown: YAML frontmatter + content': 'Markdown: YAML-Frontmatter + Inhalt',
  'The migration tool will:': 'Das Migrationstool wird:',
  'Convert TOML files to Markdown': 'TOML-Dateien in Markdown konvertieren',
  'Create backups of original files':
    'Sicherungen der Originaldateien erstellen',
  'Preserve all command functionality': 'Alle Befehlsfunktionen beibehalten',
  'TOML format will continue to work for now, but migration is recommended.':
    'Das TOML-Format funktioniert vorerst weiter, aber eine Migration wird empfohlen.',

  // ============================================================================
  // Extensions - Explore Command
  // ============================================================================
  'Open extensions page in your browser': 'Erweiterungsseite im Browser �ffnen',
  'Unknown extensions source: {{source}}.':
    'Unbekannte Erweiterungsquelle: {{source}}.',
  'Would open extensions page in your browser: {{url}} (skipped in test environment)':
    'W�rde Erweiterungsseite im Browser �ffnen: {{url}} (�bersprungen in Testumgebung)',
  'View available extensions at {{url}}':
    'Verf�gbare Erweiterungen ansehen unter {{url}}',
  'Opening extensions page in your browser: {{url}}':
    'Erweiterungsseite wird im Browser ge�ffnet: {{url}}',
  'Failed to open browser. Check out the extensions gallery at {{url}}':
    'Browser konnte nicht ge�ffnet werden. Besuchen Sie die Erweiterungsgalerie unter {{url}}',
  'Use /compress when the conversation gets long to summarize history and free up context.':
    'Verwenden Sie /compress, wenn die Unterhaltung lang wird, um den Verlauf zusammenzufassen und Kontext freizugeben.',
  'Start a fresh idea with /clear or /new; the previous session stays available in history.':
    'Starten Sie eine neue Idee mit /clear oder /new; die vorherige Sitzung bleibt im Verlauf verf�gbar.',
  'Use /bug to submit issues to the maintainers when something goes off.':
    'Verwenden Sie /bug, um Probleme an die Betreuer zu melden, wenn etwas schiefgeht.',
  'Switch auth type quickly with /auth.':
    'Wechseln Sie den Authentifizierungstyp schnell mit /auth.',
  'You can run any shell commands from HopCode using ! (e.g. !ls).':
    'Sie k�nnen beliebige Shell-Befehle in HopCode mit ! ausf�hren (z. B. !ls).',
  'Type / to open the command popup; Tab autocompletes slash commands and saved prompts.':
    'Geben Sie / ein, um das Befehlsmen� zu �ffnen; Tab vervollst�ndigt Slash-Befehle und gespeicherte Prompts.',
  'You can resume a previous conversation by running hopcode --continue or hopcode --resume.':
    'Sie k�nnen eine fr�here Unterhaltung mit hopcode --continue oder hopcode --resume fortsetzen.',
  'You can switch permission mode quickly with Shift+Tab or /approval-mode.':
    'Sie k�nnen den Berechtigungsmodus schnell mit Shift+Tab oder /approval-mode wechseln.',
  'You can switch permission mode quickly with Tab or /approval-mode.':
    'Sie k�nnen den Berechtigungsmodus schnell mit Tab oder /approval-mode wechseln.',
  'Try /insight to generate personalized insights from your chat history.':
    'Probieren Sie /insight, um personalisierte Erkenntnisse aus Ihrem Chatverlauf zu erstellen.',
  'Press Ctrl+O to toggle compact mode � hide tool output and thinking for a cleaner view.':
    'Strg+O dr�cken, um den Kompaktmodus umzuschalten � Tool-Ausgabe und Denkprozess ausblenden.',
  'Add a HOPCODE.md file to give HopCode persistent project context.':
    'F�gen Sie eine HOPCODE.md-Datei hinzu, um HopCode dauerhaften Projektkontext zu geben.',
  'Use /btw to ask a quick side question without disrupting the conversation.':
    'Verwenden Sie /btw, um eine kurze Nebenfrage zu stellen, ohne die Unterhaltung zu unterbrechen.',
  'Context is almost full! Run /compress now or start /new to continue.':
    'Der Kontext ist fast voll! F�hren Sie jetzt /compress aus oder starten Sie /new, um fortzufahren.',
  'Context is getting full. Use /compress to free up space.':
    'Der Kontext f�llt sich. Verwenden Sie /compress, um Platz freizugeben.',
  'Long conversation? /compress summarizes history to free context.':
    'Lange Unterhaltung? /compress fasst den Verlauf zusammen, um Kontext freizugeben.',

  // ============================================================================
  // Custom API Key Configuration
  // ============================================================================
  'You can configure your API key and models in settings.json':
    'Sie k�nnen Ihren API-Schl�ssel und Modelle in settings.json konfigurieren',
  'Refer to the documentation for setup instructions':
    'Einrichtungsanweisungen finden Sie in der Dokumentation',

  // ============================================================================
  // Coding Plan Authentication
  // ============================================================================
  'API key cannot be empty.': 'API-Schl�ssel darf nicht leer sein.',
  'You can get your Coding Plan API key here':
    'Sie k�nnen Ihren Coding-Plan-API-Schl�ssel hier erhalten',
  'New model configurations are available for Alibaba Cloud Coding Plan. Update now?':
    'Neue Modellkonfigurationen sind f�r Alibaba Cloud Coding Plan verf�gbar. Jetzt aktualisieren?',
  'Coding Plan configuration updated successfully. New models are now available.':
    'Coding Plan-Konfiguration erfolgreich aktualisiert. Neue Modelle sind jetzt verf�gbar.',
  'Coding Plan API key not found. Please re-authenticate with Coding Plan.':
    'Coding Plan API-Schl�ssel nicht gefunden. Bitte authentifizieren Sie sich erneut mit Coding Plan.',
  'Failed to update Coding Plan configuration: {{message}}':
    'Fehler beim Aktualisieren der Coding Plan-Konfiguration: {{message}}',

  // ============================================================================
  // Auth Dialog - View Titles and Labels
  // ============================================================================
  'Coding Plan': 'Coding Plan',
  "Paste your api key of ModelStudio Coding Plan and you're all set!":
    'F�gen Sie Ihren ModelStudio Coding Plan API-Schl�ssel ein und Sie sind bereit!',
  Custom: 'Benutzerdefiniert',
  'More instructions about configuring `modelProviders` manually.':
    'Weitere Anweisungen zur manuellen Konfiguration von `modelProviders`.',
  'Select API-KEY configuration mode:':
    'API-KEY-Konfigurationsmodus ausw�hlen:',
  '(Press Escape to go back)': '(Escape dr�cken zum Zur�ckgehen)',
  '(Press Enter to submit, Escape to cancel)':
    '(Enter zum Absenden, Escape zum Abbrechen)',
  'More instructions please check:': 'Weitere Anweisungen finden Sie unter:',
  'Select Region for Coding Plan': 'Region f�r Coding Plan ausw�hlen',
  'Choose based on where your account is registered':
    'W�hlen Sie basierend auf dem Registrierungsort Ihres Kontos',
  'Enter Coding Plan API Key': 'Coding-Plan-API-Schl�ssel eingeben',

  // ============================================================================
  // Coding Plan International Updates
  // ============================================================================
  'New model configurations are available for {{region}}. Update now?':
    'Neue Modellkonfigurationen sind f�r {{region}} verf�gbar. Jetzt aktualisieren?',
  '{{region}} configuration updated successfully. Model switched to "{{model}}".':
    '{{region}}-Konfiguration erfolgreich aktualisiert. Modell auf "{{model}}" umgeschaltet.',
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json (backed up).':
    'Erfolgreich mit {{region}} authentifiziert. API-Schl�ssel und Modellkonfigurationen wurden in settings.json gespeichert (gesichert).',

  // ============================================================================
  // Context Usage Component
  // ============================================================================
  'Context Usage': 'Kontextnutzung',
  '% used': '% verwendet',
  '% context used': '% Kontext verwendet',
  'Context exceeds limit! Use /compress or /clear to reduce.':
    'Kontext �berschreitet Limit! Verwenden Sie /compress oder /clear zum Reduzieren.',
  'Use /compress or /clear': 'Verwenden Sie /compress oder /clear',
  'No API response yet. Send a message to see actual usage.':
    'Noch keine API-Antwort. Senden Sie eine Nachricht, um die tats�chliche Nutzung anzuzeigen.',
  'Estimated pre-conversation overhead':
    'Gesch�tzte Vorabkosten vor der Unterhaltung',
  'Context window': 'Kontextfenster',
  tokens: 'Tokens',
  Used: 'Verwendet',
  Free: 'Frei',
  'Autocompact buffer': 'Autokomprimierungs-Puffer',
  'Usage by category': 'Verwendung nach Kategorie',
  'System prompt': 'System-Prompt',
  'Built-in tools': 'Integrierte Tools',
  'MCP tools': 'MCP-Tools',
  'Memory files': 'Speicherdateien',
  Skills: 'F�higkeiten',
  Messages: 'Nachrichten',
  'Show context window usage breakdown.':
    'Zeigt die Aufschl�sselung der Kontextfenster-Nutzung an.',
  'Run /context detail for per-item breakdown.':
    'F�hren Sie /context detail f�r eine Aufschl�sselung nach Elementen aus.',
  active: 'aktiv',
  'body loaded': 'Inhalt geladen',
  memory: 'Speicher',
  '{{region}} configuration updated successfully.':
    '{{region}}-Konfiguration erfolgreich aktualisiert.',
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json.':
    'Erfolgreich mit {{region}} authentifiziert. API-Schl�ssel und Modellkonfigurationen wurden in settings.json gespeichert.',
  'Tip: Use /model to switch between available Coding Plan models.':
    'Tipp: Verwenden Sie /model, um zwischen verf�gbaren Coding Plan-Modellen zu wechseln.',

  // ============================================================================
  // Ask User Question Tool
  // ============================================================================
  'Please answer the following question(s):':
    'Bitte beantworten Sie die folgende(n) Frage(n):',
  'Cannot ask user questions in non-interactive mode. Please run in interactive mode to use this tool.':
    'Benutzerfragen k�nnen im nicht-interaktiven Modus nicht gestellt werden. Bitte f�hren Sie das Tool im interaktiven Modus aus.',
  'User declined to answer the questions.':
    'Benutzer hat die Beantwortung der Fragen abgelehnt.',
  'User has provided the following answers:':
    'Benutzer hat die folgenden Antworten bereitgestellt:',
  'Failed to process user answers:':
    'Fehler beim Verarbeiten der Benutzerantworten:',
  'Type something...': 'Etwas eingeben...',
  Submit: 'Senden',
  'Submit answers': 'Antworten senden',
  Cancel: 'Abbrechen',
  'Your answers:': 'Ihre Antworten:',
  '(not answered)': '(nicht beantwortet)',
  'Ready to submit your answers?': 'Bereit, Ihre Antworten zu senden?',
  '?/?: Navigate | ?/?: Switch tabs | Enter: Select':
    '?/?: Navigieren | ?/?: Tabs wechseln | Enter: Ausw�hlen',
  '?/?: Navigate | ?/?: Switch tabs | Space/Enter: Toggle | Esc: Cancel':
    '?/?: Navigieren | ?/?: Tabs wechseln | Space/Enter: Umschalten | Esc: Abbrechen',
  '?/?: Navigate | Space/Enter: Toggle | Esc: Cancel':
    '?/?: Navigieren | Space/Enter: Umschalten | Esc: Abbrechen',
  '?/?: Navigate | Enter: Select | Esc: Cancel':
    '?/?: Navigieren | Enter: Ausw�hlen | Esc: Abbrechen',

  // ============================================================================
  // Commands - Auth
  // ============================================================================
  'Configure authentication information with Qwen-OAuth or Alibaba Cloud Coding Plan':
    'Qwen-Authentifizierung mit Qwen-OAuth oder Alibaba Cloud Coding Plan konfigurieren',
  'Authenticate using Qwen OAuth': 'Mit Legacy OAuth authentifizieren',
  'Authenticate using Alibaba Cloud Coding Plan':
    'Mit Alibaba Cloud Coding Plan authentifizieren',
  'Region for Coding Plan (china/global)':
    'Region f�r Coding Plan (china/global)',
  'API key for Coding Plan': 'API-Schl�ssel f�r Coding Plan',
  'Show current authentication status':
    'Aktuellen Authentifizierungsstatus anzeigen',
  'Authentication completed successfully.':
    'Authentifizierung erfolgreich abgeschlossen.',
  'Starting Qwen OAuth authentication...':
    'Legacy OAuth-Authentifizierung wird gestartet...',
  'Successfully authenticated with Qwen OAuth.':
    'Erfolgreich mit Legacy OAuth authentifiziert.',
  'Failed to authenticate with Qwen OAuth: {{error}}':
    'Authentifizierung mit Legacy OAuth fehlgeschlagen: {{error}}',
  'Processing Alibaba Cloud Coding Plan authentication...':
    'Alibaba Cloud Coding Plan-Authentifizierung wird verarbeitet...',
  'Successfully authenticated with Alibaba Cloud Coding Plan.':
    'Erfolgreich mit Alibaba Cloud Coding Plan authentifiziert.',
  'Failed to authenticate with Coding Plan: {{error}}':
    'Authentifizierung mit Coding Plan fehlgeschlagen: {{error}}',
  '?? (China)': '?? (China)',
  '????? (aliyun.com)': '????? (aliyun.com)',
  Global: 'Global',
  'Alibaba Cloud (alibabacloud.com)': 'Alibaba Cloud (alibabacloud.com)',
  'Select region for Coding Plan:': 'Region f�r Coding Plan ausw�hlen:',
  'Enter your Coding Plan API key: ':
    'Geben Sie Ihren Coding Plan API-Schl�ssel ein: ',
  'Select authentication method:': 'Authentifizierungsmethode ausw�hlen:',
  '\n=== Authentication Status ===\n': '\n=== Authentifizierungsstatus ===\n',
  '??  No authentication method configured.\n':
    '??  Keine Authentifizierungsmethode konfiguriert.\n',
  'Run one of the following commands to get started:\n':
    'F�hren Sie einen der folgenden Befehle aus, um zu beginnen:\n',
  '  hopcode auth qwen-oauth     - Authenticate with Qwen OAuth (discontinued)':
    '  hopcode auth qwen-oauth     - Mit Legacy OAuth authentifizieren (eingestellt)',
  '  hopcode auth coding-plan      - Authenticate with Alibaba Cloud Coding Plan\n':
    '  hopcode auth coding-plan      - Mit Alibaba Cloud Coding Plan authentifizieren\n',
  'Or simply run:': 'Oder einfach ausf�hren:',
  '  hopcode auth                - Interactive authentication setup\n':
    '  hopcode auth                - Interaktive Authentifizierungseinrichtung\n',
  '? Authentication Method: Qwen OAuth':
    '? Authentifizierungsmethode: Legacy OAuth',
  '  Type: Free tier (discontinued 2026-04-15)':
    '  Typ: Kostenloses Kontingent (eingestellt 2026-04-15)',
  '  Limit: No longer available': '  Limit: Nicht mehr verf�gbar',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Run /auth to switch to Coding Plan, OpenRouter, Fireworks AI, or another provider.':
    'Das kostenlose Legacy OAuth-Kontingent wurde am 2026-04-15 eingestellt. F�hren Sie /auth aus, um zu Coding Plan, OpenRouter, Fireworks AI oder einem anderen Anbieter zu wechseln.',
  '  Models: Qwen latest models\n': '  Modelle: Qwen neueste Modelle\n',
  '? Authentication Method: Alibaba Cloud Coding Plan':
    '? Authentifizierungsmethode: Alibaba Cloud Coding Plan',
  '?? (China) - ?????': '?? (China) - ?????',
  'Global - Alibaba Cloud': 'Global - Alibaba Cloud',
  '  Region: {{region}}': '  Region: {{region}}',
  '  Current Model: {{model}}': '  Aktuelles Modell: {{model}}',
  '  Config Version: {{version}}': '  Konfigurationsversion: {{version}}',
  '  Status: API key configured\n': '  Status: API-Schl�ssel konfiguriert\n',
  '??  Authentication Method: Alibaba Cloud Coding Plan (Incomplete)':
    '??  Authentifizierungsmethode: Alibaba Cloud Coding Plan (Unvollst�ndig)',
  '  Issue: API key not found in environment or settings\n':
    '  Problem: API-Schl�ssel nicht in Umgebung oder Einstellungen gefunden\n',
  '  Run `hopcode auth coding-plan` to re-configure.\n':
    '  F�hren Sie `hopcode auth coding-plan` aus, um neu zu konfigurieren.\n',
  '? Authentication Method: {{type}}': '? Authentifizierungsmethode: {{type}}',
  '  Status: Configured\n': '  Status: Konfiguriert\n',
  'Failed to check authentication status: {{error}}':
    'Authentifizierungsstatus konnte nicht �berpr�ft werden: {{error}}',
  'Select an option:': 'Option ausw�hlen:',
  'Raw mode not available. Please run in an interactive terminal.':
    'Raw-Modus nicht verf�gbar. Bitte in einem interaktiven Terminal ausf�hren.',
  '(Use ? ? arrows to navigate, Enter to select, Ctrl+C to exit)\n':
    '(? ? Pfeiltasten zum Navigieren, Enter zum Ausw�hlen, Strg+C zum Beenden)\n',
  compact: 'kompakt',
  'compact mode: on (Ctrl+O off)': 'Kompaktmodus: ein (Strg+O aus)',
  'to toggle compact mode': 'Kompaktmodus umschalten',
  'Hide tool output and thinking for a cleaner view (toggle with Ctrl+O).':
    'Tool-Ausgabe und Denkprozess ausblenden f�r eine �bersichtlichere Ansicht (mit Strg+O umschalten).',
  'Press Ctrl+O to show full tool output':
    'Strg+O f�r vollst�ndige Tool-Ausgabe dr�cken',

  'Switch to plan mode or exit plan mode':
    'Switch to plan mode or exit plan mode',
  'Exited plan mode. Previous approval mode restored.':
    'Exited plan mode. Previous approval mode restored.',
  'Enabled plan mode. The agent will analyze and plan without executing tools.':
    'Enabled plan mode. The agent will analyze and plan without executing tools.',
  'Already in plan mode. Use "/plan exit" to exit plan mode.':
    'Already in plan mode. Use "/plan exit" to exit plan mode.',
  'Not in plan mode. Use "/plan" to enter plan mode first.':
    'Not in plan mode. Use "/plan" to enter plan mode first.',

  "Set up HopCode's status line UI": "Set up HopCode's status line UI",
};
