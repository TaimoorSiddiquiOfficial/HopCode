/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

// Traductions fran�aises pour HopCode CLI

export default {
  // ============================================================================
  // Aide / Composants UI
  // ============================================================================
  '? to manage attachments': '? pour g�rer les pi�ces jointes',
  '? ? select, Delete to remove, ? to exit':
    '? ? s�lectionner, Suppr pour retirer, ? pour quitter',
  'Attachments: ': 'Pi�ces jointes : ',

  'Basics:': 'Bases :',
  'Add context': 'Ajouter du contexte',
  'Use {{symbol}} to specify files for context (e.g., {{example}}) to target specific files or folders.':
    'Utilisez {{symbol}} pour sp�cifier des fichiers de contexte (ex. {{example}}) pour cibler des fichiers ou dossiers sp�cifiques.',
  '@': '@',
  '@src/myFile.ts': '@src/myFile.ts',
  'Shell mode': 'Mode shell',
  'IZN mode': 'Mode IZN',
  'plan mode': 'mode plan',
  'auto-accept edits': 'acceptation automatique des modifications',
  'Accepting edits': 'Acceptation des modifications',
  '(shift + tab to cycle)': '(maj + tab pour cycler)',
  '(tab to cycle)': '(tab pour cycler)',
  'Execute shell commands via {{symbol}} (e.g., {{example1}}) or use natural language (e.g., {{example2}}).':
    'Ex�cutez des commandes shell via {{symbol}} (ex. {{example1}}) ou utilisez le langage naturel (ex. {{example2}}).',
  '!': '!',
  '!npm run start': '!npm run start',
  'start server': 'd�marrer le serveur',
  'Commands:': 'Commandes :',
  'shell command': 'commande shell',
  'Model Context Protocol command (from external servers)':
    'Commande Model Context Protocol (depuis des serveurs externes)',
  'Keyboard Shortcuts:': 'Raccourcis clavier :',
  'Toggle this help display': 'Afficher/masquer cette aide',
  'Toggle shell mode': 'Basculer le mode shell',
  'Open command menu': 'Ouvrir le menu des commandes',
  'Add file context': 'Ajouter un contexte de fichier',
  'Accept suggestion / Autocomplete': 'Accepter la suggestion / Autocompl�tion',
  'Reverse search history': "Recherche invers�e dans l'historique",
  'Press ? again to close': 'Appuyez � nouveau sur ? pour fermer',
  'for shell mode': 'pour le mode shell',
  'for commands': 'pour les commandes',
  'for file paths': 'pour les chemins de fichiers',
  'to clear input': "pour effacer l'entr�e",
  'to cycle approvals': 'pour cycler les approbations',
  'to quit': 'pour quitter',
  'for newline': 'pour une nouvelle ligne',
  'to clear screen': "pour effacer l'�cran",
  'to search history': "pour rechercher dans l'historique",
  'to paste images': 'pour coller des images',
  'for external editor': 'pour un �diteur externe',
  'Jump through words in the input': "Sauter de mot en mot dans l'entr�e",
  'Close dialogs, cancel requests, or quit application':
    "Fermer les bo�tes de dialogue, annuler les requ�tes ou quitter l'application",
  'New line': 'Nouvelle ligne',
  'New line (Alt+Enter works for certain linux distros)':
    'Nouvelle ligne (Alt+Entr�e fonctionne sur certaines distributions Linux)',
  'Clear the screen': "Effacer l'�cran",
  'Open input in external editor': "Ouvrir l'entr�e dans un �diteur externe",
  'Send message': 'Envoyer le message',
  'Initializing...': 'Initialisation...',
  'Connecting to MCP servers... ({{connected}}/{{total}})':
    'Connexion aux serveurs MCP... ({{connected}}/{{total}})',
  'Type your message or @path/to/file':
    'Tapez votre message ou @chemin/vers/fichier',
  '? for shortcuts': '? pour les raccourcis',
  "Press 'i' for INSERT mode and 'Esc' for NORMAL mode.":
    "Appuyez sur 'i' pour le mode INSERTION et '�chap' pour le mode NORMAL.",
  'Cancel operation / Clear input (double press)':
    "Annuler l'op�ration / Effacer l'entr�e (double appui)",
  'Cycle approval modes': "Cycler les modes d'approbation",
  'Cycle through your prompt history': "Parcourir l'historique des invites",
  'For a full list of shortcuts, see {{docPath}}':
    'Pour la liste compl�te des raccourcis, voir {{docPath}}',
  'docs/keyboard-shortcuts.md': 'docs/keyboard-shortcuts.md',
  'for help on HopCode': "pour l'aide de HopCode",
  'show version info': 'afficher les informations de version',
  'submit a bug report': 'soumettre un rapport de bogue',
  'About HopCode': '� propos de HopCode',
  Status: 'Statut',

  // ============================================================================
  // Informations syst�me
  // ============================================================================
  HopCode: 'HopCode',
  Runtime: 'Environnement',
  OS: 'OS',
  Auth: 'Auth',
  'CLI Version': 'Version CLI',
  'Git Commit': 'Commit Git',
  Model: 'Mod�le',
  'Fast Model': 'Mod�le rapide',
  Sandbox: 'Bac � sable',
  'OS Platform': 'Plateforme OS',
  'OS Arch': 'Architecture OS',
  'OS Release': 'Version OS',
  'Node.js Version': 'Version Node.js',
  'NPM Version': 'Version NPM',
  'Session ID': 'ID de session',
  'Auth Method': "M�thode d'authentification",
  'Base URL': 'URL de base',
  Proxy: 'Proxy',
  'Memory Usage': 'Utilisation m�moire',
  'IDE Client': 'Client IDE',

  // ============================================================================
  // Commandes - G�n�ral
  // ============================================================================
  'Analyzes the project and creates a tailored HOPCODE.md file.':
    'Analyse le projet et cr�e un fichier HOPCODE.md personnalis�.',
  'List available HopCode tools. Usage: /tools [desc]':
    'Lister les outils HopCode disponibles. Utilisation : /tools [desc]',
  'List available skills.': 'Lister les comp�tences disponibles.',
  'Available HopCode CLI tools:': 'Outils HopCode CLI disponibles :',
  'No tools available': 'Aucun outil disponible',
  'View or change the approval mode for tool usage':
    "Voir ou modifier le mode d'approbation pour l'utilisation des outils",
  'Invalid approval mode "{{arg}}". Valid modes: {{modes}}':
    'Mode d\'approbation invalide "{{arg}}". Modes valides : {{modes}}',
  'Approval mode set to "{{mode}}"':
    'Mode d\'approbation d�fini sur "{{mode}}"',
  'View or change the language setting':
    'Voir ou modifier le param�tre de langue',
  'change the theme': 'changer le th�me',
  'Select Theme': 'S�lectionner un th�me',
  Preview: 'Aper�u',
  '(Use Enter to select, Tab to configure scope)':
    '(Utilisez Entr�e pour s�lectionner, Tab pour configurer la port�e)',
  '(Use Enter to apply scope, Tab to go back)':
    '(Utilisez Entr�e pour appliquer la port�e, Tab pour revenir)',
  'Theme configuration unavailable due to NO_COLOR env variable.':
    "Configuration du th�me indisponible en raison de la variable d'environnement NO_COLOR.",
  'Theme "{{themeName}}" not found.': 'Th�me "{{themeName}}" introuvable.',
  'Theme "{{themeName}}" not found in selected scope.':
    'Th�me "{{themeName}}" introuvable dans la port�e s�lectionn�e.',
  'Clear conversation history and free up context':
    "Effacer l'historique de conversation et lib�rer le contexte",
  'Compresses the context by replacing it with a summary.':
    'Compresse le contexte en le rempla�ant par un r�sum�.',
  'open full HopCode documentation in your browser':
    'ouvrir la documentation compl�te de HopCode dans votre navigateur',
  'Configuration not available.': 'Configuration non disponible.',
  'change the auth method': "changer la m�thode d'authentification",
  'Configure authentication information for login':
    "Configurer les informations d'authentification pour la connexion",
  'Copy the last result or code snippet to clipboard':
    'Copier le dernier r�sultat ou extrait de code dans le presse-papiers',

  // ============================================================================
  // Commandes - Agents
  // ============================================================================
  'Manage subagents for specialized task delegation.':
    'G�rer les sous-agents pour la d�l�gation de t�ches sp�cialis�es.',
  'Manage existing subagents (view, edit, delete).':
    'G�rer les sous-agents existants (voir, modifier, supprimer).',
  'Create a new subagent with guided setup.':
    'Cr�er un nouveau sous-agent avec configuration guid�e.',

  // ============================================================================
  // Agents - Bo�te de dialogue de gestion
  // ============================================================================
  Agents: 'Agents',
  'Choose Action': 'Choisir une action',
  'Edit {{name}}': 'Modifier {{name}}',
  'Edit Tools: {{name}}': 'Modifier les outils : {{name}}',
  'Edit Color: {{name}}': 'Modifier la couleur : {{name}}',
  'Delete {{name}}': 'Supprimer {{name}}',
  'Unknown Step': '�tape inconnue',
  'Esc to close': '�chap pour fermer',
  'Enter to select, ?? to navigate, Esc to close':
    'Entr�e pour s�lectionner, ?? pour naviguer, �chap pour fermer',
  'Esc to go back': '�chap pour revenir',
  'Enter to confirm, Esc to cancel':
    'Entr�e pour confirmer, �chap pour annuler',
  'Enter to select, ?? to navigate, Esc to go back':
    'Entr�e pour s�lectionner, ?? pour naviguer, �chap pour revenir',
  'Enter to submit, Esc to go back':
    'Entr�e pour soumettre, �chap pour revenir',
  'Invalid step: {{step}}': '�tape invalide : {{step}}',
  'No subagents found.': 'Aucun sous-agent trouv�.',
  "Use '/agents create' to create your first subagent.":
    "Utilisez '/agents create' pour cr�er votre premier sous-agent.",
  '(built-in)': '(int�gr�)',
  '(overridden by project level agent)':
    '(remplac� par un agent au niveau du projet)',
  'Project Level ({{path}})': 'Niveau projet ({{path}})',
  'User Level ({{path}})': 'Niveau utilisateur ({{path}})',
  'Built-in Agents': 'Agents int�gr�s',
  'Extension Agents': "Agents d'extension",
  'Using: {{count}} agents': 'Utilisation : {{count}} agents',
  'View Agent': "Voir l'agent",
  'Edit Agent': "Modifier l'agent",
  'Delete Agent': "Supprimer l'agent",
  Back: 'Retour',
  'No agent selected': 'Aucun agent s�lectionn�',
  'File Path: ': 'Chemin du fichier : ',
  'Tools: ': 'Outils : ',
  'Color: ': 'Couleur : ',
  'Description:': 'Description :',
  'System Prompt:': 'Invite syst�me :',
  'Open in editor': "Ouvrir dans l'�diteur",
  'Edit tools': 'Modifier les outils',
  'Edit color': 'Modifier la couleur',
  '? Error:': '? Erreur :',
  'Are you sure you want to delete agent "{{name}}"?':
    '�tes-vous s�r de vouloir supprimer l\'agent "{{name}}" ?',

  // ============================================================================
  // Agents - Assistant de cr�ation
  // ============================================================================
  'Project Level (.hopcode/agents/)': 'Niveau projet (.hopcode/agents/)',
  'User Level (~/.hopcode/agents/)': 'Niveau utilisateur (~/.hopcode/agents/)',
  '? Subagent Created Successfully!': '? Sous-agent cr�� avec succ�s !',
  'Subagent "{{name}}" has been saved to {{level}} level.':
    'Le sous-agent "{{name}}" a �t� enregistr� au niveau {{level}}.',
  'Name: ': 'Nom : ',
  'Location: ': 'Emplacement : ',
  '? Error saving subagent:': '? Erreur lors de la sauvegarde du sous-agent :',
  'Warnings:': 'Avertissements :',
  'Name "{{name}}" already exists at {{level}} level - will overwrite existing subagent':
    'Le nom "{{name}}" existe d�j� au niveau {{level}} - le sous-agent existant sera �cras�',
  'Name "{{name}}" exists at user level - project level will take precedence':
    'Le nom "{{name}}" existe au niveau utilisateur - le niveau projet aura la priorit�',
  'Name "{{name}}" exists at project level - existing subagent will take precedence':
    'Le nom "{{name}}" existe au niveau projet - le sous-agent existant aura la priorit�',
  'Description is over {{length}} characters':
    'La description d�passe {{length}} caract�res',
  'System prompt is over {{length}} characters':
    "L'invite syst�me d�passe {{length}} caract�res",
  'Step {{n}}: Choose Location': "�tape {{n}} : Choisir l'emplacement",
  'Step {{n}}: Choose Generation Method':
    '�tape {{n}} : Choisir la m�thode de g�n�ration',
  'Generate with HopCode (Recommended)': 'G�n�rer avec HopCode (Recommand�)',
  'Manual Creation': 'Cr�ation manuelle',
  'Describe what this subagent should do and when it should be used. (Be comprehensive for best results)':
    'D�crivez ce que ce sous-agent doit faire et quand il doit �tre utilis�. (Soyez complet pour de meilleurs r�sultats)',
  'e.g., Expert code reviewer that reviews code based on best practices...':
    'ex. R�viseur de code expert qui r�vise le code selon les meilleures pratiques...',
  'Generating subagent configuration...':
    'G�n�ration de la configuration du sous-agent...',
  'Failed to generate subagent: {{error}}':
    '�chec de la g�n�ration du sous-agent : {{error}}',
  'Step {{n}}: Describe Your Subagent':
    '�tape {{n}} : D�crire votre sous-agent',
  'Step {{n}}: Enter Subagent Name':
    '�tape {{n}} : Entrer le nom du sous-agent',
  'Step {{n}}: Enter System Prompt': "�tape {{n}} : Entrer l'invite syst�me",
  'Step {{n}}: Enter Description': '�tape {{n}} : Entrer la description',
  'Step {{n}}: Select Tools': '�tape {{n}} : S�lectionner les outils',
  'All Tools (Default)': 'Tous les outils (par d�faut)',
  'All Tools': 'Tous les outils',
  'Read-only Tools': 'Outils en lecture seule',
  'Read & Edit Tools': 'Outils lecture et �dition',
  'Read & Edit & Execution Tools': 'Outils lecture, �dition et ex�cution',
  'All tools selected, including MCP tools':
    'Tous les outils s�lectionn�s, y compris les outils MCP',
  'Selected tools:': 'Outils s�lectionn�s :',
  'Read-only tools:': 'Outils en lecture seule :',
  'Edit tools:': "Outils d'�dition :",
  'Execution tools:': "Outils d'ex�cution :",
  'Step {{n}}: Choose Background Color':
    "�tape {{n}} : Choisir la couleur d'arri�re-plan",
  'Step {{n}}: Confirm and Save': '�tape {{n}} : Confirmer et enregistrer',
  'Esc to cancel': '�chap pour annuler',
  'Press Enter to save, e to save and edit, Esc to go back':
    'Appuyez sur Entr�e pour enregistrer, e pour enregistrer et modifier, �chap pour revenir',
  'Press Enter to continue, {{navigation}}Esc to {{action}}':
    'Appuyez sur Entr�e pour continuer, {{navigation}}�chap pour {{action}}',
  cancel: 'annuler',
  'go back': 'revenir',
  '?? to navigate, ': '?? pour naviguer, ',
  'Enter a clear, unique name for this subagent.':
    'Entrez un nom clair et unique pour ce sous-agent.',
  'e.g., Code Reviewer': 'ex. R�viseur de code',
  'Name cannot be empty.': 'Le nom ne peut pas �tre vide.',
  "Write the system prompt that defines this subagent's behavior. Be comprehensive for best results.":
    "R�digez l'invite syst�me qui d�finit le comportement de ce sous-agent. Soyez complet pour de meilleurs r�sultats.",
  'e.g., You are an expert code reviewer...':
    'ex. Vous �tes un r�viseur de code expert...',
  'System prompt cannot be empty.': "L'invite syst�me ne peut pas �tre vide.",
  'Describe when and how this subagent should be used.':
    'D�crivez quand et comment ce sous-agent doit �tre utilis�.',
  'e.g., Reviews code for best practices and potential bugs.':
    'ex. R�vise le code pour les meilleures pratiques et les bogues potentiels.',
  'Description cannot be empty.': 'La description ne peut pas �tre vide.',
  'Failed to launch editor: {{error}}':
    "�chec du lancement de l'�diteur : {{error}}",
  'Failed to save and edit subagent: {{error}}':
    '�chec de la sauvegarde et modification du sous-agent : {{error}}',

  // ============================================================================
  // Extensions - Bo�te de dialogue de gestion
  // ============================================================================
  'Manage Extensions': 'G�rer les extensions',
  'Extension Details': "D�tails de l'extension",
  'View Extension': "Voir l'extension",
  'Update Extension': "Mettre � jour l'extension",
  'Disable Extension': "D�sactiver l'extension",
  'Enable Extension': "Activer l'extension",
  'Uninstall Extension': "D�sinstaller l'extension",
  'Select Scope': 'S�lectionner la port�e',
  'User Scope': 'Port�e utilisateur',
  'Workspace Scope': 'Port�e espace de travail',
  'No extensions found.': 'Aucune extension trouv�e.',
  Active: 'Actif',
  Disabled: 'D�sactiv�',
  'Update available': 'Mise � jour disponible',
  'Up to date': '� jour',
  'Checking...': 'V�rification...',
  'Updating...': 'Mise � jour...',
  Unknown: 'Inconnu',
  Error: 'Erreur',
  'Version:': 'Version :',
  'Status:': 'Statut :',
  'Are you sure you want to uninstall extension "{{name}}"?':
    '�tes-vous s�r de vouloir d�sinstaller l\'extension "{{name}}" ?',
  'This action cannot be undone.': 'Cette action est irr�versible.',
  'Extension "{{name}}" disabled successfully.':
    'Extension "{{name}}" d�sactiv�e avec succ�s.',
  'Extension "{{name}}" enabled successfully.':
    'Extension "{{name}}" activ�e avec succ�s.',
  'Extension "{{name}}" updated successfully.':
    'Extension "{{name}}" mise � jour avec succ�s.',
  'Failed to update extension "{{name}}": {{error}}':
    '�chec de la mise � jour de l\'extension "{{name}}" : {{error}}',
  'Select the scope for this action:':
    'S�lectionnez la port�e pour cette action :',
  'User - Applies to all projects':
    "Utilisateur - S'applique � tous les projets",
  'Workspace - Applies to current project only':
    "Espace de travail - S'applique uniquement au projet actuel",
  'Name:': 'Nom :',
  'MCP Servers:': 'Serveurs MCP :',
  'Settings:': 'Param�tres :',
  active: 'actif',
  disabled: 'd�sactiv�',
  'View Details': 'Voir les d�tails',
  'Update failed:': '�chec de la mise � jour :',
  'Updating {{name}}...': 'Mise � jour de {{name}}...',
  'Update complete!': 'Mise � jour termin�e !',
  'User (global)': 'Utilisateur (global)',
  'Workspace (project-specific)': 'Espace de travail (sp�cifique au projet)',
  'Disable "{{name}}" - Select Scope':
    'D�sactiver "{{name}}" - S�lectionner la port�e',
  'Enable "{{name}}" - Select Scope':
    'Activer "{{name}}" - S�lectionner la port�e',
  'No extension selected': 'Aucune extension s�lectionn�e',
  'Press Y/Enter to confirm, N/Esc to cancel':
    'Appuyez sur O/Entr�e pour confirmer, N/�chap pour annuler',
  'Y/Enter to confirm, N/Esc to cancel':
    'O/Entr�e pour confirmer, N/�chap pour annuler',
  '{{count}} extensions installed': '{{count}} extensions install�es',
  "Use '/extensions install' to install your first extension.":
    "Utilisez '/extensions install' pour installer votre premi�re extension.",
  'up to date': '� jour',
  'update available': 'mise � jour disponible',
  'checking...': 'v�rification...',
  'not updatable': 'non mise � jour possible',
  error: 'erreur',

  // ============================================================================
  // Commandes - G�n�ral (suite)
  // ============================================================================
  'View and edit HopCode settings':
    'Voir et modifier les param�tres de HopCode',
  Settings: 'Param�tres',
  'To see changes, HopCode must be restarted. Press r to exit and apply changes now.':
    'Pour voir les changements, HopCode doit �tre red�marr�. Appuyez sur r pour quitter et appliquer les changements maintenant.',
  'The command "/{{command}}" is not supported in non-interactive mode.':
    'La commande "/{{command}}" n\'est pas prise en charge en mode non interactif.',

  // ============================================================================
  // �tiquettes des param�tres
  // ============================================================================
  'Vim Mode': 'Mode Vim',
  'Disable Auto Update': 'D�sactiver la mise � jour automatique',
  'Attribution: commit': 'Attribution : commit',
  'Terminal Bell Notification': 'Notification sonore du terminal',
  'Enable Usage Statistics': "Activer les statistiques d'utilisation",
  Theme: 'Th�me',
  'Preferred Editor': '�diteur pr�f�r�',
  'Auto-connect to IDE': "Connexion automatique � l'IDE",
  'Enable Prompt Completion': "Activer la compl�tion d'invite",
  'Debug Keystroke Logging': 'Journalisation des frappes de d�bogage',
  'Language: UI': 'Langue : Interface',
  'Language: Model': 'Langue : Mod�le',
  'Output Format': 'Format de sortie',
  'Hide Window Title': 'Masquer le titre de la fen�tre',
  'Show Status in Title': 'Afficher le statut dans le titre',
  'Hide Tips': 'Masquer les conseils',
  'Show Line Numbers in Code': 'Afficher les num�ros de ligne dans le code',
  'Show Citations': 'Afficher les citations',
  'Custom Witty Phrases': 'Phrases personnalis�es spirituelles',
  'Show Welcome Back Dialog': 'Afficher le dialogue de bienvenue',
  'Enable User Feedback': 'Activer les retours utilisateur',
  'How is HopCode doing this session? (optional)':
    'Comment se passe cette session avec HopCode ? (facultatif)',
  Bad: 'Mauvais',
  Fine: 'Correct',
  Good: 'Bien',
  Dismiss: 'Ignorer',
  'Not Sure Yet': 'Pas encore s�r',
  'Any other key': 'Toute autre touche',
  'Disable Loading Phrases': 'D�sactiver les phrases de chargement',
  'Screen Reader Mode': "Mode lecteur d'�cran",
  'IDE Mode': 'Mode IDE',
  'Max Session Turns': 'Nombre maximum de tours de session',
  'Skip Next Speaker Check':
    'Ignorer la v�rification du prochain interlocuteur',
  'Skip Loop Detection': 'Ignorer la d�tection de boucle',
  'Skip Startup Context': 'Ignorer le contexte de d�marrage',
  'Enable OpenAI Logging': 'Activer la journalisation OpenAI',
  'OpenAI Logging Directory': 'R�pertoire de journalisation OpenAI',
  Timeout: "D�lai d'attente",
  'Max Retries': 'Nombre maximum de tentatives',
  'Disable Cache Control': 'D�sactiver le contr�le du cache',
  'Memory Discovery Max Dirs': 'R�pertoires max pour la d�couverte m�moire',
  'Load Memory From Include Directories':
    'Charger la m�moire depuis les r�pertoires inclus',
  'Respect .gitignore': 'Respecter .gitignore',
  'Respect .hopcodeignore': 'Respecter .hopcodeignore',
  'Enable Recursive File Search': 'Activer la recherche r�cursive de fichiers',
  'Disable Fuzzy Search': 'D�sactiver la recherche approximative',
  'Interactive Shell (PTY)': 'Shell interactif (PTY)',
  'Show Color': 'Afficher les couleurs',
  'Auto Accept': 'Acceptation automatique',
  'Use Ripgrep': 'Utiliser Ripgrep',
  'Use Builtin Ripgrep': 'Utiliser Ripgrep int�gr�',
  'Enable Tool Output Truncation': 'Activer la troncature de sortie des outils',
  'Tool Output Truncation Threshold':
    'Seuil de troncature de sortie des outils',
  'Tool Output Truncation Lines': 'Lignes de troncature de sortie des outils',
  'Folder Trust': 'Confiance des dossiers',
  'Vision Model Preview': 'Aper�u du mod�le de vision',
  'Tool Schema Compliance': 'Conformit� au sch�ma des outils',
  'Auto (detect from system)': 'Auto (d�tecter depuis le syst�me)',
  'Auto (detect terminal theme)': 'Auto (d�tecter le th�me du terminal)',
  Auto: 'Auto',
  Text: 'Texte',
  JSON: 'JSON',
  Plan: 'Plan',
  Default: 'Par d�faut',
  'Auto Edit': '�dition automatique',
  IZN: 'IZN',
  'toggle vim mode on/off': 'activer/d�sactiver le mode Vim',
  'check session stats. Usage: /stats [model|tools]':
    'v�rifier les stats de session. Utilisation : /stats [mod�le|outils]',
  'Show model-specific usage statistics.':
    "Afficher les statistiques d'utilisation sp�cifiques au mod�le.",
  'Show tool-specific usage statistics.':
    "Afficher les statistiques d'utilisation sp�cifiques aux outils.",
  'exit the cli': 'quitter le CLI',
  'Open MCP management dialog, or authenticate with OAuth-enabled servers':
    'Ouvrir le dialogue de gestion MCP, ou authentifier avec des serveurs compatibles OAuth',
  'List configured MCP servers and tools, or authenticate with OAuth-enabled servers':
    'Lister les serveurs MCP et outils configur�s, ou authentifier avec des serveurs compatibles OAuth',
  'Manage workspace directories':
    "G�rer les r�pertoires de l'espace de travail",
  'Add directories to the workspace. Use comma to separate multiple paths':
    "Ajouter des r�pertoires � l'espace de travail. Utilisez une virgule pour s�parer plusieurs chemins",
  'Show all directories in the workspace':
    "Afficher tous les r�pertoires de l'espace de travail",
  'set external editor preference': "d�finir la pr�f�rence d'�diteur externe",
  'Select Editor': "S�lectionner l'�diteur",
  'Editor Preference': "Pr�f�rence d'�diteur",
  'These editors are currently supported. Please note that some editors cannot be used in sandbox mode.':
    'Ces �diteurs sont actuellement pris en charge. Notez que certains �diteurs ne peuvent pas �tre utilis�s en mode bac � sable.',
  'Your preferred editor is:': 'Votre �diteur pr�f�r� est :',
  'Manage extensions': 'G�rer les extensions',
  'Manage installed extensions': 'G�rer les extensions install�es',
  'List active extensions': 'Lister les extensions actives',
  'Update extensions. Usage: update <extension-names>|--all':
    'Mettre � jour les extensions. Utilisation : update <noms-extensions>|--all',
  'Disable an extension': 'D�sactiver une extension',
  'Enable an extension': 'Activer une extension',
  'Install an extension from a git repo or local path':
    'Installer une extension depuis un d�p�t git ou un chemin local',
  'Uninstall an extension': 'D�sinstaller une extension',
  'No extensions installed.': 'Aucune extension install�e.',
  'Usage: /extensions update <extension-names>|--all':
    'Utilisation : /extensions update <noms-extensions>|--all',
  'Extension "{{name}}" not found.': 'Extension "{{name}}" introuvable.',
  'No extensions to update.': 'Aucune extension � mettre � jour.',
  'Usage: /extensions install <source>':
    'Utilisation : /extensions install <source>',
  'Installing extension from "{{source}}"...':
    'Installation de l\'extension depuis "{{source}}"...',
  'Extension "{{name}}" installed successfully.':
    'Extension "{{name}}" install�e avec succ�s.',
  'Failed to install extension from "{{source}}": {{error}}':
    '�chec de l\'installation de l\'extension depuis "{{source}}" : {{error}}',
  'Usage: /extensions uninstall <extension-name>':
    'Utilisation : /extensions uninstall <nom-extension>',
  'Uninstalling extension "{{name}}"...':
    'D�sinstallation de l\'extension "{{name}}"...',
  'Extension "{{name}}" uninstalled successfully.':
    'Extension "{{name}}" d�sinstall�e avec succ�s.',
  'Failed to uninstall extension "{{name}}": {{error}}':
    '�chec de la d�sinstallation de l\'extension "{{name}}" : {{error}}',
  'Usage: /extensions {{command}} <extension> [--scope=<user|workspace>]':
    'Utilisation : /extensions {{command}} <extension> [--scope=<user|workspace>]',
  'Unsupported scope "{{scope}}", should be one of "user" or "workspace"':
    'Port�e non prise en charge "{{scope}}", doit �tre "user" ou "workspace"',
  'Extension "{{name}}" disabled for scope "{{scope}}"':
    'Extension "{{name}}" d�sactiv�e pour la port�e "{{scope}}"',
  'Extension "{{name}}" enabled for scope "{{scope}}"':
    'Extension "{{name}}" activ�e pour la port�e "{{scope}}"',
  'Do you want to continue? [Y/n]: ': 'Voulez-vous continuer ? [O/n] : ',
  'Do you want to continue?': 'Voulez-vous continuer ?',
  'Installing extension "{{name}}".':
    'Installation de l\'extension "{{name}}".',
  '**Extensions may introduce unexpected behavior. Ensure you have investigated the extension source and trust the author.**':
    "**Les extensions peuvent introduire des comportements inattendus. Assurez-vous d'avoir examin� la source de l'extension et de faire confiance � l'auteur.**",
  'This extension will run the following MCP servers:':
    'Cette extension ex�cutera les serveurs MCP suivants :',
  local: 'local',
  remote: 'distant',
  'This extension will add the following commands: {{commands}}.':
    'Cette extension ajoutera les commandes suivantes : {{commands}}.',
  'This extension will append info to your HOPCODE.md context using {{fileName}}':
    'Cette extension ajoutera des informations � votre contexte HOPCODE.md en utilisant {{fileName}}',
  'This extension will exclude the following core tools: {{tools}}':
    'Cette extension exclura les outils principaux suivants : {{tools}}',
  'This extension will install the following skills:':
    'Cette extension installera les comp�tences suivantes :',
  'This extension will install the following subagents:':
    'Cette extension installera les sous-agents suivants :',
  'Installation cancelled for "{{name}}".':
    'Installation annul�e pour "{{name}}".',
  'You are installing an extension from {{originSource}}. Some features may not work perfectly with HopCode.':
    'Vous installez une extension depuis {{originSource}}. Certaines fonctionnalit�s peuvent ne pas fonctionner parfaitement avec HopCode.',
  '--ref and --auto-update are not applicable for marketplace extensions.':
    '--ref et --auto-update ne sont pas applicables aux extensions du marketplace.',
  'Extension "{{name}}" installed successfully and enabled.':
    'Extension "{{name}}" install�e et activ�e avec succ�s.',
  'Installs an extension from a git repository URL, local path, or claude marketplace (marketplace-url:plugin-name).':
    'Installe une extension depuis une URL de d�p�t git, un chemin local ou le marketplace claude (marketplace-url:nom-plugin).',
  'The github URL, local path, or marketplace source (marketplace-url:plugin-name) of the extension to install.':
    "L'URL GitHub, le chemin local ou la source marketplace (marketplace-url:nom-plugin) de l'extension � installer.",
  'The git ref to install from.': 'La r�f�rence git depuis laquelle installer.',
  'Enable auto-update for this extension.':
    'Activer la mise � jour automatique pour cette extension.',
  'Enable pre-release versions for this extension.':
    'Activer les versions pr�-release pour cette extension.',
  'Acknowledge the security risks of installing an extension and skip the confirmation prompt.':
    "Reconna�tre les risques de s�curit� li�s � l'installation d'une extension et ignorer la confirmation.",
  'The source argument must be provided.':
    "L'argument source doit �tre fourni.",
  'Extension "{{name}}" successfully uninstalled.':
    'Extension "{{name}}" d�sinstall�e avec succ�s.',
  'Uninstalls an extension.': 'D�sinstalle une extension.',
  'The name or source path of the extension to uninstall.':
    "Le nom ou le chemin source de l'extension � d�sinstaller.",
  'Please include the name of the extension to uninstall as a positional argument.':
    "Veuillez inclure le nom de l'extension � d�sinstaller comme argument positionnel.",
  'Enables an extension.': 'Active une extension.',
  'The name of the extension to enable.': "Le nom de l'extension � activer.",
  'The scope to enable the extenison in. If not set, will be enabled in all scopes.':
    "La port�e dans laquelle activer l'extension. Si non d�finie, sera activ�e dans toutes les port�es.",
  'Extension "{{name}}" successfully enabled for scope "{{scope}}".':
    'Extension "{{name}}" activ�e avec succ�s pour la port�e "{{scope}}".',
  'Extension "{{name}}" successfully enabled in all scopes.':
    'Extension "{{name}}" activ�e avec succ�s dans toutes les port�es.',
  'Invalid scope: {{scope}}. Please use one of {{scopes}}.':
    "Port�e invalide : {{scope}}. Veuillez utiliser l'une de : {{scopes}}.",
  'Disables an extension.': 'D�sactive une extension.',
  'The name of the extension to disable.':
    "Le nom de l'extension � d�sactiver.",
  'The scope to disable the extenison in.':
    "La port�e dans laquelle d�sactiver l'extension.",
  'Extension "{{name}}" successfully disabled for scope "{{scope}}".':
    'Extension "{{name}}" d�sactiv�e avec succ�s pour la port�e "{{scope}}".',
  'Extension "{{name}}" successfully updated: {{oldVersion}} ? {{newVersion}}.':
    'Extension "{{name}}" mise � jour avec succ�s : {{oldVersion}} ? {{newVersion}}.',
  'Unable to install extension "{{name}}" due to missing install metadata':
    "Impossible d'installer l'extension \"{{name}}\" en raison de m�tadonn�es d'installation manquantes",
  'Extension "{{name}}" is already up to date.':
    'L\'extension "{{name}}" est d�j� � jour.',
  'Updates all extensions or a named extension to the latest version.':
    'Met � jour toutes les extensions ou une extension nomm�e vers la derni�re version.',
  'Update all extensions.': 'Mettre � jour toutes les extensions.',
  'Either an extension name or --all must be provided':
    "Un nom d'extension ou --all doit �tre fourni",
  'Lists installed extensions.': 'Liste les extensions install�es.',
  'Path:': 'Chemin :',
  'Source:': 'Source :',
  'Type:': 'Type :',
  'Ref:': 'R�f :',
  'Release tag:': 'Tag de version :',
  'Enabled (User):': 'Activ� (Utilisateur) :',
  'Enabled (Workspace):': 'Activ� (Espace de travail) :',
  'Context files:': 'Fichiers de contexte :',
  'Skills:': 'Comp�tences :',
  'Agents:': 'Agents :',
  'MCP servers:': 'Serveurs MCP :',
  'Link extension failed to install.':
    "�chec de l'installation de l'extension li�e.",
  'Extension "{{name}}" linked successfully and enabled.':
    'Extension "{{name}}" li�e et activ�e avec succ�s.',
  'Links an extension from a local path. Updates made to the local path will always be reflected.':
    'Lie une extension depuis un chemin local. Les modifications apport�es au chemin local seront toujours refl�t�es.',
  'The name of the extension to link.': "Le nom de l'extension � lier.",
  'Set a specific setting for an extension.':
    'D�finir un param�tre sp�cifique pour une extension.',
  'Name of the extension to configure.': "Nom de l'extension � configurer.",
  'The setting to configure (name or env var).':
    "Le param�tre � configurer (nom ou variable d'environnement).",
  'The scope to set the setting in.':
    'La port�e dans laquelle d�finir le param�tre.',
  'List all settings for an extension.':
    "Lister tous les param�tres d'une extension.",
  'Name of the extension.': "Nom de l'extension.",
  'Extension "{{name}}" has no settings to configure.':
    'L\'extension "{{name}}" n\'a aucun param�tre � configurer.',
  'Settings for "{{name}}":': 'Param�tres pour "{{name}}" :',
  '(workspace)': '(espace de travail)',
  '(user)': '(utilisateur)',
  '[not set]': '[non d�fini]',
  '[value stored in keychain]': '[valeur stock�e dans le trousseau]',
  'Value:': 'Valeur :',
  'Manage extension settings.': 'G�rer les param�tres des extensions.',
  'You need to specify a command (set or list).':
    'Vous devez sp�cifier une commande (set ou list).',

  // ============================================================================
  // Choix de plugin / Marketplace
  // ============================================================================
  'No plugins available in this marketplace.':
    'Aucun plugin disponible dans ce marketplace.',
  'Select a plugin to install from marketplace "{{name}}":':
    'S�lectionnez un plugin � installer depuis le marketplace "{{name}}" :',
  'Plugin selection cancelled.': 'S�lection de plugin annul�e.',
  'Select a plugin from "{{name}}"': 'S�lectionner un plugin depuis "{{name}}"',
  'Use ?? or j/k to navigate, Enter to select, Escape to cancel':
    'Utilisez ?? ou j/k pour naviguer, Entr�e pour s�lectionner, �chap pour annuler',
  '{{count}} more above': '{{count}} de plus au-dessus',
  '{{count}} more below': '{{count}} de plus en dessous',
  'manage IDE integration': "g�rer l'int�gration IDE",
  'check status of IDE integration': "v�rifier le statut de l'int�gration IDE",
  'install required IDE companion for {{ideName}}':
    'installer le compagnon IDE requis pour {{ideName}}',
  'enable IDE integration': "activer l'int�gration IDE",
  'disable IDE integration': "d�sactiver l'int�gration IDE",
  'IDE integration is not supported in your current environment. To use this feature, run HopCode in one of these supported IDEs: VS Code or VS Code forks.':
    "L'int�gration IDE n'est pas prise en charge dans votre environnement actuel. Pour utiliser cette fonctionnalit�, ex�cutez HopCode dans l'un des IDEs pris en charge : VS Code ou ses d�riv�s.",
  'Set up GitHub Actions': 'Configurer GitHub Actions',
  'Configure terminal keybindings for multiline input (VS Code, Cursor, Windsurf, Trae)':
    'Configurer les raccourcis du terminal pour la saisie multiligne (VS Code, Cursor, Windsurf, Trae)',
  'Please restart your terminal for the changes to take effect.':
    'Veuillez red�marrer votre terminal pour que les modifications prennent effet.',
  'Failed to configure terminal: {{error}}':
    '�chec de la configuration du terminal : {{error}}',
  'Could not determine {{terminalName}} config path on Windows: APPDATA environment variable is not set.':
    "Impossible de d�terminer le chemin de configuration de {{terminalName}} sur Windows : la variable d'environnement APPDATA n'est pas d�finie.",
  '{{terminalName}} keybindings.json exists but is not a valid JSON array. Please fix the file manually or delete it to allow automatic configuration.':
    "{{terminalName}} keybindings.json existe mais n'est pas un tableau JSON valide. Veuillez corriger le fichier manuellement ou le supprimer pour permettre la configuration automatique.",
  'File: {{file}}': 'Fichier : {{file}}',
  'Failed to parse {{terminalName}} keybindings.json. The file contains invalid JSON. Please fix the file manually or delete it to allow automatic configuration.':
    "�chec de l'analyse de {{terminalName}} keybindings.json. Le fichier contient du JSON invalide. Veuillez corriger le fichier manuellement ou le supprimer pour permettre la configuration automatique.",
  'Error: {{error}}': 'Erreur : {{error}}',
  'Shift+Enter binding already exists': 'Le raccourci Maj+Entr�e existe d�j�',
  'Ctrl+Enter binding already exists': 'Le raccourci Ctrl+Entr�e existe d�j�',
  'Existing keybindings detected. Will not modify to avoid conflicts.':
    'Raccourcis existants d�tect�s. Aucune modification pour �viter les conflits.',
  'Please check and modify manually if needed: {{file}}':
    'Veuillez v�rifier et modifier manuellement si n�cessaire : {{file}}',
  'Added Shift+Enter and Ctrl+Enter keybindings to {{terminalName}}.':
    'Raccourcis Maj+Entr�e et Ctrl+Entr�e ajout�s � {{terminalName}}.',
  'Modified: {{file}}': 'Modifi� : {{file}}',
  '{{terminalName}} keybindings already configured.':
    'Raccourcis {{terminalName}} d�j� configur�s.',
  'Failed to configure {{terminalName}}.':
    '�chec de la configuration de {{terminalName}}.',
  'Your terminal is already configured for an optimal experience with multiline input (Shift+Enter and Ctrl+Enter).':
    'Votre terminal est d�j� configur� pour une exp�rience optimale avec la saisie multiligne (Maj+Entr�e et Ctrl+Entr�e).',

  // ============================================================================
  // Commandes - Hooks
  // ============================================================================
  'Manage HopCode hooks': 'G�rer les hooks HopCode',
  'List all configured hooks': 'Lister tous les hooks configur�s',
  'Enable a disabled hook': 'Activer un hook d�sactiv�',
  'Disable an active hook': 'D�sactiver un hook actif',
  Hooks: 'Hooks',
  'Loading hooks...': 'Chargement des hooks...',
  'Error loading hooks:': 'Erreur lors du chargement des hooks :',
  'Press Escape to close': 'Appuyez sur �chap pour fermer',
  'Press Escape, Ctrl+C, or Ctrl+D to cancel':
    'Appuyez sur �chap, Ctrl+C ou Ctrl+D pour annuler',
  'Press Space, Enter, or Escape to dismiss':
    'Appuyez sur Espace, Entr�e ou �chap pour ignorer',
  'No hook selected': 'Aucun hook s�lectionn�',
  'No hook events found.': 'Aucun �v�nement de hook trouv�.',
  '{{count}} hook configured': '{{count}} hook configur�',
  '{{count}} hooks configured': '{{count}} hooks configur�s',
  'This menu is read-only. To add or modify hooks, edit settings.json directly or ask HopCode.':
    'Ce menu est en lecture seule. Pour ajouter ou modifier des hooks, �ditez settings.json directement ou demandez � HopCode.',
  'Enter to select � Esc to cancel':
    'Entr�e pour s�lectionner � �chap pour annuler',
  'Exit codes:': 'Codes de sortie :',
  'Configured hooks:': 'Hooks configur�s :',
  'No hooks configured for this event.':
    'Aucun hook configur� pour cet �v�nement.',
  'To add hooks, edit settings.json directly or ask HopCode.':
    'Pour ajouter des hooks, �ditez settings.json directement ou demandez � HopCode.',
  'Enter to select � Esc to go back':
    'Entr�e pour s�lectionner � �chap pour revenir',
  'Hook details': 'D�tails du hook',
  'Event:': '�v�nement :',
  'Extension:': 'Extension :',
  'Desc:': 'Description :',
  'No hook config selected': 'Aucune configuration de hook s�lectionn�e',
  'To modify or remove this hook, edit settings.json directly or ask HopCode to help.':
    'Pour modifier ou supprimer ce hook, �ditez settings.json directement ou demandez � HopCode.',
  'Hook Configuration - Disabled': 'Configuration du hook - D�sactiv�',
  'All hooks are currently disabled. You have {{count}} that are not running.':
    "Tous les hooks sont actuellement d�sactiv�s. Vous en avez {{count}} qui ne s'ex�cutent pas.",
  '{{count}} configured hook': '{{count}} hook configur�',
  '{{count}} configured hooks': '{{count}} hooks configur�s',
  'When hooks are disabled:': 'Quand les hooks sont d�sactiv�s :',
  'No hook commands will execute': "Aucune commande de hook ne s'ex�cutera",
  'StatusLine will not be displayed': 'La barre de statut ne sera pas affich�e',
  'Tool operations will proceed without hook validation':
    "Les op�rations d'outils se poursuivront sans validation des hooks",
  'To re-enable hooks, remove "disableAllHooks" from settings.json or ask HopCode.':
    'Pour r�activer les hooks, supprimez "disableAllHooks" de settings.json ou demandez � HopCode.',
  Project: 'Projet',
  User: 'Utilisateur',
  System: 'Syst�me',
  Extension: 'Extension',
  'Local Settings': 'Param�tres locaux',
  'User Settings': 'Param�tres utilisateur',
  'System Settings': 'Param�tres syst�me',
  Extensions: 'Extensions',
  '? Enabled': '? Activ�',
  '? Disabled': '? D�sactiv�',
  'Before tool execution': "Avant l'ex�cution de l'outil",
  'After tool execution': "Apr�s l'ex�cution de l'outil",
  'After tool execution fails': "Apr�s l'�chec de l'ex�cution de l'outil",
  'When notifications are sent': 'Quand des notifications sont envoy�es',
  'When the user submits a prompt': "Quand l'utilisateur soumet une invite",
  'When a new session is started': 'Quand une nouvelle session est d�marr�e',
  'Right before HopCode concludes its response':
    'Juste avant que HopCode conclue sa r�ponse',
  'When a subagent (Agent tool call) is started':
    "Quand un sous-agent (appel d'outil Agent) est d�marr�",
  'Right before a subagent concludes its response':
    "Juste avant qu'un sous-agent conclue sa r�ponse",
  'Before conversation compaction': 'Avant la compaction de la conversation',
  'When a session is ending': 'Quand une session se termine',
  'When a permission dialog is displayed':
    'Quand un dialogue de permission est affich�',
  'Input to command is JSON of tool call arguments.':
    "L'entr�e de la commande est du JSON des arguments d'appel d'outil.",
  'Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).':
    "L'entr�e de la commande est du JSON avec les champs \"inputs\" (arguments d'appel d'outil) et \"response\" (r�ponse de l'appel d'outil).",
  'Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.':
    "L'entr�e de la commande est du JSON avec tool_name, tool_input, tool_use_id, error, error_type, is_interrupt et is_timeout.",
  'Input to command is JSON with notification message and type.':
    "L'entr�e de la commande est du JSON avec le message et le type de notification.",
  'Input to command is JSON with original user prompt text.':
    "L'entr�e de la commande est du JSON avec le texte d'invite original de l'utilisateur.",
  'Input to command is JSON with session start source.':
    "L'entr�e de la commande est du JSON avec la source de d�marrage de session.",
  'Input to command is JSON with session end reason.':
    "L'entr�e de la commande est du JSON avec la raison de fin de session.",
  'Input to command is JSON with agent_id and agent_type.':
    "L'entr�e de la commande est du JSON avec agent_id et agent_type.",
  'Input to command is JSON with agent_id, agent_type, and agent_transcript_path.':
    "L'entr�e de la commande est du JSON avec agent_id, agent_type et agent_transcript_path.",
  'Input to command is JSON with compaction details.':
    "L'entr�e de la commande est du JSON avec les d�tails de compaction.",
  'Input to command is JSON with tool_name, tool_input, and tool_use_id. Output JSON with hookSpecificOutput containing decision to allow or deny.':
    "L'entr�e de la commande est du JSON avec tool_name, tool_input et tool_use_id. Sortie JSON avec hookSpecificOutput contenant la d�cision d'autoriser ou de refuser.",
  'stdout/stderr not shown': 'stdout/stderr non affich�',
  'show stderr to model and continue conversation':
    'afficher stderr au mod�le et continuer la conversation',
  'show stderr to user only': "afficher stderr � l'utilisateur uniquement",
  'stdout shown in transcript mode (ctrl+o)':
    'stdout affich� en mode transcription (ctrl+o)',
  'show stderr to model immediately': 'afficher stderr au mod�le imm�diatement',
  'show stderr to user only but continue with tool call':
    "afficher stderr � l'utilisateur uniquement mais continuer l'appel d'outil",
  'block processing, erase original prompt, and show stderr to user only':
    "bloquer le traitement, effacer l'invite originale et afficher stderr � l'utilisateur uniquement",
  'stdout shown to HopCode': 'stdout affich� � HopCode',
  'show stderr to user only (blocking errors ignored)':
    "afficher stderr � l'utilisateur uniquement (erreurs bloquantes ignor�es)",
  'command completes successfully': 'la commande se termine avec succ�s',
  'stdout shown to subagent': 'stdout affich� au sous-agent',
  'show stderr to subagent and continue having it run':
    'afficher stderr au sous-agent et continuer son ex�cution',
  'stdout appended as custom compact instructions':
    'stdout ajout� comme instructions compactes personnalis�es',
  'block compaction': 'bloquer la compaction',
  'show stderr to user only but continue with compaction':
    "afficher stderr � l'utilisateur uniquement mais continuer la compaction",
  'use hook decision if provided': 'utiliser la d�cision du hook si fournie',
  'Config not loaded.': 'Configuration non charg�e.',
  'Hooks are not enabled. Enable hooks in settings to use this feature.':
    'Les hooks ne sont pas activ�s. Activez les hooks dans les param�tres pour utiliser cette fonctionnalit�.',
  'No hooks configured. Add hooks in your settings.json file.':
    'Aucun hook configur�. Ajoutez des hooks dans votre fichier settings.json.',
  'Configured Hooks ({{count}} total)': 'Hooks configur�s ({{count}} au total)',

  // ============================================================================
  // Commandes - Export de session
  // ============================================================================
  'Export current session message history to a file':
    "Exporter l'historique des messages de la session actuelle vers un fichier",
  'Export session to HTML format': 'Exporter la session au format HTML',
  'Export session to JSON format': 'Exporter la session au format JSON',
  'Export session to JSONL format (one message per line)':
    'Exporter la session au format JSONL (un message par ligne)',
  'Export session to markdown format': 'Exporter la session au format markdown',

  // ============================================================================
  // Commandes - Insights
  // ============================================================================
  'generate personalized programming insights from your chat history':
    'g�n�rer des insights de programmation personnalis�s depuis votre historique de chat',

  // ============================================================================
  // Commandes - Historique de session
  // ============================================================================
  'Resume a previous session': 'Reprendre une session pr�c�dente',
  'Restore a tool call. This will reset the conversation and file history to the state it was in when the tool call was suggested':
    "Restaurer un appel d'outil. Cela r�initialisera la conversation et l'historique des fichiers � l'�tat o� il se trouvait lors de la suggestion de l'appel d'outil",
  'Could not detect terminal type. Supported terminals: VS Code, Cursor, Windsurf, and Trae.':
    'Impossible de d�tecter le type de terminal. Terminaux pris en charge : VS Code, Cursor, Windsurf et Trae.',
  'Terminal "{{terminal}}" is not supported yet.':
    'Le terminal "{{terminal}}" n\'est pas encore pris en charge.',

  // ============================================================================
  // Commandes - Langue
  // ============================================================================
  'Invalid language. Available: {{options}}':
    'Langue invalide. Disponibles : {{options}}',
  'Language subcommands do not accept additional arguments.':
    "Les sous-commandes de langue n'acceptent pas d'arguments suppl�mentaires.",
  'Current UI language: {{lang}}': "Langue de l'interface actuelle : {{lang}}",
  'Current LLM output language: {{lang}}':
    'Langue de sortie LLM actuelle : {{lang}}',
  'LLM output language not set': 'Langue de sortie LLM non d�finie',
  'Set UI language': "D�finir la langue de l'interface",
  'Set LLM output language': 'D�finir la langue de sortie LLM',
  'Usage: /language ui [{{options}}]':
    'Utilisation : /language ui [{{options}}]',
  'Usage: /language output <language>':
    'Utilisation : /language output <langue>',
  'Example: /language output ??': 'Exemple : /language output ??',
  'Example: /language output English': 'Exemple : /language output English',
  'Example: /language output ???': 'Exemple : /language output ???',
  'Example: /language output Portugu�s': 'Exemple : /language output Portugu�s',
  'UI language changed to {{lang}}':
    "Langue de l'interface chang�e en {{lang}}",
  'LLM output language set to {{lang}}':
    'Langue de sortie LLM d�finie sur {{lang}}',
  'LLM output language rule file generated at {{path}}':
    'Fichier de r�gle de langue de sortie LLM g�n�r� dans {{path}}',
  'Please restart the application for the changes to take effect.':
    "Veuillez red�marrer l'application pour que les modifications prennent effet.",
  'Failed to generate LLM output language rule file: {{error}}':
    '�chec de la g�n�ration du fichier de r�gle de langue de sortie LLM : {{error}}',
  'Invalid command. Available subcommands:':
    'Commande invalide. Sous-commandes disponibles :',
  'Available subcommands:': 'Sous-commandes disponibles :',
  'To request additional UI language packs, please open an issue on GitHub.':
    "Pour demander des packs de langue d'interface suppl�mentaires, veuillez ouvrir un ticket sur GitHub.",
  'Available options:': 'Options disponibles :',
  'Set UI language to {{name}}':
    "D�finir la langue de l'interface sur {{name}}",

  // ============================================================================
  // Commandes - Mode d'approbation
  // ============================================================================
  'Tool Approval Mode': "Mode d'approbation des outils",
  'Current approval mode: {{mode}}': "Mode d'approbation actuel : {{mode}}",
  'Available approval modes:': "Modes d'approbation disponibles :",
  'Approval mode changed to: {{mode}}':
    "Mode d'approbation chang� en : {{mode}}",
  'Approval mode changed to: {{mode}} (saved to {{scope}} settings{{location}})':
    "Mode d'approbation chang� en : {{mode}} (enregistr� dans les param�tres {{scope}}{{location}})",
  'Usage: /approval-mode <mode> [--session|--user|--project]':
    'Utilisation : /approval-mode <mode> [--session|--user|--project]',
  'Scope subcommands do not accept additional arguments.':
    "Les sous-commandes de port�e n'acceptent pas d'arguments suppl�mentaires.",
  'Plan mode - Analyze only, do not modify files or execute commands':
    'Mode plan - Analyser uniquement, ne pas modifier les fichiers ni ex�cuter des commandes',
  'Default mode - Require approval for file edits or shell commands':
    "Mode par d�faut - Demander l'approbation pour les modifications de fichiers ou les commandes shell",
  'Auto-edit mode - Automatically approve file edits':
    'Mode �dition automatique - Approuver automatiquement les modifications de fichiers',
  'IZN mode - Automatically approve all tools':
    'Mode IZN - Approuver automatiquement tous les outils',
  '{{mode}} mode': 'Mode {{mode}}',
  'Settings service is not available; unable to persist the approval mode.':
    "Le service de param�tres n'est pas disponible ; impossible de persister le mode d'approbation.",
  'Failed to save approval mode: {{error}}':
    "�chec de la sauvegarde du mode d'approbation : {{error}}",
  'Failed to change approval mode: {{error}}':
    "�chec du changement du mode d'approbation : {{error}}",
  'Apply to current session only (temporary)':
    'Appliquer uniquement � la session actuelle (temporaire)',
  'Persist for this project/workspace':
    'Persister pour ce projet/espace de travail',
  'Persist for this user on this machine':
    'Persister pour cet utilisateur sur cette machine',
  'Analyze only, do not modify files or execute commands':
    'Analyser uniquement, ne pas modifier les fichiers ni ex�cuter des commandes',
  'Require approval for file edits or shell commands':
    "Demander l'approbation pour les modifications de fichiers ou les commandes shell",
  'Automatically approve file edits':
    'Approuver automatiquement les modifications de fichiers',
  'Automatically approve all tools':
    'Approuver automatiquement tous les outils',
  'Workspace approval mode exists and takes priority. User-level change will have no effect.':
    "Un mode d'approbation d'espace de travail existe et a la priorit�. La modification au niveau utilisateur n'aura aucun effet.",
  'Apply To': 'Appliquer �',
  'Workspace Settings': "Param�tres de l'espace de travail",

  // ============================================================================
  // Commandes - M�moire
  // ============================================================================
  'Commands for interacting with memory.':
    'Commandes pour interagir avec la m�moire.',
  'Show the current memory contents.':
    'Afficher le contenu actuel de la m�moire.',
  'Show project-level memory contents.':
    'Afficher le contenu de la m�moire au niveau du projet.',
  'Show global memory contents.': 'Afficher le contenu de la m�moire globale.',
  'Add content to project-level memory.':
    'Ajouter du contenu � la m�moire au niveau du projet.',
  'Add content to global memory.': 'Ajouter du contenu � la m�moire globale.',
  'Refresh the memory from the source.':
    'Actualiser la m�moire depuis la source.',
  'Usage: /memory add --project <text to remember>':
    'Utilisation : /memory add --project <texte � m�moriser>',
  'Usage: /memory add --global <text to remember>':
    'Utilisation : /memory add --global <texte � m�moriser>',
  'Attempting to save to project memory: "{{text}}"':
    'Tentative de sauvegarde dans la m�moire du projet : "{{text}}"',
  'Attempting to save to global memory: "{{text}}"':
    'Tentative de sauvegarde dans la m�moire globale : "{{text}}"',
  'Current memory content from {{count}} file(s):':
    'Contenu actuel de la m�moire depuis {{count}} fichier(s) :',
  'Memory is currently empty.': 'La m�moire est actuellement vide.',
  'Project memory file not found or is currently empty.':
    'Fichier de m�moire du projet introuvable ou actuellement vide.',
  'Global memory file not found or is currently empty.':
    'Fichier de m�moire globale introuvable ou actuellement vide.',
  'Global memory is currently empty.':
    'La m�moire globale est actuellement vide.',
  'Global memory content:\n\n---\n{{content}}\n---':
    'Contenu de la m�moire globale :\n\n---\n{{content}}\n---',
  'Project memory content from {{path}}:\n\n---\n{{content}}\n---':
    'Contenu de la m�moire du projet depuis {{path}} :\n\n---\n{{content}}\n---',
  'Project memory is currently empty.':
    'La m�moire du projet est actuellement vide.',
  'Refreshing memory from source files...':
    'Actualisation de la m�moire depuis les fichiers sources...',
  'Add content to the memory. Use --global for global memory or --project for project memory.':
    'Ajouter du contenu � la m�moire. Utilisez --global pour la m�moire globale ou --project pour la m�moire du projet.',
  'Usage: /memory add [--global|--project] <text to remember>':
    'Utilisation : /memory add [--global|--project] <texte � m�moriser>',
  'Attempting to save to memory {{scope}}: "{{fact}}"':
    'Tentative de sauvegarde dans la m�moire {{scope}} : "{{fact}}"',

  // ============================================================================
  // Commandes - MCP
  // ============================================================================
  'Authenticate with an OAuth-enabled MCP server':
    'Authentifier avec un serveur MCP compatible OAuth',
  'List configured MCP servers and tools':
    'Lister les serveurs MCP et outils configur�s',
  'Restarts MCP servers.': 'Red�marre les serveurs MCP.',
  'Open MCP management dialog': 'Ouvrir le dialogue de gestion MCP',
  'Could not retrieve tool registry.':
    'Impossible de r�cup�rer le registre des outils.',
  'No MCP servers configured with OAuth authentication.':
    "Aucun serveur MCP configur� avec l'authentification OAuth.",
  'MCP servers with OAuth authentication:':
    'Serveurs MCP avec authentification OAuth :',
  'Use /mcp auth <server-name> to authenticate.':
    'Utilisez /mcp auth <nom-serveur> pour vous authentifier.',
  "MCP server '{{name}}' not found.": "Serveur MCP '{{name}}' introuvable.",
  "Successfully authenticated and refreshed tools for '{{name}}'.":
    "Authentification r�ussie et outils actualis�s pour '{{name}}'.",
  "Failed to authenticate with MCP server '{{name}}': {{error}}":
    "�chec de l'authentification avec le serveur MCP '{{name}}' : {{error}}",
  "Re-discovering tools from '{{name}}'...":
    "Red�couverte des outils depuis '{{name}}'...",
  "Discovered {{count}} tool(s) from '{{name}}'.":
    "{{count}} outil(s) d�couvert(s) depuis '{{name}}'.",
  'Authentication complete. Returning to server details...':
    'Authentification termin�e. Retour aux d�tails du serveur...',
  'Authentication successful.': 'Authentification r�ussie.',
  'If the browser does not open, copy and paste this URL into your browser:':
    "Si le navigateur ne s'ouvre pas, copiez et collez cette URL dans votre navigateur :",
  'Make sure to copy the COMPLETE URL - it may wrap across multiple lines.':
    "Assurez-vous de copier l'URL COMPL�TE - elle peut s'�tendre sur plusieurs lignes.",

  // ============================================================================
  // Bo�te de dialogue de gestion MCP
  // ============================================================================
  'Manage MCP servers': 'G�rer les serveurs MCP',
  'Server Detail': 'D�tail du serveur',
  'Disable Server': 'D�sactiver le serveur',
  Tools: 'Outils',
  'Tool Detail': "D�tail de l'outil",
  'MCP Management': 'Gestion MCP',
  'Loading...': 'Chargement...',
  'Unknown step': '�tape inconnue',
  'Esc to back': '�chap pour revenir',
  '?? to navigate � Enter to select � Esc to close':
    '?? pour naviguer � Entr�e pour s�lectionner � �chap pour fermer',
  '?? to navigate � Enter to select � Esc to back':
    '?? pour naviguer � Entr�e pour s�lectionner � �chap pour revenir',
  '?? to navigate � Enter to confirm � Esc to back':
    '?? pour naviguer � Entr�e pour confirmer � �chap pour revenir',
  'User Settings (global)': 'Param�tres utilisateur (global)',
  'Workspace Settings (project-specific)':
    'Param�tres espace de travail (sp�cifique au projet)',
  'Disable server:': 'D�sactiver le serveur :',
  'Select where to add the server to the exclude list:':
    "S�lectionnez o� ajouter le serveur � la liste d'exclusion :",
  'Press Enter to confirm, Esc to cancel':
    'Appuyez sur Entr�e pour confirmer, �chap pour annuler',
  'View tools': 'Voir les outils',
  Reconnect: 'Reconnecter',
  Enable: 'Activer',
  Disable: 'D�sactiver',
  Authenticate: 'Authentifier',
  'Re-authenticate': 'R�authentifier',
  'Clear Authentication': "Effacer l'authentification",
  'Server:': 'Serveur :',
  'Command:': 'Commande :',
  'Working Directory:': 'R�pertoire de travail :',
  'Capabilities:': 'Capacit�s :',
  'No server selected': 'Aucun serveur s�lectionn�',
  prompts: 'invites',
  '(disabled)': '(d�sactiv�)',
  'Error:': 'Erreur :',
  tool: 'outil',
  tools: 'outils',
  connected: 'connect�',
  connecting: 'connexion en cours',
  disconnected: 'd�connect�',
  'User MCPs': 'MCPs utilisateur',
  'Project MCPs': 'MCPs projet',
  'Extension MCPs': "MCPs d'extension",
  server: 'serveur',
  servers: 'serveurs',
  'Add MCP servers to your settings to get started.':
    'Ajoutez des serveurs MCP � vos param�tres pour commencer.',
  'Run hopcode --debug to see error logs':
    "Ex�cutez hopcode --debug pour voir les journaux d'erreurs",
  'OAuth Authentication': 'Authentification OAuth',
  'Press Enter to start authentication, Esc to go back':
    "Appuyez sur Entr�e pour d�marrer l'authentification, �chap pour revenir",
  'Authenticating... Please complete the login in your browser.':
    'Authentification... Veuillez compl�ter la connexion dans votre navigateur.',
  'Press Enter or Esc to go back': 'Appuyez sur Entr�e ou �chap pour revenir',
  'No tools available for this server.':
    'Aucun outil disponible pour ce serveur.',
  destructive: 'destructif',
  'read-only': 'lecture seule',
  'open-world': 'monde ouvert',
  idempotent: 'idempotent',
  'Tools for {{name}}': 'Outils pour {{name}}',
  'Tools for {{serverName}}': 'Outils pour {{serverName}}',
  '{{current}}/{{total}}': '{{current}}/{{total}}',
  required: 'requis',
  Type: 'Type',
  Enum: 'Enum',
  Parameters: 'Param�tres',
  'No tool selected': 'Aucun outil s�lectionn�',
  Annotations: 'Annotations',
  Title: 'Titre',
  'Read Only': 'Lecture seule',
  Destructive: 'Destructif',
  Idempotent: 'Idempotent',
  'Open World': 'Monde ouvert',
  Server: 'Serveur',
  '{{count}} invalid tools': '{{count}} outils invalides',
  invalid: 'invalide',
  'invalid: {{reason}}': 'invalide : {{reason}}',
  'missing name': 'nom manquant',
  'missing description': 'description manquante',
  '(unnamed)': '(sans nom)',
  'Warning: This tool cannot be called by the LLM':
    'Avertissement : Cet outil ne peut pas �tre appel� par le LLM',
  Reason: 'Raison',
  'Tools must have both name and description to be used by the LLM.':
    'Les outils doivent avoir un nom et une description pour �tre utilis�s par le LLM.',

  // ============================================================================
  // Commandes - Chat
  // ============================================================================
  'Manage conversation history.': "G�rer l'historique des conversations.",
  'List saved conversation checkpoints':
    'Lister les points de contr�le de conversation sauvegard�s',
  'No saved conversation checkpoints found.':
    'Aucun point de contr�le de conversation sauvegard� trouv�.',
  'List of saved conversations:': 'Liste des conversations sauvegard�es :',
  'Note: Newest last, oldest first':
    'Note : Du plus r�cent au plus ancien en dernier, du plus ancien en premier',
  'Save the current conversation as a checkpoint. Usage: /chat save <tag>':
    'Sauvegarder la conversation actuelle comme point de contr�le. Utilisation : /chat save <�tiquette>',
  'Missing tag. Usage: /chat save <tag>':
    '�tiquette manquante. Utilisation : /chat save <�tiquette>',
  'Delete a conversation checkpoint. Usage: /chat delete <tag>':
    'Supprimer un point de contr�le de conversation. Utilisation : /chat delete <�tiquette>',
  'Missing tag. Usage: /chat delete <tag>':
    '�tiquette manquante. Utilisation : /chat delete <�tiquette>',
  "Conversation checkpoint '{{tag}}' has been deleted.":
    "Le point de contr�le de conversation '{{tag}}' a �t� supprim�.",
  "Error: No checkpoint found with tag '{{tag}}'.":
    "Erreur : Aucun point de contr�le trouv� avec l'�tiquette '{{tag}}'.",
  'Resume a conversation from a checkpoint. Usage: /chat resume <tag>':
    'Reprendre une conversation depuis un point de contr�le. Utilisation : /chat resume <�tiquette>',
  'Missing tag. Usage: /chat resume <tag>':
    '�tiquette manquante. Utilisation : /chat resume <�tiquette>',
  'No saved checkpoint found with tag: {{tag}}.':
    "Aucun point de contr�le sauvegard� trouv� avec l'�tiquette : {{tag}}.",
  'A checkpoint with the tag {{tag}} already exists. Do you want to overwrite it?':
    "Un point de contr�le avec l'�tiquette {{tag}} existe d�j�. Voulez-vous l'�craser ?",
  'No chat client available to save conversation.':
    'Aucun client de chat disponible pour sauvegarder la conversation.',
  'Conversation checkpoint saved with tag: {{tag}}.':
    "Point de contr�le de conversation sauvegard� avec l'�tiquette : {{tag}}.",
  'No conversation found to save.':
    'Aucune conversation trouv�e � sauvegarder.',
  'No chat client available to share conversation.':
    'Aucun client de chat disponible pour partager la conversation.',
  'Invalid file format. Only .md and .json are supported.':
    'Format de fichier invalide. Seuls .md et .json sont pris en charge.',
  'Error sharing conversation: {{error}}':
    'Erreur lors du partage de la conversation : {{error}}',
  'Conversation shared to {{filePath}}':
    'Conversation partag�e vers {{filePath}}',
  'No conversation found to share.': 'Aucune conversation trouv�e � partager.',
  'Share the current conversation to a markdown or json file. Usage: /chat share <file>':
    'Partager la conversation actuelle vers un fichier markdown ou json. Utilisation : /chat share <fichier>',

  // ============================================================================
  // Commandes - R�sum�
  // ============================================================================
  'Generate a project summary and save it to .hopcode/PROJECT_SUMMARY.md':
    "G�n�rer un r�sum� du projet et l'enregistrer dans .hopcode/PROJECT_SUMMARY.md",
  'No chat client available to generate summary.':
    'Aucun client de chat disponible pour g�n�rer le r�sum�.',
  'Already generating summary, wait for previous request to complete':
    'G�n�ration de r�sum� d�j� en cours, attendez que la demande pr�c�dente se termine',
  'No conversation found to summarize.':
    'Aucune conversation trouv�e � r�sumer.',
  'Failed to generate project context summary: {{error}}':
    '�chec de la g�n�ration du r�sum� du contexte du projet : {{error}}',
  'Saved project summary to {{filePathForDisplay}}.':
    'R�sum� du projet enregistr� dans {{filePathForDisplay}}.',
  'Saving project summary...': 'Enregistrement du r�sum� du projet...',
  'Generating project summary...': 'G�n�ration du r�sum� du projet...',
  'Failed to generate summary - no text content received from LLM response':
    '�chec de la g�n�ration du r�sum� - aucun contenu texte re�u de la r�ponse LLM',

  // ============================================================================
  // Commandes - Mod�le
  // ============================================================================
  'Switch the model for this session (--fast for suggestion model, [model-id] to switch immediately).':
    'Changer le modèle pour cette session (--fast pour le modèle de suggestion)',
  'Set a lighter model for prompt suggestions and speculative execution':
    "D�finir un mod�le plus l�ger pour les suggestions d'invite et l'ex�cution sp�culative",
  'Content generator configuration not available.':
    'Configuration du g�n�rateur de contenu non disponible.',
  'Authentication type not available.':
    "Type d'authentification non disponible.",
  'No models available for the current authentication type ({{authType}}).':
    "Aucun modèle disponible pour le type d'authentification actuel ({{authType}}).",
  // Needs translation
  ' (not in model registry)': ' (not in model registry)',

  // ============================================================================
  // Commandes - Effacer
  // ============================================================================
  'Starting a new session, resetting chat, and clearing terminal.':
    "D�marrage d'une nouvelle session, r�initialisation du chat et effacement du terminal.",
  'Starting a new session and clearing.':
    "D�marrage d'une nouvelle session et effacement.",

  // ============================================================================
  // Commandes - Compresser
  // ============================================================================
  'Already compressing, wait for previous request to complete':
    'Compression d�j� en cours, attendez que la demande pr�c�dente se termine',
  'Failed to compress chat history.':
    "�chec de la compression de l'historique du chat.",
  'Failed to compress chat history: {{error}}':
    "�chec de la compression de l'historique du chat : {{error}}",
  'Compressing chat history': "Compression de l'historique du chat",
  'Chat history compressed from {{originalTokens}} to {{newTokens}} tokens.':
    "L'historique du chat a �t� compress� de {{originalTokens}} � {{newTokens}} tokens.",
  'Compression was not beneficial for this history size.':
    "La compression n'�tait pas b�n�fique pour cette taille d'historique.",
  'Chat history compression did not reduce size. This may indicate issues with the compression prompt.':
    "La compression de l'historique du chat n'a pas r�duit la taille. Cela peut indiquer des probl�mes avec l'invite de compression.",
  'Could not compress chat history due to a token counting error.':
    "Impossible de compresser l'historique du chat en raison d'une erreur de comptage de tokens.",
  'Chat history is already compressed.':
    "L'historique du chat est d�j� compress�.",

  // ============================================================================
  // Commandes - R�pertoire
  // ============================================================================
  'Configuration is not available.': 'Configuration non disponible.',
  'Please provide at least one path to add.':
    'Veuillez fournir au moins un chemin � ajouter.',
  'The /directory add command is not supported in restrictive sandbox profiles. Please use --include-directories when starting the session instead.':
    "La commande /directory add n'est pas prise en charge dans les profils de bac � sable restrictifs. Utilisez plut�t --include-directories lors du d�marrage de la session.",
  "Error adding '{{path}}': {{error}}":
    "Erreur lors de l'ajout de '{{path}}' : {{error}}",
  'Successfully added HOPCODE.md files from the following directories if there are:\n- {{directories}}':
    "Fichiers HOPCODE.md ajout�s avec succ�s depuis les r�pertoires suivants s'ils existent :\n- {{directories}}",
  'Error refreshing memory: {{error}}':
    "Erreur lors de l'actualisation de la m�moire : {{error}}",
  'Successfully added directories:\n- {{directories}}':
    'R�pertoires ajout�s avec succ�s :\n- {{directories}}',
  'Current workspace directories:\n{{directories}}':
    "R�pertoires actuels de l'espace de travail :\n{{directories}}",

  // ============================================================================
  // Commandes - Documentation
  // ============================================================================
  'Please open the following URL in your browser to view the documentation:\n{{url}}':
    "Veuillez ouvrir l'URL suivante dans votre navigateur pour voir la documentation :\n{{url}}",
  'Opening documentation in your browser: {{url}}':
    'Ouverture de la documentation dans votre navigateur : {{url}}',

  // ============================================================================
  // Bo�tes de dialogue - Confirmation d'outil
  // ============================================================================
  'Do you want to proceed?': 'Voulez-vous continuer ?',
  'Yes, allow once': 'Oui, autoriser une fois',
  'Allow always': 'Toujours autoriser',
  Yes: 'Oui',
  No: 'Non',
  'No (esc)': 'Non (�chap)',
  'Yes, allow always for this session':
    'Oui, toujours autoriser pour cette session',
  'Modify in progress:': 'Modification en cours :',
  'Save and close external editor to continue':
    "Enregistrez et fermez l'�diteur externe pour continuer",
  'Apply this change?': 'Appliquer cette modification ?',
  'Yes, allow always': 'Oui, toujours autoriser',
  'Modify with external editor': "Modifier avec l'�diteur externe",
  'No, suggest changes (esc)': 'Non, sugg�rer des modifications (�chap)',
  "Allow execution of: '{{command}}'?":
    "Autoriser l'ex�cution de : '{{command}}' ?",
  'Yes, allow always ...': 'Oui, toujours autoriser ...',
  'Always allow in this project': 'Toujours autoriser dans ce projet',
  'Always allow {{action}} in this project':
    'Toujours autoriser {{action}} dans ce projet',
  'Always allow for this user': 'Toujours autoriser pour cet utilisateur',
  'Always allow {{action}} for this user':
    'Toujours autoriser {{action}} pour cet utilisateur',
  'Yes, restore previous mode ({{mode}})':
    'Oui, restaurer le mode pr�c�dent ({{mode}})',
  'Yes, and auto-accept edits':
    'Oui, et accepter automatiquement les modifications',
  'Yes, and manually approve edits':
    'Oui, et approuver manuellement les modifications',
  'No, keep planning (esc)': 'Non, continuer la planification (�chap)',
  'URLs to fetch:': 'URLs � r�cup�rer :',
  'MCP Server: {{server}}': 'Serveur MCP : {{server}}',
  'Tool: {{tool}}': 'Outil : {{tool}}',
  'Allow execution of MCP tool "{{tool}}" from server "{{server}}"?':
    'Autoriser l\'ex�cution de l\'outil MCP "{{tool}}" depuis le serveur "{{server}}" ?',
  'Yes, always allow tool "{{tool}}" from server "{{server}}"':
    'Oui, toujours autoriser l\'outil "{{tool}}" depuis le serveur "{{server}}"',
  'Yes, always allow all tools from server "{{server}}"':
    'Oui, toujours autoriser tous les outils depuis le serveur "{{server}}"',

  // ============================================================================
  // Bo�tes de dialogue - Confirmation shell
  // ============================================================================
  'Shell Command Execution': 'Ex�cution de commande shell',
  'A custom command wants to run the following shell commands:':
    'Une commande personnalis�e veut ex�cuter les commandes shell suivantes :',

  // ============================================================================
  // Bo�tes de dialogue - Quota Pro
  // ============================================================================
  'Pro quota limit reached for {{model}}.':
    'Limite de quota Pro atteinte pour {{model}}.',
  'Change auth (executes the /auth command)':
    "Changer l'authentification (ex�cute la commande /auth)",
  'Continue with {{model}}': 'Continuer avec {{model}}',

  // ============================================================================
  // Bo�tes de dialogue - Bienvenue
  // ============================================================================
  'Current Plan:': 'Plan actuel :',
  'Progress: {{done}}/{{total}} tasks completed':
    'Progression : {{done}}/{{total}} t�ches termin�es',
  ', {{inProgress}} in progress': ', {{inProgress}} en cours',
  'Pending Tasks:': 'T�ches en attente :',
  'What would you like to do?': 'Que souhaitez-vous faire ?',
  'Choose how to proceed with your session:':
    'Choisissez comment poursuivre votre session :',
  'Start new chat session': 'D�marrer une nouvelle session de chat',
  'Continue previous conversation': 'Continuer la conversation pr�c�dente',
  '?? Welcome back! (Last updated: {{timeAgo}})':
    '?? Bon retour ! (Derni�re mise � jour : {{timeAgo}})',
  '?? Overall Goal:': '?? Objectif global :',

  // ============================================================================
  // Bo�tes de dialogue - Authentification
  // ============================================================================
  'Get started': 'Commencer',
  'Select Authentication Method': "S�lectionner la m�thode d'authentification",
  'OpenAI API key is required to use OpenAI authentication.':
    "Une cl� API OpenAI est requise pour utiliser l'authentification OpenAI.",
  'You must select an auth method to proceed. Press Ctrl+C again to exit.':
    "Vous devez s�lectionner une m�thode d'authentification pour continuer. Appuyez � nouveau sur Ctrl+C pour quitter.",
  'Terms of Services and Privacy Notice':
    "Conditions d'utilisation et avis de confidentialit�",
  'HopCode OAuth': 'Legacy OAuth',
  'Discontinued � switch to Coding Plan or API Key':
    'Abandonn� � passez � Coding Plan ou API Key',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Run /auth to switch provider.':
    'Le niveau gratuit Legacy OAuth a �t� abandonn� le 2026-04-15. Ex�cutez /auth pour changer de fournisseur.',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Please select Coding Plan or API Key instead.':
    'Le niveau gratuit Legacy OAuth a �t� abandonn� le 2026-04-15. Veuillez s�lectionner Coding Plan ou API Key.',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Please select a model from another provider or run /auth to switch.':
    "Le niveau gratuit de Legacy OAuth a �t� abandonn� le 2026-04-15. Veuillez s�lectionner un mod�le d'un autre fournisseur ou ex�cuter /auth pour changer.",
  '\n? HopCode OAuth free tier was discontinued on 2026-04-15. Please select another option.\n':
    '\n? Le niveau gratuit Legacy OAuth a �t� abandonn� le 2026-04-15. Veuillez s�lectionner une autre option.\n',
  'Paid \u00B7 Up to 6,000 requests/5 hrs \u00B7 All Alibaba Cloud Coding Plan Models':
    "Payant � Jusqu'� 6 000 requ�tes/5h � Tous les mod�les Alibaba Cloud Coding Plan",
  'Alibaba Cloud Coding Plan': 'Plan de codage Alibaba Cloud',
  'Bring your own API key': 'Apportez votre propre cl� API',
  'Browser-based authentication with third-party providers (e.g. OpenRouter, ModelScope)':
    'Authentification bas�e sur le navigateur avec des fournisseurs tiers (par exemple OpenRouter, ModelScope)',
  'API-KEY': 'CL�-API',
  'Use coding plan credentials or your own api-keys/providers.':
    'Utilisez les identifiants du plan de codage ou vos propres cl�s API/fournisseurs.',
  OpenAI: 'OpenAI',
  'Failed to login. Message: {{message}}':
    '�chec de la connexion. Message : {{message}}',
  'Authentication is enforced to be {{enforcedType}}, but you are currently using {{currentType}}.':
    "L'authentification est impos�e � {{enforcedType}}, mais vous utilisez actuellement {{currentType}}.",
  'HopCode OAuth authentication timed out. Please try again.':
    "L'authentification Legacy OAuth a expir�. Veuillez r�essayer.",
  'HopCode OAuth authentication cancelled.':
    'Authentification Legacy OAuth annul�e.',
  'HopCode OAuth Authentication': 'Authentification Legacy OAuth',
  'Please visit this URL to authorize:':
    'Veuillez visiter cette URL pour autoriser :',
  'Or scan the QR code below:': 'Ou scannez le QR code ci-dessous :',
  'Waiting for authorization': "En attente d'autorisation",
  'Time remaining:': 'Temps restant :',
  '(Press ESC or CTRL+C to cancel)':
    '(Appuyez sur �CHAP ou CTRL+C pour annuler)',
  'HopCode OAuth Authentication Timeout':
    "D�lai d'authentification Legacy OAuth",
  'OAuth token expired (over {{seconds}} seconds). Please select authentication method again.':
    "Token OAuth expir� (plus de {{seconds}} secondes). Veuillez s�lectionner � nouveau la m�thode d'authentification.",
  'Press any key to return to authentication type selection.':
    "Appuyez sur n'importe quelle touche pour revenir � la s�lection du type d'authentification.",
  'Waiting for HopCode OAuth authentication...':
    "En attente de l'authentification Legacy OAuth...",
  'Note: Your existing API key in settings.json will not be cleared when using HopCode OAuth. You can switch back to OpenAI authentication later if needed.':
    "Remarque : Votre cl� API existante dans settings.json ne sera pas effac�e lors de l'utilisation de Legacy OAuth. Vous pouvez revenir � l'authentification OpenAI plus tard si n�cessaire.",
  'Note: Your existing API key will not be cleared when using HopCode OAuth.':
    "Remarque : Votre cl� API existante ne sera pas effac�e lors de l'utilisation de Legacy OAuth.",
  'Authentication timed out. Please try again.':
    "L'authentification a expir�. Veuillez r�essayer.",
  'Waiting for auth... (Press ESC or CTRL+C to cancel)':
    "En attente d'authentification... (Appuyez sur �CHAP ou CTRL+C pour annuler)",
  'Missing API key for OpenAI-compatible auth. Set settings.security.auth.apiKey, or set the {{envKeyHint}} environment variable.':
    "Cl� API manquante pour l'authentification compatible OpenAI. D�finissez settings.security.auth.apiKey ou la variable d'environnement {{envKeyHint}}.",
  '{{envKeyHint}} environment variable not found.':
    "Variable d'environnement {{envKeyHint}} introuvable.",
  '{{envKeyHint}} environment variable not found. Please set it in your .env file or environment variables.':
    "Variable d'environnement {{envKeyHint}} introuvable. Veuillez la d�finir dans votre fichier .env ou les variables d'environnement.",
  '{{envKeyHint}} environment variable not found (or set settings.security.auth.apiKey). Please set it in your .env file or environment variables.':
    "Variable d'environnement {{envKeyHint}} introuvable (ou d�finissez settings.security.auth.apiKey). Veuillez la d�finir dans votre fichier .env ou les variables d'environnement.",
  'Missing API key for OpenAI-compatible auth. Set the {{envKeyHint}} environment variable.':
    "Cl� API manquante pour l'authentification compatible OpenAI. D�finissez la variable d'environnement {{envKeyHint}}.",
  'Anthropic provider missing required baseUrl in modelProviders[].baseUrl.':
    'Le fournisseur Anthropic manque le baseUrl requis dans modelProviders[].baseUrl.',
  'ANTHROPIC_BASE_URL environment variable not found.':
    "Variable d'environnement ANTHROPIC_BASE_URL introuvable.",
  'Invalid auth method selected.':
    "M�thode d'authentification invalide s�lectionn�e.",
  'Failed to authenticate. Message: {{message}}':
    "�chec de l'authentification. Message : {{message}}",
  'Authenticated successfully with {{authType}} credentials.':
    'Authentification r�ussie avec les identifiants {{authType}}.',
  'Invalid HOPCODE_DEFAULT_AUTH_TYPE value: "{{value}}". Valid values are: {{validValues}}':
    'Valeur HOPCODE_DEFAULT_AUTH_TYPE invalide : "{{value}}". Valeurs valides : {{validValues}}',
  'OpenAI Configuration Required': 'Configuration OpenAI requise',
  'Please enter your OpenAI configuration. You can get an API key from':
    'Veuillez entrer votre configuration OpenAI. Vous pouvez obtenir une cl� API depuis',
  'API Key:': 'Cl� API :',
  'Invalid credentials: {{errorMessage}}':
    'Identifiants invalides : {{errorMessage}}',
  'Failed to validate credentials': '�chec de la validation des identifiants',
  'Press Enter to continue, Tab/?? to navigate, Esc to cancel':
    'Appuyez sur Entr�e pour continuer, Tab/?? pour naviguer, �chap pour annuler',

  // ============================================================================
  // Bo�tes de dialogue - Mod�le
  // ============================================================================
  'Select Model': 'S�lectionner un mod�le',
  '(Press Esc to close)': '(Appuyez sur �chap pour fermer)',
  'Current (effective) configuration': 'Configuration actuelle (effective)',
  AuthType: "Type d'auth",
  'API Key': 'Cl� API',
  unset: 'non d�fini',
  '(default)': '(par d�faut)',
  '(set)': '(d�fini)',
  '(not set)': '(non d�fini)',
  Modality: 'Modalit�',
  'Context Window': 'Fen�tre de contexte',
  text: 'texte',
  'text-only': 'texte uniquement',
  image: 'image',
  pdf: 'pdf',
  audio: 'audio',
  video: 'vid�o',
  'not set': 'non d�fini',
  none: 'aucun',
  unknown: 'inconnu',
  "Failed to switch model to '{{modelId}}'.\n\n{{error}}":
    "�chec du changement de mod�le vers '{{modelId}}'.\n\n{{error}}",
  'Qwen 3.6 Plus � efficient hybrid model with leading coding performance':
    'Qwen 3.6 Plus � mod�le hybride efficace avec des performances de codage de pointe',
  'The latest HopCode Vision model from Alibaba Cloud ModelStudio (version: qwen3-vl-plus-2025-09-23)':
    "Le dernier mod�le HopCode Vision d'Alibaba Cloud ModelStudio (version : qwen3-vl-plus-2025-09-23)",

  // ============================================================================
  // Bo�tes de dialogue - Permissions
  // ============================================================================
  'Manage folder trust settings':
    'G�rer les param�tres de confiance des dossiers',
  'Manage permission rules': 'G�rer les r�gles de permission',
  Allow: 'Autoriser',
  Ask: 'Demander',
  Deny: 'Refuser',
  Workspace: 'Espace de travail',
  "HopCode won't ask before using allowed tools.":
    "HopCode ne demandera pas avant d'utiliser les outils autoris�s.",
  'HopCode will ask before using these tools.':
    "HopCode demandera avant d'utiliser ces outils.",
  'HopCode is not allowed to use denied tools.':
    "HopCode n'est pas autoris� � utiliser les outils refus�s.",
  'Manage trusted directories for this workspace.':
    'G�rer les r�pertoires de confiance pour cet espace de travail.',
  'Any use of the {{tool}} tool': "Toute utilisation de l'outil {{tool}}",
  "{{tool}} commands matching '{{pattern}}'":
    "Commandes {{tool}} correspondant � '{{pattern}}'",
  'From user settings': 'Depuis les param�tres utilisateur',
  'From project settings': 'Depuis les param�tres du projet',
  'From session': 'Depuis la session',
  'Project settings (local)': 'Param�tres du projet (local)',
  'Saved in .hopcode/settings.local.json':
    'Enregistr� dans .hopcode/settings.local.json',
  'Project settings': 'Param�tres du projet',
  'Checked in at .hopcode/settings.json': 'Valid� dans .hopcode/settings.json',
  'User settings': 'Param�tres utilisateur',
  'Saved in at ~/.hopcode/settings.json':
    'Enregistr� dans ~/.hopcode/settings.json',
  'Add a new rule�': 'Ajouter une nouvelle r�gle�',
  'Add {{type}} permission rule': 'Ajouter une r�gle de permission {{type}}',
  'Permission rules are a tool name, optionally followed by a specifier in parentheses.':
    "Les r�gles de permission sont un nom d'outil, suivi optionnellement d'un sp�cificateur entre parenth�ses.",
  'e.g.,': 'ex.,',
  or: 'ou',
  'Enter permission rule�': 'Entrer une r�gle de permission�',
  'Enter to submit � Esc to cancel':
    'Entr�e pour soumettre � �chap pour annuler',
  'Where should this rule be saved?':
    'O� cette r�gle doit-elle �tre enregistr�e ?',
  'Enter to confirm � Esc to cancel':
    'Entr�e pour confirmer � �chap pour annuler',
  'Delete {{type}} rule?': 'Supprimer la r�gle {{type}} ?',
  'Are you sure you want to delete this permission rule?':
    '�tes-vous s�r de vouloir supprimer cette r�gle de permission ?',
  'Permissions:': 'Permissions :',
  '(?/? or tab to cycle)': '(?/? ou tab pour cycler)',
  'Press ?? to navigate � Enter to select � Type to search � Esc to cancel':
    'Appuyez sur ?? pour naviguer � Entr�e pour s�lectionner � Tapez pour rechercher � �chap pour annuler',
  'Search�': 'Rechercher�',
  'Use /trust to manage folder trust settings for this workspace.':
    'Utilisez /trust pour g�rer les param�tres de confiance des dossiers pour cet espace de travail.',
  'Add directory�': 'Ajouter un r�pertoire�',
  'Add directory to workspace': "Ajouter un r�pertoire � l'espace de travail",
  'HopCode can read files in the workspace, and make edits when auto-accept edits is on.':
    "HopCode peut lire les fichiers dans l'espace de travail et effectuer des modifications lorsque l'acceptation automatique est activ�e.",
  'HopCode will be able to read files in this directory and make edits when auto-accept edits is on.':
    "HopCode pourra lire les fichiers dans ce r�pertoire et effectuer des modifications lorsque l'acceptation automatique est activ�e.",
  'Enter the path to the directory:': 'Entrez le chemin vers le r�pertoire :',
  'Enter directory path�': 'Entrez le chemin du r�pertoire�',
  'Tab to complete � Enter to add � Esc to cancel':
    'Tab pour compl�ter � Entr�e pour ajouter � �chap pour annuler',
  'Remove directory?': 'Supprimer le r�pertoire ?',
  'Are you sure you want to remove this directory from the workspace?':
    "�tes-vous s�r de vouloir supprimer ce r�pertoire de l'espace de travail ?",
  '  (Original working directory)': "  (R�pertoire de travail d'origine)",
  '  (from settings)': '  (depuis les param�tres)',
  'Directory does not exist.': "Le r�pertoire n'existe pas.",
  'Path is not a directory.': "Le chemin n'est pas un r�pertoire.",
  'This directory is already in the workspace.':
    "Ce r�pertoire est d�j� dans l'espace de travail.",
  'Already covered by existing directory: {{dir}}':
    'D�j� couvert par le r�pertoire existant : {{dir}}',

  // ============================================================================
  // Barre de statut
  // ============================================================================
  'Using:': 'Utilisation :',
  '{{count}} open file': '{{count}} fichier ouvert',
  '{{count}} open files': '{{count}} fichiers ouverts',
  '(ctrl+g to view)': '(ctrl+g pour afficher)',
  '{{count}} {{name}} file': '{{count}} fichier {{name}}',
  '{{count}} {{name}} files': '{{count}} fichiers {{name}}',
  '{{count}} MCP server': '{{count}} serveur MCP',
  '{{count}} MCP servers': '{{count}} serveurs MCP',
  '{{count}} Blocked': '{{count}} bloqu�(s)',
  '(ctrl+t to view)': '(ctrl+t pour afficher)',
  '(ctrl+t to toggle)': '(ctrl+t pour basculer)',
  'Press Ctrl+C again to exit.': 'Appuyez � nouveau sur Ctrl+C pour quitter.',
  'Press Ctrl+D again to exit.': 'Appuyez � nouveau sur Ctrl+D pour quitter.',
  'Press Esc again to clear.': 'Appuyez � nouveau sur �chap pour effacer.',

  // ============================================================================
  // Statut MCP
  // ============================================================================
  'No MCP servers configured.': 'Aucun serveur MCP configur�.',
  '? MCP servers are starting up ({{count}} initializing)...':
    '? Les serveurs MCP d�marrent ({{count}} en initialisation)...',
  'Note: First startup may take longer. Tool availability will update automatically.':
    'Remarque : Le premier d�marrage peut prendre plus de temps. La disponibilit� des outils se mettra � jour automatiquement.',
  'Configured MCP servers:': 'Serveurs MCP configur�s :',
  Ready: 'Pr�t',
  'Starting... (first startup may take longer)':
    'D�marrage... (le premier d�marrage peut prendre plus de temps)',
  Disconnected: 'D�connect�',
  '{{count}} tool': '{{count}} outil',
  '{{count}} tools': '{{count}} outils',
  '{{count}} prompt': '{{count}} invite',
  '{{count}} prompts': '{{count}} invites',
  '(from {{extensionName}})': '(depuis {{extensionName}})',
  OAuth: 'OAuth',
  'OAuth expired': 'OAuth expir�',
  'OAuth not authenticated': 'OAuth non authentifi�',
  'tools and prompts will appear when ready':
    'les outils et invites appara�tront quand pr�ts',
  '{{count}} tools cached': '{{count}} outils mis en cache',
  'Tools:': 'Outils :',
  'Parameters:': 'Param�tres :',
  'Prompts:': 'Invites :',
  Blocked: 'Bloqu�',
  '?? Tips:': '?? Conseils :',
  Use: 'Utilisez',
  'to show server and tool descriptions':
    'pour afficher les descriptions des serveurs et des outils',
  'to show tool parameter schemas':
    'pour afficher les sch�mas de param�tres des outils',
  'to hide descriptions': 'pour masquer les descriptions',
  'to authenticate with OAuth-enabled servers':
    'pour authentifier avec des serveurs compatibles OAuth',
  Press: 'Appuyez sur',
  'to toggle tool descriptions on/off':
    'pour activer/d�sactiver les descriptions des outils',
  "Starting OAuth authentication for MCP server '{{name}}'...":
    "D�marrage de l'authentification OAuth pour le serveur MCP '{{name}}'...",
  'Restarting MCP servers...': 'Red�marrage des serveurs MCP...',

  // ============================================================================
  // Conseils de d�marrage
  // ============================================================================
  'Tips:': 'Conseils :',
  'Use /compress when the conversation gets long to summarize history and free up context.':
    "Utilisez /compress quand la conversation devient longue pour r�sumer l'historique et lib�rer le contexte.",
  'Start a fresh idea with /clear or /new; the previous session stays available in history.':
    "Commencez une nouvelle id�e avec /clear ou /new ; la session pr�c�dente reste disponible dans l'historique.",
  'Use /bug to submit issues to the maintainers when something goes off.':
    'Utilisez /bug pour soumettre des probl�mes aux mainteneurs quand quelque chose ne va pas.',
  'Switch auth type quickly with /auth.':
    "Changez rapidement le type d'authentification avec /auth.",
  'You can run any shell commands from HopCode using ! (e.g. !ls).':
    "Vous pouvez ex�cuter n'importe quelle commande shell depuis HopCode en utilisant ! (ex. !ls).",
  'Type / to open the command popup; Tab autocompletes slash commands and saved prompts.':
    'Tapez / pour ouvrir le menu des commandes ; Tab autocompl�te les commandes slash et les invites sauvegard�es.',
  'You can resume a previous conversation by running hopcode --continue or hopcode --resume.':
    'Vous pouvez reprendre une conversation pr�c�dente en ex�cutant hopcode --continue ou hopcode --resume.',
  'You can switch permission mode quickly with Shift+Tab or /approval-mode.':
    'Vous pouvez changer rapidement le mode de permission avec Maj+Tab ou /approval-mode.',
  'You can switch permission mode quickly with Tab or /approval-mode.':
    'Vous pouvez changer rapidement le mode de permission avec Tab ou /approval-mode.',
  'Try /insight to generate personalized insights from your chat history.':
    'Essayez /insight pour g�n�rer des insights personnalis�s depuis votre historique de chat.',

  // ============================================================================
  // �cran de sortie / Stats
  // ============================================================================
  'Agent powering down. Goodbye!': "Agent en cours d'arr�t. Au revoir !",
  'To continue this session, run': 'Pour continuer cette session, ex�cutez',
  'Interaction Summary': "R�sum� de l'interaction",
  'Session ID:': 'ID de session :',
  'Tool Calls:': "Appels d'outils :",
  'Success Rate:': 'Taux de succ�s :',
  'User Agreement:': "Accord de l'utilisateur :",
  reviewed: 'r�vis�',
  'Code Changes:': 'Modifications du code :',
  Performance: 'Performance',
  'Wall Time:': 'Temps r�el :',
  'Agent Active:': 'Agent actif :',
  'API Time:': 'Temps API :',
  'Tool Time:': "Temps d'outil :",
  'Session Stats': 'Stats de session',
  'Model Usage': 'Utilisation du mod�le',
  Reqs: 'Req.',
  'Input Tokens': "Tokens d'entr�e",
  'Output Tokens': 'Tokens de sortie',
  'Savings Highlight:': '�conomies notables :',
  'of input tokens were served from the cache, reducing costs.':
    "des tokens d'entr�e ont �t� servis depuis le cache, r�duisant les co�ts.",
  'Tip: For a full token breakdown, run `/stats model`.':
    'Conseil : Pour une d�composition compl�te des tokens, ex�cutez `/stats model`.',
  'Model Stats For Nerds': 'Stats du mod�le pour les geeks',
  'Tool Stats For Nerds': 'Stats des outils pour les geeks',
  Metric: 'M�trique',
  API: 'API',
  Requests: 'Requ�tes',
  Errors: 'Erreurs',
  'Avg Latency': 'Latence moyenne',
  Tokens: 'Tokens',
  Total: 'Total',
  Prompt: 'Invite',
  Cached: 'En cache',
  Thoughts: 'R�flexions',
  Tool: 'Outil',
  Output: 'Sortie',
  'No API calls have been made in this session.':
    "Aucun appel API n'a �t� effectu� dans cette session.",
  'Tool Name': "Nom de l'outil",
  Calls: 'Appels',
  'Success Rate': 'Taux de succ�s',
  'Avg Duration': 'Dur�e moyenne',
  'User Decision Summary': "R�sum� des d�cisions de l'utilisateur",
  'Total Reviewed Suggestions:': 'Total des suggestions r�vis�es :',
  ' � Accepted:': ' � Accept�es :',
  ' � Rejected:': ' � Rejet�es :',
  ' � Modified:': ' � Modifi�es :',
  ' Overall Agreement Rate:': " Taux d'accord global :",
  'No tool calls have been made in this session.':
    "Aucun appel d'outil n'a �t� effectu� dans cette session.",
  'Session start time is unavailable, cannot calculate stats.':
    "L'heure de d�but de session est indisponible, impossible de calculer les stats.",

  // ============================================================================
  // Migration de format de commande
  // ============================================================================
  'Command Format Migration': 'Migration du format de commande',
  'Found {{count}} TOML command file:':
    'Trouv� {{count}} fichier de commande TOML :',
  'Found {{count}} TOML command files:':
    'Trouv� {{count}} fichiers de commande TOML :',
  'Current tasks': 'T�ches actuelles',
  '... and {{count}} more': '... et {{count}} de plus',
  'The TOML format is deprecated. Would you like to migrate them to Markdown format?':
    'Le format TOML est obsol�te. Souhaitez-vous les migrer vers le format Markdown ?',
  '(Backups will be created and original files will be preserved)':
    '(Des sauvegardes seront cr��es et les fichiers originaux seront conserv�s)',

  // ============================================================================
  // Phrases de chargement
  // ============================================================================
  'Waiting for user confirmation...':
    "En attente de la confirmation de l'utilisateur...",
  '(esc to cancel, {{time}})': '(�chap pour annuler, {{time}})',

  // ============================================================================
  // Phrases de chargement amusantes
  // ============================================================================
  WITTY_LOADING_PHRASES: [
    'Je me sens chanceux',
    "Livraison d'excellence...",
    'Repeignant les empattements...',
    'Navigation dans le moisissure num�rique...',
    'Consultation des esprits num�riques...',
    'R�ticuler les splines...',
    'R�chauffement des hamsters IA...',
    'Consultation de la conque magique...',
    "G�n�ration d'une r�plique spirituelle...",
    'Polissage des algorithmes...',
    'Ne pr�cipitez pas la perfection (ni mon code)...',
    'Brassage de nouveaux octets...',
    'Comptage des �lectrons...',
    'Engagement des processeurs cognitifs...',
    "V�rification des erreurs de syntaxe dans l'univers...",
    "Un instant, optimisation de l'humour...",
    'M�lange des chutes de r�pliques...',
    'D�m�lage des r�seaux de neurones...',
    'Compilation de la brillance...',
    'Chargement de wit.exe...',
    'Invocation du nuage de sagesse...',
    "Pr�paration d'une r�ponse spirituelle...",
    'Juste une seconde, je d�bogue la r�alit�...',
    'Confusion des options...',
    'Accord des fr�quences cosmiques...',
    "Cr�ation d'une r�ponse digne de votre patience...",
    'Compilation des 0 et des 1...',
    'R�solution des d�pendances... et des crises existentielles...',
    'D�fragmentation des m�moires... RAM et personnelles...',
    'Red�marrage du module humoristique...',
    "Mise en cache de l'essentiel (surtout les m�mes de chats)...",
    'Optimisation pour une vitesse ludicrous',
    '�change de bits... ne le dites pas aux octets...',
    'Nettoyage de la m�moire... je reviens...',
    'Assemblage des internets...',
    'Conversion de caf� en code...',
    'Mise � jour de la syntaxe de la r�alit�...',
    'Rec�blage des synapses...',
    "Recherche d'un point-virgule �gar�...",
    'Graissage des rouages de la machine...',
    'Pr�chauffage des serveurs...',
    'Calibrage du condensateur de flux...',
    "Engagement de l'entra�nement de l'improbabilit�...",
    'Canalisation de la Force...',
    'Alignement des �toiles pour une r�ponse optimale...',
    "Qu'il en soit ainsi pour nous tous...",
    'Chargement de la prochaine grande id�e...',
    'Juste un moment, je suis dans la zone...',
    'Pr�paration � vous �blouir de brillance...',
    'Juste un instant, je peaufine mon esprit...',
    "Attendez, je cr�e un chef-d'�uvre...",
    "Juste une seconde, je d�bogue l'univers...",
    "Juste un moment, j'aligne les pixels...",
    "Juste un instant, j'optimise l'humour...",
    "Juste un moment, j'accorde les algorithmes...",
    'Vitesse warp enclench�e...',
    'Extraction de plus de cristaux de Dilithium...',
    'Pas de panique...',
    'Suivre le lapin blanc...',
    'La v�rit� est l�... quelque part...',
    'Souffler sur la cartouche...',
    'Chargement... Faites un tonneau !',
    'En attente du respawn...',
    'Finir la course de Kessel en moins de 12 parsecs...',
    "Le g�teau n'est pas un mensonge, il charge juste encore...",
    "Bidouillage de l'�cran de cr�ation de personnage...",
    'Juste un moment, je cherche le bon m�me...',
    "Appuyer sur 'A' pour continuer...",
    'Rassemblement de chats num�riques...',
    'Polissage des pixels...',
    "Recherche d'un jeu de mots d'�cran de chargement appropri�...",
    'Vous distraire avec cette phrase spirituelle...',
    'Presque l�... probablement...',
    "Nos hamsters travaillent aussi vite qu'ils peuvent...",
    'Donnant une tape dans le dos � Cloudy...',
    'Caressant le chat...',
    'Rickrolling mon patron...',
    'Je ne vais jamais vous abandonner, je ne vais jamais vous laisser tomber...',
    'Claquant la basse...',
    'Go�tant les snozberries...',
    "Je vais jusqu'au bout, je vais � toute vitesse...",
    'Est-ce la vraie vie ? Est-ce juste une fantaisie ?...',
    "J'ai un bon pressentiment � ce sujet...",
    "Poking l'ours...",
    'Faire des recherches sur les derniers m�mes...',
    'Trouver comment rendre �a plus spirituel...',
    'Hmm... laissez-moi r�fl�chir...',
    'Comment appelle-t-on un poisson sans yeux ? Un posson...',
    "Pourquoi l'ordinateur est-il all� en th�rapie ? Il avait trop d'octets...",
    "Pourquoi les programmeurs n'aiment pas la nature ? Elle a trop de bugs...",
    'Pourquoi les programmeurs pr�f�rent le mode sombre ? Parce que la lumi�re attire les bugs...',
    "Pourquoi le d�veloppeur est-il fauch� ? Parce qu'il a utilis� tout son cache...",
    "Que peut-on faire avec un crayon cass� ? Rien, c'est inutile...",
    'Application de la maintenance percussive...',
    'Recherche de la bonne orientation USB...',
    "S'assurer que la fum�e magique reste � l'int�rieur des c�bles...",
    'Essai de quitter Vim...',
    'Mise en marche de la roue du hamster...',
    "Ce n'est pas un bug, c'est une fonctionnalit� non document�e...",
    'Engage.',
    'Je reviendrai... avec une r�ponse.',
    'Mon autre processus est un TARDIS...',
    "Communion avec l'esprit machine...",
    'Laisser les pens�es mariner...',
    "Je viens de me souvenir o� j'ai mis mes cl�s...",
    "Contemplation de l'orbe...",
    "J'ai vu des choses que vous ne croiriez pas... comme un utilisateur qui lit les messages de chargement.",
    'Initiation du regard pensif...',
    "Quel est le go�ter pr�f�r� d'un ordinateur ? Les microchips.",
    "Pourquoi les d�veloppeurs Java portent-ils des lunettes ? Parce qu'ils ne C# pas.",
    'Chargement du laser... pew pew !',
    'Division par z�ro... je plaisante !',
    "Recherche d'un superviseur... je veux dire, traitement.",
    'Faire du bip boop.',
    "Buffering... parce que m�me les IAs ont besoin d'un moment.",
    'Enchev�trement de particules quantiques pour une r�ponse plus rapide...',
    'Polissage du chrome... sur les algorithmes.',
    "N'�tes-vous pas diverti ? (On y travaille !)",
    'Invocation des lutins de code... pour aider, bien s�r.',
    'En attente de la tonalit� du modem...',
    "Recalibrage du sens de l'humour.",
    'Mon autre �cran de chargement est encore plus dr�le.',
    "Je suis presque s�r qu'il y a un chat qui marche sur le clavier quelque part...",
    'Am�lioration... Am�lioration... Toujours en chargement.',
    "Ce n'est pas un bug, c'est une caract�ristique... de cet �cran de chargement.",
    "Avez-vous essay� de l'�teindre et de le rallumer ? (L'�cran de chargement, pas moi.)",
    'Construction de pyl�nes suppl�mentaires...',
  ],

  // ============================================================================
  // Param�tres d'extension - Saisie
  // ============================================================================
  'Enter value...': 'Entrer une valeur...',
  'Enter sensitive value...': 'Entrer une valeur sensible...',
  'Press Enter to submit, Escape to cancel':
    'Appuyez sur Entr�e pour soumettre, �chap pour annuler',

  // ============================================================================
  // Outil de migration de commandes
  // ============================================================================
  'Markdown file already exists: {{filename}}':
    'Le fichier Markdown existe d�j� : {{filename}}',
  'TOML Command Format Deprecation Notice':
    "Avis d'obsolescence du format de commande TOML",
  'Found {{count}} command file(s) in TOML format:':
    'Trouv� {{count}} fichier(s) de commande au format TOML :',
  'The TOML format for commands is being deprecated in favor of Markdown format.':
    "Le format TOML pour les commandes est en cours d'abandon au profit du format Markdown.",
  'Markdown format is more readable and easier to edit.':
    'Le format Markdown est plus lisible et plus facile � modifier.',
  'You can migrate these files automatically using:':
    'Vous pouvez migrer ces fichiers automatiquement en utilisant :',
  'Or manually convert each file:':
    'Ou convertir chaque fichier manuellement :',
  'TOML: prompt = "..." / description = "..."':
    'TOML : prompt = "..." / description = "..."',
  'Markdown: YAML frontmatter + content':
    'Markdown : YAML frontmatter + contenu',
  'The migration tool will:': "L'outil de migration va :",
  'Convert TOML files to Markdown': 'Convertir les fichiers TOML en Markdown',
  'Create backups of original files':
    'Cr�er des sauvegardes des fichiers originaux',
  'Preserve all command functionality':
    'Pr�server toutes les fonctionnalit�s des commandes',
  'TOML format will continue to work for now, but migration is recommended.':
    "Le format TOML continuera � fonctionner pour l'instant, mais la migration est recommand�e.",

  // ============================================================================
  // Extensions - Commande Explore
  // ============================================================================
  'Open extensions page in your browser':
    'Ouvrir la page des extensions dans votre navigateur',
  'Unknown extensions source: {{source}}.':
    "Source d'extensions inconnue : {{source}}.",
  'Would open extensions page in your browser: {{url}} (skipped in test environment)':
    'Ouvrirait la page des extensions dans votre navigateur : {{url}} (ignor� en environnement de test)',
  'View available extensions at {{url}}':
    'Voir les extensions disponibles sur {{url}}',
  'Opening extensions page in your browser: {{url}}':
    'Ouverture de la page des extensions dans votre navigateur : {{url}}',
  'Failed to open browser. Check out the extensions gallery at {{url}}':
    "�chec de l'ouverture du navigateur. Consultez la galerie d'extensions sur {{url}}",

  // ============================================================================
  // R�essai / Limite de d�bit
  // ============================================================================
  'Rate limit error: {{reason}}': 'Erreur de limite de d�bit : {{reason}}',
  'Retrying in {{seconds}} seconds� (attempt {{attempt}}/{{maxRetries}})':
    'Nouvelle tentative dans {{seconds}} secondes� (tentative {{attempt}}/{{maxRetries}})',
  'Press Ctrl+Y to retry': 'Appuyez sur Ctrl+Y pour r�essayer',
  'No failed request to retry.': 'Aucune requ�te �chou�e � r�essayer.',
  'to retry last request': 'pour r�essayer la derni�re requ�te',

  // ============================================================================
  // Authentification du plan de codage
  // ============================================================================
  'API key cannot be empty.': 'La cl� API ne peut pas �tre vide.',
  'You can get your Coding Plan API key here':
    'Vous pouvez obtenir votre cl� API Coding Plan ici',
  'API key is stored in settings.env. You can migrate it to a .env file for better security.':
    'La cl� API est stock�e dans settings.env. Vous pouvez la migrer vers un fichier .env pour une meilleure s�curit�.',
  'New model configurations are available for Alibaba Cloud Coding Plan. Update now?':
    'De nouvelles configurations de mod�le sont disponibles pour Alibaba Cloud Coding Plan. Mettre � jour maintenant ?',
  'Coding Plan configuration updated successfully. New models are now available.':
    'Configuration Coding Plan mise � jour avec succ�s. Les nouveaux mod�les sont maintenant disponibles.',
  'Coding Plan API key not found. Please re-authenticate with Coding Plan.':
    'Cl� API Coding Plan introuvable. Veuillez vous r�authentifier avec Coding Plan.',
  'Failed to update Coding Plan configuration: {{message}}':
    '�chec de la mise � jour de la configuration Coding Plan : {{message}}',

  // ============================================================================
  // Configuration de cl� API personnalis�e
  // ============================================================================
  'You can configure your API key and models in settings.json':
    'Vous pouvez configurer votre cl� API et vos mod�les dans settings.json',
  'Refer to the documentation for setup instructions':
    'Consultez la documentation pour les instructions de configuration',

  // ============================================================================
  // Bo�te de dialogue Auth - Titres et �tiquettes
  // ============================================================================
  'Coding Plan': 'Plan de codage',
  "Paste your api key of ModelStudio Coding Plan and you're all set!":
    "Collez votre cl� API de ModelStudio Coding Plan et c'est parti !",
  Custom: 'Personnalis�',
  'More instructions about configuring `modelProviders` manually.':
    "Plus d'instructions sur la configuration manuelle de `modelProviders`.",
  'Select API-KEY configuration mode:':
    'S�lectionner le mode de configuration API-KEY :',
  '(Press Escape to go back)': '(Appuyez sur �chap pour revenir)',
  '(Press Enter to submit, Escape to cancel)':
    '(Appuyez sur Entr�e pour soumettre, �chap pour annuler)',
  'Select Region for Coding Plan': 'S�lectionner la r�gion pour Coding Plan',
  'Choose based on where your account is registered':
    "Choisissez en fonction de l'endroit o� votre compte est enregistr�",
  'Enter Coding Plan API Key': 'Entrer la cl� API Coding Plan',

  // ============================================================================
  // Mises � jour internationales Coding Plan
  // ============================================================================
  'New model configurations are available for {{region}}. Update now?':
    'De nouvelles configurations de mod�le sont disponibles pour {{region}}. Mettre � jour maintenant ?',
  '{{region}} configuration updated successfully. Model switched to "{{model}}".':
    'Configuration {{region}} mise � jour avec succ�s. Mod�le chang� en "{{model}}".',
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json (backed up).':
    'Authentification r�ussie avec {{region}}. Cl� API et configurations de mod�le enregistr�es dans settings.json (sauvegard�).',

  // ============================================================================
  // Composant d'utilisation du contexte
  // ============================================================================
  'Context Usage': 'Utilisation du contexte',
  'No API response yet. Send a message to see actual usage.':
    "Pas encore de r�ponse API. Envoyez un message pour voir l'utilisation r�elle.",
  'Estimated pre-conversation overhead':
    'Surcharge estim�e avant la conversation',
  'Context window': 'Fen�tre de contexte',
  tokens: 'tokens',
  Used: 'Utilis�',
  Free: 'Libre',
  'Autocompact buffer': 'Tampon de compaction automatique',
  'Usage by category': 'Utilisation par cat�gorie',
  'System prompt': 'Invite syst�me',
  'Built-in tools': 'Outils int�gr�s',
  'MCP tools': 'Outils MCP',
  'Memory files': 'Fichiers m�moire',
  Skills: 'Comp�tences',
  Messages: 'Messages',
  'Show context window usage breakdown.':
    "Afficher la r�partition de l'utilisation de la fen�tre de contexte.",
  'Run /context detail for per-item breakdown.':
    'Ex�cutez /context detail pour une r�partition par �l�ment.',
  'body loaded': 'corps charg�',
  memory: 'm�moire',
  '{{region}} configuration updated successfully.':
    'Configuration {{region}} mise � jour avec succ�s.',
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json.':
    'Authentification r�ussie avec {{region}}. Cl� API et configurations de mod�le enregistr�es dans settings.json.',
  'Tip: Use /model to switch between available Coding Plan models.':
    'Conseil : Utilisez /model pour basculer entre les mod�les Coding Plan disponibles.',

  // ============================================================================
  // Outil de question � l'utilisateur
  // ============================================================================
  'Please answer the following question(s):':
    'Veuillez r�pondre � la (aux) question(s) suivante(s) :',
  'Cannot ask user questions in non-interactive mode. Please run in interactive mode to use this tool.':
    "Impossible de poser des questions � l'utilisateur en mode non interactif. Veuillez ex�cuter en mode interactif pour utiliser cet outil.",
  'User declined to answer the questions.':
    "L'utilisateur a refus� de r�pondre aux questions.",
  'User has provided the following answers:':
    "L'utilisateur a fourni les r�ponses suivantes :",
  'Failed to process user answers:':
    "�chec du traitement des r�ponses de l'utilisateur :",
  'Type something...': 'Tapez quelque chose...',
  Submit: 'Soumettre',
  'Submit answers': 'Soumettre les r�ponses',
  Cancel: 'Annuler',
  'Your answers:': 'Vos r�ponses :',
  '(not answered)': '(sans r�ponse)',
  'Ready to submit your answers?': 'Pr�t � soumettre vos r�ponses ?',
  '?/?: Navigate | ?/?: Switch tabs | Enter: Select':
    "?/? : Naviguer | ?/? : Changer d'onglet | Entr�e : S�lectionner",
  '?/?: Navigate | ?/?: Switch tabs | Space/Enter: Toggle | Esc: Cancel':
    "?/? : Naviguer | ?/? : Changer d'onglet | Espace/Entr�e : Basculer | �chap : Annuler",
  '?/?: Navigate | Space/Enter: Toggle | Esc: Cancel':
    '?/? : Naviguer | Espace/Entr�e : Basculer | �chap : Annuler',
  '?/?: Navigate | Enter: Select | Esc: Cancel':
    '?/? : Naviguer | Entr�e : S�lectionner | �chap : Annuler',

  // ============================================================================
  // Commandes - Auth
  // ============================================================================
  'Configure authentication information with Qwen-OAuth or Alibaba Cloud Coding Plan':
    "Configurer les informations d'authentification Qwen avec Qwen-OAuth ou Alibaba Cloud Coding Plan",
  'Authenticate using HopCode OAuth': 'Authentifier avec Legacy OAuth',
  'Authenticate using Alibaba Cloud Coding Plan':
    'Authentifier avec Alibaba Cloud Coding Plan',
  'Region for Coding Plan (china/global)':
    'R�gion pour Coding Plan (china/global)',
  'API key for Coding Plan': 'Cl� API pour Coding Plan',
  'Show current authentication status':
    "Afficher le statut d'authentification actuel",
  'Authentication completed successfully.':
    'Authentification termin�e avec succ�s.',
  'Starting HopCode OAuth authentication...':
    "D�marrage de l'authentification Legacy OAuth...",
  'Successfully authenticated with HopCode OAuth.':
    'Authentification r�ussie avec Legacy OAuth.',
  'Failed to authenticate with HopCode OAuth: {{error}}':
    "�chec de l'authentification avec Legacy OAuth : {{error}}",
  'Processing Alibaba Cloud Coding Plan authentication...':
    "Traitement de l'authentification Alibaba Cloud Coding Plan...",
  'Successfully authenticated with Alibaba Cloud Coding Plan.':
    'Authentification r�ussie avec Alibaba Cloud Coding Plan.',
  'Failed to authenticate with Coding Plan: {{error}}':
    "�chec de l'authentification avec Coding Plan : {{error}}",
  '?? (China)': '?? (Chine)',
  '????? (aliyun.com)': '????? (aliyun.com)',
  Global: 'Global',
  'Alibaba Cloud (alibabacloud.com)': 'Alibaba Cloud (alibabacloud.com)',
  'Select region for Coding Plan:': 'S�lectionner la r�gion pour Coding Plan :',
  'Enter your Coding Plan API key: ': 'Entrez votre cl� API Coding Plan : ',
  'Select authentication method:':
    "S�lectionner la m�thode d'authentification :",
  '\n=== Authentication Status ===\n': "\n=== Statut d'authentification ===\n",
  '??  No authentication method configured.\n':
    "??  Aucune m�thode d'authentification configur�e.\n",
  'Run one of the following commands to get started:\n':
    "Ex�cutez l'une des commandes suivantes pour commencer :\n",
  '  hopcode auth hopcode-oauth     - Authenticate with HopCode OAuth (discontinued)':
    '  hopcode auth hopcode-oauth     - Authentification avec Legacy OAuth (abandonn�)',
  '  hopcode auth coding-plan      - Authenticate with Alibaba Cloud Coding Plan\n':
    '  hopcode auth coding-plan      - Authentifier avec Alibaba Cloud Coding Plan\n',
  'Or simply run:': 'Ou simplement ex�cutez :',
  '  hopcode auth                - Interactive authentication setup\n':
    "  hopcode auth                - Configuration d'authentification interactive\n",
  '? Authentication Method: HopCode OAuth':
    "? M�thode d'authentification : Legacy OAuth",
  '  Type: Free tier (discontinued 2026-04-15)':
    '  Type : Niveau gratuit (abandonn� 2026-04-15)',
  '  Limit: No longer available': '  Limite : Plus disponible',
  'HopCode OAuth free tier was discontinued on 2026-04-15. Run /auth to switch to Coding Plan, OpenRouter, Fireworks AI, or another provider.':
    'Le niveau gratuit Legacy OAuth a �t� abandonn� le 2026-04-15. Ex�cutez /auth pour passer � Coding Plan, OpenRouter, Fireworks AI ou un autre fournisseur.',
  '  Models: Qwen latest models\n': '  Mod�les : Derniers mod�les Qwen\n',
  '? Authentication Method: Alibaba Cloud Coding Plan':
    "? M�thode d'authentification : Alibaba Cloud Coding Plan",
  '?? (China) - ?????': '?? (Chine) - ?????',
  'Global - Alibaba Cloud': 'Global - Alibaba Cloud',
  '  Region: {{region}}': '  R�gion : {{region}}',
  '  Current Model: {{model}}': '  Mod�le actuel : {{model}}',
  '  Config Version: {{version}}': '  Version de config : {{version}}',
  '  Status: API key configured\n': '  Statut : Cl� API configur�e\n',
  '??  Authentication Method: Alibaba Cloud Coding Plan (Incomplete)':
    "??  M�thode d'authentification : Alibaba Cloud Coding Plan (Incompl�te)",
  '  Issue: API key not found in environment or settings\n':
    "  Probl�me : Cl� API introuvable dans l'environnement ou les param�tres\n",
  '  Run `hopcode auth coding-plan` to re-configure.\n':
    '  Ex�cutez `hopcode auth coding-plan` pour reconfigurer.\n',
  '? Authentication Method: {{type}}':
    "? M�thode d'authentification : {{type}}",
  '  Status: Configured\n': '  Statut : Configur�\n',
  'Failed to check authentication status: {{error}}':
    "�chec de la v�rification du statut d'authentification : {{error}}",
  'Select an option:': 'S�lectionner une option :',
  'Raw mode not available. Please run in an interactive terminal.':
    'Mode brut non disponible. Veuillez ex�cuter dans un terminal interactif.',
  '(Use ? ? arrows to navigate, Enter to select, Ctrl+C to exit)\n':
    '(Utilisez les fl�ches ? ? pour naviguer, Entr�e pour s�lectionner, Ctrl+C pour quitter)\n',
  compact: 'compact',
  'Hide tool output and thinking for a cleaner view (toggle with Ctrl+O).':
    'Masquer la sortie des outils et la r�flexion pour une vue plus nette (basculer avec Ctrl+O).',
  'Press Ctrl+O to show full tool output':
    'Appuyez sur Ctrl+O pour afficher la sortie compl�te des outils',
  'Switch to plan mode or exit plan mode':
    'Passer en mode plan ou quitter le mode plan',
  'Exited plan mode. Previous approval mode restored.':
    "Mode plan quitt�. Mode d'approbation pr�c�dent restaur�.",
  'Enabled plan mode. The agent will analyze and plan without executing tools.':
    "Mode plan activ�. L'agent analysera et planifiera sans ex�cuter d'outils.",
  'Already in plan mode. Use "/plan exit" to exit plan mode.':
    'D�j� en mode plan. Utilisez "/plan exit" pour quitter le mode plan.',
  'Not in plan mode. Use "/plan" to enter plan mode first.':
    'Pas en mode plan. Utilisez "/plan" pour entrer en mode plan d\'abord.',

  "Set up HopCode's status line UI":
    "Configurer l'interface de la barre de statut de HopCode",
};
