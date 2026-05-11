/**
 * @license
 * Copyright 2025 HopCode
 * SPDX-License-Identifier: Apache-2.0
 */

// Traduccions en catal� per al CLI de HopCode per Jordi Mas i Hern�ndez <jmas@softcatala.org>

export default {
  // ============================================================================
  // Ajuda / Components de la interf�cie
  // ============================================================================
  '? to manage attachments': '? per gestionar els adjunts',
  '? ? select, Delete to remove, ? to exit':
    '? ? seleccionar, Supr per eliminar, ? per sortir',
  'Attachments: ': 'Adjunts: ',

  'Basics:': 'B�sic:',
  'Add context': 'Afegir context',
  'Use {{symbol}} to specify files for context (e.g., {{example}}) to target specific files or folders.':
    'Useu {{symbol}} per especificar fitxers de context (p. ex., {{example}}) per seleccionar fitxers o carpetes espec�fics.',
  '@': '@',
  '@src/myFile.ts': '@src/myFile.ts',
  'Shell mode': 'Mode shell',
  'IZN mode': 'Mode IZN',
  'plan mode': 'mode de planificaci�',
  'auto-accept edits': 'acceptaci� autom�tica de canvis',
  'Accepting edits': 'Acceptant canvis',
  '(shift + tab to cycle)': '(maj + tab per canviar)',
  '(tab to cycle)': '(tab per canviar)',
  'Execute shell commands via {{symbol}} (e.g., {{example1}}) or use natural language (e.g., {{example2}}).':
    'Executeu ordres shell amb {{symbol}} (p. ex., {{example1}}) o useu el llenguatge natural (p. ex., {{example2}}).',
  '!': '!',
  '!npm run start': '!npm run start',
  'start server': 'iniciar el servidor',
  'Commands:': 'Ordres:',
  'shell command': 'ordre shell',
  'Model Context Protocol command (from external servers)':
    'Ordre del protocol de context del model (des de servidors externs)',
  'Keyboard Shortcuts:': 'Dreceres de teclat:',
  'Toggle this help display': 'Mostrar/amagar aquesta ajuda',
  'Toggle shell mode': 'Canviar el mode shell',
  'Open command menu': "Obrir el men� d'ordres",
  'Add file context': 'Afegir context de fitxer',
  'Accept suggestion / Autocomplete': 'Acceptar suggeriment / Autocompleci�',
  'Reverse search history': "Cerca inversa a l'historial",
  'Press ? again to close': 'Premeu ? de nou per tancar',
  'for shell mode': 'per al mode shell',
  'for commands': 'per a les ordres',
  'for file paths': 'per als camins de fitxers',
  'to clear input': "per esborrar l'entrada",
  'to cycle approvals': 'per canviar les aprovacions',
  'to quit': 'per sortir',
  'for newline': 'per a nova l�nia',
  'to clear screen': 'per netejar la pantalla',
  'to search history': "per cercar a l'historial",
  'to paste images': 'per enganxar imatges',
  'for external editor': 'per a editor extern',
  'to toggle compact mode': 'per canviar el mode compacte',
  'Jump through words in the input': "Saltar entre paraules a l'entrada",
  'Close dialogs, cancel requests, or quit application':
    "Tancar di�legs, cancel�lar peticions o sortir de l'aplicaci�",
  'New line': 'Nova l�nia',
  'New line (Alt+Enter works for certain linux distros)':
    'Nova l�nia (Alt+Retorn funciona en certes distribucions de Linux)',
  'Clear the screen': 'Netejar la pantalla',
  'Open input in external editor': "Obrir l'entrada en un editor extern",
  'Send message': 'Enviar missatge',
  'Initializing...': 'Inicialitzant...',
  'Connecting to MCP servers... ({{connected}}/{{total}})':
    'Connectant als servidors MCP... ({{connected}}/{{total}})',
  'Type your message or @path/to/file':
    'Escriviu el vostre missatge o @cam�/al/fitxer',
  '? for shortcuts': '? per a dreceres',
  "Press 'i' for INSERT mode and 'Esc' for NORMAL mode.":
    "Premeu 'i' per al mode INSERCI� i 'Esc' per al mode NORMAL.",
  'Cancel operation / Clear input (double press)':
    'Cancel�lar operaci� / Esborrar entrada (doble premuda)',
  'Cycle approval modes': "Canviar els modes d'aprovaci�",
  'Cycle through your prompt history': "Navegar per l'historial de missatges",
  'For a full list of shortcuts, see {{docPath}}':
    'Per a una llista completa de dreceres, vegeu {{docPath}}',
  'docs/keyboard-shortcuts.md': 'docs/keyboard-shortcuts.md',
  'for help on HopCode': 'per a ajuda sobre HopCode',
  'show version info': 'mostrar informaci� de la versi�',
  'submit a bug report': "enviar un informe d'error",
  'About HopCode': 'Sobre HopCode',
  Status: 'Estat',

  // ============================================================================
  // Informaci� del sistema
  // ============================================================================
  HopCode: 'HopCode',
  Runtime: "Entorn d'execuci�",
  OS: 'SO',
  Auth: 'Autenticaci�',
  'CLI Version': 'Versi� del CLI',
  'Git Commit': 'Commit de Git',
  Model: 'Model',
  'Fast Model': 'Model r�pid',
  Sandbox: 'Entorn a�llat',
  'OS Platform': 'Plataforma del SO',
  'OS Arch': 'Arquitectura del SO',
  'OS Release': 'Versi� del SO',
  'Node.js Version': 'Versi� de Node.js',
  'NPM Version': 'Versi� de NPM',
  'Session ID': 'ID de sessi�',
  'Auth Method': "M�tode d'autenticaci�",
  'Base URL': 'URL base',
  Proxy: 'Proxy',
  'Memory Usage': '�s de mem�ria',
  'IDE Client': 'Client IDE',

  // ============================================================================
  // Ordres - General
  // ============================================================================
  'Analyzes the project and creates a tailored HOPCODE.md file.':
    'Analitza el projecte i crea un fitxer HOPCODE.md personalitzat.',
  'List available HopCode tools. Usage: /tools [desc]':
    'Llistar les eines disponibles de HopCode. �s: /tools [desc]',
  'List available skills.': 'Llistar les habilitats disponibles.',
  'Available HopCode CLI tools:': 'Eines del CLI de HopCode disponibles:',
  'No tools available': 'No hi ha eines disponibles',
  'View or change the approval mode for tool usage':
    "Veure o canviar el mode d'aprovaci� per a l'�s d'eines",
  'Invalid approval mode "{{arg}}". Valid modes: {{modes}}':
    'Mode d\'aprovaci� no v�lid "{{arg}}". Modes v�lids: {{modes}}',
  'Approval mode set to "{{mode}}"': 'Mode d\'aprovaci� establert a "{{mode}}"',
  'View or change the language setting':
    "Veure o canviar la configuraci� d'idioma",
  'change the theme': 'canviar el tema',
  'Select Theme': 'Seleccionar tema',
  Preview: 'Previsualitzaci�',
  '(Use Enter to select, Tab to configure scope)':
    "(Useu Retorn per seleccionar, Tab per configurar l'�mbit)",
  '(Use Enter to apply scope, Tab to go back)':
    "(Useu Retorn per aplicar l'�mbit, Tab per tornar enrere)",
  'Theme configuration unavailable due to NO_COLOR env variable.':
    "La configuraci� del tema no est� disponible degut a la variable d'entorn NO_COLOR.",
  'Theme "{{themeName}}" not found.': 'Tema "{{themeName}}" no trobat.',
  'Theme "{{themeName}}" not found in selected scope.':
    'Tema "{{themeName}}" no trobat en l\'�mbit seleccionat.',
  'Clear conversation history and free up context':
    "Esborrar l'historial de la conversa i alliberar context",
  'Compresses the context by replacing it with a summary.':
    'Comprimeix el context substituint-lo per un resum.',
  'open full HopCode documentation in your browser':
    'obrir la documentaci� completa de HopCode al navegador',
  'Configuration not available.': 'Configuraci� no disponible.',
  'change the auth method': "canviar el m�tode d'autenticaci�",
  'Configure authentication information for login':
    "Configurar la informaci� d'autenticaci� per a iniciar sessi�",
  'Copy the last result or code snippet to clipboard':
    "Copiar l'�ltim resultat o fragment de codi al porta-retalls",

  // ============================================================================
  // Ordres - Agents
  // ============================================================================
  'Manage subagents for specialized task delegation.':
    'Gestionar subagents per a la delegaci� de tasques especialitzades.',
  'Manage existing subagents (view, edit, delete).':
    'Gestionar subagents existents (veure, editar, eliminar).',
  'Create a new subagent with guided setup.':
    'Crear un nou subagent amb configuraci� guiada.',

  // ============================================================================
  // Agents - Di�leg de gesti�
  // ============================================================================
  Agents: 'Agents',
  'Choose Action': 'Triar acci�',
  'Edit {{name}}': 'Editar {{name}}',
  'Edit Tools: {{name}}': 'Editar eines: {{name}}',
  'Edit Color: {{name}}': 'Editar color: {{name}}',
  'Delete {{name}}': 'Eliminar {{name}}',
  'Unknown Step': 'Pas desconegut',
  'Esc to close': 'Esc per tancar',
  'Enter to select, ?? to navigate, Esc to close':
    'Retorn per seleccionar, ?? per navegar, Esc per tancar',
  'Esc to go back': 'Esc per tornar enrere',
  'Enter to confirm, Esc to cancel': 'Retorn per confirmar, Esc per cancel�lar',
  'Enter to select, ?? to navigate, Esc to go back':
    'Retorn per seleccionar, ?? per navegar, Esc per tornar enrere',
  'Enter to submit, Esc to go back': 'Retorn per enviar, Esc per tornar enrere',
  'Invalid step: {{step}}': 'Pas no v�lid: {{step}}',
  'No subagents found.': "No s'han trobat subagents.",
  "Use '/agents create' to create your first subagent.":
    "Useu '/agents create' per crear el vostre primer subagent.",
  '(built-in)': '(integrat)',
  '(overridden by project level agent)':
    '(sobreescrit per un agent de nivell de projecte)',
  'Project Level ({{path}})': 'Nivell de projecte ({{path}})',
  'User Level ({{path}})': "Nivell d'usuari ({{path}})",
  'Built-in Agents': 'Agents integrats',
  'Extension Agents': "Agents d'extensi�",
  'Using: {{count}} agents': 'En �s: {{count}} agents',
  'View Agent': 'Veure agent',
  'Edit Agent': 'Editar agent',
  'Delete Agent': 'Eliminar agent',
  Back: 'Enrere',
  'No agent selected': 'Cap agent seleccionat',
  'File Path: ': 'Cam� del fitxer: ',
  'Tools: ': 'Eines: ',
  'Color: ': 'Color: ',
  'Description:': 'Descripci�:',
  'System Prompt:': 'Missatge del sistema:',
  'Open in editor': "Obrir a l'editor",
  'Edit tools': 'Editar eines',
  'Edit color': 'Editar color',
  '? Error:': '? Error:',
  'Are you sure you want to delete agent "{{name}}"?':
    'Esteu segur que voleu eliminar l\'agent "{{name}}"?',

  // ============================================================================
  // Agents - Assistent de creaci�
  // ============================================================================
  'Project Level (.hopcode/agents/)': 'Nivell de projecte (.hopcode/agents/)',
  'User Level (~/.hopcode/agents/)': "Nivell d'usuari (~/.hopcode/agents/)",
  '? Subagent Created Successfully!': '? Subagent creat correctament!',
  'Subagent "{{name}}" has been saved to {{level}} level.':
    'El subagent "{{name}}" s\'ha desat al nivell {{level}}.',
  'Name: ': 'Nom: ',
  'Location: ': 'Ubicaci�: ',
  '? Error saving subagent:': '? Error en desar el subagent:',
  'Warnings:': 'Advert�ncies:',
  'Name "{{name}}" already exists at {{level}} level - will overwrite existing subagent':
    'El nom "{{name}}" ja existeix al nivell {{level}} - sobreescriur� el subagent existent',
  'Name "{{name}}" exists at user level - project level will take precedence':
    'El nom "{{name}}" existeix al nivell d\'usuari - el nivell de projecte tindr� prioritat',
  'Name "{{name}}" exists at project level - existing subagent will take precedence':
    'El nom "{{name}}" existeix al nivell de projecte - el subagent existent tindr� prioritat',
  'Description is over {{length}} characters':
    'La descripci� supera els {{length}} car�cters',
  'System prompt is over {{length}} characters':
    'El missatge del sistema supera els {{length}} car�cters',
  'Step {{n}}: Choose Location': 'Pas {{n}}: Triar ubicaci�',
  'Step {{n}}: Choose Generation Method':
    'Pas {{n}}: Triar m�tode de generaci�',
  'Generate with HopCode (Recommended)': 'Generar amb HopCode (Recomanat)',
  'Manual Creation': 'Creaci� manual',
  'Describe what this subagent should do and when it should be used. (Be comprehensive for best results)':
    "Descriviu qu� ha de fer aquest subagent i quan s'ha d'usar. (Sigueu exhaustiu per obtenir els millors resultats)",
  'e.g., Expert code reviewer that reviews code based on best practices...':
    'p. ex., Revisor de codi expert que revisa el codi seguint les millors pr�ctiques...',
  'Generating subagent configuration...':
    'Generant la configuraci� del subagent...',
  'Failed to generate subagent: {{error}}':
    'Error en generar el subagent: {{error}}',
  'Step {{n}}: Describe Your Subagent':
    'Pas {{n}}: Descriure el vostre subagent',
  'Step {{n}}: Enter Subagent Name': 'Pas {{n}}: Introduir el nom del subagent',
  'Step {{n}}: Enter System Prompt':
    'Pas {{n}}: Introduir el missatge del sistema',
  'Step {{n}}: Enter Description': 'Pas {{n}}: Introduir la descripci�',
  'Step {{n}}: Select Tools': 'Pas {{n}}: Seleccionar eines',
  'All Tools (Default)': 'Totes les eines (per defecte)',
  'All Tools': 'Totes les eines',
  'Read-only Tools': 'Eines de nom�s lectura',
  'Read & Edit Tools': 'Eines de lectura i edici�',
  'Read & Edit & Execution Tools': 'Eines de lectura, edici� i execuci�',
  'All tools selected, including MCP tools':
    'Totes les eines seleccionades, incloses les eines MCP',
  'Selected tools:': 'Eines seleccionades:',
  'Read-only tools:': 'Eines de nom�s lectura:',
  'Edit tools:': "Eines d'edici�:",
  'Execution tools:': "Eines d'execuci�:",
  'Step {{n}}: Choose Background Color': 'Pas {{n}}: Triar el color de fons',
  'Step {{n}}: Confirm and Save': 'Pas {{n}}: Confirmar i desar',
  'Esc to cancel': 'Esc per cancel�lar',
  'Press Enter to save, e to save and edit, Esc to go back':
    'Premeu Retorn per desar, e per desar i editar, Esc per tornar enrere',
  'Press Enter to continue, {{navigation}}Esc to {{action}}':
    'Premeu Retorn per continuar, {{navigation}}Esc per {{action}}',
  cancel: 'cancel�lar',
  'go back': 'tornar enrere',
  '?? to navigate, ': '?? per navegar, ',
  'Enter a clear, unique name for this subagent.':
    'Introdu�u un nom clar i �nic per a aquest subagent.',
  'e.g., Code Reviewer': 'p. ex., Revisor de codi',
  'Name cannot be empty.': 'El nom no pot estar buit.',
  "Write the system prompt that defines this subagent's behavior. Be comprehensive for best results.":
    "Escriviu el missatge del sistema que defineix el comportament d'aquest subagent. Sigueu exhaustiu per obtenir els millors resultats.",
  'e.g., You are an expert code reviewer...':
    'p. ex., Sou un revisor de codi expert...',
  'System prompt cannot be empty.':
    'El missatge del sistema no pot estar buit.',
  'Describe when and how this subagent should be used.':
    "Descriviu quan i com s'ha d'usar aquest subagent.",
  'e.g., Reviews code for best practices and potential bugs.':
    'p. ex., Revisa el codi seguint les millors pr�ctiques i detectant errors potencials.',
  'Description cannot be empty.': 'La descripci� no pot estar buida.',
  'Failed to launch editor: {{error}}': "Error en iniciar l'editor: {{error}}",
  'Failed to save and edit subagent: {{error}}':
    'Error en desar i editar el subagent: {{error}}',

  // ============================================================================
  // Extensions - Di�leg de gesti�
  // ============================================================================
  'Manage Extensions': 'Gestionar extensions',
  'Extension Details': "Detalls de l'extensi�",
  'View Extension': "Veure l'extensi�",
  'Update Extension': "Actualitzar l'extensi�",
  'Disable Extension': "Desactivar l'extensi�",
  'Enable Extension': "Activar l'extensi�",
  'Uninstall Extension': "Desinstal�lar l'extensi�",
  'Select Scope': "Seleccionar l'�mbit",
  'User Scope': "�mbit d'usuari",
  'Workspace Scope': "�mbit de l'espai de treball",
  'No extensions found.': "No s'han trobat extensions.",
  Active: 'Activa',
  Disabled: 'Desactivada',
  'Update available': 'Actualitzaci� disponible',
  'Up to date': 'Al dia',
  'Checking...': 'Comprovant...',
  'Updating...': 'Actualitzant...',
  Unknown: 'Desconegut',
  Error: 'Error',
  'Version:': 'Versi�:',
  'Status:': 'Estat:',
  'Are you sure you want to uninstall extension "{{name}}"?':
    'Esteu segur que voleu desinstal�lar l\'extensi� "{{name}}"?',
  'This action cannot be undone.': 'Aquesta acci� no es pot desfer.',
  'Extension "{{name}}" disabled successfully.':
    'L\'extensi� "{{name}}" s\'ha desactivat correctament.',
  'Extension "{{name}}" enabled successfully.':
    'L\'extensi� "{{name}}" s\'ha activat correctament.',
  'Extension "{{name}}" updated successfully.':
    'L\'extensi� "{{name}}" s\'ha actualitzat correctament.',
  'Failed to update extension "{{name}}": {{error}}':
    'Error en actualitzar l\'extensi� "{{name}}": {{error}}',
  'Select the scope for this action:':
    "Seleccioneu l'�mbit per a aquesta acci�:",
  'User - Applies to all projects': "Usuari - S'aplica a tots els projectes",
  'Workspace - Applies to current project only':
    "Espai de treball - S'aplica nom�s al projecte actual",
  'Name:': 'Nom:',
  'MCP Servers:': 'Servidors MCP:',
  'Settings:': 'Configuraci�:',
  active: 'activa',
  disabled: 'desactivada',
  'View Details': 'Veure detalls',
  'Update failed:': "Error en l'actualitzaci�:",
  'Updating {{name}}...': 'Actualitzant {{name}}...',
  'Update complete!': 'Actualitzaci� completada!',
  'User (global)': 'Usuari (global)',
  'Workspace (project-specific)': 'Espai de treball (espec�fic del projecte)',
  'Disable "{{name}}" - Select Scope':
    'Desactivar "{{name}}" - Seleccionar �mbit',
  'Enable "{{name}}" - Select Scope': 'Activar "{{name}}" - Seleccionar �mbit',
  'No extension selected': 'Cap extensi� seleccionada',
  'Press Y/Enter to confirm, N/Esc to cancel':
    'Premeu Y/Retorn per confirmar, N/Esc per cancel�lar',
  'Y/Enter to confirm, N/Esc to cancel':
    'Y/Retorn per confirmar, N/Esc per cancel�lar',
  '{{count}} extensions installed': '{{count}} extensions instal�lades',
  "Use '/extensions install' to install your first extension.":
    "Useu '/extensions install' per instal�lar la vostra primera extensi�.",
  'up to date': 'al dia',
  'update available': 'actualitzaci� disponible',
  'checking...': 'comprovant...',
  'not updatable': 'no actualitzable',
  error: 'error',

  // ============================================================================
  // Ordres - General (continuaci�)
  // ============================================================================
  'View and edit HopCode settings': 'Veure i editar la configuraci� de HopCode',
  Settings: 'Configuraci�',
  'To see changes, HopCode must be restarted. Press r to exit and apply changes now.':
    'Per veure els canvis, cal reiniciar HopCode. Premeu r per sortir i aplicar els canvis ara.',
  'The command "/{{command}}" is not supported in non-interactive mode.':
    'L\'ordre "/{{command}}" no �s compatible en mode no interactiu.',

  // ============================================================================
  // Etiquetes de configuraci�
  // ============================================================================
  'Vim Mode': 'Mode Vim',
  'Disable Auto Update': 'Desactivar actualitzaci� autom�tica',
  'Attribution: commit': 'Atribuci�: commit',
  'Terminal Bell Notification': 'Notificaci� de campana del terminal',
  'Enable Usage Statistics': "Activar estad�stiques d'�s",
  Theme: 'Tema',
  'Preferred Editor': 'Editor preferit',
  'Auto-connect to IDE': 'Connexi� autom�tica a IDE',
  'Enable Prompt Completion': 'Activar la compleci� de missatges',
  'Debug Keystroke Logging': 'Registre de tecles per a depuraci�',
  'Language: UI': 'Idioma: Interf�cie',
  'Language: Model': 'Idioma: Model',
  'Output Format': 'Format de sortida',
  'Hide Window Title': 'Amagar el t�tol de la finestra',
  'Show Status in Title': "Mostrar l'estat al t�tol",
  'Hide Tips': 'Amagar consells',
  'Show Line Numbers in Code': 'Mostrar n�meros de l�nia al codi',
  'Show Citations': 'Mostrar cites',
  'Custom Witty Phrases': 'Frases enginyoses personalitzades',
  'Show Welcome Back Dialog': 'Mostrar el di�leg de benvinguda',
  'Enable User Feedback': 'Activar les valoracions dels usuaris',
  'How is HopCode doing this session? (optional)':
    'Com va HopCode en aquesta sessi�? (opcional)',
  Bad: 'Malament',
  Fine: 'B�',
  Good: 'Molt b�',
  Dismiss: 'Descartar',
  'Not Sure Yet': 'Encara no estic segur',
  'Any other key': 'Qualsevol altra tecla',
  'Disable Loading Phrases': 'Desactivar frases de c�rrega',
  'Screen Reader Mode': 'Mode de lector de pantalla',
  'IDE Mode': 'Mode IDE',
  'Max Session Turns': 'Torns m�xims de sessi�',
  'Skip Next Speaker Check': 'Ometre la comprovaci� del proper parlant',
  'Skip Loop Detection': 'Ometre la detecci� de bucles',
  'Skip Startup Context': "Ometre el context d'inici",
  'Enable OpenAI Logging': "Activar el registre d'OpenAI",
  'OpenAI Logging Directory': "Directori de registres d'OpenAI",
  Timeout: "Temps d'espera",
  'Max Retries': 'Reintents m�xims',
  'Disable Cache Control': 'Desactivar el control de mem�ria cau',
  'Memory Discovery Max Dirs': 'Directoris m�xims de descoberta de mem�ria',
  'Load Memory From Include Directories':
    'Carregar mem�ria des dels directoris inclosos',
  'Respect .gitignore': 'Respectar .gitignore',
  'Respect .hopcodeignore': 'Respectar .hopcodeignore',
  'Enable Recursive File Search': 'Activar la cerca recursiva de fitxers',
  'Disable Fuzzy Search': 'Desactivar la cerca difusa',
  'Interactive Shell (PTY)': 'Shell interactiva (PTY)',
  'Show Color': 'Mostrar color',
  'Auto Accept': 'Acceptaci� autom�tica',
  'Use Ripgrep': 'Usar Ripgrep',
  'Use Builtin Ripgrep': 'Usar Ripgrep integrat',
  'Enable Tool Output Truncation':
    "Activar el truncament de la sortida d'eines",
  'Tool Output Truncation Threshold':
    "Llindar de truncament de la sortida d'eines",
  'Tool Output Truncation Lines': "L�nies de truncament de la sortida d'eines",
  'Folder Trust': 'Confian�a de carpeta',
  'Vision Model Preview': 'Previsualitzaci� del model de visi�',
  'Tool Schema Compliance': "Compliment de l'esquema d'eines",
  'Auto (detect from system)': 'Autom�tic (detectar del sistema)',
  'Auto (detect terminal theme)': 'Autom�tic (detectar el tema del terminal)',
  Auto: 'Autom�tic',
  Text: 'Text',
  JSON: 'JSON',
  Plan: 'Planificaci�',
  Default: 'Per defecte',
  'Auto Edit': 'Edici� autom�tica',
  IZN: 'IZN',
  'toggle vim mode on/off': 'activar/desactivar el mode Vim',
  'check session stats. Usage: /stats [model|tools]':
    'comprovar les estad�stiques de la sessi�. �s: /stats [model|tools]',
  'Show model-specific usage statistics.':
    "Mostrar les estad�stiques d'�s espec�fiques del model.",
  'Show tool-specific usage statistics.':
    "Mostrar les estad�stiques d'�s espec�fiques de les eines.",
  'exit the cli': 'sortir del CLI',
  'Open MCP management dialog, or authenticate with OAuth-enabled servers':
    'Obrir el di�leg de gesti� MCP o autenticar-se amb servidors OAuth',
  'List configured MCP servers and tools, or authenticate with OAuth-enabled servers':
    'Llistar els servidors MCP configurats i les seves eines, o autenticar-se amb servidors OAuth',
  'Manage workspace directories':
    "Gestionar els directoris de l'espai de treball",
  'Add directories to the workspace. Use comma to separate multiple paths':
    "Afegir directoris a l'espai de treball. Useu comes per separar m�ltiples camins",
  'Show all directories in the workspace':
    "Mostrar tots els directoris de l'espai de treball",
  'set external editor preference': "establir la prefer�ncia d'editor extern",
  'Select Editor': 'Seleccionar editor',
  'Editor Preference': "Prefer�ncia d'editor",
  'These editors are currently supported. Please note that some editors cannot be used in sandbox mode.':
    'Aquests editors estan suportats. Cal tenir en compte que alguns editors no es poden usar en mode a�llat.',
  'Your preferred editor is:': 'El vostre editor preferit �s:',
  'Manage extensions': 'Gestionar extensions',
  'Manage installed extensions': 'Gestionar les extensions instal�lades',
  'List active extensions': 'Llistar les extensions actives',
  'Update extensions. Usage: update <extension-names>|--all':
    "Actualitzar extensions. �s: update <noms-d'extensions>|--all",
  'Disable an extension': 'Desactivar una extensi�',
  'Enable an extension': 'Activar una extensi�',
  'Install an extension from a git repo or local path':
    "Instal�lar una extensi� des d'un repositori git o cam� local",
  'Uninstall an extension': 'Desinstal�lar una extensi�',
  'No extensions installed.': 'No hi ha extensions instal�lades.',
  'Usage: /extensions update <extension-names>|--all':
    "�s: /extensions update <noms-d'extensions>|--all",
  'Extension "{{name}}" not found.': 'Extensi� "{{name}}" no trobada.',
  'No extensions to update.': 'No hi ha extensions per actualitzar.',
  'Usage: /extensions install <source>': '�s: /extensions install <font>',
  'Installing extension from "{{source}}"...':
    'Instal�lant extensi� des de "{{source}}"...',
  'Extension "{{name}}" installed successfully.':
    'L\'extensi� "{{name}}" s\'ha instal�lat correctament.',
  'Failed to install extension from "{{source}}": {{error}}':
    'Error en instal�lar l\'extensi� des de "{{source}}": {{error}}',
  'Usage: /extensions uninstall <extension-name>':
    "�s: /extensions uninstall <nom-de-l'extensi�>",
  'Uninstalling extension "{{name}}"...':
    'Desinstal�lant l\'extensi� "{{name}}"...',
  'Extension "{{name}}" uninstalled successfully.':
    'L\'extensi� "{{name}}" s\'ha desinstal�lat correctament.',
  'Failed to uninstall extension "{{name}}": {{error}}':
    'Error en desinstal�lar l\'extensi� "{{name}}": {{error}}',
  'Usage: /extensions {{command}} <extension> [--scope=<user|workspace>]':
    '�s: /extensions {{command}} <extensi�> [--scope=<user|workspace>]',
  'Unsupported scope "{{scope}}", should be one of "user" or "workspace"':
    '�mbit no suportat "{{scope}}", ha de ser "user" o "workspace"',
  'Extension "{{name}}" disabled for scope "{{scope}}"':
    'L\'extensi� "{{name}}" desactivada per a l\'�mbit "{{scope}}"',
  'Extension "{{name}}" enabled for scope "{{scope}}"':
    'L\'extensi� "{{name}}" activada per a l\'�mbit "{{scope}}"',
  'Do you want to continue? [Y/n]: ': 'Voleu continuar? [S/n]: ',
  'Do you want to continue?': 'Voleu continuar?',
  'Installing extension "{{name}}".': 'Instal�lant l\'extensi� "{{name}}".',
  '**Extensions may introduce unexpected behavior. Ensure you have investigated the extension source and trust the author.**':
    "**Les extensions poden introduir comportaments inesperats. Assegureu-vos d'haver investigat la font de l'extensi� i de confiar en l'autor.**",
  'This extension will run the following MCP servers:':
    'Aquesta extensi� executar� els servidors MCP seg�ents:',
  local: 'local',
  remote: 'remot',
  'This extension will add the following commands: {{commands}}.':
    'Aquesta extensi� afegir� les ordres seg�ents: {{commands}}.',
  'This extension will append info to your HOPCODE.md context using {{fileName}}':
    'Aquesta extensi� afegir� informaci� al vostre context HOPCODE.md usant {{fileName}}',
  'This extension will exclude the following core tools: {{tools}}':
    'Aquesta extensi� exclour� les eines principals seg�ents: {{tools}}',
  'This extension will install the following skills:':
    'Aquesta extensi� instal�lar� les habilitats seg�ents:',
  'This extension will install the following subagents:':
    'Aquesta extensi� instal�lar� els subagents seg�ents:',
  'Installation cancelled for "{{name}}".':
    'Instal�laci� cancel�lada per a "{{name}}".',
  'You are installing an extension from {{originSource}}. Some features may not work perfectly with HopCode.':
    'Esteu instal�lant una extensi� des de {{originSource}}. Algunes funcions poden no funcionar perfectament amb HopCode.',
  '--ref and --auto-update are not applicable for marketplace extensions.':
    "--ref i --auto-update no s'apliquen a les extensions del mercat.",
  'Extension "{{name}}" installed successfully and enabled.':
    'L\'extensi� "{{name}}" s\'ha instal�lat i activat correctament.',
  'Installs an extension from a git repository URL, local path, or claude marketplace (marketplace-url:plugin-name).':
    "Instal�la una extensi� des d'una URL de repositori git, un cam� local o el mercat (marketplace-url:nom-del-connector).",
  'The github URL, local path, or marketplace source (marketplace-url:plugin-name) of the extension to install.':
    "La URL de GitHub, el cam� local o la font del mercat (marketplace-url:nom-del-connector) de l'extensi� a instal�lar.",
  'The git ref to install from.':
    'La refer�ncia git des de la qual instal�lar.',
  'Enable auto-update for this extension.':
    "Activar l'actualitzaci� autom�tica per a aquesta extensi�.",
  'Enable pre-release versions for this extension.':
    'Activar les versions preliminars per a aquesta extensi�.',
  'Acknowledge the security risks of installing an extension and skip the confirmation prompt.':
    "Acceptar els riscos de seguretat d'instal�lar una extensi� i ometre el missatge de confirmaci�.",
  'The source argument must be provided.': "Cal proporcionar l'argument font.",
  'Extension "{{name}}" successfully uninstalled.':
    'L\'extensi� "{{name}}" s\'ha desinstal�lat correctament.',
  'Uninstalls an extension.': 'Desinstal�la una extensi�.',
  'The name or source path of the extension to uninstall.':
    "El nom o cam� font de l'extensi� a desinstal�lar.",
  'Please include the name of the extension to uninstall as a positional argument.':
    "Incloeu el nom de l'extensi� a desinstal�lar com a argument posicional.",
  'Enables an extension.': 'Activa una extensi�.',
  'The name of the extension to enable.': "El nom de l'extensi� a activar.",
  'The scope to enable the extenison in. If not set, will be enabled in all scopes.':
    "L'�mbit en el qual activar l'extensi�. Si no s'estableix, s'activar� en tots els �mbits.",
  'Extension "{{name}}" successfully enabled for scope "{{scope}}".':
    'L\'extensi� "{{name}}" s\'ha activat correctament per a l\'�mbit "{{scope}}".',
  'Extension "{{name}}" successfully enabled in all scopes.':
    'L\'extensi� "{{name}}" s\'ha activat correctament en tots els �mbits.',
  'Invalid scope: {{scope}}. Please use one of {{scopes}}.':
    '�mbit no v�lid: {{scope}}. Useu un dels seg�ents: {{scopes}}.',
  'Disables an extension.': 'Desactiva una extensi�.',
  'The name of the extension to disable.': "El nom de l'extensi� a desactivar.",
  'The scope to disable the extenison in.':
    "L'�mbit en el qual desactivar l'extensi�.",
  'Extension "{{name}}" successfully disabled for scope "{{scope}}".':
    'L\'extensi� "{{name}}" s\'ha desactivat correctament per a l\'�mbit "{{scope}}".',
  'Extension "{{name}}" successfully updated: {{oldVersion}} ? {{newVersion}}.':
    'L\'extensi� "{{name}}" s\'ha actualitzat correctament: {{oldVersion}} ? {{newVersion}}.',
  'Unable to install extension "{{name}}" due to missing install metadata':
    'No es pot instal�lar l\'extensi� "{{name}}" per manca de metadades d\'instal�laci�',
  'Extension "{{name}}" is already up to date.':
    'L\'extensi� "{{name}}" ja �s al dia.',
  'Updates all extensions or a named extension to the latest version.':
    "Actualitza totes les extensions o una extensi� espec�fica a l'�ltima versi�.",
  'Update all extensions.': 'Actualitzar totes les extensions.',
  'The name of the extension to update.': "El nom de l'extensi� a actualitzar.",
  'Either an extension name or --all must be provided':
    "Cal proporcionar un nom d'extensi� o --all",
  'Lists installed extensions.': 'Llista les extensions instal�lades.',
  'Path:': 'Cam�:',
  'Source:': 'Font:',
  'Type:': 'Tipus:',
  'Ref:': 'Ref:',
  'Release tag:': 'Etiqueta de versi�:',
  'Enabled (User):': 'Activada (Usuari):',
  'Enabled (Workspace):': 'Activada (Espai de treball):',
  'Context files:': 'Fitxers de context:',
  'Skills:': 'Habilitats:',
  'Agents:': 'Agents:',
  'MCP servers:': 'Servidors MCP:',
  'Link extension failed to install.':
    "No s'ha pogut instal�lar l'extensi� d'enlla�.",
  'Extension "{{name}}" linked successfully and enabled.':
    'L\'extensi� "{{name}}" s\'ha enlla�at i activat correctament.',
  'Links an extension from a local path. Updates made to the local path will always be reflected.':
    "Enlla�a una extensi� des d'un cam� local. Els canvis al cam� local sempre es reflectiran.",
  'The name of the extension to link.': "El nom de l'extensi� a enlla�ar.",
  'Set a specific setting for an extension.':
    'Establir una configuraci� espec�fica per a una extensi�.',
  'Name of the extension to configure.': "Nom de l'extensi� a configurar.",
  'The setting to configure (name or env var).':
    "La configuraci� a establir (nom o variable d'entorn).",
  'The scope to set the setting in.': "L'�mbit on establir la configuraci�.",
  'List all settings for an extension.':
    "Llistar tota la configuraci� d'una extensi�.",
  'Name of the extension.': "Nom de l'extensi�.",
  'Extension "{{name}}" has no settings to configure.':
    'L\'extensi� "{{name}}" no t� cap configuraci�.',
  'Settings for "{{name}}":': 'Configuraci� per a "{{name}}":',
  '(workspace)': '(espai de treball)',
  '(user)': '(usuari)',
  '[not set]': '[no establert]',
  '[value stored in keychain]': '[valor emmagatzemat al clauer]',
  'Value:': 'Valor:',
  'Manage extension settings.': 'Gestionar la configuraci� de les extensions.',
  'You need to specify a command (set or list).':
    'Cal especificar una ordre (set o list).',

  // ============================================================================
  // Selecci� de connector / Mercat
  // ============================================================================
  'No plugins available in this marketplace.':
    'No hi ha connectors disponibles en aquest mercat.',
  'Select a plugin to install from marketplace "{{name}}":':
    'Seleccioneu un connector per instal�lar des del mercat "{{name}}":',
  'Plugin selection cancelled.': 'Selecci� de connector cancel�lada.',
  'Select a plugin from "{{name}}"': 'Seleccionar un connector de "{{name}}"',
  'Use ?? or j/k to navigate, Enter to select, Escape to cancel':
    'Useu ?? o j/k per navegar, Retorn per seleccionar, Esc per cancel�lar',
  '{{count}} more above': '{{count}} m�s amunt',
  '{{count}} more below': '{{count}} m�s avall',
  'manage IDE integration': "gestionar la integraci� de l'IDE",
  'check status of IDE integration':
    "comprovar l'estat de la integraci� de l'IDE",
  'install required IDE companion for {{ideName}}':
    'instal�lar el complement IDE necessari per a {{ideName}}',
  'enable IDE integration': "activar la integraci� de l'IDE",
  'disable IDE integration': "desactivar la integraci� de l'IDE",
  'IDE integration is not supported in your current environment. To use this feature, run HopCode in one of these supported IDEs: VS Code or VS Code forks.':
    "La integraci� de l'IDE no �s compatible en el vostre entorn actual. Per usar aquesta funci�, executeu HopCode en un dels IDEs compatibles: VS Code o bifurcacions de VS Code.",
  'Set up GitHub Actions': 'Configurar GitHub Actions',
  'Configure terminal keybindings for multiline input (VS Code, Cursor, Windsurf, Trae)':
    'Configurar les dreceres del terminal per a entrada multil�nia (VS Code, Cursor, Windsurf, Trae)',
  'Please restart your terminal for the changes to take effect.':
    'Reinicieu el terminal perqu� els canvis tinguin efecte.',
  'Failed to configure terminal: {{error}}':
    'Error en configurar el terminal: {{error}}',
  'Could not determine {{terminalName}} config path on Windows: APPDATA environment variable is not set.':
    "No s'ha pogut determinar el cam� de configuraci� de {{terminalName}} a Windows: la variable d'entorn APPDATA no est� establerta.",
  '{{terminalName}} keybindings.json exists but is not a valid JSON array. Please fix the file manually or delete it to allow automatic configuration.':
    '{{terminalName}} keybindings.json existeix per� no �s un array JSON v�lid. Corregiu el fitxer manualment o elimineu-lo per permetre la configuraci� autom�tica.',
  'File: {{file}}': 'Fitxer: {{file}}',
  'Failed to parse {{terminalName}} keybindings.json. The file contains invalid JSON. Please fix the file manually or delete it to allow automatic configuration.':
    'Error en analitzar {{terminalName}} keybindings.json. El fitxer cont� JSON no v�lid. Corregiu el fitxer manualment o elimineu-lo per permetre la configuraci� autom�tica.',
  'Error: {{error}}': 'Error: {{error}}',
  'Shift+Enter binding already exists': 'La drecera Shift+Retorn ja existeix',
  'Ctrl+Enter binding already exists': 'La drecera Ctrl+Retorn ja existeix',
  'Existing keybindings detected. Will not modify to avoid conflicts.':
    "S'han detectat dreceres existents. No es modificaran per evitar conflictes.",
  'Please check and modify manually if needed: {{file}}':
    'Comproveu i modifiqueu manualment si cal: {{file}}',
  'Added Shift+Enter and Ctrl+Enter keybindings to {{terminalName}}.':
    "S'han afegit les dreceres Shift+Retorn i Ctrl+Retorn a {{terminalName}}.",
  'Modified: {{file}}': 'Modificat: {{file}}',
  '{{terminalName}} keybindings already configured.':
    'Les dreceres de {{terminalName}} ja estan configurades.',
  'Failed to configure {{terminalName}}.':
    'Error en configurar {{terminalName}}.',
  'Your terminal is already configured for an optimal experience with multiline input (Shift+Enter and Ctrl+Enter).':
    'El vostre terminal ja est� configurat per a una experi�ncia �ptima amb entrada multil�nia (Shift+Retorn i Ctrl+Retorn).',

  // ============================================================================
  // Ordres - Hooks
  // ============================================================================
  'Manage HopCode hooks': 'Gestionar els hooks de HopCode',
  'List all configured hooks': 'Llistar tots els hooks configurats',
  'Enable a disabled hook': 'Activar un hook desactivat',
  'Disable an active hook': 'Desactivar un hook actiu',
  Hooks: 'Hooks',
  'Loading hooks...': 'Carregant hooks...',
  'Error loading hooks:': 'Error en carregar els hooks:',
  'Press Escape to close': 'Premeu Esc per tancar',
  'Press Escape, Ctrl+C, or Ctrl+D to cancel':
    'Premeu Esc, Ctrl+C o Ctrl+D per cancel�lar',
  'Press Space, Enter, or Escape to dismiss':
    'Premeu Espai, Retorn o Esc per descartar',
  'No hook selected': 'Cap hook seleccionat',
  'No hook events found.': "No s'han trobat esdeveniments de hook.",
  '{{count}} hook configured': '{{count}} hook configurat',
  '{{count}} hooks configured': '{{count}} hooks configurats',
  'This menu is read-only. To add or modify hooks, edit settings.json directly or ask HopCode.':
    'Aquest men� �s de nom�s lectura. Per afegir o modificar hooks, editeu settings.json directament o demaneu-ho a HopCode.',
  'Enter to select � Esc to cancel':
    'Retorn per seleccionar � Esc per cancel�lar',
  'Exit codes:': 'Codis de sortida:',
  'Configured hooks:': 'Hooks configurats:',
  'No hooks configured for this event.':
    'No hi ha hooks configurats per a aquest esdeveniment.',
  'To add hooks, edit settings.json directly or ask HopCode.':
    'Per afegir hooks, editeu settings.json directament o demaneu-ho a HopCode.',
  'Enter to select � Esc to go back':
    'Retorn per seleccionar � Esc per tornar enrere',
  'Hook details': 'Detalls del hook',
  'Event:': 'Esdeveniment:',
  'Extension:': 'Extensi�:',
  'Desc:': 'Desc:',
  'No hook config selected': 'Cap configuraci� de hook seleccionada',
  'To modify or remove this hook, edit settings.json directly or ask HopCode to help.':
    'Per modificar o eliminar aquest hook, editeu settings.json directament o demaneu ajuda a HopCode.',
  'Hook Configuration - Disabled': 'Configuraci� de hooks - Desactivats',
  'All hooks are currently disabled. You have {{count}} that are not running.':
    'Tots els hooks estan desactivats. En teniu {{count}} que no estan en execuci�.',
  '{{count}} configured hook': '{{count}} hook configurat',
  '{{count}} configured hooks': '{{count}} hooks configurats',
  'When hooks are disabled:': 'Quan els hooks estan desactivats:',
  'No hook commands will execute': "Cap ordre de hook s'executar�",
  'StatusLine will not be displayed': "La barra d'estat no es mostrar�",
  'Tool operations will proceed without hook validation':
    "Les operacions d'eines continuaran sense validaci� de hook",
  'To re-enable hooks, remove "disableAllHooks" from settings.json or ask HopCode.':
    'Per tornar a activar els hooks, elimineu "disableAllHooks" de settings.json o demaneu-ho a HopCode.',
  Project: 'Projecte',
  User: 'Usuari',
  System: 'Sistema',
  Extension: 'Extensi�',
  'Local Settings': 'Configuraci� local',
  'User Settings': "Configuraci� d'usuari",
  'System Settings': 'Configuraci� del sistema',
  Extensions: 'Extensions',
  'Session (temporary)': 'Sessi� (temporal)',
  '? Enabled': '? Activat',
  '? Disabled': '? Desactivat',
  'Before tool execution': "Abans de l'execuci� de l'eina",
  'After tool execution': "Despr�s de l'execuci� de l'eina",
  'After tool execution fails': "Quan falla l'execuci� de l'eina",
  'When notifications are sent': "Quan s'envien notificacions",
  'When the user submits a prompt': "Quan l'usuari envia un missatge",
  'When a new session is started': "Quan s'inicia una nova sessi�",
  'Right before HopCode concludes its response':
    'Immediatament abans que HopCode conclou la seva resposta',
  'When a subagent (Agent tool call) is started':
    "Quan s'inicia un subagent (crida a l'eina Agent)",
  'Right before a subagent concludes its response':
    'Immediatament abans que un subagent conclou la seva resposta',
  'Before conversation compaction': 'Abans de la compactaci� de la conversa',
  'When a session is ending': "Quan una sessi� s'est� acabant",
  'When a permission dialog is displayed':
    'Quan es mostra un di�leg de permisos',
  'Input to command is JSON of tool call arguments.':
    "L'entrada a l'ordre �s JSON dels arguments de la crida a l'eina.",
  'Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).':
    'L\'entrada a l\'ordre �s JSON amb els camps "inputs" (arguments de la crida a l\'eina) i "response" (resposta de la crida a l\'eina).',
  'Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.':
    "L'entrada a l'ordre �s JSON amb tool_name, tool_input, tool_use_id, error, error_type, is_interrupt i is_timeout.",
  'Input to command is JSON with notification message and type.':
    "L'entrada a l'ordre �s JSON amb el missatge de notificaci� i el tipus.",
  'Input to command is JSON with original user prompt text.':
    "L'entrada a l'ordre �s JSON amb el text original del missatge de l'usuari.",
  'Input to command is JSON with session start source.':
    "L'entrada a l'ordre �s JSON amb la font d'inici de sessi�.",
  'Input to command is JSON with session end reason.':
    "L'entrada a l'ordre �s JSON amb el motiu de fi de sessi�.",
  'Input to command is JSON with agent_id and agent_type.':
    "L'entrada a l'ordre �s JSON amb agent_id i agent_type.",
  'Input to command is JSON with agent_id, agent_type, and agent_transcript_path.':
    "L'entrada a l'ordre �s JSON amb agent_id, agent_type i agent_transcript_path.",
  'Input to command is JSON with compaction details.':
    "L'entrada a l'ordre �s JSON amb els detalls de compactaci�.",
  'Input to command is JSON with tool_name, tool_input, and tool_use_id. Output JSON with hookSpecificOutput containing decision to allow or deny.':
    "L'entrada a l'ordre �s JSON amb tool_name, tool_input i tool_use_id. La sortida JSON amb hookSpecificOutput cont� la decisi� de permetre o denegar.",
  'stdout/stderr not shown': 'stdout/stderr no es mostra',
  'show stderr to model and continue conversation':
    'mostrar stderr al model i continuar la conversa',
  'show stderr to user only': "mostrar stderr nom�s a l'usuari",
  'stdout shown in transcript mode (ctrl+o)':
    'stdout mostrat en mode transcripci� (ctrl+o)',
  'show stderr to model immediately': 'mostrar stderr al model immediatament',
  'show stderr to user only but continue with tool call':
    "mostrar stderr nom�s a l'usuari per� continuar amb la crida a l'eina",
  'block processing, erase original prompt, and show stderr to user only':
    "blocar el processament, esborrar el missatge original i mostrar stderr nom�s a l'usuari",
  'stdout shown to HopCode': 'stdout mostrat a HopCode',
  'show stderr to user only (blocking errors ignored)':
    "mostrar stderr nom�s a l'usuari (errors de bloqueig ignorats)",
  'command completes successfully': "l'ordre es completa correctament",
  'stdout shown to subagent': 'stdout mostrat al subagent',
  'show stderr to subagent and continue having it run':
    'mostrar stderr al subagent i continuar la seva execuci�',
  'stdout appended as custom compact instructions':
    'stdout afegit com a instruccions compactes personalitzades',
  'block compaction': 'blocar la compactaci�',
  'show stderr to user only but continue with compaction':
    "mostrar stderr nom�s a l'usuari per� continuar amb la compactaci�",
  'use hook decision if provided': 'usar la decisi� del hook si es proporciona',
  'Config not loaded.': 'Configuraci� no carregada.',
  'Hooks are not enabled. Enable hooks in settings to use this feature.':
    'Els hooks no estan activats. Activeu els hooks a la configuraci� per usar aquesta funci�.',
  'No hooks configured. Add hooks in your settings.json file.':
    'No hi ha hooks configurats. Afegiu hooks al vostre fitxer settings.json.',
  'Configured Hooks ({{count}} total)':
    'Hooks configurats ({{count}} en total)',

  // ============================================================================
  // Ordres - Exportaci� de sessi�
  // ============================================================================
  'Export current session message history to a file':
    "Exportar l'historial de missatges de la sessi� actual a un fitxer",
  'Export session to HTML format': 'Exportar la sessi� en format HTML',
  'Export session to JSON format': 'Exportar la sessi� en format JSON',
  'Export session to JSONL format (one message per line)':
    'Exportar la sessi� en format JSONL (un missatge per l�nia)',
  'Export session to markdown format': 'Exportar la sessi� en format markdown',

  // ============================================================================
  // Ordres - Idees
  // ============================================================================
  'generate personalized programming insights from your chat history':
    'generar idees de programaci� personalitzades a partir del vostre historial de xat',

  // ============================================================================
  // Ordres - Historial de sessi�
  // ============================================================================
  'Resume a previous session': 'Reprendre una sessi� anterior',
  'Restore a tool call. This will reset the conversation and file history to the state it was in when the tool call was suggested':
    "Restaurar una crida a una eina. Aix� restablir� la conversa i l'historial de fitxers a l'estat en qu� es trobaven quan es va suggerir la crida a l'eina",
  'Could not detect terminal type. Supported terminals: VS Code, Cursor, Windsurf, and Trae.':
    "No s'ha pogut detectar el tipus de terminal. Terminals compatibles: VS Code, Cursor, Windsurf i Trae.",
  'Terminal "{{terminal}}" is not supported yet.':
    'El terminal "{{terminal}}" no �s compatible encara.',

  // ============================================================================
  // Ordres - Idioma
  // ============================================================================
  'Invalid language. Available: {{options}}':
    'Idioma no v�lid. Disponibles: {{options}}',
  'Language subcommands do not accept additional arguments.':
    "Les subordres d'idioma no accepten arguments addicionals.",
  'Current UI language: {{lang}}': 'Idioma actual de la interf�cie: {{lang}}',
  'Current LLM output language: {{lang}}':
    'Idioma actual de la sortida del model: {{lang}}',
  'LLM output language not set': 'Idioma de sortida del model no establert',
  'Set UI language': "Establir l'idioma de la interf�cie",
  'Set LLM output language': "Establir l'idioma de sortida del model",
  'Usage: /language ui [{{options}}]': '�s: /language ui [{{options}}]',
  'Usage: /language output <language>': '�s: /language output <idioma>',
  'Example: /language output ??': 'Exemple: /language output ??',
  'Example: /language output English': 'Exemple: /language output English',
  'Example: /language output ???': 'Exemple: /language output ???',
  'Example: /language output Portugu�s': 'Exemple: /language output Portugu�s',
  'UI language changed to {{lang}}':
    'Idioma de la interf�cie canviat a {{lang}}',
  'LLM output language set to {{lang}}':
    'Idioma de sortida del model establert a {{lang}}',
  'LLM output language rule file generated at {{path}}':
    "Fitxer de regles d'idioma de sortida del model generat a {{path}}",
  'Please restart the application for the changes to take effect.':
    "Reinicieu l'aplicaci� perqu� els canvis tinguin efecte.",
  'Failed to generate LLM output language rule file: {{error}}':
    "Error en generar el fitxer de regles d'idioma de sortida del model: {{error}}",
  'Invalid command. Available subcommands:':
    'Ordre no v�lida. Subordres disponibles:',
  'Available subcommands:': 'Subordres disponibles:',
  'To request additional UI language packs, please open an issue on GitHub.':
    "Per sol�licitar paquets d'idioma addicionals per a la interf�cie, obriu una incid�ncia a GitHub.",
  'Available options:': 'Opcions disponibles:',
  'Set UI language to {{name}}':
    "Establir l'idioma de la interf�cie a {{name}}",

  // ============================================================================
  // Ordres - Mode d'aprovaci�
  // ============================================================================
  'Tool Approval Mode': "Mode d'aprovaci� d'eines",
  'Current approval mode: {{mode}}': "Mode d'aprovaci� actual: {{mode}}",
  'Available approval modes:': "Modes d'aprovaci� disponibles:",
  'Approval mode changed to: {{mode}}': "Mode d'aprovaci� canviat a: {{mode}}",
  'Approval mode changed to: {{mode}} (saved to {{scope}} settings{{location}})':
    "Mode d'aprovaci� canviat a: {{mode}} (desat a la configuraci� {{scope}}{{location}})",
  'Usage: /approval-mode <mode> [--session|--user|--project]':
    '�s: /approval-mode <mode> [--session|--user|--project]',
  'Scope subcommands do not accept additional arguments.':
    "Les subordres d'�mbit no accepten arguments addicionals.",
  'Plan mode - Analyze only, do not modify files or execute commands':
    'Mode de planificaci� - Analitzar nom�s, sense modificar fitxers ni executar ordres',
  'Default mode - Require approval for file edits or shell commands':
    'Mode per defecte - Requerir aprovaci� per a edicions de fitxers o ordres shell',
  'Auto-edit mode - Automatically approve file edits':
    "Mode d'edici� autom�tica - Aprovar autom�ticament les edicions de fitxers",
  'IZN mode - Automatically approve all tools':
    'Mode IZN - Aprovar autom�ticament totes les eines',
  '{{mode}} mode': 'Mode {{mode}}',
  'Settings service is not available; unable to persist the approval mode.':
    "El servei de configuraci� no est� disponible; no es pot persistir el mode d'aprovaci�.",
  'Failed to save approval mode: {{error}}':
    "Error en desar el mode d'aprovaci�: {{error}}",
  'Failed to change approval mode: {{error}}':
    "Error en canviar el mode d'aprovaci�: {{error}}",
  'Apply to current session only (temporary)':
    'Aplicar nom�s a la sessi� actual (temporal)',
  'Persist for this project/workspace':
    'Persistir per a aquest projecte/espai de treball',
  'Persist for this user on this machine':
    'Persistir per a aquest usuari en aquesta m�quina',
  'Analyze only, do not modify files or execute commands':
    'Analitzar nom�s, sense modificar fitxers ni executar ordres',
  'Require approval for file edits or shell commands':
    'Requerir aprovaci� per a edicions de fitxers o ordres shell',
  'Automatically approve file edits':
    'Aprovar autom�ticament les edicions de fitxers',
  'Automatically approve all tools': 'Aprovar autom�ticament totes les eines',
  'Workspace approval mode exists and takes priority. User-level change will have no effect.':
    "Existeix un mode d'aprovaci� de l'espai de treball i t� prioritat. El canvi a nivell d'usuari no tindr� cap efecte.",
  'Apply To': 'Aplicar a',
  'Workspace Settings': "Configuraci� de l'espai de treball",

  // ============================================================================
  // Ordres - Mem�ria
  // ============================================================================
  'Commands for interacting with memory.':
    'Ordres per interactuar amb la mem�ria.',
  'Show the current memory contents.':
    'Mostrar el contingut actual de la mem�ria.',
  'Show project-level memory contents.':
    'Mostrar el contingut de la mem�ria a nivell de projecte.',
  'Show global memory contents.': 'Mostrar el contingut de la mem�ria global.',
  'Add content to project-level memory.':
    'Afegir contingut a la mem�ria a nivell de projecte.',
  'Add content to global memory.': 'Afegir contingut a la mem�ria global.',
  'Refresh the memory from the source.':
    'Actualitzar la mem�ria des de la font.',
  'Usage: /memory add --project <text to remember>':
    '�s: /memory add --project <text a recordar>',
  'Usage: /memory add --global <text to remember>':
    '�s: /memory add --global <text a recordar>',
  'Attempting to save to project memory: "{{text}}"':
    'Intentant desar a la mem�ria del projecte: "{{text}}"',
  'Attempting to save to global memory: "{{text}}"':
    'Intentant desar a la mem�ria global: "{{text}}"',
  'Current memory content from {{count}} file(s):':
    'Contingut actual de la mem�ria de {{count}} fitxer(s):',
  'Memory is currently empty.': 'La mem�ria �s buida actualment.',
  'Project memory file not found or is currently empty.':
    "El fitxer de mem�ria del projecte no s'ha trobat o �s buit.",
  'Global memory file not found or is currently empty.':
    "El fitxer de mem�ria global no s'ha trobat o �s buit.",
  'Global memory is currently empty.': 'La mem�ria global �s buida actualment.',
  'Global memory content:\n\n---\n{{content}}\n---':
    'Contingut de la mem�ria global:\n\n---\n{{content}}\n---',
  'Project memory content from {{path}}:\n\n---\n{{content}}\n---':
    'Contingut de la mem�ria del projecte des de {{path}}:\n\n---\n{{content}}\n---',
  'Project memory is currently empty.': 'La mem�ria del projecte �s buida.',
  'Refreshing memory from source files...':
    'Actualitzant la mem�ria des dels fitxers font...',
  'Add content to the memory. Use --global for global memory or --project for project memory.':
    'Afegir contingut a la mem�ria. Useu --global per a la mem�ria global o --project per a la mem�ria del projecte.',
  'Usage: /memory add [--global|--project] <text to remember>':
    '�s: /memory add [--global|--project] <text a recordar>',
  'Attempting to save to memory {{scope}}: "{{fact}}"':
    'Intentant desar a la mem�ria {{scope}}: "{{fact}}"',
  'Open auto-memory folder': 'Obrir la carpeta de mem�ria autom�tica',
  'Auto-memory: {{status}}': 'Mem�ria autom�tica: {{status}}',
  'Auto-dream: {{status}} � {{lastDream}} � /dream to run':
    'Auto-dream: {{status}} � {{lastDream}} � /dream per executar',
  never: 'mai',
  on: 'activada',
  off: 'desactivada',
  '? dreaming': '? somniant',
  'Remove matching entries from managed auto-memory.':
    'Eliminar les entrades coincidents de la mem�ria autom�tica gestionada.',
  'Usage: /forget <memory text to remove>':
    '�s: /forget <text de mem�ria a eliminar>',
  'No managed auto-memory entries matched: {{query}}':
    'Cap entrada de mem�ria autom�tica gestionada coincideix: {{query}}',
  'Show managed auto-memory status.':
    "Mostrar l'estat de la mem�ria autom�tica gestionada.",
  'Run managed auto-memory extraction for the current session.':
    "Executar l'extracci� de mem�ria autom�tica gestionada per a la sessi� actual.",
  'Managed auto-memory root: {{root}}':
    'Arrel de la mem�ria autom�tica gestionada: {{root}}',
  'Managed auto-memory topics:': 'Temes de la mem�ria autom�tica gestionada:',
  'No extraction cursor found yet.':
    "Encara no s'ha trobat cap cursor d'extracci�.",
  'Cursor: session={{sessionId}}, offset={{offset}}, updated={{updatedAt}}':
    'Cursor: session={{sessionId}}, offset={{offset}}, updated={{updatedAt}}',
  'No chat client available to extract memory.':
    'No hi ha cap client de xat disponible per extreure mem�ria.',
  'Managed auto-memory extraction is already running.':
    "L'extracci� de mem�ria autom�tica gestionada ja s'est� executant.",
  'Managed auto-memory extraction found no new durable memories.':
    "L'extracci� de mem�ria autom�tica gestionada no ha trobat noves mem�ries durables.",
  'Consolidate managed auto-memory topic files.':
    'Consolidar els fitxers de temes de mem�ria autom�tica gestionada.',
  'Managed auto-memory dream found nothing to improve.':
    "L'auto-dream de mem�ria gestionada no ha trobat res a millorar.",
  'Deduplicated entries: {{count}}': 'Entrades desduplicades: {{count}}',
  'Save a durable memory using the save_memory tool.':
    "Desar una mem�ria durable usant l'eina save_memory.",
  'Usage: /remember [--global|--project] <text to remember>':
    '�s: /remember [--global|--project] <text a recordar>',

  // ============================================================================
  // Ordres - MCP
  // ============================================================================
  'Authenticate with an OAuth-enabled MCP server':
    'Autenticar-se amb un servidor MCP amb OAuth',
  'List configured MCP servers and tools':
    'Llistar els servidors MCP configurats i les seves eines',
  'Restarts MCP servers.': 'Reinicia els servidors MCP.',
  'Open MCP management dialog': 'Obrir el di�leg de gesti� MCP',
  'Could not retrieve tool registry.':
    "No s'ha pogut recuperar el registre d'eines.",
  'No MCP servers configured with OAuth authentication.':
    'No hi ha servidors MCP configurats amb autenticaci� OAuth.',
  'MCP servers with OAuth authentication:':
    'Servidors MCP amb autenticaci� OAuth:',
  'Use /mcp auth <server-name> to authenticate.':
    'Useu /mcp auth <nom-del-servidor> per autenticar-vos.',
  "MCP server '{{name}}' not found.":
    "El servidor MCP '{{name}}' no s'ha trobat.",
  "Successfully authenticated and refreshed tools for '{{name}}'.":
    "S'ha autenticat correctament i s'han actualitzat les eines per a '{{name}}'.",
  "Failed to authenticate with MCP server '{{name}}': {{error}}":
    "Error en autenticar-se amb el servidor MCP '{{name}}': {{error}}",
  "Re-discovering tools from '{{name}}'...":
    "Redescobrint les eines de '{{name}}'...",
  "Discovered {{count}} tool(s) from '{{name}}'.":
    "S'han descobert {{count}} eina(es) de '{{name}}'.",
  'Authentication complete. Returning to server details...':
    'Autenticaci� completada. Tornant als detalls del servidor...',
  'Authentication successful.': 'Autenticaci� correcta.',
  'If the browser does not open, copy and paste this URL into your browser:':
    "Si el navegador no s'obre, copieu i enganxeu aquesta URL al vostre navegador:",
  'Make sure to copy the COMPLETE URL - it may wrap across multiple lines.':
    'Assegureu-vos de copiar la URL COMPLETA - pot ocupar m�ltiples l�nies.',

  // ============================================================================
  // Di�leg de gesti� MCP
  // ============================================================================
  'Manage MCP servers': 'Gestionar els servidors MCP',
  'Server Detail': 'Detalls del servidor',
  'Disable Server': 'Desactivar el servidor',
  Tools: 'Eines',
  'Tool Detail': "Detalls de l'eina",
  'MCP Management': 'Gesti� MCP',
  'Loading...': 'Carregant...',
  'Unknown step': 'Pas desconegut',
  'Esc to back': 'Esc per tornar',
  '?? to navigate � Enter to select � Esc to close':
    '?? per navegar � Retorn per seleccionar � Esc per tancar',
  '?? to navigate � Enter to select � Esc to back':
    '?? per navegar � Retorn per seleccionar � Esc per tornar',
  '?? to navigate � Enter to confirm � Esc to back':
    '?? per navegar � Retorn per confirmar � Esc per tornar',
  'User Settings (global)': "Configuraci� d'usuari (global)",
  'Workspace Settings (project-specific)':
    "Configuraci� de l'espai de treball (espec�fica del projecte)",
  'Disable server:': 'Desactivar el servidor:',
  'Select where to add the server to the exclude list:':
    "Seleccioneu on afegir el servidor a la llista d'exclusi�:",
  'Press Enter to confirm, Esc to cancel':
    'Premeu Retorn per confirmar, Esc per cancel�lar',
  'View tools': 'Veure eines',
  Reconnect: 'Reconnectar',
  Enable: 'Activar',
  Disable: 'Desactivar',
  Authenticate: 'Autenticar',
  'Re-authenticate': 'Tornar a autenticar',
  'Clear Authentication': "Esborrar l'autenticaci�",
  'Server:': 'Servidor:',
  'Command:': 'Ordre:',
  'Working Directory:': 'Directori de treball:',
  'Capabilities:': 'Capacitats:',
  'No server selected': 'Cap servidor seleccionat',
  prompts: 'missatges',
  '(disabled)': '(desactivat)',
  'Error:': 'Error:',
  tool: 'eina',
  tools: 'eines',
  connected: 'connectat',
  connecting: 'connectant',
  disconnected: 'desconnectat',
  'User MCPs': "MCPs de l'usuari",
  'Project MCPs': 'MCPs del projecte',
  'Extension MCPs': 'MCPs de les extensions',
  server: 'servidor',
  servers: 'servidors',
  'Add MCP servers to your settings to get started.':
    'Afegiu servidors MCP a la configuraci� per comen�ar.',
  'Run hopcode --debug to see error logs':
    "Executeu hopcode --debug per veure els registres d'errors",
  'OAuth Authentication': 'Autenticaci� OAuth',
  'Press Enter to start authentication, Esc to go back':
    "Premeu Retorn per iniciar l'autenticaci�, Esc per tornar enrere",
  'Authenticating... Please complete the login in your browser.':
    "Autenticant... Completeu l'inici de sessi� al vostre navegador.",
  'Press c to copy the authorization URL to your clipboard.':
    "Premeu c per copiar la URL d'autoritzaci� al porta-retalls.",
  'Copy request sent to your terminal. If paste is empty, copy the URL above manually.':
    'Sol�licitud de c�pia enviada al vostre terminal. Si el que enganxeu �s buit, copieu la URL anterior manualment.',
  'Cannot write to terminal � copy the URL above manually.':
    'No es pot escriure al terminal � copieu la URL anterior manualment.',
  'Press Enter or Esc to go back': 'Premeu Retorn o Esc per tornar enrere',
  'No tools available for this server.':
    'No hi ha eines disponibles per a aquest servidor.',
  destructive: 'destructiu',
  'read-only': 'nom�s lectura',
  'open-world': 'm�n obert',
  idempotent: 'idempotent',
  'Tools for {{name}}': 'Eines per a {{name}}',
  'Tools for {{serverName}}': 'Eines per a {{serverName}}',
  '{{current}}/{{total}}': '{{current}}/{{total}}',
  required: 'obligatori',
  Type: 'Tipus',
  Enum: 'Enumeraci�',
  Parameters: 'Par�metres',
  'No tool selected': 'Cap eina seleccionada',
  Annotations: 'Anotacions',
  Title: 'T�tol',
  'Read Only': 'Nom�s lectura',
  Destructive: 'Destructiu',
  Idempotent: 'Idempotent',
  'Open World': 'M�n obert',
  Server: 'Servidor',
  '{{count}} invalid tools': '{{count}} eines no v�lides',
  invalid: 'no v�lid',
  'invalid: {{reason}}': 'no v�lid: {{reason}}',
  'missing name': 'nom absent',
  'missing description': 'descripci� absent',
  '(unnamed)': '(sense nom)',
  'Warning: This tool cannot be called by the LLM':
    'Advert�ncia: el model no pot cridar aquesta eina',
  Reason: 'Motiu',
  'Tools must have both name and description to be used by the LLM.':
    'Les eines han de tenir nom i descripci� per poder ser usades pel model.',

  // ============================================================================
  // Ordres - Xat
  // ============================================================================
  'Manage conversation history.': "Gestionar l'historial de la conversa.",
  'List saved conversation checkpoints':
    'Llistar els punts de control desats de la conversa',
  'No saved conversation checkpoints found.':
    "No s'han trobat punts de control de conversa desats.",
  'List of saved conversations:': 'Llista de converses desades:',
  'Note: Newest last, oldest first':
    'Nota: Les m�s recents al final, les m�s antigues al principi',
  'Save the current conversation as a checkpoint. Usage: /chat save <tag>':
    'Desar la conversa actual com a punt de control. �s: /chat save <etiqueta>',
  'Missing tag. Usage: /chat save <tag>':
    'Etiqueta absent. �s: /chat save <etiqueta>',
  'Delete a conversation checkpoint. Usage: /chat delete <tag>':
    'Eliminar un punt de control de conversa. �s: /chat delete <etiqueta>',
  'Missing tag. Usage: /chat delete <tag>':
    'Etiqueta absent. �s: /chat delete <etiqueta>',
  "Conversation checkpoint '{{tag}}' has been deleted.":
    "El punt de control de conversa '{{tag}}' s'ha eliminat.",
  "Error: No checkpoint found with tag '{{tag}}'.":
    "Error: No s'ha trobat cap punt de control amb l'etiqueta '{{tag}}'.",
  'Resume a conversation from a checkpoint. Usage: /chat resume <tag>':
    "Reprendre una conversa des d'un punt de control. �s: /chat resume <etiqueta>",
  'Missing tag. Usage: /chat resume <tag>':
    'Etiqueta absent. �s: /chat resume <etiqueta>',
  'No saved checkpoint found with tag: {{tag}}.':
    "No s'ha trobat cap punt de control desat amb l'etiqueta: {{tag}}.",
  'A checkpoint with the tag {{tag}} already exists. Do you want to overwrite it?':
    "Ja existeix un punt de control amb l'etiqueta {{tag}}. Voleu sobreescriure'l?",
  'No chat client available to save conversation.':
    'No hi ha cap client de xat disponible per desar la conversa.',
  'Conversation checkpoint saved with tag: {{tag}}.':
    "Punt de control de conversa desat amb l'etiqueta: {{tag}}.",
  'No conversation found to save.': "No s'ha trobat cap conversa per desar.",
  'No chat client available to share conversation.':
    'No hi ha cap client de xat disponible per compartir la conversa.',
  'Invalid file format. Only .md and .json are supported.':
    'Format de fitxer no v�lid. Nom�s es suporten .md i .json.',
  'Error sharing conversation: {{error}}':
    'Error en compartir la conversa: {{error}}',
  'Conversation shared to {{filePath}}': 'Conversa compartida a {{filePath}}',
  'No conversation found to share.':
    "No s'ha trobat cap conversa per compartir.",
  'Share the current conversation to a markdown or json file. Usage: /chat share <file>':
    'Compartir la conversa actual a un fitxer markdown o json. �s: /chat share <fitxer>',

  // ============================================================================
  // Ordres - Resum
  // ============================================================================
  'Generate a project summary and save it to .hopcode/PROJECT_SUMMARY.md':
    'Generar un resum del projecte i desar-lo a .hopcode/PROJECT_SUMMARY.md',
  'No chat client available to generate summary.':
    'No hi ha cap client de xat disponible per generar el resum.',
  'Already generating summary, wait for previous request to complete':
    "Ja s'est� generant el resum, espereu que acabi la sol�licitud anterior",
  'No conversation found to summarize.':
    "No s'ha trobat cap conversa per resumir.",
  'Failed to generate project context summary: {{error}}':
    'Error en generar el resum del context del projecte: {{error}}',
  'Saved project summary to {{filePathForDisplay}}.':
    'Resum del projecte desat a {{filePathForDisplay}}.',
  'Saving project summary...': 'Desant el resum del projecte...',
  'Generating project summary...': 'Generant el resum del projecte...',
  'Failed to generate summary - no text content received from LLM response':
    "Error en generar el resum - no s'ha rebut contingut de text de la resposta del model",

  // ============================================================================
  // Ordres - Model
  // ============================================================================
  'Switch the model for this session (--fast for suggestion model, [model-id] to switch immediately).':
    'Canviar el model per a aquesta sessió (--fast per al model de suggeriments)',
  'Set a lighter model for prompt suggestions and speculative execution':
    'Establir un model m�s lleuger per a suggeriments de missatges i execuci� especulativa',
  'Content generator configuration not available.':
    'Configuraci� del generador de contingut no disponible.',
  'Authentication type not available.': "Tipus d'autenticaci� no disponible.",
  'No models available for the current authentication type ({{authType}}).':
    "No hi ha models disponibles per al tipus d'autenticació actual ({{authType}}).",
  // Needs translation
  ' (not in model registry)': ' (not in model registry)',

  // ============================================================================
  // Ordres - Netejar
  // ============================================================================
  'Starting a new session, resetting chat, and clearing terminal.':
    'Iniciant una nova sessi�, restablint el xat i netejant el terminal.',
  'Starting a new session and clearing.':
    'Iniciant una nova sessi� i netejant.',

  // ============================================================================
  // Ordres - Comprimir
  // ============================================================================
  'Already compressing, wait for previous request to complete':
    "Ja s'est� comprimint, espereu que acabi la sol�licitud anterior",
  'Failed to compress chat history.': "Error en comprimir l'historial del xat.",
  'Failed to compress chat history: {{error}}':
    "Error en comprimir l'historial del xat: {{error}}",
  'Compressing chat history': "Comprimint l'historial del xat",
  'Chat history compressed from {{originalTokens}} to {{newTokens}} tokens.':
    "L'historial del xat s'ha comprimit de {{originalTokens}} a {{newTokens}} tokens.",
  'Compression was not beneficial for this history size.':
    "La compressi� no ha estat beneficiosa per a aquesta mida d'historial.",
  'Chat history compression did not reduce size. This may indicate issues with the compression prompt.':
    "La compressi� de l'historial del xat no ha redu�t la mida. Aix� pot indicar problemes amb el missatge de compressi�.",
  'Could not compress chat history due to a token counting error.':
    "No s'ha pogut comprimir l'historial del xat per un error de recompte de tokens.",
  'Chat history is already compressed.':
    "L'historial del xat ja est� comprimit.",

  // ============================================================================
  // Ordres - Directori
  // ============================================================================
  'Configuration is not available.': 'Configuraci� no disponible.',
  'Please provide at least one path to add.':
    'Proporcioneu almenys un cam� per afegir.',
  'The /directory add command is not supported in restrictive sandbox profiles. Please use --include-directories when starting the session instead.':
    "L'ordre /directory add no �s compatible en perfils d'entorn a�llat restrictius. En el seu lloc, useu --include-directories en iniciar la sessi�.",
  "Error adding '{{path}}': {{error}}": "Error en afegir '{{path}}': {{error}}",
  'Successfully added HOPCODE.md files from the following directories if there are:\n- {{directories}}':
    "S'han afegit correctament els fitxers HOPCODE.md dels directoris seg�ents si n'hi ha:\n- {{directories}}",
  'Error refreshing memory: {{error}}':
    'Error en actualitzar la mem�ria: {{error}}',
  'Successfully added directories:\n- {{directories}}':
    "S'han afegit correctament els directoris:\n- {{directories}}",
  'Current workspace directories:\n{{directories}}':
    "Directoris actuals de l'espai de treball:\n{{directories}}",

  // ============================================================================
  // Ordres - Documentaci�
  // ============================================================================
  'Please open the following URL in your browser to view the documentation:\n{{url}}':
    'Obriu la URL seg�ent al vostre navegador per veure la documentaci�:\n{{url}}',
  'Opening documentation in your browser: {{url}}':
    'Obrint la documentaci� al vostre navegador: {{url}}',

  // ============================================================================
  // Di�legs - Confirmaci� d'eines
  // ============================================================================
  'Do you want to proceed?': 'Voleu continuar?',
  'Yes, allow once': 'S�, permetre una vegada',
  'Allow always': 'Permetre sempre',
  Yes: 'S�',
  No: 'No',
  'No (esc)': 'No (esc)',
  'Yes, allow always for this session':
    'S�, permetre sempre per a aquesta sessi�',
  'Modify in progress:': 'Modificaci� en curs:',
  'Save and close external editor to continue':
    "Deseu i tanqueu l'editor extern per continuar",
  'Apply this change?': 'Aplicar aquest canvi?',
  'Yes, allow always': 'S�, permetre sempre',
  'Modify with external editor': 'Modificar amb editor extern',
  'No, suggest changes (esc)': 'No, suggerir canvis (esc)',
  "Allow execution of: '{{command}}'?":
    "Permetre l'execuci� de: '{{command}}'?",
  'Yes, allow always ...': 'S�, permetre sempre...',
  'Always allow in this project': 'Permetre sempre en aquest projecte',
  'Always allow {{action}} in this project':
    'Permetre sempre {{action}} en aquest projecte',
  'Always allow for this user': 'Permetre sempre per a aquest usuari',
  'Always allow {{action}} for this user':
    'Permetre sempre {{action}} per a aquest usuari',
  'Yes, restore previous mode ({{mode}})':
    'S�, restaurar el mode anterior ({{mode}})',
  'Yes, and auto-accept edits': 'S�, i acceptar els canvis autom�ticament',
  'Yes, and manually approve edits': 'S�, i aprovar els canvis manualment',
  'No, keep planning (esc)': 'No, seguir planificant (esc)',
  'URLs to fetch:': 'URLs a recuperar:',
  'MCP Server: {{server}}': 'Servidor MCP: {{server}}',
  'Tool: {{tool}}': 'Eina: {{tool}}',
  'Allow execution of MCP tool "{{tool}}" from server "{{server}}"?':
    'Permetre l\'execuci� de l\'eina MCP "{{tool}}" del servidor "{{server}}"?',
  'Yes, always allow tool "{{tool}}" from server "{{server}}"':
    'S�, permetre sempre l\'eina "{{tool}}" del servidor "{{server}}"',
  'Yes, always allow all tools from server "{{server}}"':
    'S�, permetre sempre totes les eines del servidor "{{server}}"',

  // ============================================================================
  // Di�legs - Confirmaci� de shell
  // ============================================================================
  'Shell Command Execution': "Execuci� d'ordres shell",
  'A custom command wants to run the following shell commands:':
    'Una ordre personalitzada vol executar les ordres shell seg�ents:',

  // ============================================================================
  // Di�legs - Quota Pro
  // ============================================================================
  'Pro quota limit reached for {{model}}.':
    "S'ha assolit el l�mit de quota Pro per a {{model}}.",
  'Change auth (executes the /auth command)':
    "Canviar autenticaci� (executa l'ordre /auth)",
  'Continue with {{model}}': 'Continuar amb {{model}}',

  // ============================================================================
  // Di�legs - Benvinguda
  // ============================================================================
  'Current Plan:': 'Pla actual:',
  'Progress: {{done}}/{{total}} tasks completed':
    'Progr�s: {{done}}/{{total}} tasques completades',
  ', {{inProgress}} in progress': ', {{inProgress}} en curs',
  'Pending Tasks:': 'Tasques pendents:',
  'What would you like to do?': 'Qu� voleu fer?',
  'Choose how to proceed with your session:':
    'Trieu com voleu continuar la vostra sessi�:',
  'Start new chat session': 'Iniciar una nova sessi� de xat',
  'Continue previous conversation': 'Continuar la conversa anterior',
  '?? Welcome back! (Last updated: {{timeAgo}})':
    '?? Benvingut de nou! (Darrera actualitzaci�: {{timeAgo}})',
  '?? Overall Goal:': '?? Objectiu general:',

  // ============================================================================
  // Di�legs - Autenticaci�
  // ============================================================================
  'Get started': 'Comencem',
  'Select Authentication Method': "Seleccioneu el m�tode d'autenticaci�",
  'OpenAI API key is required to use OpenAI authentication.':
    "Cal una clau API d'OpenAI per usar l'autenticaci� d'OpenAI.",
  'You must select an auth method to proceed. Press Ctrl+C again to exit.':
    "Cal seleccionar un m�tode d'autenticaci� per continuar. Premeu Ctrl+C de nou per sortir.",
  'Terms of Services and Privacy Notice':
    'Termes de servei i av�s de privacitat',
  'HopCode OAuth': 'Legacy OAuth',
  'Discontinued � switch to Coding Plan or API Key':
    'Descontinuat � canvieu a Coding Plan o clau API',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Run /auth to switch provider.':
    'El nivell gratu�t de Legacy OAuth es va descontinuar el 15-04-2026. Executeu /auth per canviar de prove�dor.',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Please select Coding Plan or API Key instead.':
    'El nivell gratu�t de Legacy OAuth es va descontinuar el 15-04-2026. Seleccioneu Coding Plan o clau API en el seu lloc.',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Please select a model from another provider or run /auth to switch.':
    "El nivell gratu�t de Legacy OAuth es va descontinuar el 15-04-2026. Seleccioneu un model d'un altre prove�dor o executeu /auth per canviar.",
  '\n? HopCode OAuth free tier was discontinued on 2026-04-15. Please select another option.\n':
    '\n? El nivell gratu�t de Legacy OAuth es va descontinuar el 15-04-2026. Seleccioneu una altra opci�.\n',
  'Paid � Up to 6,000 requests/5 hrs � All Alibaba Cloud Coding Plan Models':
    "De pagament � Fins a 6.000 sol�licituds/5 h � Tots els models del Coding Plan d'Alibaba Cloud",
  'Alibaba Cloud Coding Plan': "Coding Plan d'Alibaba Cloud",
  'Bring your own API key': 'Porteu la vostra pr�pia clau API',
  'API-KEY': 'API-KEY',
  'Use coding plan credentials or your own api-keys/providers.':
    'Useu les credencials del coding plan o les vostres pr�pies claus API/prove�dors.',
  OpenAI: 'OpenAI',
  'Failed to login. Message: {{message}}':
    'Error en iniciar sessi�. Missatge: {{message}}',
  'Authentication is enforced to be {{enforcedType}}, but you are currently using {{currentType}}.':
    "L'autenticaci� ha de ser {{enforcedType}}, per� actualment esteu usant {{currentType}}.",
  'HopCode OAuth authentication timed out. Please try again.':
    "L'autenticaci� Legacy OAuth ha expirat. Torneu-ho a intentar.",
  'HopCode OAuth authentication cancelled.':
    "L'autenticaci� Legacy OAuth s'ha cancel�lat.",
  'HopCode OAuth Authentication': 'Autenticaci� Legacy OAuth',
  'Please visit this URL to authorize:': 'Visiteu aquesta URL per autoritzar:',
  'Or scan the QR code below:': 'O escanegeu el codi QR de sota:',
  'Waiting for authorization': "Esperant l'autoritzaci�",
  'Time remaining:': 'Temps restant:',
  '(Press ESC or CTRL+C to cancel)': '(Premeu ESC o CTRL+C per cancel�lar)',
  'HopCode OAuth Authentication Timeout':
    "Temps d'espera de l'autenticaci� Legacy OAuth esgotat",
  'OAuth token expired (over {{seconds}} seconds). Please select authentication method again.':
    "El token OAuth ha expirat (m�s de {{seconds}} segons). Seleccioneu el m�tode d'autenticaci� de nou.",
  'Press any key to return to authentication type selection.':
    "Premeu qualsevol tecla per tornar a la selecci� del tipus d'autenticaci�.",
  'Waiting for HopCode OAuth authentication...':
    "Esperant l'autenticaci� Legacy OAuth...",
  'Note: Your existing API key in settings.json will not be cleared when using HopCode OAuth. You can switch back to OpenAI authentication later if needed.':
    "Nota: La vostra clau API existent a settings.json no s'esborrar� en usar Legacy OAuth. Podeu tornar a l'autenticaci� d'OpenAI m�s endavant si cal.",
  'Note: Your existing API key will not be cleared when using HopCode OAuth.':
    "Nota: La vostra clau API existent no s'esborrar� en usar Legacy OAuth.",
  'Authentication timed out. Please try again.':
    "L'autenticaci� ha expirat. Torneu-ho a intentar.",
  'Waiting for auth... (Press ESC or CTRL+C to cancel)':
    "Esperant l'autenticaci�... (Premeu ESC o CTRL+C per cancel�lar)",
  'Missing API key for OpenAI-compatible auth. Set settings.security.auth.apiKey, or set the {{envKeyHint}} environment variable.':
    "Manca la clau API per a l'autenticaci� compatible amb OpenAI. Establiu settings.security.auth.apiKey o la variable d'entorn {{envKeyHint}}.",
  '{{envKeyHint}} environment variable not found.':
    "La variable d'entorn {{envKeyHint}} no s'ha trobat.",
  '{{envKeyHint}} environment variable not found. Please set it in your .env file or environment variables.':
    "La variable d'entorn {{envKeyHint}} no s'ha trobat. Establiu-la al fitxer .env o a les variables d'entorn.",
  '{{envKeyHint}} environment variable not found (or set settings.security.auth.apiKey). Please set it in your .env file or environment variables.':
    "La variable d'entorn {{envKeyHint}} no s'ha trobat (o establiu settings.security.auth.apiKey). Establiu-la al fitxer .env o a les variables d'entorn.",
  'Missing API key for OpenAI-compatible auth. Set the {{envKeyHint}} environment variable.':
    "Manca la clau API per a l'autenticaci� compatible amb OpenAI. Establiu la variable d'entorn {{envKeyHint}}.",
  'Anthropic provider missing required baseUrl in modelProviders[].baseUrl.':
    'El prove�dor Anthropic no t� la baseUrl obligat�ria a modelProviders[].baseUrl.',
  'ANTHROPIC_BASE_URL environment variable not found.':
    "La variable d'entorn ANTHROPIC_BASE_URL no s'ha trobat.",
  'Invalid auth method selected.':
    "S'ha seleccionat un m�tode d'autenticaci� no v�lid.",
  'Failed to authenticate. Message: {{message}}':
    'Error en autenticar-se. Missatge: {{message}}',
  'Authenticated successfully with {{authType}} credentials.':
    "S'ha autenticat correctament amb les credencials {{authType}}.",
  'Invalid HOPCODE_DEFAULT_AUTH_TYPE value: "{{value}}". Valid values are: {{validValues}}':
    'Valor de HOPCODE_DEFAULT_AUTH_TYPE no v�lid: "{{value}}". Els valors v�lids s�n: {{validValues}}',
  'OpenAI Configuration Required': "Configuraci� d'OpenAI necess�ria",
  'Please enter your OpenAI configuration. You can get an API key from':
    "Introdu�u la vostra configuraci� d'OpenAI. Podeu obtenir una clau API de",
  'API Key:': 'Clau API:',
  'Invalid credentials: {{errorMessage}}':
    'Credencials no v�lides: {{errorMessage}}',
  'Failed to validate credentials': 'Error en validar les credencials',
  'Press Enter to continue, Tab/?? to navigate, Esc to cancel':
    'Premeu Retorn per continuar, Tab/?? per navegar, Esc per cancel�lar',

  // ============================================================================
  // Di�legs - Model
  // ============================================================================
  'Select Model': 'Seleccioneu el model',
  '(Press Esc to close)': '(Premeu Esc per tancar)',
  'Current (effective) configuration': 'Configuraci� actual (efectiva)',
  AuthType: "Tipus d'autenticaci�",
  'API Key': 'Clau API',
  unset: 'no establert',
  '(default)': '(per defecte)',
  '(set)': '(establert)',
  '(not set)': '(no establert)',
  Modality: 'Modalitat',
  'Context Window': 'Fin. de context',
  text: 'text',
  'text-only': 'nom�s text',
  image: 'imatge',
  pdf: 'pdf',
  audio: '�udio',
  video: 'v�deo',
  'not set': 'no establert',
  none: 'cap',
  unknown: 'desconegut',
  "Failed to switch model to '{{modelId}}'.\n\n{{error}}":
    "Error en canviar al model '{{modelId}}'.\n\n{{error}}",
  'Qwen 3.6 Plus � efficient hybrid model with leading coding performance':
    'Qwen 3.6 Plus � model h�brid eficient amb un rendiment de codificaci� l�der',
  'The latest HopCode Vision model from Alibaba Cloud ModelStudio (version: qwen3-vl-plus-2025-09-23)':
    "L'�ltim model de visi� Qwen d'Alibaba Cloud ModelStudio (versi�: qwen3-vl-plus-2025-09-23)",

  // ============================================================================
  // Di�legs - Permisos
  // ============================================================================
  'Manage folder trust settings':
    'Gestionar la configuraci� de confian�a de carpetes',
  'Manage permission rules': 'Gestionar les regles de permisos',
  Allow: 'Permetre',
  Ask: 'Preguntar',
  Deny: 'Denegar',
  Workspace: 'Espai de treball',
  "HopCode won't ask before using allowed tools.":
    "HopCode no preguntar� abans d'usar les eines permeses.",
  'HopCode will ask before using these tools.':
    "HopCode preguntar� abans d'usar aquestes eines.",
  'HopCode is not allowed to use denied tools.':
    'HopCode no t� perm�s per usar les eines denegades.',
  'Manage trusted directories for this workspace.':
    "Gestionar els directoris de confian�a d'aquest espai de treball.",
  'Any use of the {{tool}} tool': "Qualsevol �s de l'eina {{tool}}",
  "{{tool}} commands matching '{{pattern}}'":
    "Ordres de {{tool}} que coincideixen amb '{{pattern}}'",
  'From user settings': "Des de la configuraci� d'usuari",
  'From project settings': 'Des de la configuraci� del projecte',
  'From session': 'Des de la sessi�',
  'Project settings (local)': 'Configuraci� del projecte (local)',
  'Saved in .hopcode/settings.local.json':
    'Desat a .hopcode/settings.local.json',
  'Project settings': 'Configuraci� del projecte',
  'Checked in at .hopcode/settings.json': 'Registrat a .hopcode/settings.json',
  'User settings': "Configuraci� d'usuari",
  'Saved in at ~/.hopcode/settings.json': 'Desat a ~/.hopcode/settings.json',
  'Add a new rule�': 'Afegir una nova regla�',
  'Add {{type}} permission rule': 'Afegir una regla de perm�s {{type}}',
  'Permission rules are a tool name, optionally followed by a specifier in parentheses.':
    "Les regles de permisos s�n un nom d'eina, seguit opcionalment d'un especificador entre par�ntesis.",
  'e.g.,': 'p. ex.,',
  or: 'o',
  'Enter permission rule�': 'Introdu�u la regla de perm�s�',
  'Enter to submit � Esc to cancel': 'Retorn per enviar � Esc per cancel�lar',
  'Where should this rule be saved?': "On s'ha de desar aquesta regla?",
  'Enter to confirm � Esc to cancel':
    'Retorn per confirmar � Esc per cancel�lar',
  'Delete {{type}} rule?': 'Eliminar la regla {{type}}?',
  'Are you sure you want to delete this permission rule?':
    'Esteu segur que voleu eliminar aquesta regla de permisos?',
  'Permissions:': 'Permisos:',
  '(?/? or tab to cycle)': '(?/? o tab per canviar)',
  'Press ?? to navigate � Enter to select � Type to search � Esc to cancel':
    'Premeu ?? per navegar � Retorn per seleccionar � Escriviu per cercar � Esc per cancel�lar',
  'Search�': 'Cercar�',
  'Use /trust to manage folder trust settings for this workspace.':
    "Useu /trust per gestionar la configuraci� de confian�a de carpetes d'aquest espai de treball.",
  'Add directory�': 'Afegir directori�',
  'Add directory to workspace': "Afegir directori a l'espai de treball",
  'HopCode can read files in the workspace, and make edits when auto-accept edits is on.':
    "HopCode pot llegir fitxers a l'espai de treball i fer canvis quan l'acceptaci� autom�tica de canvis est� activada.",
  'HopCode will be able to read files in this directory and make edits when auto-accept edits is on.':
    "HopCode podr� llegir fitxers en aquest directori i fer canvis quan l'acceptaci� autom�tica de canvis est� activada.",
  'Enter the path to the directory:': 'Introdu�u el cam� del directori:',
  'Enter directory path�': 'Introdu�u el cam� del directori�',
  'Tab to complete � Enter to add � Esc to cancel':
    'Tab per completar � Retorn per afegir � Esc per cancel�lar',
  'Remove directory?': 'Eliminar el directori?',
  'Are you sure you want to remove this directory from the workspace?':
    "Esteu segur que voleu eliminar aquest directori de l'espai de treball?",
  '  (Original working directory)': '  (Directori de treball original)',
  '  (from settings)': '  (des de la configuraci�)',
  'Directory does not exist.': 'El directori no existeix.',
  'Path is not a directory.': 'El cam� no �s un directori.',
  'This directory is already in the workspace.':
    "Aquest directori ja �s a l'espai de treball.",
  'Already covered by existing directory: {{dir}}':
    'Ja cobert per un directori existent: {{dir}}',

  // ============================================================================
  // Barra d'estat
  // ============================================================================
  'Using:': 'En �s:',
  '{{count}} open file': '{{count}} fitxer obert',
  '{{count}} open files': '{{count}} fitxers oberts',
  '(ctrl+g to view)': '(ctrl+g per veure)',
  '{{count}} {{name}} file': '{{count}} fitxer {{name}}',
  '{{count}} {{name}} files': '{{count}} fitxers {{name}}',
  '{{count}} MCP server': '{{count}} servidor MCP',
  '{{count}} MCP servers': '{{count}} servidors MCP',
  '{{count}} Blocked': '{{count}} bloquejats',
  '(ctrl+t to view)': '(ctrl+t per veure)',
  '(ctrl+t to toggle)': '(ctrl+t per canviar)',
  'Press Ctrl+C again to exit.': 'Premeu Ctrl+C de nou per sortir.',
  'Press Ctrl+D again to exit.': 'Premeu Ctrl+D de nou per sortir.',
  'Press Esc again to clear.': 'Premeu Esc de nou per esborrar.',
  'Press ? to edit queued messages': 'Premeu ? per editar els missatges en cua',

  // ============================================================================
  // Estat MCP
  // ============================================================================
  'No MCP servers configured.': 'No hi ha servidors MCP configurats.',
  '? MCP servers are starting up ({{count}} initializing)...':
    "? Els servidors MCP s'estan iniciant ({{count}} inicialitzant)...",
  'Note: First startup may take longer. Tool availability will update automatically.':
    "Nota: El primer inici pot tardar m�s. La disponibilitat de les eines s'actualitzar� autom�ticament.",
  'Configured MCP servers:': 'Servidors MCP configurats:',
  Ready: 'Preparat',
  'Starting... (first startup may take longer)':
    'Iniciant... (el primer inici pot tardar m�s)',
  Disconnected: 'Desconnectat',
  '{{count}} tool': '{{count}} eina',
  '{{count}} tools': '{{count}} eines',
  '{{count}} prompt': '{{count}} missatge',
  '{{count}} prompts': '{{count}} missatges',
  '(from {{extensionName}})': '(de {{extensionName}})',
  OAuth: 'OAuth',
  'OAuth expired': 'OAuth expirat',
  'OAuth not authenticated': 'OAuth no autenticat',
  'tools and prompts will appear when ready':
    'les eines i els missatges apareixeran quan estiguin a punt',
  '{{count}} tools cached': '{{count}} eines en mem�ria cau',
  'Tools:': 'Eines:',
  'Parameters:': 'Par�metres:',
  'Prompts:': 'Missatges:',
  Blocked: 'Bloquejat',
  '?? Tips:': '?? Consells:',
  Use: 'Useu',
  'to show server and tool descriptions':
    'per mostrar les descripcions del servidor i de les eines',
  'to show tool parameter schemas':
    'per mostrar els esquemes de par�metres de les eines',
  'to hide descriptions': 'per amagar les descripcions',
  'to authenticate with OAuth-enabled servers':
    'per autenticar-vos amb servidors OAuth',
  Press: 'Premeu',
  'to toggle tool descriptions on/off':
    'per activar/desactivar les descripcions de les eines',
  "Starting OAuth authentication for MCP server '{{name}}'...":
    "Iniciant l'autenticaci� OAuth per al servidor MCP '{{name}}'...",
  'Restarting MCP servers...': 'Reiniciant els servidors MCP...',

  // ============================================================================
  // Consells d'inici
  // ============================================================================
  'Tips:': 'Consells:',
  'Use /compress when the conversation gets long to summarize history and free up context.':
    "Useu /compress quan la conversa sigui llarga per resumir l'historial i alliberar context.",
  'Start a fresh idea with /clear or /new; the previous session stays available in history.':
    "Comenceu una idea nova amb /clear o /new; la sessi� anterior segueix disponible a l'historial.",
  'Use /bug to submit issues to the maintainers when something goes off.':
    'Useu /bug per enviar incid�ncies als mantenidors quan alguna cosa vagi malament.',
  'Switch auth type quickly with /auth.':
    "Canvieu r�pidament el tipus d'autenticaci� amb /auth.",
  'You can run any shell commands from HopCode using ! (e.g. !ls).':
    'Podeu executar qualsevol ordre shell des de HopCode usant ! (p. ex. !ls).',
  'Type / to open the command popup; Tab autocompletes slash commands and saved prompts.':
    "Escriviu / per obrir el men� emergent d'ordres; Tab completa autom�ticament les ordres de barra i els missatges desats.",
  'You can resume a previous conversation by running hopcode --continue or hopcode --resume.':
    'Podeu reprendre una conversa anterior executant hopcode --continue o hopcode --resume.',
  'You can switch permission mode quickly with Shift+Tab or /approval-mode.':
    'Podeu canviar r�pidament el mode de permisos amb Maj+Tab o /approval-mode.',
  'You can switch permission mode quickly with Tab or /approval-mode.':
    'Podeu canviar r�pidament el mode de permisos amb Tab o /approval-mode.',
  'Try /insight to generate personalized insights from your chat history.':
    'Proveu /insight per generar idees personalitzades a partir del vostre historial de xat.',
  'Press Ctrl+O to toggle compact mode � hide tool output and thinking for a cleaner view.':
    'Premeu Ctrl+O per canviar el mode compacte � amagueu la sortida de les eines i el pensament per a una vista m�s neta.',
  'Add a HOPCODE.md file to give HopCode persistent project context.':
    'Afegiu un fitxer HOPCODE.md per donar a HopCode un context persistent del projecte.',
  'Use /btw to ask a quick side question without disrupting the conversation.':
    'Useu /btw per fer una pregunta r�pida sense interrompre la conversa.',
  'Context is almost full! Run /compress now or start /new to continue.':
    'El context gaireb� �s ple! Executeu /compress ara o inicieu /new per continuar.',
  'Context is getting full. Use /compress to free up space.':
    "El context s'omple. Useu /compress per alliberar espai.",
  'Long conversation? /compress summarizes history to free context.':
    "Conversa llarga? /compress resumeix l'historial per alliberar context.",

  // ============================================================================
  // Pantalla de sortida / Estad�stiques
  // ============================================================================
  'Agent powering down. Goodbye!': "L'agent s'apaga. Fins aviat!",
  'To continue this session, run': 'Per continuar aquesta sessi�, executeu',
  'Interaction Summary': 'Resum de la interacci�',
  'Session ID:': 'ID de sessi�:',
  'Tool Calls:': 'Crides a eines:',
  'Success Rate:': "Taxa d'�xit:",
  'User Agreement:': "Acord de l'usuari:",
  reviewed: 'revisades',
  'Code Changes:': 'Canvis de codi:',
  Performance: 'Rendiment',
  'Wall Time:': 'Temps real:',
  'Agent Active:': 'Agent actiu:',
  'API Time:': "Temps de l'API:",
  'Tool Time:': "Temps d'eines:",
  'Session Stats': 'Estad�stiques de la sessi�',
  'Model Usage': '�s del model',
  Reqs: 'Sol�licituds',
  'Input Tokens': "Tokens d'entrada",
  'Output Tokens': 'Tokens de sortida',
  'Savings Highlight:': 'Estalvis destacats:',
  'of input tokens were served from the cache, reducing costs.':
    "dels tokens d'entrada s'han servit des de la mem�ria cau, reduint els costos.",
  'Tip: For a full token breakdown, run `/stats model`.':
    'Consell: Per a un desglossament complet de tokens, executeu `/stats model`.',
  'Model Stats For Nerds': 'Estad�stiques del model per a nerds',
  'Tool Stats For Nerds': "Estad�stiques d'eines per a nerds",
  Metric: 'M�trica',
  API: 'API',
  Requests: 'Sol�licituds',
  Errors: 'Errors',
  'Avg Latency': 'Lat�ncia mitjana',
  Tokens: 'Tokens',
  Total: 'Total',
  Prompt: 'Missatge',
  Cached: 'En mem�ria cau',
  Thoughts: 'Pensaments',
  Tool: 'Eina',
  Output: 'Sortida',
  'No API calls have been made in this session.':
    "No s'ha realitzat cap crida a l'API en aquesta sessi�.",
  'Tool Name': "Nom de l'eina",
  Calls: 'Crides',
  'Success Rate': "Taxa d'�xit",
  'Avg Duration': 'Durada mitjana',
  'User Decision Summary': "Resum de decisions de l'usuari",
  'Total Reviewed Suggestions:': 'Total de suggeriments revisats:',
  ' � Accepted:': ' � Acceptats:',
  ' � Rejected:': ' � Rebutjats:',
  ' � Modified:': ' � Modificats:',
  ' Overall Agreement Rate:': " Taxa d'acord global:",
  'No tool calls have been made in this session.':
    "No s'ha realitzat cap crida a eines en aquesta sessi�.",
  'Session start time is unavailable, cannot calculate stats.':
    "L'hora d'inici de la sessi� no est� disponible, no es poden calcular les estad�stiques.",

  // ============================================================================
  // Migraci� del format d'ordres
  // ============================================================================
  'Command Format Migration': "Migraci� del format d'ordres",
  'Found {{count}} TOML command file:':
    "S'ha trobat {{count}} fitxer d'ordres TOML:",
  'Found {{count}} TOML command files:':
    "S'han trobat {{count}} fitxers d'ordres TOML:",
  'Current tasks': 'Tasques actuals',
  '... and {{count}} more': '... i {{count}} m�s',
  'The TOML format is deprecated. Would you like to migrate them to Markdown format?':
    'El format TOML �s obsolet. Voleu migrar-los al format Markdown?',
  '(Backups will be created and original files will be preserved)':
    '(Es crearan c�pies de seguretat i els fitxers originals es conservaran)',

  // ============================================================================
  // Frases de c�rrega
  // ============================================================================
  'Waiting for user confirmation...': "Esperant la confirmaci� de l'usuari...",
  '(esc to cancel, {{time}})': '(esc per cancel�lar, {{time}})',

  // ============================================================================
  // Frases de c�rrega enginyoses
  // ============================================================================
  WITTY_LOADING_PHRASES: [
    'Em sento afortunat',
    'Enviant el millor...',
    "Setze jutges d'un jutjat mengen fetge d'un penjat.",
    'Navegant pel fong mucilagin�s...',
    'Consultant els esperits digitals...',
    'Desperta ferro...',
    'Escalfant els h�msters de la IA...',
    'Preguntant a la petxina m�gica...',
    'Generant una r�plica enginyosa...',
    'Polint els algorismes...',
    'No correu la perfecci� (ni el meu codi)...',
    'Preparant bytes frescos...',
    'Comptant electrons...',
    'Activant els processadors cognitius...',
    "Buscant errors de sintaxi a l'univers...",
    "Un moment, optimitzant l'humor...",
    'Barrejant les gr�cies...',
    'Desenredant les xarxes neuronals...',
    'Compilant la brillantor...',
    'Carregant gr�cia.exe...',
    'Invocant el n�vol de saviesa...',
    'Preparant una resposta enginyosa...',
    'Un segon, estic depurant la realitat...',
    'Donant els �ltims cops de...',
    'Afinant les freq��ncies c�smiques...',
    'Elaborant una resposta digna de la vostra paci�ncia...',
    'Compilant els 1 i els 0...',
    'Resolent depend�ncies... i crisis existencials...',
    'Desfragmentant records... tant de RAM com personals...',
    "Reiniciant el m�dul de l'humor...",
    'Emmagatzemant en mem�ria cau el necessari (principalment mems de gats)...',
    'Optimitzant per a velocitat rid�cula',
    'Intercanviant bits... que no ho s�piguen els bytes...',
    'Recollint brossa... torno de seguida...',
    'Assemblant les internets...',
    'Convertint caf� en codi...',
    'Actualitzant la sintaxi de la realitat...',
    'Reconnectant les sinapsis...',
    'Buscant un punt i coma mal posat...',
    'Engreixant els engranatges de la m�quina...',
    'Precalfant els servidors...',
    'Calibrant el condensador de flux...',
    'Activant el motor de improbabilitat...',
    'Canalitzant la For�a...',
    'Alineant les estrelles per a una resposta �ptima...',
    'I tots ho diem...',
    'Carregant la propera gran idea...',
    'Un moment, estic en el meu element...',
    'Preparant-me per impressionar-vos amb brillantor...',
    'Un moment, polint el meu enginy...',
    'Aguanteu, estic creant una obra mestra...',
    "Un moment, depurant l'univers...",
    'Un moment, alineant els p�xels...',
    "Un segon, optimitzant l'humor...",
    'Un moment, afinant els algorismes...',
    'Velocitat de curvatura activada...',
    'Preparant la seg�ent jugada mestre...',
    'No us espanteu...',
    'Seguint el conill blanc...',
    'La veritat �s aqu�... en algun lloc...',
    'Bufant al cartutx...',
    'Carregant... Feu un gir de barril!',
    'Esperant la reaparici�...',
    'Paci�ncia, pensa que Rodalies encara va m�s lent...',
    "El past�s no �s una mentida, simplement s'est� carregant...",
    'Tafanejant la pantalla de creaci� de personatge...',
    'Un moment, trobo el meme adequat...',
    "Prement 'A' per continuar...",
    'Pasturant gats digitals...',
    'Polint els p�xels...',
    'Buscant un acudit per a la pantalla de c�rrega...',
    'Distreu-vos amb aquesta frase enginyosa...',
    'Gaireb� a punt... probablement...',
    'Els nostres h�msters treballen tan r�pid com poden...',
    'Donant un copet al cap a Cloudy...',
    'Fent festes al gat...',
    'Endavant les atxes...',
    'Mai no us deixar� anar, mai no us decebr�...',
    'Tocant el baix...',
    'Vaig a buscar ratafia...',
    'Vaig a tota velocitat, vaig a tota marxa...',
    '�s la vida real? �s sols fantasia?...',
    'Tinc bon pressentiment sobre aix�...',
    'Tocant el tigre...',
    'Investigant els �ltims mems...',
    'Pensant com fer aix� m�s enginy�s...',
    'Hmm... deixeu-me pensar...',
    'Suant la cansalada...',
    'Trient el fetge per la boca...',
    "Posar fil a l'agulla...",
    'Un moment, ho tenim a tocar..',
    'Aix� �s bufar i fer ampolles',
    'Qu� pots fer amb un llapis trencat? Res, no t� punta...',
    'Aplicant manteniment percussiu...',
    "Buscant l'orientaci� correcta de l'USB...",
    'Assegurant que el fum m�gic quedi dins dels cables...',
    'Intentant sortir del Vim...',
    'Girant la roda del h�mster...',
    'Aix� no �s un error, �s una caracter�stica no documentada...',
    'Endavant.',
    'Tornar�... amb una resposta.',
    'El meu altre proc�s �s una TARDIS...',
    'Posant oli als engranatges...',
    'Deixant que els pensaments macerin...',
    'Acabo de recordar on he deixat les claus...',
    "Ponderant l'orbe...",
    'He vist coses que no creur�eu... com un usuari que llegeix els missatges de c�rrega.',
    'Iniciant la mirada pensativa...',
    "Quin �s el berenar preferit d'un computador? Xips micro.",
    'Per qu� els programadors de Java porten ulleres? Perqu� no veuen en C#.',
    'Carregant el l�ser... piu piu!',
    'Dividint per zero... �s broma!',
    'Buscant un supervisor adult... �s a dir, processant.',
    'Fent que faci xup xup.',
    'Emmarcant... perqu� fins i tot les IA necessiten un moment.',
    'Entrella�ant part�cules qu�ntiques per a una resposta m�s r�pida...',
    'Polint el crom... dels algorismes.',
    'No esteu entretinguts? (Hi estem treballant!)',
    'Invocant els follets del codi... per ajudar, �s clar.',
    'Esperant que acabi el so del m�dem de marcaci�...',
    "Recalibrant el mesurament de l'humor.",
    'La meva altra pantalla de c�rrega �s fins i tot m�s divertida.',
    'Estic bastant segur que hi ha un gat caminant per algun teclat...',
    'Millorant... millorant... encara carregant.',
    "No �s un error, �s una caracter�stica... d'aquesta pantalla de c�rrega.",
    'Heu provat apagar-ho i tornar-lo a encendre? (La pantalla de c�rrega, no jo.)',
    'Construint pil� addicionals...',
  ],

  // ============================================================================
  // Entrada de configuraci� d'extensions
  // ============================================================================
  'Enter value...': 'Introdu�u el valor...',
  'Enter sensitive value...': 'Introdu�u el valor sensible...',
  'Press Enter to submit, Escape to cancel':
    'Premeu Retorn per enviar, Esc per cancel�lar',

  // ============================================================================
  // Eina de migraci� d'ordres
  // ============================================================================
  'Markdown file already exists: {{filename}}':
    'El fitxer Markdown ja existeix: {{filename}}',
  'TOML Command Format Deprecation Notice':
    "Av�s d'obsolesc�ncia del format d'ordres TOML",
  'Found {{count}} command file(s) in TOML format:':
    "S'ha(n) trobat {{count}} fitxer(s) d'ordres en format TOML:",
  'The TOML format for commands is being deprecated in favor of Markdown format.':
    "El format TOML per a ordres s'est� fent obsolet en favor del format Markdown.",
  'Markdown format is more readable and easier to edit.':
    "El format Markdown �s m�s llegible i f�cil d'editar.",
  'You can migrate these files automatically using:':
    'Podeu migrar aquests fitxers autom�ticament usant:',
  'Or manually convert each file:': 'O convertiu cada fitxer manualment:',
  'TOML: prompt = "..." / description = "..."':
    'TOML: prompt = "..." / description = "..."',
  'Markdown: YAML frontmatter + content':
    'Markdown: cap�alera YAML + contingut',
  'The migration tool will:': "L'eina de migraci� far�:",
  'Convert TOML files to Markdown': 'Convertir fitxers TOML a Markdown',
  'Create backups of original files':
    'Crear c�pies de seguretat dels fitxers originals',
  'Preserve all command functionality':
    'Preservar tota la funcionalitat de les ordres',
  'TOML format will continue to work for now, but migration is recommended.':
    'El format TOML seguir� funcionant de moment, per� es recomana la migraci�.',

  // ============================================================================
  // Extensions - Ordre d'explorar
  // ============================================================================
  'Open extensions page in your browser':
    "Obrir la p�gina d'extensions al vostre navegador",
  'Unknown extensions source: {{source}}.':
    "Font d'extensions desconeguda: {{source}}.",
  'Would open extensions page in your browser: {{url}} (skipped in test environment)':
    "Obriria la p�gina d'extensions al vostre navegador: {{url}} (om�s en entorn de proves)",
  'View available extensions at {{url}}':
    'Veure les extensions disponibles a {{url}}',
  'Opening extensions page in your browser: {{url}}':
    "Obrint la p�gina d'extensions al vostre navegador: {{url}}",
  'Failed to open browser. Check out the extensions gallery at {{url}}':
    "Error en obrir el navegador. Visiteu la galeria d'extensions a {{url}}",

  // ============================================================================
  // Reintents / L�mit de velocitat
  // ============================================================================
  'Rate limit error: {{reason}}': 'Error de l�mit de velocitat: {{reason}}',
  'Retrying in {{seconds}} seconds� (attempt {{attempt}}/{{maxRetries}})':
    'Reintentant en {{seconds}} segons� (intent {{attempt}}/{{maxRetries}})',
  'Press Ctrl+Y to retry': 'Premeu Ctrl+Y per reintentar',
  'No failed request to retry.':
    'No hi ha cap sol�licitud fallida per reintentar.',
  'to retry last request': "per reintentar l'�ltima sol�licitud",

  // ============================================================================
  // Autenticaci� del Coding Plan
  // ============================================================================
  'API key cannot be empty.': 'La clau API no pot estar buida.',
  'Invalid API key. Coding Plan API keys start with "sk-sp-". Please check.':
    'Clau API no v�lida. Les claus API del Coding Plan comencen per "sk-sp-". Comproveu-la.',
  'You can get your Coding Plan API key here':
    'Podeu obtenir la vostra clau API del Coding Plan aqu�',
  'API key is stored in settings.env. You can migrate it to a .env file for better security.':
    "La clau API s'emmagatzema a settings.env. Podeu migrar-la a un fitxer .env per una millor seguretat.",
  'New model configurations are available for Alibaba Cloud Coding Plan. Update now?':
    "Hi ha noves configuracions de model disponibles per al Coding Plan d'Alibaba Cloud. Actualitzeu ara?",
  'Coding Plan configuration updated successfully. New models are now available.':
    "La configuraci� del Coding Plan s'ha actualitzat correctament. Ara hi ha nous models disponibles.",
  'Coding Plan API key not found. Please re-authenticate with Coding Plan.':
    "No s'ha trobat la clau API del Coding Plan. Torneu a autenticar-vos amb el Coding Plan.",
  'Failed to update Coding Plan configuration: {{message}}':
    'Error en actualitzar la configuraci� del Coding Plan: {{message}}',

  // ============================================================================
  // Configuraci� de clau API personalitzada
  // ============================================================================
  'You can configure your API key and models in settings.json':
    'Podeu configurar la vostra clau API i els models a settings.json',
  'Refer to the documentation for setup instructions':
    'Consulteu la documentaci� per a les instruccions de configuraci�',

  // ============================================================================
  // Di�leg d'autenticaci� - T�tols i etiquetes
  // ============================================================================
  'Coding Plan': 'Coding Plan',
  "Paste your api key of ModelStudio Coding Plan and you're all set!":
    'Enganxeu la vostra clau API del Coding Plan de ModelStudio i ja esteu llest!',
  Custom: 'Personalitzat',
  'More instructions about configuring `modelProviders` manually.':
    'M�s instruccions sobre la configuraci� manual de `modelProviders`.',
  'Select API-KEY configuration mode:':
    'Seleccioneu el mode de configuraci� de la clau API:',
  '(Press Escape to go back)': '(Premeu Esc per tornar enrere)',
  '(Press Enter to submit, Escape to cancel)':
    '(Premeu Retorn per enviar, Esc per cancel�lar)',
  'Select Region for Coding Plan': 'Seleccioneu la regi� per al Coding Plan',
  'Choose based on where your account is registered':
    "Trieu en funci� d'on teniu registrat el compte",
  'Enter Coding Plan API Key': 'Introdu�u la clau API del Coding Plan',

  // ============================================================================
  // Actualitzacions internacionals del Coding Plan
  // ============================================================================
  'New model configurations are available for {{region}}. Update now?':
    'Hi ha noves configuracions de model disponibles per a {{region}}. Actualitzeu ara?',
  '{{region}} configuration updated successfully. Model switched to "{{model}}".':
    'La configuraci� de {{region}} s\'ha actualitzat correctament. El model ha canviat a "{{model}}".',
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json (backed up).':
    "S'ha autenticat correctament amb {{region}}. La clau API i les configuracions del model s'han desat a settings.json (amb c�pia de seguretat).",

  // ============================================================================
  // Component d'�s del context
  // ============================================================================
  'Context Usage': '�s del context',
  '% used': '% usat',
  '% context used': '% del context usat',
  'Context exceeds limit! Use /compress or /clear to reduce.':
    'El context supera el l�mit! Useu /compress o /clear per reduir-lo.',
  'Use /compress or /clear': 'Useu /compress o /clear',
  'No API response yet. Send a message to see actual usage.':
    "Encara no hi ha cap resposta de l'API. Envieu un missatge per veure l'�s real.",
  'Estimated pre-conversation overhead':
    'C�rrega estimada pr�via a la conversa',
  'Context window': 'Finestra de context',
  tokens: 'tokens',
  Used: 'Usat',
  Free: 'Lliure',
  'Autocompact buffer': 'Mem�ria interm�dia de compactaci� autom�tica',
  'Usage by category': '�s per categoria',
  'System prompt': 'Missatge del sistema',
  'Built-in tools': 'Eines integrades',
  'MCP tools': 'Eines MCP',
  'Memory files': 'Fitxers de mem�ria',
  Skills: 'Habilitats',
  Messages: 'Missatges',
  'Show context window usage breakdown.':
    "Mostrar el desglossament de l'�s de la finestra de context.",
  'Run /context detail for per-item breakdown.':
    'Executeu /context detail per a un desglossament per element.',
  'Show context window usage breakdown. Use "/context detail" for per-item breakdown.':
    'Mostrar el desglossament de l\'�s de la finestra de context. Useu "/context detail" per a un desglossament per element.',
  'body loaded': 'cos carregat',
  memory: 'mem�ria',
  '{{region}} configuration updated successfully.':
    "La configuraci� de {{region}} s'ha actualitzat correctament.",
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json.':
    "S'ha autenticat correctament amb {{region}}. La clau API i les configuracions del model s'han desat a settings.json.",
  'Tip: Use /model to switch between available Coding Plan models.':
    'Consell: Useu /model per canviar entre els models del Coding Plan disponibles.',

  // ============================================================================
  // Eina de preguntes a l'usuari
  // ============================================================================
  'Please answer the following question(s):':
    'Responeu la(es) pregunta(es) seg�ent(s):',
  'Cannot ask user questions in non-interactive mode. Please run in interactive mode to use this tool.':
    "No es poden fer preguntes a l'usuari en mode no interactiu. Executeu en mode interactiu per usar aquesta eina.",
  'User declined to answer the questions.':
    "L'usuari ha declinat respondre les preguntes.",
  'User has provided the following answers:':
    "L'usuari ha proporcionat les respostes seg�ents:",
  'Failed to process user answers:':
    "Error en processar les respostes de l'usuari:",
  'Type something...': 'Escriviu alguna cosa...',
  Submit: 'Enviar',
  'Submit answers': 'Enviar respostes',
  Cancel: 'Cancel�lar',
  'Your answers:': 'Les vostres respostes:',
  '(not answered)': '(sense resposta)',
  'Ready to submit your answers?':
    'Preparats per enviar les vostres respostes?',
  '?/?: Navigate | ?/?: Switch tabs | Enter: Select':
    '?/?: Navegar | ?/?: Canviar pestanyes | Retorn: Seleccionar',
  '?/?: Navigate | ?/?: Switch tabs | Space/Enter: Toggle | Esc: Cancel':
    '?/?: Navegar | ?/?: Canviar pestanyes | Espai/Retorn: Canviar | Esc: Cancel�lar',
  '?/?: Navigate | Space/Enter: Toggle | Esc: Cancel':
    '?/?: Navegar | Espai/Retorn: Canviar | Esc: Cancel�lar',
  '?/?: Navigate | Enter: Select | Esc: Cancel':
    '?/?: Navegar | Retorn: Seleccionar | Esc: Cancel�lar',

  // ============================================================================
  // Ordres - Autenticaci�
  // ============================================================================
  'Configure authentication information with Qwen-OAuth or Alibaba Cloud Coding Plan':
    "Configurar la informaci� d'autenticaci� de Qwen amb Qwen-OAuth o el Coding Plan d'Alibaba Cloud",
  'Authenticate using HopCode OAuth': 'Autenticar-se usant Legacy OAuth',
  'Authenticate using Alibaba Cloud Coding Plan':
    "Autenticar-se usant el Coding Plan d'Alibaba Cloud",
  'Region for Coding Plan (china/global)':
    'Regi� per al Coding Plan (china/global)',
  'API key for Coding Plan': 'Clau API per al Coding Plan',
  'Show current authentication status': "Mostrar l'estat d'autenticaci� actual",
  'Authentication completed successfully.':
    "L'autenticaci� s'ha completat correctament.",
  'Starting HopCode OAuth authentication...':
    "Iniciant l'autenticaci� Legacy OAuth...",
  'Successfully authenticated with HopCode OAuth.':
    "S'ha autenticat correctament amb Legacy OAuth.",
  'Failed to authenticate with HopCode OAuth: {{error}}':
    'Error en autenticar-se amb Legacy OAuth: {{error}}',
  'Processing Alibaba Cloud Coding Plan authentication...':
    "Processant l'autenticaci� del Coding Plan d'Alibaba Cloud...",
  'Successfully authenticated with Alibaba Cloud Coding Plan.':
    "S'ha autenticat correctament amb el Coding Plan d'Alibaba Cloud.",
  'Failed to authenticate with Coding Plan: {{error}}':
    'Error en autenticar-se amb el Coding Plan: {{error}}',
  '?? (China)': '?? (China)',
  '????? (aliyun.com)': '????? (aliyun.com)',
  Global: 'Global',
  'Alibaba Cloud (alibabacloud.com)': 'Alibaba Cloud (alibabacloud.com)',
  'Select region for Coding Plan:': 'Seleccioneu la regi� per al Coding Plan:',
  'Enter your Coding Plan API key: ':
    'Introdu�u la vostra clau API del Coding Plan: ',
  'Select authentication method:': "Seleccioneu el m�tode d'autenticaci�:",
  '\n=== Authentication Status ===\n': "\n=== Estat d'autenticaci� ===\n",
  '??  No authentication method configured.\n':
    "??  Cap m�tode d'autenticaci� configurat.\n",
  'Run one of the following commands to get started:\n':
    'Executeu una de les ordres seg�ents per comen�ar:\n',
  '  hopcode auth hopcode-oauth     - Authenticate with HopCode OAuth (discontinued)':
    '  hopcode auth hopcode-oauth     - Autenticar-se amb Legacy OAuth (descontinuat)',
  '  hopcode auth coding-plan      - Authenticate with Alibaba Cloud Coding Plan\n':
    "  hopcode auth coding-plan      - Autenticar-se amb el Coding Plan d'Alibaba Cloud\n",
  'Or simply run:': 'O simplement executeu:',
  '  hopcode auth                - Interactive authentication setup\n':
    "  hopcode auth                - Configuraci� interactiva de l'autenticaci�\n",
  '? Authentication Method: HopCode OAuth':
    "? M�tode d'autenticaci�: Legacy OAuth",
  '  Type: Free tier (discontinued 2026-04-15)':
    '  Tipus: Nivell gratu�t (descontinuat el 15-04-2026)',
  '  Limit: No longer available': '  L�mit: Ja no disponible',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Run /auth to switch to Coding Plan, OpenRouter, Fireworks AI, or another provider.':
    'El nivell gratu�t de Legacy OAuth es va descontinuar el 15-04-2026. Executeu /auth per canviar al Coding Plan, OpenRouter, Fireworks AI o un altre prove�dor.',
  '  Models: Qwen latest models\n': '  Models: �ltims models Qwen\n',
  '? Authentication Method: Alibaba Cloud Coding Plan':
    "? M�tode d'autenticaci�: Coding Plan d'Alibaba Cloud",
  '?? (China) - ?????': '?? (China) - ?????',
  'Global - Alibaba Cloud': 'Global - Alibaba Cloud',
  '  Region: {{region}}': '  Regi�: {{region}}',
  '  Current Model: {{model}}': '  Model actual: {{model}}',
  '  Config Version: {{version}}': '  Versi� de configuraci�: {{version}}',
  '  Status: API key configured\n': '  Estat: Clau API configurada\n',
  '??  Authentication Method: Alibaba Cloud Coding Plan (Incomplete)':
    "??  M�tode d'autenticaci�: Coding Plan d'Alibaba Cloud (Incomplet)",
  '  Issue: API key not found in environment or settings\n':
    "  Problema: Clau API no trobada a l'entorn o la configuraci�\n",
  '  Run `hopcode auth coding-plan` to re-configure.\n':
    '  Executeu `hopcode auth coding-plan` per tornar a configurar.\n',
  '? Authentication Method: {{type}}': "? M�tode d'autenticaci�: {{type}}",
  '  Status: Configured\n': '  Estat: Configurat\n',
  'Failed to check authentication status: {{error}}':
    "Error en comprovar l'estat d'autenticaci�: {{error}}",
  'Select an option:': 'Seleccioneu una opci�:',
  'Raw mode not available. Please run in an interactive terminal.':
    'El mode raw no est� disponible. Executeu en un terminal interactiu.',
  '(Use ? ? arrows to navigate, Enter to select, Ctrl+C to exit)\n':
    '(Useu les fletxes ? ? per navegar, Retorn per seleccionar, Ctrl+C per sortir)\n',
  compact: 'compacte',
  'compact mode: on (Ctrl+O off)':
    'mode compacte: activat (Ctrl+O per desactivar)',
  'Hide tool output and thinking for a cleaner view (toggle with Ctrl+O).':
    'Amagueu la sortida de les eines i el pensament per a una vista m�s neta (canvieu amb Ctrl+O).',
  'Press Ctrl+O to show full tool output':
    'Premeu Ctrl+O per mostrar la sortida completa de les eines',

  'Switch to plan mode or exit plan mode':
    'Canviar al mode de planificaci� o sortir del mode de planificaci�',
  'Exited plan mode. Previous approval mode restored.':
    "S'ha sortit del mode de planificaci�. S'ha restaurat el mode d'aprovaci� anterior.",
  'Enabled plan mode. The agent will analyze and plan without executing tools.':
    "S'ha activat el mode de planificaci�. L'agent analitzar� i planificar� sense executar eines.",
  'Already in plan mode. Use "/plan exit" to exit plan mode.':
    'Ja esteu en mode de planificaci�. Useu "/plan exit" per sortir del mode de planificaci�.',
  'Not in plan mode. Use "/plan" to enter plan mode first.':
    'No esteu en mode de planificaci�. Useu "/plan" per entrar al mode de planificaci� primer.',

  "Set up HopCode's status line UI":
    "Configurar la interf�cie de la barra d'estat de HopCode",
};
