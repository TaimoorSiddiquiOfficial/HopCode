/**
 * @license
 * Copyright 2026 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */

// Portuguese translations for HopCode CLI (pt-BR)

export default {
  // ============================================================================
  // Help / UI Components
  // ============================================================================
  'Basics:': 'No��es b�sicas:',
  'Add context': 'Adicionar contexto',
  'Use {{symbol}} to specify files for context (e.g., {{example}}) to target specific files or folders.':
    'Use {{symbol}} para especificar arquivos para o contexto (ex: {{example}}) para atingir arquivos ou pastas espec�ficos.',
  '@': '@',
  '@src/myFile.ts': '@src/myFile.ts',
  'Shell mode': 'Modo shell',
  'IZN mode': 'Modo IZN',
  'plan mode': 'modo planejamento',
  'auto-accept edits': 'aceitar edi��es automaticamente',
  'Accepting edits': 'Aceitando edi��es',
  '(shift + tab to cycle)': '(shift + tab para alternar)',
  'Execute shell commands via {{symbol}} (e.g., {{example1}}) or use natural language (e.g., {{example2}}).':
    'Execute comandos shell via {{symbol}} (ex: {{example1}}) ou use linguagem natural (ex: {{example2}}).',
  '!': '!',
  '!npm run start': '!npm run start',
  'start server': 'iniciar servidor',
  'Commands:': 'Comandos:',
  'shell command': 'comando shell',
  'Model Context Protocol command (from external servers)':
    'Comando Model Context Protocol (de servidores externos)',
  'Keyboard Shortcuts:': 'Atalhos de teclado:',
  'Toggle this help display': 'Alternar exibi��o desta ajuda',
  'Toggle shell mode': 'Alternar modo shell',
  'Open command menu': 'Abrir menu de comandos',
  'Add file context': 'Adicionar contexto de arquivo',
  'Accept suggestion / Autocomplete': 'Aceitar sugest�o / Autocompletar',
  'Reverse search history': 'Pesquisa reversa no hist�rico',
  'Press ? again to close': 'Pressione ? novamente para fechar',
  // Keyboard shortcuts panel descriptions
  'for shell mode': 'para modo shell',
  'for commands': 'para comandos',
  'for file paths': 'para caminhos de arquivo',
  'to clear input': 'para limpar entrada',
  'to cycle approvals': 'para alternar aprova��es',
  'to quit': 'para sair',
  'for newline': 'para nova linha',
  'to clear screen': 'para limpar a tela',
  'to search history': 'para pesquisar no hist�rico',
  'to paste images': 'para colar imagens',
  'for external editor': 'para editor externo',
  'to toggle compact mode': 'alternar modo compacto',
  'Jump through words in the input': 'Pular palavras na entrada',
  'Close dialogs, cancel requests, or quit application':
    'Fechar di�logos, cancelar solicita��es ou sair do aplicativo',
  'New line': 'Nova linha',
  'New line (Alt+Enter works for certain linux distros)':
    'Nova linha (Alt+Enter funciona em certas distros linux)',
  'Clear the screen': 'Limpar a tela',
  'Open input in external editor': 'Abrir entrada no editor externo',
  'Send message': 'Enviar mensagem',
  'Initializing...': 'Inicializando...',
  'Connecting to MCP servers... ({{connected}}/{{total}})':
    'Conectando aos servidores MCP... ({{connected}}/{{total}})',
  'Type your message or @path/to/file':
    'Digite sua mensagem ou @caminho/do/arquivo',
  '? for shortcuts': '? para atalhos',
  "Press 'i' for INSERT mode and 'Esc' for NORMAL mode.":
    "Pressione 'i' para modo INSER��O e 'Esc' para modo NORMAL.",
  'Cancel operation / Clear input (double press)':
    'Cancelar opera��o / Limpar entrada (pressionar duas vezes)',
  'Cycle approval modes': 'Alternar modos de aprova��o',
  'Cycle through your prompt history': 'Alternar hist�rico de prompts',
  'For a full list of shortcuts, see {{docPath}}':
    'Para uma lista completa de atalhos, consulte {{docPath}}',
  'docs/keyboard-shortcuts.md': 'docs/keyboard-shortcuts.md',
  'for help on HopCode': 'para ajuda sobre o HopCode',
  'show version info': 'mostrar informa��es de vers�o',
  'submit a bug report': 'enviar um relat�rio de erro',
  'About HopCode': 'Sobre o HopCode',
  Status: 'Status',

  // ============================================================================
  // System Information Fields
  // ============================================================================
  HopCode: 'HopCode',
  Runtime: 'Runtime',
  OS: 'SO',
  Auth: 'Autentica��o',
  'CLI Version': 'Vers�o da CLI',
  'Git Commit': 'Commit do Git',
  Model: 'Modelo',
  'Fast Model': 'Modelo R�pido',
  Sandbox: 'Sandbox',
  'OS Platform': 'Plataforma do SO',
  'OS Arch': 'Arquitetura do SO',
  'OS Release': 'Vers�o do SO',
  'Node.js Version': 'Vers�o do Node.js',
  'NPM Version': 'Vers�o do NPM',
  'Session ID': 'ID da Sess�o',
  'Auth Method': 'M�todo de Autentica��o',
  'Base URL': 'URL Base',
  Proxy: 'Proxy',
  'Memory Usage': 'Uso de Mem�ria',
  'IDE Client': 'Cliente IDE',

  // ============================================================================
  // Commands - General
  // ============================================================================
  'Analyzes the project and creates a tailored HOPCODE.md file.':
    'Analisa o projeto e cria um arquivo HOPCODE.md personalizado.',
  'List available HopCode tools. Usage: /tools [desc]':
    'Listar ferramentas HopCode dispon�veis. Uso: /tools [desc]',
  'List available skills.': 'Listar habilidades dispon�veis.',
  'Available HopCode CLI tools:': 'Ferramentas CLI do HopCode dispon�veis:',
  'No tools available': 'Nenhuma ferramenta dispon�vel',
  'View or change the approval mode for tool usage':
    'Ver ou alterar o modo de aprova��o para uso de ferramentas',
  'Invalid approval mode "{{arg}}". Valid modes: {{modes}}':
    'Modo de aprova��o inv�lido "{{arg}}". Modos v�lidos: {{modes}}',
  'Approval mode set to "{{mode}}"':
    'Modo de aprova��o definido como "{{mode}}"',
  'View or change the language setting':
    'Ver ou alterar a configura��o de idioma',
  'change the theme': 'alterar o tema',
  'Select Theme': 'Selecionar Tema',
  Preview: 'Visualizar',
  '(Use Enter to select, Tab to configure scope)':
    '(Use Enter para selecionar, Tab para configurar o escopo)',
  '(Use Enter to apply scope, Tab to go back)':
    '(Use Enter para aplicar o escopo, Tab para voltar)',
  'Theme configuration unavailable due to NO_COLOR env variable.':
    'Configura��o de tema indispon�vel devido � vari�vel de ambiente NO_COLOR.',
  'Theme "{{themeName}}" not found.': 'Tema "{{themeName}}" n�o encontrado.',
  'Theme "{{themeName}}" not found in selected scope.':
    'Tema "{{themeName}}" n�o encontrado no escopo selecionado.',
  'Clear conversation history and free up context':
    'Limpar hist�rico de conversa e liberar contexto',
  'Compresses the context by replacing it with a summary.':
    'Comprime o contexto substituindo-o por um resumo.',
  'open full HopCode documentation in your browser':
    'abrir documenta��o completa do HopCode no seu navegador',
  'Configuration not available.': 'Configura��o n�o dispon�vel.',
  'change the auth method': 'alterar o m�todo de autentica��o',
  'Configure authentication information for login':
    'Configurar informa��es de autentica��o para login',
  'Copy the last result or code snippet to clipboard':
    'Copiar o �ltimo resultado ou trecho de c�digo para a �rea de transfer�ncia',

  // ============================================================================
  // Commands - Agents
  // ============================================================================
  'Manage subagents for specialized task delegation.':
    'Gerenciar subagentes para delega��o de tarefas especializadas.',
  'Manage existing subagents (view, edit, delete).':
    'Gerenciar subagentes existentes (ver, editar, excluir).',
  'Create a new subagent with guided setup.':
    'Criar um novo subagente com configura��o guiada.',

  // ============================================================================
  // Agents - Management Dialog
  // ============================================================================
  Agents: 'Agentes',
  'Choose Action': 'Escolher A��o',
  'Edit {{name}}': 'Editar {{name}}',
  'Edit Tools: {{name}}': 'Editar Ferramentas: {{name}}',
  'Edit Color: {{name}}': 'Editar Cor: {{name}}',
  'Delete {{name}}': 'Excluir {{name}}',
  'Unknown Step': 'Etapa Desconhecida',
  'Esc to close': 'Esc para fechar',
  'Enter to select, ?? to navigate, Esc to close':
    'Enter para selecionar, ?? para navegar, Esc para fechar',
  'Esc to go back': 'Esc para voltar',
  'Enter to confirm, Esc to cancel': 'Enter para confirmar, Esc para cancelar',
  'Enter to select, ?? to navigate, Esc to go back':
    'Enter para selecionar, ?? para navegar, Esc para voltar',
  'Enter to submit, Esc to go back': 'Enter para enviar, Esc para voltar',
  'Invalid step: {{step}}': 'Etapa inv�lida: {{step}}',
  'No subagents found.': 'Nenhum subagente encontrado.',
  "Use '/agents create' to create your first subagent.":
    "Use '/agents create' para criar seu primeiro subagente.",
  '(built-in)': '(integrado)',
  '(overridden by project level agent)':
    '(substitu�do por agente de n�vel de projeto)',
  'Project Level ({{path}})': 'N�vel de Projeto ({{path}})',
  'User Level ({{path}})': 'N�vel de Usu�rio ({{path}})',
  'Built-in Agents': 'Agentes Integrados',
  'Extension Agents': 'Agentes de Extens�o',
  'Using: {{count}} agents': 'Usando: {{count}} agentes',
  'View Agent': 'Ver Agente',
  'Edit Agent': 'Editar Agente',
  'Delete Agent': 'Excluir Agente',
  Back: 'Voltar',
  'No agent selected': 'Nenhum agente selecionado',
  'File Path: ': 'Caminho do Arquivo: ',
  'Tools: ': 'Ferramentas: ',
  'Color: ': 'Cor: ',
  'Description:': 'Descri��o:',
  'System Prompt:': 'Prompt do Sistema:',
  'Open in editor': 'Abrir no editor',
  'Edit tools': 'Editar ferramentas',
  'Edit color': 'Editar cor',
  '? Error:': '? Erro:',
  'Are you sure you want to delete agent "{{name}}"?':
    'Tem certeza que deseja excluir o agente "{{name}}"?',

  // ============================================================================
  // Agents - Creation Wizard
  // ============================================================================
  'Project Level (.hopcode/agents/)': 'N�vel de Projeto (.hopcode/agents/)',
  'User Level (~/.hopcode/agents/)': 'N�vel de Usu�rio (~/.hopcode/agents/)',
  '? Subagent Created Successfully!': '? Subagente criado com sucesso!',
  'Subagent "{{name}}" has been saved to {{level}} level.':
    'O subagente "{{name}}" foi salvo no n�vel {{level}}.',
  'Name: ': 'Nome: ',
  'Location: ': 'Localiza��o: ',
  '? Error saving subagent:': '? Erro ao salvar subagente:',
  'Warnings:': 'Avisos:',
  'Name "{{name}}" already exists at {{level}} level - will overwrite existing subagent':
    'O nome "{{name}}" j� existe no n�vel {{level}} - o subagente existente ser� substitu�do',
  'Name "{{name}}" exists at user level - project level will take precedence':
    'O nome "{{name}}" existe no n�vel de usu�rio - o n�vel de projeto ter� preced�ncia',
  'Name "{{name}}" exists at project level - existing subagent will take precedence':
    'O nome "{{name}}" existe no n�vel de projeto - o subagente existente ter� preced�ncia',
  'Description is over {{length}} characters':
    'A descri��o tem mais de {{length}} caracteres',
  'System prompt is over {{length}} characters':
    'O prompt do sistema tem mais de {{length}} caracteres',

  // ============================================================================
  // Agents - Creation Wizard Steps
  // ============================================================================
  'Step {{n}}: Choose Location': 'Etapa {{n}}: Escolher Localiza��o',
  'Step {{n}}: Choose Generation Method':
    'Etapa {{n}}: Escolher M�todo de Gera��o',
  'Generate with HopCode (Recommended)': 'Gerar com HopCode (Recomendado)',
  'Manual Creation': 'Cria��o Manual',
  'Describe what this subagent should do and when it should be used. (Be comprehensive for best results)':
    'Descreva o que este subagente deve fazer e quando deve ser usado. (Seja abrangente para melhores resultados)',
  'e.g., Expert code reviewer that reviews code based on best practices...':
    'ex: Revisor de c�digo especialista que revisa c�digo com base em melhores pr�ticas...',
  'Generating subagent configuration...':
    'Gerando configura��o do subagente...',
  'Failed to generate subagent: {{error}}':
    'Falha ao gerar subagente: {{error}}',
  'Step {{n}}: Describe Your Subagent': 'Etapa {{n}}: Descreva Seu Subagente',
  'Step {{n}}: Enter Subagent Name': 'Etapa {{n}}: Digite o Nome do Subagente',
  'Step {{n}}: Enter System Prompt': 'Etapa {{n}}: Digite o Prompt do Sistema',
  'Step {{n}}: Enter Description': 'Etapa {{n}}: Digite a Descri��o',

  // ============================================================================
  // Agents - Tool Selection
  // ============================================================================
  'Step {{n}}: Select Tools': 'Etapa {{n}}: Selecionar Ferramentas',
  'All Tools (Default)': 'Todas as Ferramentas (Padr�o)',
  'All Tools': 'Todas as Ferramentas',
  'Read-only Tools': 'Ferramentas de Somente Leitura',
  'Read & Edit Tools': 'Ferramentas de Leitura e Edi��o',
  'Read & Edit & Execution Tools': 'Ferramentas de Leitura, Edi��o e Execu��o',
  'All tools selected, including MCP tools':
    'Todas as ferramentas selecionadas, incluindo ferramentas MCP',
  'Selected tools:': 'Ferramentas selecionadas:',
  'Read-only tools:': 'Ferramentas de somente leitura:',
  'Edit tools:': 'Ferramentas de edi��o:',
  'Execution tools:': 'Ferramentas de execu��o:',
  'Step {{n}}: Choose Background Color': 'Etapa {{n}}: Escolher Cor de Fundo',
  'Step {{n}}: Confirm and Save': 'Etapa {{n}}: Confirmar e Salvar',

  // ============================================================================
  // Agents - Navigation & Instructions
  // ============================================================================
  'Esc to cancel': 'Esc para cancelar',
  'Press Enter to save, e to save and edit, Esc to go back':
    'Pressione Enter para salvar, e para salvar e editar, Esc para voltar',
  'Press Enter to continue, {{navigation}}Esc to {{action}}':
    'Pressione Enter para continuar, {{navigation}}Esc para {{action}}',
  cancel: 'cancelar',
  'go back': 'voltar',
  '?? to navigate, ': '?? para navegar, ',
  'Enter a clear, unique name for this subagent.':
    'Digite um nome claro e �nico para este subagente.',
  'e.g., Code Reviewer': 'ex: Revisor de C�digo',
  'Name cannot be empty.': 'O nome n�o pode estar vazio.',
  "Write the system prompt that defines this subagent's behavior. Be comprehensive for best results.":
    'Escreva o prompt do sistema que define o comportamento deste subagente. Seja abrangente para melhores resultados.',
  'e.g., You are an expert code reviewer...':
    'ex: Voc� � um revisor de c�digo especialista...',
  'System prompt cannot be empty.': 'O prompt do sistema n�o pode estar vazio.',
  'Describe when and how this subagent should be used.':
    'Descreva quando e como este subagente deve ser usado.',
  'e.g., Reviews code for best practices and potential bugs.':
    'ex: Revisa o c�digo em busca de melhores pr�ticas e erros potenciais.',
  'Description cannot be empty.': 'A descri��o n�o pode estar vazia.',
  'Failed to launch editor: {{error}}': 'Falha ao iniciar editor: {{error}}',
  'Failed to save and edit subagent: {{error}}':
    'Falha ao salvar e editar subagente: {{error}}',

  // ============================================================================
  // Commands - General (continued)
  // ============================================================================
  'View and edit HopCode settings': 'Ver e editar configura��es do HopCode',
  Settings: 'Configura��es',
  'To see changes, HopCode must be restarted. Press r to exit and apply changes now.':
    'Para ver as altera��es, o HopCode deve ser reiniciado. Pressione r para sair e aplicar as altera��es agora.',
  'The command "/{{command}}" is not supported in non-interactive mode.':
    'O comando "/{{command}}" n�o � suportado no modo n�o interativo.',

  // ============================================================================
  // Settings Labels
  // ============================================================================
  'Vim Mode': 'Modo Vim',
  'Disable Auto Update': 'Desativar Atualiza��o Autom�tica',
  'Attribution: commit': 'Atribui��o: commit',
  'Terminal Bell Notification': 'Notifica��o Sonora do Terminal',
  'Enable Usage Statistics': 'Ativar Estat�sticas de Uso',
  Theme: 'Tema',
  'Preferred Editor': 'Editor Preferido',
  'Auto-connect to IDE': 'Conex�o Autom�tica com IDE',
  'Enable Prompt Completion': 'Ativar Autocompletar de Prompts',
  'Debug Keystroke Logging': 'Log de Depura��o de Teclas',
  'Language: UI': 'Idioma: Interface',
  'Language: Model': 'Idioma: Modelo',
  'Output Format': 'Formato de Sa�da',
  'Hide Window Title': 'Ocultar T�tulo da Janela',
  'Show Status in Title': 'Mostrar Status no T�tulo',
  'Hide Tips': 'Ocultar Dicas',
  'Show Line Numbers in Code': 'Mostrar N�meros de Linhas no C�digo',
  'Show Citations': 'Mostrar Cita��es',
  'Custom Witty Phrases': 'Frases de Efeito Personalizadas',
  'Show Welcome Back Dialog': 'Mostrar Di�logo de Bem-vindo de Volta',
  'Enable User Feedback': 'Ativar Feedback do Usu�rio',
  'How is HopCode doing this session? (optional)':
    'Como o HopCode est� se saindo nesta sess�o? (opcional)',
  Bad: 'Ruim',
  Fine: 'Bom',
  Good: '�timo',
  Dismiss: 'Ignorar',
  'Not Sure Yet': 'N�o tenho certeza ainda',
  'Any other key': 'Qualquer outra tecla',
  'Disable Loading Phrases': 'Desativar Frases de Carregamento',
  'Screen Reader Mode': 'Modo de Leitor de Tela',
  'IDE Mode': 'Modo IDE',
  'Max Session Turns': 'M�ximo de Turnos da Sess�o',
  'Skip Next Speaker Check': 'Pular Verifica��o do Pr�ximo Falante',
  'Skip Loop Detection': 'Pular Detec��o de Loop',
  'Skip Startup Context': 'Pular Contexto de Inicializa��o',
  'Enable OpenAI Logging': 'Ativar Log do OpenAI',
  'OpenAI Logging Directory': 'Diret�rio de Log do OpenAI',
  Timeout: 'Tempo Limite',
  'Max Retries': 'M�ximo de Tentativas',
  'Disable Cache Control': 'Desativar Controle de Cache',
  'Memory Discovery Max Dirs': 'Descoberta de Mem�ria M�x. Diretorios',
  'Load Memory From Include Directories':
    'Carregar Mem�ria de Diret�rios Inclu�dos',
  'Respect .gitignore': 'Respeitar .gitignore',
  'Respect .hopcodeignore': 'Respeitar .hopcodeignore',
  'Enable Recursive File Search': 'Ativar Pesquisa Recursiva de Arquivos',
  'Disable Fuzzy Search': 'Desativar Pesquisa Difusa',
  'Interactive Shell (PTY)': 'Shell Interativo (PTY)',
  'Show Color': 'Mostrar Cores',
  'Auto Accept': 'Aceitar Automaticamente',
  'Use Ripgrep': 'Usar Ripgrep',
  'Use Builtin Ripgrep': 'Usar Ripgrep Integrado',
  'Enable Tool Output Truncation': 'Ativar Truncamento de Sa�da de Ferramenta',
  'Tool Output Truncation Threshold':
    'Limite de Truncamento de Sa�da de Ferramenta',
  'Tool Output Truncation Lines':
    'Linhas de Truncamento de Sa�da de Ferramenta',
  'Folder Trust': 'Confian�a de Pasta',
  'Vision Model Preview': 'Visualiza��o de Modelo de Vis�o',
  'Tool Schema Compliance': 'Conformidade de Esquema de Ferramenta',

  // Settings enum options
  'Auto (detect from system)': 'Autom�tico (detectar do sistema)',
  'Auto (detect terminal theme)': 'Autom�tico (detectar tema do terminal)',
  Auto: 'Autom�tico',
  Text: 'Texto',
  JSON: 'JSON',
  Plan: 'Planejamento',
  Default: 'Padr�o',
  'Auto Edit': 'Edi��o Autom�tica',
  IZN: 'IZN',
  'toggle vim mode on/off': 'alternar modo vim ligado/desligado',
  'check session stats. Usage: /stats [model|tools]':
    'verificar estat�sticas da sess�o. Uso: /stats [model|tools]',
  'Show model-specific usage statistics.':
    'Mostrar estat�sticas de uso espec�ficas do modelo.',
  'Show tool-specific usage statistics.':
    'Mostrar estat�sticas de uso espec�ficas da ferramenta.',
  'exit the cli': 'sair da cli',
  'Open MCP management dialog, or authenticate with OAuth-enabled servers':
    'Abrir di�logo de gerenciamento MCP ou autenticar com servidor habilitado para OAuth',
  'List configured MCP servers and tools, or authenticate with OAuth-enabled servers':
    'Listar servidores e ferramentas MCP configurados, ou autenticar com servidores habilitados para OAuth',
  'Manage workspace directories': 'Gerenciar diret�rios do workspace',
  'Add directories to the workspace. Use comma to separate multiple paths':
    'Adicionar diret�rios ao workspace. Use v�rgula para separar v�rios caminhos',
  'Show all directories in the workspace':
    'Mostrar todos os diret�rios no workspace',
  'set external editor preference': 'definir prefer�ncia de editor externo',
  'Select Editor': 'Selecionar Editor',
  'Editor Preference': 'Prefer�ncia de Editor',
  'These editors are currently supported. Please note that some editors cannot be used in sandbox mode.':
    'Estes editores s�o suportados atualmente. Note que alguns editores n�o podem ser usados no modo sandbox.',
  'Your preferred editor is:': 'Seu editor preferido �:',
  'Manage extensions': 'Gerenciar extens�es',
  'Manage installed extensions': 'Gerenciar extens�es instaladas',
  'List active extensions': 'Listar extens�es ativas',
  'Update extensions. Usage: update <extension-names>|--all':
    'Atualizar extens�es. Uso: update <nomes-das-extensoes>|--all',
  'Disable an extension': 'Desativar uma extens�o',
  'Enable an extension': 'Ativar uma extens�o',
  'Install an extension from a git repo or local path':
    'Instalar uma extens�o de um reposit�rio git ou caminho local',
  'Uninstall an extension': 'Desinstalar uma extens�o',
  'No extensions installed.': 'Nenhuma extens�o instalada.',
  'Usage: /extensions update <extension-names>|--all':
    'Uso: /extensions update <nomes-das-extensoes>|--all',
  'Extension "{{name}}" not found.': 'Extens�o "{{name}}" n�o encontrada.',
  'No extensions to update.': 'Nenhuma extens�o para atualizar.',
  'Usage: /extensions install <source>': 'Uso: /extensions install <fonte>',
  'Installing extension from "{{source}}"...':
    'Instalando extens�o de "{{source}}"...',
  'Extension "{{name}}" installed successfully.':
    'Extens�o "{{name}}" instalada com sucesso.',
  'Failed to install extension from "{{source}}": {{error}}':
    'Falha ao instalar extens�o de "{{source}}": {{error}}',
  'Usage: /extensions uninstall <extension-name>':
    'Uso: /extensions uninstall <nome-da-extensao>',
  'Uninstalling extension "{{name}}"...':
    'Desinstalando extens�o "{{name}}"...',
  'Extension "{{name}}" uninstalled successfully.':
    'Extens�o "{{name}}" desinstalada com sucesso.',
  'Failed to uninstall extension "{{name}}": {{error}}':
    'Falha ao desinstalar extens�o "{{name}}": {{error}}',
  'Usage: /extensions {{command}} <extension> [--scope=<user|workspace>]':
    'Uso: /extensions {{command}} <extensao> [--scope=<user|workspace>]',
  'Unsupported scope "{{scope}}", deve ser um de "user" ou "workspace"':
    'Escopo n�o suportado "{{scope}}", deve ser um de "user" ou "workspace"',
  'Extension "{{name}}" disabled for scope "{{scope}}"':
    'Extens�o "{{name}}" desativada para o escopo "{{scope}}"',
  'Extension "{{name}}" enabled for scope "{{scope}}"':
    'Extens�o "{{name}}" ativada para o escopo "{{scope}}"',
  'Do you want to continue? [Y/n]: ': 'Voc� deseja continuar? [Y/n]: ',
  'Do you want to continue?': 'Voc� deseja continuar?',
  'Installing extension "{{name}}".': 'Instalando extens�o "{{name}}".',
  '**Extensions may introduce unexpected behavior. Ensure you have investigated the extension source and trust the author.**':
    '**As extens�es podem introduzir comportamentos inesperados. Certifique-se de ter investigado a fonte da extens�o e confie no autor.**',
  'This extension will run the following MCP servers:':
    'Esta extens�o executar� os seguintes servidores MCP:',
  local: 'local',
  remote: 'remoto',
  'This extension will add the following commands: {{commands}}.':
    'Esta extens�o adicionar� os seguintes comandos: {{commands}}.',
  'This extension will append info to your HOPCODE.md context using {{fileName}}':
    'Esta extens�o anexar� informa��es ao seu contexto HOPCODE.md usando {{fileName}}',
  'This extension will exclude the following core tools: {{tools}}':
    'Esta extens�o excluir� as seguintes ferramentas principais: {{tools}}',
  'This extension will install the following skills:':
    'Esta extens�o instalar� as seguintes habilidades:',
  'This extension will install the following subagents:':
    'Esta extens�o instalar� os seguintes subagentes:',
  'Installation cancelled for "{{name}}".':
    'Instala��o cancelada para "{{name}}".',
  'You are installing an extension from {{originSource}}. Some features may not work perfectly with HopCode.':
    'Voc� est� instalando uma extens�o de {{originSource}}. Alguns recursos podem n�o funcionar perfeitamente com o HopCode.',
  '--ref and --auto-update are not applicable for marketplace extensions.':
    '--ref e --auto-update n�o s�o aplic�veis para extens�es de marketplace.',
  'Extension "{{name}}" installed successfully and enabled.':
    'Extens�o "{{name}}" instalada com sucesso e ativada.',
  'Installs an extension from a git repository URL, local path, or claude marketplace (marketplace-url:plugin-name).':
    'Instala uma extens�o de uma URL de reposit�rio git, caminho local ou marketplace do claude (marketplace-url:plugin-name).',
  'The github URL, local path, or marketplace source (marketplace-url:plugin-name) of the extension to install.':
    'A URL do github, caminho local ou fonte do marketplace (marketplace-url:plugin-name) da extens�o para instalar.',
  'The git ref to install from.': 'A refer�ncia git para instalar.',
  'Enable auto-update for this extension.':
    'Ativar atualiza��o autom�tica para esta extens�o.',
  'Enable pre-release versions for this extension.':
    'Ativar vers�es de pr�-lan�amento para esta extens�o.',
  'Acknowledge the security risks of installing an extension and skip the confirmation prompt.':
    'Reconhecer os riscos de seguran�a de instalar uma extens�o e pular o prompt de confirma��o.',
  'The source argument must be provided.':
    'O argumento fonte deve ser fornecido.',
  'Extension "{{name}}" successfully uninstalled.':
    'Extens�o "{{name}}" desinstalada com sucesso.',
  'Uninstalls an extension.': 'Desinstala uma extens�o.',
  'The name or source path of the extension to uninstall.':
    'O nome ou caminho da fonte da extens�o para desinstalar.',
  'Please include the name of the extension to uninstall as a positional argument.':
    'Inclua o nome da extens�o para desinstalar como um argumento posicional.',
  'Enables an extension.': 'Ativa uma extens�o.',
  'The name of the extension to enable.': 'O nome da extens�o para ativar.',
  'The scope to enable the extenison in. If not set, will be enabled in all scopes.':
    'O escopo para ativar a extens�o. Se n�o definido, ser� ativada em todos os escopos.',
  'Extension "{{name}}" successfully enabled for scope "{{scope}}".':
    'Extens�o "{{name}}" ativada com sucesso para o escopo "{{scope}}".',
  'Extension "{{name}}" successfully enabled in all scopes.':
    'Extens�o "{{name}}" ativada com sucesso em todos os escopos.',
  'Invalid scope: {{scope}}. Please use one of {{scopes}}.':
    'Escopo inv�lido: {{scope}}. Use um de {{scopes}}.',
  'Disables an extension.': 'Desativa uma extens�o.',
  'The name of the extension to disable.': 'O nome da extens�o para desativar.',
  'The scope to disable the extenison in.':
    'O escopo para desativar a extens�o.',
  'Extension "{{name}}" successfully disabled for scope "{{scope}}".':
    'Extens�o "{{name}}" desativada com sucesso para o escopo "{{scope}}".',
  'Extension "{{name}}" successfully updated: {{oldVersion}} ? {{newVersion}}.':
    'Extens�o "{{name}}" atualizada com sucesso: {{oldVersion}} ? {{newVersion}}.',
  'Unable to install extension "{{name}}" due to missing install metadata':
    'N�o foi poss�vel instalar a extens�o "{{name}}" devido � falta de metadados de instala��o',
  'Extension "{{name}}" is already up to date.':
    'A extens�o "{{name}}" j� est� atualizada.',
  'Updates all extensions or a named extension to the latest version.':
    'Atualiza todas as extens�es ou uma extens�o nomeada para a �ltima vers�o.',
  'Update all extensions.': 'Atualizar todas as extens�es.',
  'Either an extension name or --all must be provided':
    'Um nome de extens�o ou --all deve ser fornecido',
  'Lists installed extensions.': 'Lista as extens�es instaladas.',
  'Link extension failed to install.': 'Falha ao instalar link da extens�o.',
  'Extension "{{name}}" linked successfully and enabled.':
    'Extens�o "{{name}}" vinculada com sucesso e ativada.',
  'Links an extension from a local path. Updates made to the local path will always be reflected.':
    'Vincula uma extens�o de um caminho local. Atualiza��es feitas no caminho local sempre ser�o refletidas.',
  'The name of the extension to link.': 'O nome da extens�o para vincular.',
  'Set a specific setting for an extension.':
    'Define uma configura��o espec�fica para uma extens�o.',
  'Name of the extension to configure.': 'Nome da extens�o para configurar.',
  'The setting to configure (name or env var).':
    'A configura��o para configurar (nome ou var env).',
  'The scope to set the setting in.': 'O escopo para definir a configura��o.',
  'List all settings for an extension.':
    'Listar todas as configura��es de uma extens�o.',
  'Name of the extension.': 'Nome da extens�o.',
  'Extension "{{name}}" has no settings to configure.':
    'A extens�o "{{name}}" n�o tem configura��es para configurar.',
  'Settings for "{{name}}":': 'Configura��es para "{{name}}":',
  '(workspace)': '(workspace)',
  '(user)': '(usu�rio)',
  '[not set]': '[n�o definido]',
  '[value stored in keychain]': '[valor armazenado no chaveiro]',
  'Value:': 'Valor:',
  'Manage extension settings.': 'Gerenciar configura��es de extens�o.',
  'You need to specify a command (set or list).':
    'Voc� precisa especificar um comando (set ou list).',

  // ============================================================================
  // Plugin Choice / Marketplace
  // ============================================================================
  'No plugins available in this marketplace.':
    'Nenhum plugin dispon�vel neste marketplace.',
  'Select a plugin to install from marketplace "{{name}}":':
    'Selecione um plugin para instalar do marketplace "{{name}}":',
  'Plugin selection cancelled.': 'Sele��o de plugin cancelada.',
  'Select a plugin from "{{name}}"': 'Selecione um plugin de "{{name}}"',
  'Use ?? or j/k to navigate, Enter to select, Escape to cancel':
    'Use ?? ou j/k para navegar, Enter para selecionar, Escape para cancelar',
  '{{count}} more above': '{{count}} mais acima',
  '{{count}} more below': '{{count}} mais abaixo',
  'manage IDE integration': 'gerenciar integra��o com IDE',
  'check status of IDE integration': 'verificar status da integra��o com IDE',
  'install required IDE companion for {{ideName}}':
    'instalar companion IDE necess�rio para {{ideName}}',
  'enable IDE integration': 'ativar integra��o com IDE',
  'disable IDE integration': 'desativar integra��o com IDE',
  'IDE integration is not supported in your current environment. To use this feature, run HopCode in one of these supported IDEs: VS Code or VS Code forks.':
    'A integra��o com IDE n�o � suportada no seu ambiente atual. Para usar este recurso, execute o HopCode em um destes IDEs suportados: VS Code ou forks do VS Code.',
  'Set up GitHub Actions': 'Configurar GitHub Actions',
  'Configure terminal keybindings for multiline input (VS Code, Cursor, Windsurf, Trae)':
    'Configurar atalhos de terminal para entrada multilinhas (VS Code, Cursor, Windsurf, Trae)',
  'Please restart your terminal for the changes to take effect.':
    'Reinicie seu terminal para que as altera��es tenham efeito.',
  'Failed to configure terminal: {{error}}':
    'Falha ao configurar terminal: {{error}}',
  'Could not determine {{terminalName}} config path on Windows: APPDATA environment variable is not set.':
    'N�o foi poss�vel determinar o caminho de configura��o de {{terminalName}} no Windows: vari�vel de ambiente APPDATA n�o est� definida.',
  '{{terminalName}} keybindings.json exists but is not a valid JSON array. Please fix the file manually or delete it to allow automatic configuration.':
    '{{terminalName}} keybindings.json existe mas n�o � um array JSON v�lido. Corrija o arquivo manualmente ou exclua-o para permitir a configura��o autom�tica.',
  'File: {{file}}': 'Arquivo: {{file}}',
  'Failed to parse {{terminalName}} keybindings.json. The file contains invalid JSON. Please fix the file manually or delete it to allow automatic configuration.':
    'Falha ao analisar {{terminalName}} keybindings.json. O arquivo cont�m JSON inv�lido. Corrija o arquivo manualmente ou exclua-o para permitir a configura��o autom�tica.',
  'Error: {{error}}': 'Erro: {{error}}',
  'Shift+Enter binding already exists': 'Atalho Shift+Enter j� existe',
  'Ctrl+Enter binding already exists': 'Atalho Ctrl+Enter j� existe',
  'Existing keybindings detected. Will not modify to avoid conflicts.':
    'Atalhos existentes detectados. N�o ser�o modificados para evitar conflitos.',
  'Please check and modify manually if needed: {{file}}':
    'Verifique e modifique manualmente se necess�rio: {{file}}',
  'Added Shift+Enter and Ctrl+Enter keybindings to {{terminalName}}.':
    'Adicionados atalhos Shift+Enter e Ctrl+Enter para {{terminalName}}.',
  'Modified: {{file}}': 'Modificado: {{file}}',
  '{{terminalName}} keybindings already configured.':
    'Atalhos de {{terminalName}} j� configurados.',
  'Failed to configure {{terminalName}}.':
    'Falha ao configurar {{terminalName}}.',
  'Your terminal is already configured for an optimal experience with multiline input (Shift+Enter and Ctrl+Enter).':
    'Seu terminal j� est� configurado para uma experi�ncia ideal com entrada multilinhas (Shift+Enter e Ctrl+Enter).',
  // ============================================================================
  // Commands - Hooks
  // ============================================================================
  'Manage HopCode hooks': 'Gerenciar hooks do HopCode',
  'List all configured hooks': 'Listar todos os hooks configurados',
  'Enable a disabled hook': 'Ativar um hook desativado',
  'Disable an active hook': 'Desativar um hook ativo',
  // Hooks - Dialog
  Hooks: 'Hooks',
  'Loading hooks...': 'Carregando hooks...',
  'Error loading hooks:': 'Erro ao carregar hooks:',
  'Press Escape to close': 'Pressione Escape para fechar',
  'Press Escape, Ctrl+C, or Ctrl+D to cancel':
    'Pressione Escape, Ctrl+C ou Ctrl+D para cancelar',
  'Press Space, Enter, or Escape to dismiss':
    'Pressione Espa�o, Enter ou Escape para dispensar',
  'No hook selected': 'Nenhum hook selecionado',
  // Hooks - List Step
  'No hook events found.': 'Nenhum evento de hook encontrado.',
  '{{count}} hook configured': '{{count}} hook configurado',
  '{{count}} hooks configured': '{{count}} hooks configurados',
  'This menu is read-only. To add or modify hooks, edit settings.json directly or ask HopCode.':
    'Este menu � somente leitura. Para adicionar ou modificar hooks, edite settings.json diretamente ou pergunte ao HopCode.',
  'Enter to select � Esc to cancel':
    'Enter para selecionar � Esc para cancelar',
  // Hooks - Detail Step
  'Exit codes:': 'C�digos de sa�da:',
  'Configured hooks:': 'Hooks configurados:',
  'No hooks configured for this event.':
    'Nenhum hook configurado para este evento.',
  'To add hooks, edit settings.json directly or ask HopCode.':
    'Para adicionar hooks, edite settings.json diretamente ou pergunte ao HopCode.',
  'Enter to select � Esc to go back': 'Enter para selecionar � Esc para voltar',
  // Hooks - Config Detail Step
  'Hook details': 'Detalhes do Hook',
  'Event:': 'Evento:',
  'Extension:': 'Extens�o:',
  'Desc:': 'Descri��o:',
  'No hook config selected': 'Nenhuma configura��o de hook selecionada',
  'To modify or remove this hook, edit settings.json directly or ask HopCode to help.':
    'Para modificar ou remover este hook, edite settings.json diretamente ou pergunte ao HopCode.',
  // Hooks - Disabled Step
  'Hook Configuration - Disabled': 'Configura��o de Hook - Desativado',
  'All hooks are currently disabled. You have {{count}} that are not running.':
    'Todos os hooks est�o desativados. Voc� tem {{count}} que n�o est�o em execu��o.',
  '{{count}} configured hook': '{{count}} hook configurado',
  '{{count}} configured hooks': '{{count}} hooks configurados',
  'When hooks are disabled:': 'Quando os hooks est�o desativados:',
  'No hook commands will execute': 'Nenhum comando de hook ser� executado',
  'StatusLine will not be displayed': 'StatusLine n�o ser� exibido',
  'Tool operations will proceed without hook validation':
    'As opera��es de ferramentas prosseguir�o sem valida��o de hook',
  'To re-enable hooks, remove "disableAllHooks" from settings.json or ask HopCode.':
    'Para reativar os hooks, remova "disableAllHooks" do settings.json ou pergunte ao HopCode.',
  // Hooks - Source
  Project: 'Projeto',
  User: 'Usu�rio',
  System: 'Sistema',
  Extension: 'Extens�o',
  'Local Settings': 'Configura��es Locais',
  'User Settings': 'Configura��es do Usu�rio',
  'System Settings': 'Configura��es do Sistema',
  Extensions: 'Extens�es',
  'Session (temporary)': 'Sess�o (tempor�rio)',
  // Hooks - Status
  '? Enabled': '? Ativado',
  '? Disabled': '? Desativado',
  // Hooks - Event Descriptions (short)
  'Before tool execution': 'Antes da execu��o da ferramenta',
  'After tool execution': 'Ap�s a execu��o da ferramenta',
  'After tool execution fails': 'Ap�s a falha da execu��o da ferramenta',
  'When notifications are sent': 'Quando notifica��es s�o enviadas',
  'When the user submits a prompt': 'Quando o usu�rio envia um prompt',
  'When a new session is started': 'Quando uma nova sess�o � iniciada',
  'Right before HopCode concludes its response':
    'Logo antes do HopCode concluir sua resposta',
  'When a subagent (Agent tool call) is started':
    'Quando um subagente (chamada de ferramenta Agent) � iniciado',
  'Right before a subagent concludes its response':
    'Logo antes de um subagente concluir sua resposta',
  'Before conversation compaction': 'Antes da compacta��o da conversa',
  'When a session is ending': 'Quando uma sess�o est� terminando',
  'When a permission dialog is displayed':
    'Quando um di�logo de permiss�o � exibido',
  // Hooks - Event Descriptions (detailed)
  'Input to command is JSON of tool call arguments.':
    'A entrada para o comando � JSON dos argumentos da chamada da ferramenta.',
  'Input to command is JSON with fields "inputs" (tool call arguments) and "response" (tool call response).':
    'A entrada para o comando � JSON com campos "inputs" (argumentos da chamada da ferramenta) e "response" (resposta da chamada da ferramenta).',
  'Input to command is JSON with tool_name, tool_input, tool_use_id, error, error_type, is_interrupt, and is_timeout.':
    'A entrada para o comando � JSON com tool_name, tool_input, tool_use_id, error, error_type, is_interrupt e is_timeout.',
  'Input to command is JSON with notification message and type.':
    'A entrada para o comando � JSON com mensagem e tipo de notifica��o.',
  'Input to command is JSON with original user prompt text.':
    'A entrada para o comando � JSON com o texto original do prompt do usu�rio.',
  'Input to command is JSON with session start source.':
    'A entrada para o comando � JSON com a fonte de in�cio da sess�o.',
  'Input to command is JSON with session end reason.':
    'A entrada para o comando � JSON com o motivo do fim da sess�o.',
  'Input to command is JSON with agent_id and agent_type.':
    'A entrada para o comando � JSON com agent_id e agent_type.',
  'Input to command is JSON with agent_id, agent_type, and agent_transcript_path.':
    'A entrada para o comando � JSON com agent_id, agent_type e agent_transcript_path.',
  'Input to command is JSON with compaction details.':
    'A entrada para o comando � JSON com detalhes da compacta��o.',
  'Input to command is JSON with tool_name, tool_input, and tool_use_id. Output JSON with hookSpecificOutput containing decision to allow or deny.':
    'A entrada para o comando � JSON com tool_name, tool_input e tool_use_id. Sa�da � JSON com hookSpecificOutput contendo decis�o de permitir ou negar.',
  // Hooks - Exit Code Descriptions
  'stdout/stderr not shown': 'stdout/stderr n�o exibido',
  'show stderr to model and continue conversation':
    'mostrar stderr ao modelo e continuar conversa',
  'show stderr to user only': 'mostrar stderr apenas ao usu�rio',
  'stdout shown in transcript mode (ctrl+o)':
    'stdout exibido no modo transcri��o (ctrl+o)',
  'show stderr to model immediately': 'mostrar stderr ao modelo imediatamente',
  'show stderr to user only but continue with tool call':
    'mostrar stderr apenas ao usu�rio mas continuar com chamada de ferramenta',
  'block processing, erase original prompt, and show stderr to user only':
    'bloquear processamento, apagar prompt original e mostrar stderr apenas ao usu�rio',
  'stdout shown to HopCode': 'stdout mostrado ao HopCode',
  'show stderr to user only (blocking errors ignored)':
    'mostrar stderr apenas ao usu�rio (erros de bloqueio ignorados)',
  'command completes successfully': 'comando conclu�do com sucesso',
  'stdout shown to subagent': 'stdout mostrado ao subagente',
  'show stderr to subagent and continue having it run':
    'mostrar stderr ao subagente e continuar executando',
  'stdout appended as custom compact instructions':
    'stdout anexado como instru��es de compacta��o personalizadas',
  'block compaction': 'bloquear compacta��o',
  'show stderr to user only but continue with compaction':
    'mostrar stderr apenas ao usu�rio mas continuar com compacta��o',
  'use hook decision if provided': 'usar decis�o do hook se fornecida',
  // Hooks - Messages
  'Config not loaded.': 'Configura��o n�o carregada.',
  'Hooks are not enabled. Enable hooks in settings to use this feature.':
    'Hooks n�o est�o ativados. Ative hooks nas configura��es para usar este recurso.',
  'No hooks configured. Add hooks in your settings.json file.':
    'Nenhum hook configurado. Adicione hooks no seu arquivo settings.json.',
  'Configured Hooks ({{count}} total)': 'Hooks Configurados ({{count}} total)',

  // ============================================================================
  // Commands - Session Export
  // ============================================================================
  'Export current session message history to a file':
    'Exportar o hist�rico de mensagens da sess�o atual para um arquivo',
  'Export session to HTML format': 'Exportar a sess�o para o formato HTML',
  'Export session to JSON format': 'Exportar a sess�o para o formato JSON',
  'Export session to JSONL format (one message per line)':
    'Exportar a sess�o para o formato JSONL (uma mensagem por linha)',
  'Export session to markdown format':
    'Exportar a sess�o para o formato Markdown',

  // ============================================================================
  // Commands - Insights
  // ============================================================================
  'generate personalized programming insights from your chat history':
    'Gerar insights personalizados de programa��o a partir do seu hist�rico de chat',

  // ============================================================================
  // Commands - Session History
  // ============================================================================
  'Resume a previous session': 'Retomar uma sess�o anterior',
  'Restore a tool call. This will reset the conversation and file history to the state it was in when the tool call was suggested':
    'Restaurar uma chamada de ferramenta. Isso redefinir� o hist�rico da conversa e dos arquivos para o estado em que a chamada da ferramenta foi sugerida',
  'Could not detect terminal type. Supported terminals: VS Code, Cursor, Windsurf, and Trae.':
    'N�o foi poss�vel detectar o tipo de terminal. Terminais suportados: VS Code, Cursor, Windsurf e Trae.',
  'Terminal "{{terminal}}" is not supported yet.':
    'O terminal "{{terminal}}" ainda n�o � suportado.',

  // ============================================================================
  // Commands - Language
  // ============================================================================
  'Invalid language. Available: {{options}}':
    'Idioma inv�lido. Dispon�veis: {{options}}',
  'Language subcommands do not accept additional arguments.':
    'Subcomandos de idioma n�o aceitam argumentos adicionais.',
  'Current UI language: {{lang}}': 'Idioma atual da interface: {{lang}}',
  'Current LLM output language: {{lang}}':
    'Idioma atual da sa�da do LLM: {{lang}}',
  'LLM output language not set': 'Idioma de sa�da do LLM n�o definido',
  'Set UI language': 'Definir idioma da interface',
  'Set LLM output language': 'Definir idioma de sa�da do LLM',
  'Usage: /language ui [{{options}}]': 'Uso: /language ui [{{options}}]',
  'Usage: /language output <language>': 'Uso: /language output <idioma>',
  'Example: /language output ??': 'Exemplo: /language output Portugu�s',
  'Example: /language output English': 'Exemplo: /language output Ingl�s',
  'Example: /language output ???': 'Exemplo: /language output Japon�s',
  'Example: /language output Portugu�s': 'Exemplo: /language output Portugu�s',
  'UI language changed to {{lang}}':
    'Idioma da interface alterado para {{lang}}',
  'LLM output language set to {{lang}}':
    'Idioma de sa�da do LLM definido para {{lang}}',
  'LLM output language rule file generated at {{path}}':
    'Arquivo de regra de idioma de sa�da do LLM gerado em {{path}}',
  'Please restart the application for the changes to take effect.':
    'Reinicie o aplicativo para que as altera��es tenham efeito.',
  'Failed to generate LLM output language rule file: {{error}}':
    'Falha ao gerar arquivo de regra de idioma de sa�da do LLM: {{error}}',
  'Invalid command. Available subcommands:':
    'Comando inv�lido. Subcomandos dispon�veis:',
  'Available subcommands:': 'Subcomandos dispon�veis:',
  'To request additional UI language packs, please open an issue on GitHub.':
    'Para solicitar pacotes de idiomas de interface adicionais, abra um problema no GitHub.',
  'Available options:': 'Op��es dispon�veis:',
  'Set UI language to {{name}}': 'Definir idioma da interface para {{name}}',

  // ============================================================================
  // Commands - Approval Mode
  // ============================================================================
  'Tool Approval Mode': 'Modo de Aprova��o de Ferramenta',
  'Current approval mode: {{mode}}': 'Modo de aprova��o atual: {{mode}}',
  'Available approval modes:': 'Modos de aprova��o dispon�veis:',
  'Approval mode changed to: {{mode}}':
    'Modo de aprova��o alterado para: {{mode}}',
  'Approval mode changed to: {{mode}} (saved to {{scope}} settings{{location}})':
    'Modo de aprova��o alterado para: {{mode}} (salvo nas configura��es de {{scope}}{{location}})',
  'Usage: /approval-mode <mode> [--session|--user|--project]':
    'Uso: /approval-mode <mode> [--session|--user|--project]',

  'Scope subcommands do not accept additional arguments.':
    'Subcomandos de escopo n�o aceitam argumentos adicionais.',
  'Plan mode - Analyze only, do not modify files or execute commands':
    'Modo planejamento - Apenas analisa, n�o modifica arquivos nem executa comandos',
  'Default mode - Require approval for file edits or shell commands':
    'Modo padr�o - Exige aprova��o para edi��es de arquivos ou comandos shell',
  'Auto-edit mode - Automatically approve file edits':
    'Modo auto-edi��o - Aprova automaticamente edi��es de arquivos',
  'IZN mode - Automatically approve all tools':
    'Modo IZN - Aprova automaticamente todas as ferramentas',
  '{{mode}} mode': 'Modo {{mode}}',
  'Settings service is not available; unable to persist the approval mode.':
    'Servi�o de configura��es n�o dispon�vel; n�o foi poss�vel persistir o modo de aprova��o.',
  'Failed to save approval mode: {{error}}':
    'Falha ao salvar modo de aprova��o: {{error}}',
  'Failed to change approval mode: {{error}}':
    'Falha ao alterar modo de aprova��o: {{error}}',
  'Apply to current session only (temporary)':
    'Aplicar apenas � sess�o atual (tempor�rio)',
  'Persist for this project/workspace': 'Persistir para este projeto/workspace',
  'Persist for this user on this machine':
    'Persistir para este usu�rio nesta m�quina',
  'Analyze only, do not modify files or execute commands':
    'Apenas analisar, n�o modificar arquivos nem executar comandos',
  'Require approval for file edits or shell commands':
    'Exigir aprova��o para edi��es de arquivos ou comandos shell',
  'Automatically approve file edits':
    'Aprovar automaticamente edi��es de arquivos',
  'Automatically approve all tools':
    'Aprovar automaticamente todas as ferramentas',
  'Workspace approval mode exists and takes priority. User-level change will have no effect.':
    'O modo de aprova��o do workspace existe e tem prioridade. A altera��o no n�vel do usu�rio n�o ter� efeito.',
  'Apply To': 'Aplicar A',
  'Workspace Settings': 'Configura��es do Workspace',

  // ============================================================================
  // Commands - Memory
  // ============================================================================
  'Commands for interacting with memory.':
    'Comandos para interagir com a mem�ria.',
  'Show the current memory contents.':
    'Mostrar os conte�dos atuais da mem�ria.',
  'Show project-level memory contents.':
    'Mostrar conte�dos da mem�ria de n�vel de projeto.',
  'Show global memory contents.': 'Mostrar conte�dos da mem�ria global.',
  'Add content to project-level memory.':
    'Adicionar conte�do � mem�ria de n�vel de projeto.',
  'Add content to global memory.': 'Adicionar conte�do � mem�ria global.',
  'Refresh the memory from the source.': 'Atualizar a mem�ria da fonte.',
  'Usage: /memory add --project <text to remember>':
    'Uso: /memory add --project <texto para lembrar>',
  'Usage: /memory add --global <text to remember>':
    'Uso: /memory add --global <texto para lembrar>',
  'Attempting to save to project memory: "{{text}}"':
    'Tentando salvar na mem�ria do projeto: "{{text}}"',
  'Attempting to save to global memory: "{{text}}"':
    'Tentando salvar na mem�ria global: "{{text}}"',
  'Current memory content from {{count}} file(s):':
    'Conte�do da mem�ria atual de {{count}} arquivo(s):',
  'Memory is currently empty.': 'A mem�ria est� vazia no momento.',
  'Project memory file not found or is currently empty.':
    'Arquivo de mem�ria do projeto n�o encontrado ou est� vazio.',
  'Global memory file not found or is currently empty.':
    'Arquivo de mem�ria global n�o encontrado ou est� vazio.',
  'Global memory is currently empty.':
    'A mem�ria global est� vazia no momento.',
  'Global memory content:\n\n---\n{{content}}\n---':
    'Conte�do da mem�ria global:\n\n---\n{{content}}\n---',
  'Project memory content from {{path}}:\n\n---\n{{content}}\n---':
    'Conte�do da mem�ria do projeto de {{path}}:\n\n---\n{{content}}\n---',
  'Project memory is currently empty.':
    'A mem�ria do projeto est� vazia no momento.',
  'Refreshing memory from source files...':
    'Atualizando mem�ria dos arquivos fonte...',
  'Add content to the memory. Use --global for global memory or --project for project memory.':
    'Adicionar conte�do � mem�ria. Use --global para mem�ria global ou --project para mem�ria do projeto.',
  'Usage: /memory add [--global|--project] <text to remember>':
    'Uso: /memory add [--global|--project] <texto para lembrar>',
  'Attempting to save to memory {{scope}}: "{{fact}}"':
    'Tentando salvar na mem�ria {{scope}}: "{{fact}}"',
  'Open auto-memory folder': 'Abrir pasta de mem�ria autom�tica',
  'Auto-memory: {{status}}': 'Mem�ria autom�tica: {{status}}',
  'Auto-dream: {{status}} � {{lastDream}} � /dream to run':
    'Consolida��o autom�tica: {{status}} � {{lastDream}} � /dream para executar',
  never: 'nunca',
  on: 'ativado',
  off: 'desativado',
  '? dreaming': '? consolidando',
  'Remove matching entries from managed auto-memory.':
    'Remover entradas correspondentes da mem�ria autom�tica gerenciada.',
  'Usage: /forget <memory text to remove>':
    'Uso: /forget <texto de mem�ria a remover>',
  'No managed auto-memory entries matched: {{query}}':
    'Nenhuma entrada de mem�ria autom�tica gerenciada correspondeu: {{query}}',
  'Show managed auto-memory status.':
    'Mostrar status da mem�ria autom�tica gerenciada.',
  'Run managed auto-memory extraction for the current session.':
    'Executar extra��o de mem�ria autom�tica gerenciada para a sess�o atual.',
  'Managed auto-memory root: {{root}}':
    'Raiz da mem�ria autom�tica gerenciada: {{root}}',
  'Managed auto-memory topics:': 'T�picos de mem�ria autom�tica gerenciada:',
  'No extraction cursor found yet.':
    'Nenhum cursor de extra��o encontrado ainda.',
  'Cursor: session={{sessionId}}, offset={{offset}}, updated={{updatedAt}}':
    'Cursor: sess�o={{sessionId}}, offset={{offset}}, atualizado={{updatedAt}}',
  'No chat client available to extract memory.':
    'Nenhum cliente de chat dispon�vel para extrair mem�ria.',
  'Managed auto-memory extraction is already running.':
    'A extra��o de mem�ria autom�tica gerenciada j� est� em execu��o.',
  'Managed auto-memory extraction found no new durable memories.':
    'A extra��o de mem�ria autom�tica gerenciada n�o encontrou novas mem�rias dur�veis.',
  'Consolidate managed auto-memory topic files.':
    'Consolidar arquivos de t�picos de mem�ria autom�tica gerenciada.',
  'Managed auto-memory dream found nothing to improve.':
    'A consolida��o de mem�ria autom�tica n�o encontrou nada para melhorar.',
  'Deduplicated entries: {{count}}': 'Entradas desduplicadas: {{count}}',
  'Save a durable memory using the save_memory tool.':
    'Salvar uma mem�ria dur�vel usando a ferramenta save_memory.',
  'Usage: /remember [--global|--project] <text to remember>':
    'Uso: /remember [--global|--project] <texto a lembrar>',

  // ============================================================================
  // Commands - MCP
  // ============================================================================
  'Authenticate with an OAuth-enabled MCP server':
    'Autenticar com um servidor MCP habilitado para OAuth',
  'List configured MCP servers and tools':
    'Listar servidores e ferramentas MCP configurados',
  'Restarts MCP servers.': 'Reinicia os servidores MCP.',
  'Could not retrieve tool registry.':
    'N�o foi poss�vel recuperar o registro de ferramentas.',
  'No MCP servers configured with OAuth authentication.':
    'Nenhum servidor MCP configurado com autentica��o OAuth.',
  'MCP servers with OAuth authentication:':
    'Servidores MCP com autentica��o OAuth:',
  'Use /mcp auth <server-name> to authenticate.':
    'Use /mcp auth <nome-do-servidor> para autenticar.',
  "MCP server '{{name}}' not found.": "Servidor MCP '{{name}}' n�o encontrado.",
  "Successfully authenticated and refreshed tools for '{{name}}'.":
    "Autenticado com sucesso e ferramentas atualizadas para '{{name}}'.",
  "Failed to authenticate with MCP server '{{name}}': {{error}}":
    "Falha ao autenticar com o servidor MCP '{{name}}': {{error}}",
  "Re-discovering tools from '{{name}}'...":
    "Redescobrindo ferramentas de '{{name}}'...",
  "Discovered {{count}} tool(s) from '{{name}}'.":
    "{{count}} ferramenta(s) descoberta(s) de '{{name}}'.",
  'Authentication complete. Returning to server details...':
    'Autentica��o conclu�da. Retornando aos detalhes do servidor...',
  'Authentication successful.': 'Autentica��o bem-sucedida.',
  'If the browser does not open, copy and paste this URL into your browser:':
    'Se o navegador n�o abrir, copie e cole esta URL no seu navegador:',
  'Make sure to copy the COMPLETE URL - it may wrap across multiple lines.':
    '??  Certifique-se de copiar a URL COMPLETA � ela pode ocupar v�rias linhas.',

  // ============================================================================
  // Commands - Chat
  // ============================================================================
  'Manage conversation history.': 'Gerenciar hist�rico de conversas.',
  'List saved conversation checkpoints':
    'Listar checkpoints de conversa salvos',
  'No saved conversation checkpoints found.':
    'Nenhum checkpoint de conversa salvo encontrado.',
  'List of saved conversations:': 'Lista de conversas salvas:',
  'Note: Newest last, oldest first':
    'Nota: Mais novos por �ltimo, mais antigos primeiro',
  'Save the current conversation as a checkpoint. Usage: /chat save <tag>':
    'Salvar a conversa atual como um checkpoint. Uso: /chat save <tag>',
  'Missing tag. Usage: /chat save <tag>': 'Tag ausente. Uso: /chat save <tag>',
  'Delete a conversation checkpoint. Usage: /chat delete <tag>':
    'Excluir um checkpoint de conversa. Uso: /chat delete <tag>',
  'Missing tag. Usage: /chat delete <tag>':
    'Tag ausente. Uso: /chat delete <tag>',
  "Conversation checkpoint '{{tag}}' has been deleted.":
    "O checkpoint de conversa '{{tag}}' foi exclu�do.",
  "Error: No checkpoint found with tag '{{tag}}'.":
    "Erro: Nenhum checkpoint encontrado com a tag '{{tag}}'.",
  'Resume a conversation from a checkpoint. Usage: /chat resume <tag>':
    'Retomar uma conversa de um checkpoint. Uso: /chat resume <tag>',
  'Missing tag. Usage: /chat resume <tag>':
    'Tag ausente. Uso: /chat resume <tag>',
  'No saved checkpoint found with tag: {{tag}}.':
    'Nenhum checkpoint salvo encontrado com a tag: {{tag}}.',
  'A checkpoint with the tag {{tag}} already exists. Do you want to overwrite it?':
    'Um checkpoint com a tag {{tag}} j� existe. Voc� deseja substitu�-lo?',
  'No chat client available to save conversation.':
    'Nenhum cliente de chat dispon�vel para salvar a conversa.',
  'Conversation checkpoint saved with tag: {{tag}}.':
    'Checkpoint de conversa salvo com a tag: {{tag}}.',
  'No conversation found to save.': 'Nenhuma conversa encontrada para salvar.',
  'No chat client available to share conversation.':
    'Nenhum cliente de chat dispon�vel para compartilhar a conversa.',
  'Invalid file format. Only .md and .json are supported.':
    'Formato de arquivo inv�lido. Apenas .md e .json s�o suportados.',
  'Error sharing conversation: {{error}}':
    'Erro ao compartilhar conversa: {{error}}',
  'Conversation shared to {{filePath}}':
    'Conversa compartilhada em {{filePath}}',
  'No conversation found to share.':
    'Nenhuma conversa encontrada para compartilhar.',
  'Share the current conversation to a markdown or json file. Usage: /chat share <file>':
    'Compartilhar a conversa atual para um arquivo markdown ou json. Uso: /chat share <arquivo>',

  // ============================================================================
  // Commands - Summary
  // ============================================================================
  'Generate a project summary and save it to .hopcode/PROJECT_SUMMARY.md':
    'Gerar um resumo do projeto e salv�-lo em .hopcode/PROJECT_SUMMARY.md',
  'No chat client available to generate summary.':
    'Nenhum cliente de chat dispon�vel para gerar o resumo.',
  'Already generating summary, wait for previous request to complete':
    'J� gerando resumo, aguarde a conclus�o da solicita��o anterior',
  'No conversation found to summarize.':
    'Nenhuma conversa encontrada para resumir.',
  'Failed to generate project context summary: {{error}}':
    'Falha ao gerar resumo do contexto do projeto: {{error}}',
  'Saved project summary to {{filePathForDisplay}}.':
    'Resumo do projeto salvo em {{filePathForDisplay}}.',
  'Saving project summary...': 'Salvando resumo do projeto...',
  'Generating project summary...': 'Gerando resumo do projeto...',
  'Failed to generate summary - no text content received from LLM response':
    'Falha ao gerar resumo - nenhum conte�do de texto recebido da resposta do LLM',

  // ============================================================================
  // Commands - Model
  // ============================================================================
  'Switch the model for this session (--fast for suggestion model)':
    'Trocar o modelo para esta sess�o (--fast para modelo de sugest�es)',
  'Set a lighter model for prompt suggestions and speculative execution':
    'Definir modelo mais leve para sugest�es de prompt e execu��o especulativa',
  'Content generator configuration not available.':
    'Configura��o do gerador de conte�do n�o dispon�vel.',
  'Authentication type not available.': 'Tipo de autentica��o n�o dispon�vel.',
  'No models available for the current authentication type ({{authType}}).':
    'Nenhum modelo dispon�vel para o tipo de autentica��o atual ({{authType}}).',

  // ============================================================================
  // Commands - Clear
  // ============================================================================
  'Starting a new session, resetting chat, and clearing terminal.':
    'Iniciando uma nova sess�o, resetando o chat e limpando o terminal.',
  'Starting a new session and clearing.':
    'Iniciando uma nova sess�o e limpando.',

  // ============================================================================
  // Commands - Compress
  // ============================================================================
  'Already compressing, wait for previous request to complete':
    'J� comprimindo, aguarde a conclus�o da solicita��o anterior',
  'Failed to compress chat history.': 'Falha ao comprimir hist�rico do chat.',
  'Failed to compress chat history: {{error}}':
    'Falha ao comprimir hist�rico do chat: {{error}}',
  'Compressing chat history': 'Comprimindo hist�rico do chat',
  'Chat history compressed from {{originalTokens}} to {{newTokens}} tokens.':
    'Hist�rico do chat comprimido de {{originalTokens}} para {{newTokens}} tokens.',
  'Compression was not beneficial for this history size.':
    'A compress�o n�o foi ben�fica para este tamanho de hist�rico.',
  'Chat history compression did not reduce size. This may indicate issues with the compression prompt.':
    'A compress�o do hist�rico do chat n�o reduziu o tamanho. Isso pode indicar problemas com o prompt de compress�o.',
  'Could not compress chat history due to a token counting error.':
    'N�o foi poss�vel comprimir o hist�rico do chat devido a um erro de contagem de tokens.',
  'Chat history is already compressed.':
    'O hist�rico do chat j� est� comprimido.',

  // ============================================================================
  // Commands - Directory
  // ============================================================================
  'Configuration is not available.': 'A configura��o n�o est� dispon�vel.',
  'Please provide at least one path to add.':
    'Forne�a pelo menos um caminho para adicionar.',
  'The /directory add command is not supported in restrictive sandbox profiles. Please use --include-directories when starting the session instead.':
    'O comando /directory add n�o � suportado em perfis de sandbox restritivos. Use --include-directories ao iniciar a sess�o.',
  "Error adding '{{path}}': {{error}}":
    "Erro ao adicionar '{{path}}': {{error}}",
  'Successfully added HOPCODE.md files from the following directories if there are:\n- {{directories}}':
    'Arquivos HOPCODE.md adicionados com sucesso dos seguintes diret�rios, se houverem:\n- {{directories}}',
  'Error refreshing memory: {{error}}': 'Erro ao atualizar mem�ria: {{error}}',
  'Successfully added directories:\n- {{directories}}':
    'Diret�rios adicionados com sucesso:\n- {{directories}}',
  'Current workspace directories:\n{{directories}}':
    'Diret�rios atuais do workspace:\n{{directories}}',

  // ============================================================================
  // Commands - Docs
  // ============================================================================
  'Please open the following URL in your browser to view the documentation:\n{{url}}':
    'Abra a seguinte URL no seu navegador para ver a documenta��o:\n{{url}}',
  'Opening documentation in your browser: {{url}}':
    'Abrindo documenta��o no seu navegador: {{url}}',

  // ============================================================================
  // Dialogs - Tool Confirmation
  // ============================================================================
  'Do you want to proceed?': 'Voc� deseja prosseguir?',
  'Yes, allow once': 'Sim, permitir uma vez',
  'Allow always': 'Permitir sempre',
  Yes: 'Sim',
  No: 'N�o',
  'No (esc)': 'N�o (esc)',
  'Yes, allow always for this session': 'Sim, permitir sempre para esta sess�o',

  // MCP Management - Core translations
  'Manage MCP servers': 'Gerenciar servidores MCP',
  'Server Detail': 'Detalhes do servidor',
  'Disable Server': 'Desativar servidor',
  Tools: 'Ferramentas',
  'Tool Detail': 'Detalhes da ferramenta',
  'MCP Management': 'Gerenciamento MCP',
  'Loading...': 'Carregando...',
  'Unknown step': 'Etapa desconhecida',
  'Esc to back': 'Esc para voltar',
  '?? to navigate � Enter to select � Esc to close':
    '?? navegar � Enter selecionar � Esc fechar',
  '?? to navigate � Enter to select � Esc to back':
    '?? navegar � Enter selecionar � Esc voltar',
  '?? to navigate � Enter to confirm � Esc to back':
    '?? navegar � Enter confirmar � Esc voltar',
  'User Settings (global)': 'Configura��es do usu�rio (global)',
  'Workspace Settings (project-specific)':
    'Configura��es do workspace (espec�fico do projeto)',
  'Disable server:': 'Desativar servidor:',
  'Select where to add the server to the exclude list:':
    'Selecione onde adicionar o servidor � lista de exclus�o:',
  'Press Enter to confirm, Esc to cancel':
    'Enter para confirmar, Esc para cancelar',
  Disable: 'Desativar',
  Enable: 'Ativar',
  Authenticate: 'Autenticar',
  'Re-authenticate': 'Reautenticar',
  'Clear Authentication': 'Limpar autentica��o',
  disabled: 'desativado',
  'Server:': 'Servidor:',
  Reconnect: 'Reconectar',
  'View tools': 'Ver ferramentas',
  'Status:': 'Status:',
  'Source:': 'Fonte:',
  'Command:': 'Comando:',
  'Working Directory:': 'Diret�rio de trabalho:',
  'Capabilities:': 'Capacidades:',
  'No server selected': 'Nenhum servidor selecionado',
  '(disabled)': '(desativado)',
  'Error:': 'Erro:',
  tool: 'ferramenta',
  tools: 'ferramentas',
  connected: 'conectado',
  connecting: 'conectando',
  disconnected: 'desconectado',
  error: 'erro',

  // MCP Server List
  'User MCPs': 'MCPs do usu�rio',
  'Project MCPs': 'MCPs do projeto',
  'Extension MCPs': 'MCPs de extens�o',
  server: 'servidor',
  servers: 'servidores',
  'Add MCP servers to your settings to get started.':
    'Adicione servidores MCP �s suas configura��es para come�ar.',
  'Run hopcode --debug to see error logs':
    'Execute hopcode --debug para ver os logs de erro',

  // MCP OAuth Authentication
  'OAuth Authentication': 'Autentica��o OAuth',
  'Press Enter to start authentication, Esc to go back':
    'Pressione Enter para iniciar a autentica��o, Esc para voltar',
  'Authenticating... Please complete the login in your browser.':
    'Autenticando... Por favor, conclua o login no seu navegador.',
  'Press Enter or Esc to go back': 'Pressione Enter ou Esc para voltar',

  // MCP Tool List
  'No tools available for this server.':
    'Nenhuma ferramenta dispon�vel para este servidor.',
  destructive: 'destrutivo',
  'read-only': 'somente leitura',
  'open-world': 'mundo aberto',
  idempotent: 'idempotente',
  'Tools for {{name}}': 'Ferramentas para {{name}}',
  'Tools for {{serverName}}': 'Ferramentas para {{serverName}}',
  '{{current}}/{{total}}': '{{current}}/{{total}}',

  // MCP Tool Detail
  required: 'obrigat�rio',
  Type: 'Tipo',
  Enum: 'Enumera��o',
  Parameters: 'Par�metros',
  'No tool selected': 'Nenhuma ferramenta selecionada',
  Annotations: 'Anota��es',
  Title: 'T�tulo',
  'Read Only': 'Somente leitura',
  Destructive: 'Destrutivo',
  Idempotent: 'Idempotente',
  'Open World': 'Mundo aberto',
  Server: 'Servidor',

  // Invalid tool related translations
  '{{count}} invalid tools': '{{count}} ferramentas inv�lidas',
  invalid: 'inv�lido',
  'invalid: {{reason}}': 'inv�lido: {{reason}}',
  'missing name': 'nome ausente',
  'missing description': 'descri��o ausente',
  '(unnamed)': '(sem nome)',
  'Warning: This tool cannot be called by the LLM':
    'Aviso: Esta ferramenta n�o pode ser chamada pelo LLM',
  Reason: 'Motivo',
  'Tools must have both name and description to be used by the LLM.':
    'As ferramentas devem ter tanto nome quanto descri��o para serem usadas pelo LLM.',
  'Modify in progress:': 'Modifica��o em progresso:',
  'Save and close external editor to continue':
    'Salve e feche o editor externo para continuar',
  'Apply this change?': 'Aplicar esta altera��o?',
  'Yes, allow always': 'Sim, permitir sempre',
  'Modify with external editor': 'Modificar com editor externo',
  'No, suggest changes (esc)': 'N�o, sugerir altera��es (esc)',
  "Allow execution of: '{{command}}'?":
    "Permitir a execu��o de: '{{command}}'?",
  'Yes, allow always ...': 'Sim, permitir sempre ...',
  'Always allow in this project': 'Sempre permitir neste projeto',
  'Always allow {{action}} in this project':
    'Sempre permitir {{action}} neste projeto',
  'Always allow for this user': 'Sempre permitir para este usu�rio',
  'Always allow {{action}} for this user':
    'Sempre permitir {{action}} para este usu�rio',
  'Yes, restore previous mode ({{mode}})':
    'Sim, restaurar modo anterior ({{mode}})',
  'Yes, and auto-accept edits': 'Sim, e aceitar edi��es automaticamente',
  'Yes, and manually approve edits': 'Sim, e aprovar edi��es manualmente',
  'No, keep planning (esc)': 'N�o, continuar planejando (esc)',
  'URLs to fetch:': 'URLs para buscar:',
  'MCP Server: {{server}}': 'Servidor MCP: {{server}}',
  'Tool: {{tool}}': 'Ferramenta: {{tool}}',
  'Allow execution of MCP tool "{{tool}}" from server "{{server}}"?':
    'Permitir a execu��o da ferramenta MCP "{{tool}}" do servidor "{{server}}"?',
  'Yes, always allow tool "{{tool}}" from server "{{server}}"':
    'Sim, sempre permitir a ferramenta "{{tool}}" do servidor "{{server}}"',
  'Yes, always allow all tools from server "{{server}}"':
    'Sim, sempre permitir todas as ferramentas do servidor "{{server}}"',

  // ============================================================================
  // Dialogs - Shell Confirmation
  // ============================================================================
  'Shell Command Execution': 'Execu��o de Comando Shell',
  'A custom command wants to run the following shell commands:':
    'Um comando personalizado deseja executar os seguintes comandos shell:',

  // ============================================================================
  // Dialogs - Pro Quota
  // ============================================================================
  'Pro quota limit reached for {{model}}.':
    'Limite de cota Pro atingido para {{model}}.',
  'Change auth (executes the /auth command)':
    'Alterar autentica��o (executa o comando /auth)',
  'Continue with {{model}}': 'Continuar com {{model}}',

  // ============================================================================
  // Dialogs - Welcome Back
  // ============================================================================
  'Current Plan:': 'Plano Atual:',
  'Progress: {{done}}/{{total}} tasks completed':
    'Progresso: {{done}}/{{total}} tarefas conclu�das',
  ', {{inProgress}} in progress': ', {{inProgress}} em progresso',
  'Pending Tasks:': 'Tarefas Pendentes:',
  'What would you like to do?': 'O que voc� gostaria de fazer?',
  'Choose how to proceed with your session:':
    'Escolha como proceder com sua sess�o:',
  'Start new chat session': 'Iniciar nova sess�o de chat',
  'Continue previous conversation': 'Continuar conversa anterior',
  '?? Welcome back! (Last updated: {{timeAgo}})':
    '?? Bem-vindo de volta! (�ltima atualiza��o: {{timeAgo}})',
  '?? Overall Goal:': '?? Objetivo Geral:',

  // ============================================================================
  // Dialogs - Auth
  // ============================================================================
  'Get started': 'Come�ar',
  'Select Authentication Method': 'Selecionar M�todo de Autentica��o',
  'OpenAI API key is required to use OpenAI authentication.':
    'A chave da API do OpenAI � necess�ria para usar a autentica��o do OpenAI.',
  'You must select an auth method to proceed. Press Ctrl+C again to exit.':
    'Voc� deve selecionar um m�todo de autentica��o para prosseguir. Pressione Ctrl+C novamente para sair.',
  'Terms of Services and Privacy Notice':
    'Termos de Servi�o e Aviso de Privacidade',
  'Qwen OAuth': 'Legacy OAuth',
  'Discontinued � switch to Coding Plan or API Key':
    'Descontinuado � mude para Coding Plan ou API Key',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Run /auth to switch provider.':
    'O n�vel gratuito do Legacy OAuth foi descontinuado em 2026-04-15. Execute /auth para trocar de provedor.',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Please select Coding Plan or API Key instead.':
    'O n�vel gratuito do Legacy OAuth foi descontinuado em 2026-04-15. Selecione Coding Plan ou API Key.',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Please select a model from another provider or run /auth to switch.':
    'O n�vel gratuito do Legacy OAuth foi descontinuado em 2026-04-15. Por favor, selecione um modelo de outro provedor ou execute /auth para trocar.',
  '\n? Qwen OAuth free tier was discontinued on 2026-04-15. Please select another option.\n':
    '\n? O n�vel gratuito do Legacy OAuth foi descontinuado em 2026-04-15. Selecione outra op��o.\n',
  'Paid \u00B7 Up to 6,000 requests/5 hrs \u00B7 All Alibaba Cloud Coding Plan Models':
    'Pago \u00B7 At� 6.000 solicita��es/5 hrs \u00B7 Todos os modelos Alibaba Cloud Coding Plan',
  'Alibaba Cloud Coding Plan': 'Alibaba Cloud Coding Plan',
  'Bring your own API key': 'Traga sua pr�pria chave API',
  'Browser-based authentication with third-party providers (e.g. OpenRouter, ModelScope)':
    'Autentica��o baseada em navegador com provedores terceiros (por exemplo, OpenRouter, ModelScope)',
  'API-KEY': 'API-KEY',
  'Use coding plan credentials or your own api-keys/providers.':
    'Use credenciais do Coding Plan ou suas pr�prias chaves API/provedores.',
  OpenAI: 'OpenAI',
  'Failed to login. Message: {{message}}':
    'Falha ao fazer login. Mensagem: {{message}}',
  'Authentication is enforced to be {{enforcedType}}, but you are currently using {{currentType}}.':
    'A autentica��o � for�ada para {{enforcedType}}, mas voc� est� usando {{currentType}} no momento.',
  'Qwen OAuth authentication timed out. Please try again.':
    'A autentica��o Legacy OAuth expirou. Tente novamente.',
  'Qwen OAuth authentication cancelled.':
    'Autentica��o Legacy OAuth cancelada.',
  'Qwen OAuth Authentication': 'Autentica��o Legacy OAuth',
  'Please visit this URL to authorize:': 'Visite esta URL para autorizar:',
  'Or scan the QR code below:': 'Ou escaneie o c�digo QR abaixo:',
  'Waiting for authorization': 'Aguardando autoriza��o',
  'Time remaining:': 'Tempo restante:',
  '(Press ESC or CTRL+C to cancel)': '(Pressione ESC ou CTRL+C para cancelar)',
  'Qwen OAuth Authentication Timeout':
    'Tempo Limite de Autentica��o Legacy OAuth',
  'OAuth token expired (over {{seconds}} seconds). Please select authentication method again.':
    'Token OAuth expirado (mais de {{seconds}} segundos). Selecione o m�todo de autentica��o novamente.',
  'Press any key to return to authentication type selection.':
    'Pressione qualquer tecla para retornar � sele��o do tipo de autentica��o.',
  'Waiting for Qwen OAuth authentication...':
    'Aguardando autentica��o Legacy OAuth...',
  'Note: Your existing API key in settings.json will not be cleared when using Qwen OAuth. You can switch back to OpenAI authentication later if needed.':
    'Nota: Sua chave de API existente no settings.json n�o ser� limpa ao usar o Legacy OAuth. Voc� pode voltar para a autentica��o do OpenAI mais tarde, se necess�rio.',
  'Note: Your existing API key will not be cleared when using Qwen OAuth.':
    'Nota: Sua chave de API existente n�o ser� limpa ao usar o Legacy OAuth.',
  'Authentication timed out. Please try again.':
    'A autentica��o expirou. Tente novamente.',
  'Waiting for auth... (Press ESC or CTRL+C to cancel)':
    'Aguardando autentica��o... (Pressione ESC ou CTRL+C para cancelar)',
  'Missing API key for OpenAI-compatible auth. Set settings.security.auth.apiKey, or set the {{envKeyHint}} environment variable.':
    'Chave de API ausente para autentica��o compat�vel com OpenAI. Defina settings.security.auth.apiKey ou a vari�vel de ambiente {{envKeyHint}}.',
  '{{envKeyHint}} environment variable not found.':
    'Vari�vel de ambiente {{envKeyHint}} n�o encontrada.',
  '{{envKeyHint}} environment variable not found. Please set it in your .env file or environment variables.':
    'Vari�vel de ambiente {{envKeyHint}} n�o encontrada. Defina-a no seu arquivo .env ou vari�veis de ambiente.',
  '{{envKeyHint}} environment variable not found (or set settings.security.auth.apiKey). Please set it in your .env file or environment variables.':
    'Vari�vel de ambiente {{envKeyHint}} n�o encontrada (ou defina settings.security.auth.apiKey). Defina-a no seu arquivo .env ou vari�veis de ambiente.',
  'Missing API key for OpenAI-compatible auth. Set the {{envKeyHint}} environment variable.':
    'Chave de API ausente para autentica��o compat�vel com OpenAI. Defina a vari�vel de ambiente {{envKeyHint}}.',
  'Anthropic provider missing required baseUrl in modelProviders[].baseUrl.':
    'Provedor Anthropic sem a baseUrl necess�ria em modelProviders[].baseUrl.',
  'ANTHROPIC_BASE_URL environment variable not found.':
    'Vari�vel de ambiente ANTHROPIC_BASE_URL n�o encontrada.',
  'Invalid auth method selected.':
    'M�todo de autentica��o inv�lido selecionado.',
  'Failed to authenticate. Message: {{message}}':
    'Falha ao autenticar. Mensagem: {{message}}',
  'Authenticated successfully with {{authType}} credentials.':
    'Autenticado com sucesso com credenciais {{authType}}.',
  'Invalid HOPCODE_DEFAULT_AUTH_TYPE value: "{{value}}". Valid values are: {{validValues}}':
    'Valor HOPCODE_DEFAULT_AUTH_TYPE inv�lido: "{{value}}". Valores v�lidos s�o: {{validValues}}',
  'OpenAI Configuration Required': 'Configura��o do OpenAI Necess�ria',
  'Please enter your OpenAI configuration. You can get an API key from':
    'Insira sua configura��o do OpenAI. Voc� pode obter uma chave de API de',
  'API Key:': 'Chave da API:',
  'Invalid credentials: {{errorMessage}}':
    'Credenciais inv�lidas: {{errorMessage}}',
  'Failed to validate credentials': 'Falha ao validar credenciais',
  'Press Enter to continue, Tab/?? to navigate, Esc to cancel':
    'Pressione Enter para continuar, Tab/?? para navegar, Esc para cancelar',

  // ============================================================================
  // Dialogs - Model
  // ============================================================================
  'Select Model': 'Selecionar Modelo',
  '(Press Esc to close)': '(Pressione Esc para fechar)',
  'Current (effective) configuration': 'Configura��o atual (efetiva)',
  AuthType: 'AuthType',
  'API Key': 'Chave da API',
  unset: 'n�o definido',
  '(default)': '(padr�o)',
  '(set)': '(definido)',
  '(not set)': '(n�o definido)',
  Modality: 'Modalidade',
  'Context Window': 'Janela de Contexto',
  text: 'texto',
  'text-only': 'somente texto',
  image: 'imagem',
  pdf: 'PDF',
  audio: '�udio',
  video: 'v�deo',
  'not set': 'n�o definido',
  none: 'nenhum',
  unknown: 'desconhecido',
  "Failed to switch model to '{{modelId}}'.\n\n{{error}}":
    "Falha ao trocar o modelo para '{{modelId}}'.\n\n{{error}}",
  'Qwen 3.6 Plus � efficient hybrid model with leading coding performance':
    'Qwen 3.6 Plus � modelo h�brido eficiente com desempenho l�der em programa��o',
  'The latest Qwen Vision model from Alibaba Cloud ModelStudio (version: qwen3-vl-plus-2025-09-23)':
    'O modelo Qwen Vision mais recente do Alibaba Cloud ModelStudio (vers�o: qwen3-vl-plus-2025-09-23)',

  // ============================================================================
  // Dialogs - Permissions
  // ============================================================================
  'Manage folder trust settings':
    'Gerenciar configura��es de confian�a de pasta',
  'Manage permission rules': 'Gerenciar regras de permiss�o',
  Allow: 'Permitir',
  Ask: 'Perguntar',
  Deny: 'Negar',
  Workspace: '�rea de trabalho',
  "HopCode won't ask before using allowed tools.":
    'O HopCode n�o perguntar� antes de usar ferramentas permitidas.',
  'HopCode will ask before using these tools.':
    'O HopCode perguntar� antes de usar essas ferramentas.',
  'HopCode is not allowed to use denied tools.':
    'O HopCode n�o tem permiss�o para usar ferramentas negadas.',
  'Manage trusted directories for this workspace.':
    'Gerenciar diret�rios confi�veis para esta �rea de trabalho.',
  'Any use of the {{tool}} tool': 'Qualquer uso da ferramenta {{tool}}',
  "{{tool}} commands matching '{{pattern}}'":
    "Comandos {{tool}} correspondentes a '{{pattern}}'",
  'From user settings': 'Das configura��es do usu�rio',
  'From project settings': 'Das configura��es do projeto',
  'From session': 'Da sess�o',
  'Project settings (local)': 'Configura��es do projeto (local)',
  'Saved in .hopcode/settings.local.json':
    'Salvo em .hopcode/settings.local.json',
  'Project settings': 'Configura��es do projeto',
  'Checked in at .hopcode/settings.json':
    'Registrado em .hopcode/settings.json',
  'User settings': 'Configura��es do usu�rio',
  'Saved in at ~/.hopcode/settings.json': 'Salvo em ~/.hopcode/settings.json',
  'Add a new rule�': 'Adicionar nova regra�',
  'Add {{type}} permission rule': 'Adicionar regra de permiss�o {{type}}',
  'Permission rules are a tool name, optionally followed by a specifier in parentheses.':
    'Regras de permiss�o s�o um nome de ferramenta, opcionalmente seguido por um especificador entre par�nteses.',
  'e.g.,': 'ex.',
  or: 'ou',
  'Enter permission rule�': 'Insira a regra de permiss�o�',
  'Enter to submit � Esc to cancel': 'Enter para enviar � Esc para cancelar',
  'Where should this rule be saved?': 'Onde esta regra deve ser salva?',
  'Enter to confirm � Esc to cancel':
    'Enter para confirmar � Esc para cancelar',
  'Delete {{type}} rule?': 'Excluir regra {{type}}?',
  'Are you sure you want to delete this permission rule?':
    'Tem certeza de que deseja excluir esta regra de permiss�o?',
  'Permissions:': 'Permiss�es:',
  '(?/? or tab to cycle)': '(?/? ou Tab para alternar)',
  'Press ?? to navigate � Enter to select � Type to search � Esc to cancel':
    '?? para navegar � Enter para selecionar � Digite para pesquisar � Esc para cancelar',
  'Search�': 'Pesquisar�',
  'Use /trust to manage folder trust settings for this workspace.':
    'Use /trust para gerenciar as configura��es de confian�a de pasta desta �rea de trabalho.',
  // Workspace directory management
  'Add directory�': 'Adicionar diret�rio�',
  'Add directory to workspace': 'Adicionar diret�rio � �rea de trabalho',
  'HopCode can read files in the workspace, and make edits when auto-accept edits is on.':
    'O HopCode pode ler arquivos na �rea de trabalho e fazer edi��es quando a aceita��o autom�tica est� ativada.',
  'HopCode will be able to read files in this directory and make edits when auto-accept edits is on.':
    'O HopCode poder� ler arquivos neste diret�rio e fazer edi��es quando a aceita��o autom�tica est� ativada.',
  'Enter the path to the directory:': 'Insira o caminho do diret�rio:',
  'Enter directory path�': 'Insira o caminho do diret�rio�',
  'Tab to complete � Enter to add � Esc to cancel':
    'Tab para completar � Enter para adicionar � Esc para cancelar',
  'Remove directory?': 'Remover diret�rio?',
  'Are you sure you want to remove this directory from the workspace?':
    'Tem certeza de que deseja remover este diret�rio da �rea de trabalho?',
  '  (Original working directory)': '  (Diret�rio de trabalho original)',
  '  (from settings)': '  (das configura��es)',
  'Directory does not exist.': 'O diret�rio n�o existe.',
  'Path is not a directory.': 'O caminho n�o � um diret�rio.',
  'This directory is already in the workspace.':
    'Este diret�rio j� est� na �rea de trabalho.',
  'Already covered by existing directory: {{dir}}':
    'J� coberto pelo diret�rio existente: {{dir}}',

  // ============================================================================
  // Status Bar
  // ============================================================================
  'Using:': 'Usando:',
  '{{count}} open file': '{{count}} arquivo aberto',
  '{{count}} open files': '{{count}} arquivos abertos',
  '(ctrl+g to view)': '(ctrl+g para ver)',
  '{{count}} {{name}} file': '{{count}} arquivo {{name}}',
  '{{count}} {{name}} files': '{{count}} arquivos {{name}}',
  '{{count}} MCP server': '{{count}} servidor MCP',
  '{{count}} MCP servers': '{{count}} servidores MCP',
  '{{count}} Blocked': '{{count}} Bloqueados',
  '(ctrl+t to view)': '(ctrl+t para ver)',
  '(ctrl+t to toggle)': '(ctrl+t para alternar)',
  'Press Ctrl+C again to exit.': 'Pressione Ctrl+C novamente para sair.',
  'Press Ctrl+D again to exit.': 'Pressione Ctrl+D novamente para sair.',
  'Press Esc again to clear.': 'Pressione Esc novamente para limpar.',
  'Press ? to edit queued messages':
    'Pressione ? para editar mensagens na fila',

  // ============================================================================
  // MCP Status
  // ============================================================================
  'No MCP servers configured.': 'Nenhum servidor MCP configurado.',
  '? MCP servers are starting up ({{count}} initializing)...':
    '? Servidores MCP est�o iniciando ({{count}} inicializando)...',
  'Note: First startup may take longer. Tool availability will update automatically.':
    'Nota: A primeira inicializa��o pode demorar mais. A disponibilidade da ferramenta ser� atualizada automaticamente.',
  'Configured MCP servers:': 'Servidores MCP configurados:',
  Ready: 'Pronto',
  'Starting... (first startup may take longer)':
    'Iniciando... (a primeira inicializa��o pode demorar mais)',
  Disconnected: 'Desconectado',
  '{{count}} tool': '{{count}} ferramenta',
  '{{count}} tools': '{{count}} ferramentas',
  '{{count}} prompt': '{{count}} prompt',
  '{{count}} prompts': '{{count}} prompts',
  '(from {{extensionName}})': '(de {{extensionName}})',
  OAuth: 'OAuth',
  'OAuth expired': 'OAuth expirado',
  'OAuth not authenticated': 'OAuth n�o autenticado',
  'tools and prompts will appear when ready':
    'ferramentas e prompts aparecer�o quando estiverem prontos',
  '{{count}} tools cached': '{{count}} ferramentas em cache',
  'Tools:': 'Ferramentas:',
  'Parameters:': 'Par�metros:',
  'Prompts:': 'Prompts:',
  Blocked: 'Bloqueado',
  '?? Tips:': '?? Dicas:',
  Use: 'Use',
  'to show server and tool descriptions':
    'para mostrar descri��es de servidores e ferramentas',
  'to show tool parameter schemas':
    'para mostrar esquemas de par�metros de ferramentas',
  'to hide descriptions': 'para ocultar descri��es',
  'to authenticate with OAuth-enabled servers':
    'para autenticar com servidores habilitados para OAuth',
  Press: 'Pressione',
  'to toggle tool descriptions on/off':
    'para alternar descri��es de ferramentas ligadas/desligadas',
  "Starting OAuth authentication for MCP server '{{name}}'...":
    "Iniciando autentica��o OAuth para servidor MCP '{{name}}'...",
  'Restarting MCP servers...': 'Reiniciando servidores MCP...',

  // ============================================================================
  // Startup Tips
  // ============================================================================
  'Tips:': 'Dicas:',
  'Use /compress when the conversation gets long to summarize history and free up context.':
    'Use /compress quando a conversa ficar longa para resumir o hist�rico e liberar contexto.',
  'Start a fresh idea with /clear or /new; the previous session stays available in history.':
    'Comece uma nova ideia com /clear ou /new; a sess�o anterior permanece dispon�vel no hist�rico.',
  'Use /bug to submit issues to the maintainers when something goes off.':
    'Use /bug para enviar problemas aos mantenedores quando algo der errado.',
  'Switch auth type quickly with /auth.':
    'Troque o tipo de autentica��o rapidamente com /auth.',
  'You can run any shell commands from HopCode using ! (e.g. !ls).':
    'Voc� pode executar quaisquer comandos shell do HopCode usando ! (ex: !ls).',
  'Type / to open the command popup; Tab autocompletes slash commands and saved prompts.':
    'Digite / para abrir o popup de comandos; Tab autocompleta comandos de barra e prompts salvos.',
  'You can resume a previous conversation by running hopcode --continue or hopcode --resume.':
    'Voc� pode retomar uma conversa anterior executando hopcode --continue ou hopcode --resume.',
  'You can switch permission mode quickly with Shift+Tab or /approval-mode.':
    'Voc� pode alternar o modo de permiss�o rapidamente com Shift+Tab ou /approval-mode.',
  'Try /insight to generate personalized insights from your chat history.':
    'Experimente /insight para gerar insights personalizados do seu hist�rico de conversas.',
  'Press Ctrl+O to toggle compact mode � hide tool output and thinking for a cleaner view.':
    'Pressione Ctrl+O para alternar o modo compacto � ocultar sa�da de ferramentas e racioc�nio.',
  'Add a HOPCODE.md file to give HopCode persistent project context.':
    'Adicione um arquivo HOPCODE.md para dar ao HopCode um contexto persistente do projeto.',
  'Use /btw to ask a quick side question without disrupting the conversation.':
    'Use /btw para fazer uma pergunta lateral r�pida sem interromper a conversa.',
  'Context is almost full! Run /compress now or start /new to continue.':
    'O contexto est� quase cheio! Execute /compress agora ou inicie /new para continuar.',
  'Context is getting full. Use /compress to free up space.':
    'O contexto est� ficando cheio. Use /compress para liberar espa�o.',
  'Long conversation? /compress summarizes history to free context.':
    'Conversa longa? /compress resume o hist�rico para liberar contexto.',

  // ============================================================================
  // Exit Screen / Stats
  // ============================================================================
  'Agent powering down. Goodbye!': 'Agente desligando. Adeus!',
  'To continue this session, run': 'Para continuar esta sess�o, execute',
  'Interaction Summary': 'Resumo da Intera��o',
  'Session ID:': 'ID da Sess�o:',
  'Tool Calls:': 'Chamadas de Ferramenta:',
  'Success Rate:': 'Taxa de Sucesso:',
  'User Agreement:': 'Acordo do Usu�rio:',
  reviewed: 'revisado',
  'Code Changes:': 'Altera��es de C�digo:',
  Performance: 'Desempenho',
  'Wall Time:': 'Tempo Total:',
  'Agent Active:': 'Agente Ativo:',
  'API Time:': 'Tempo de API:',
  'Tool Time:': 'Tempo de Ferramenta:',
  'Session Stats': 'Estat�sticas da Sess�o',
  'Model Usage': 'Uso do Modelo',
  Reqs: 'Reqs',
  'Input Tokens': 'Tokens de Entrada',
  'Output Tokens': 'Tokens de Sa�da',
  'Savings Highlight:': 'Destaque de Economia:',
  'of input tokens were served from the cache, reducing costs.':
    'de tokens de entrada foram servidos do cache, reduzindo custos.',
  'Tip: For a full token breakdown, run `/stats model`.':
    'Dica: Para um detalhamento completo de tokens, execute `/stats model`.',
  'Model Stats For Nerds': 'Estat�sticas de Modelo Para Nerds',
  'Tool Stats For Nerds': 'Estat�sticas de Ferramenta Para Nerds',
  Metric: 'M�trica',
  API: 'API',
  Requests: 'Solicita��es',
  Errors: 'Erros',
  'Avg Latency': 'Lat�ncia M�dia',
  Tokens: 'Tokens',
  Total: 'Total',
  Prompt: 'Prompt',
  Cached: 'Cacheado',
  Thoughts: 'Pensamentos',
  Tool: 'Ferramenta',
  Output: 'Sa�da',
  'No API calls have been made in this session.':
    'Nenhuma chamada de API foi feita nesta sess�o.',
  'Tool Name': 'Nome da Ferramenta',
  Calls: 'Chamadas',
  'Success Rate': 'Taxa de Sucesso',
  'Avg Duration': 'Dura��o M�dia',
  'User Decision Summary': 'Resumo de Decis�o do Usu�rio',
  'Total Reviewed Suggestions:': 'Total de Sugest�es Revisadas:',
  ' � Accepted:': ' � Aceitas:',
  ' � Rejected:': ' � Rejeitadas:',
  ' � Modified:': ' � Modificadas:',
  ' Overall Agreement Rate:': ' Taxa Geral de Acordo:',
  'No tool calls have been made in this session.':
    'Nenhuma chamada de ferramenta foi feita nesta sess�o.',
  'Session start time is unavailable, cannot calculate stats.':
    'Hora de in�cio da sess�o indispon�vel, n�o � poss�vel calcular estat�sticas.',

  // ============================================================================
  // Command Format Migration
  // ============================================================================
  'Command Format Migration': 'Migra��o de Formato de Comando',
  'Found {{count}} TOML command file:':
    'Encontrado {{count}} arquivo de comando TOML:',
  'Found {{count}} TOML command files:':
    'Encontrados {{count}} arquivos de comando TOML:',
  'Current tasks': 'Tarefas atuais',
  '... and {{count}} more': '... e mais {{count}}',
  'The TOML format is deprecated. Would you like to migrate them to Markdown format?':
    'O formato TOML est� obsoleto. Voc� gostaria de migr�-los para o formato Markdown?',
  '(Backups will be created and original files will be preserved)':
    '(Backups ser�o criados e arquivos originais ser�o preservados)',

  // ============================================================================
  // Loading Phrases
  // ============================================================================
  'Waiting for user confirmation...': 'Aguardando confirma��o do usu�rio...',
  '(esc to cancel, {{time}})': '(esc para cancelar, {{time}})',

  WITTY_LOADING_PHRASES: [
    'Estou com sorte',
    'Enviando maravilhas...',
    'Pintando os serifos de volta...',
    'Navegando pelo mofo limoso...',
    'Consultando os esp�ritos digitais...',
    'Reticulando splines...',
    'Aquecendo os hamsters da IA...',
    'Perguntando � concha m�gica...',
    'Gerando r�plica espirituosa...',
    'Polindo os algoritmos...',
    'N�o apresse a perfei��o (ou meu c�digo)...',
    'Preparando bytes frescos...',
    'Contando el�trons...',
    'Engajando processadores cognitivos...',
    'Verificando erros de sintaxe no universo...',
    'Um momento, otimizando o humor...',
    'Embaralhando piadas...',
    'Desembara�ando redes neurais...',
    'Compilando brilhantismo...',
    'Carregando humor.exe...',
    'Invocando a nuvem da sabedoria...',
    'Preparando uma resposta espirituosa...',
    'S� um segundo, estou depurando a realidade...',
    'Confundindo as op��es...',
    'Sintonizando as frequ�ncias c�smicas...',
    'Criando uma resposta digna da sua paci�ncia...',
    'Compilando os 1s e 0s...',
    'Resolvendo depend�ncias... e crises existenciais...',
    'Desfragmentando mem�rias... tanto RAM quanto pessoais...',
    'Reiniciando o m�dulo de humor...',
    'Fazendo cache do essencial (principalmente memes de gatos)...',
    'Otimizando para velocidade absurda',
    'Trocando bits... n�o conte para os bytes...',
    'Coletando lixo... volto j�...',
    'Montando a internet...',
    'Convertendo caf� em c�digo...',
    'Atualizando a sintaxe da realidade...',
    'Reconectando as sinapses...',
    'Procurando um ponto e v�rgula perdido...',
    'Lubrificando as engrenagens da m�quina...',
    'Pr�-aquecendo os servidores...',
    'Calibrando o capacitor de fluxo...',
    'Engajando o motor de improbabilidade...',
    'Canalizando a For�a...',
    'Alinhando as estrelas para uma resposta ideal...',
    'Assim dizemos todos...',
    'Carregando a pr�xima grande ideia...',
    'S� um momento, estou na zona...',
    'Preparando para deslumbr�-lo com brilhantismo...',
    'S� um tique, estou polindo minha intelig�ncia...',
    'Segure firme, estou criando uma obra-prima...',
    'S� um instante, estou depurando o universo...',
    'S� um momento, estou alinhando os pixels...',
    'S� um segundo, estou otimizando o humor...',
    'S� um momento, estou ajustando os algoritmos...',
    'Velocidade de dobra engajada...',
    'Minerando mais cristais de Dilithium...',
    'N�o entre em p�nico...',
    'Seguindo o coelho branco...',
    'A verdade est� l� fora... em algum lugar...',
    'Soprando o cartucho...',
    'Carregando... Fa�a um barrel roll!',
    'Aguardando o respawn...',
    'Terminando a Kessel Run em menos de 12 parsecs...',
    'O bolo n�o � uma mentira, s� ainda est� carregando...',
    'Mexendo na tela de cria��o de personagem...',
    'S� um momento, estou encontrando o meme certo...',
    "Pressionando 'A' para continuar...",
    'Pastoreando gatos digitais...',
    'Polindo os pixels...',
    'Encontrando um trocadilho adequado para a tela de carregamento...',
    'Distraindo voc� com esta frase espirituosa...',
    'Quase l�... provavelmente...',
    'Nossos hamsters est�o trabalhando o mais r�pido que podem...',
    'Dando um tapinha na cabe�a do Cloudy...',
    'Acariciando o gato...',
    'Dando um Rickroll no meu chefe...',
    'Never gonna give you up, never gonna let you down...',
    'Tocando o baixo...',
    'Provando as amoras...',
    'Estou indo longe, estou indo pela velocidade...',
    'Isso � vida real? Ou � apenas fantasia?...',
    'Tenho um bom pressentimento sobre isso...',
    'Cutucando o urso...',
    'Fazendo pesquisa sobre os �ltimos memes...',
    'Descobrindo como tornar isso mais espirituoso...',
    'Hmmm... deixe-me pensar...',
    'O que voc� chama de um peixe sem olhos? Um pxe...',
    'Por que o computador foi � terapia? Porque tinha muitos bytes...',
    'Por que programadores n�o gostam da natureza? Porque tem muitos bugs...',
    'Por que programadores preferem o modo escuro? Porque a luz atrai bugs...',
    'Por que o desenvolvedor faliu? Porque usou todo o seu cache...',
    'O que voc� pode fazer com um l�pis quebrado? Nada, ele n�o tem ponta...',
    'Aplicando manuten��o percussiva...',
    'Procurando a orienta��o correta do USB...',
    'Garantindo que a fuma�a m�gica permane�a dentro dos fios...',
    'Tentando sair do Vim...',
    'Girando a roda do hamster...',
    'Isso n�o � um bug, � um recurso n�o documentado...',
    'Engajar.',
    'Eu voltarei... com uma resposta.',
    'Meu outro processo � uma TARDIS...',
    'Comungando com o esp�rito da m�quina...',
    'Deixando os pensamentos marinarem...',
    'Lembrei agora onde coloquei minhas chaves...',
    'Ponderando a orbe...',
    'Eu vi coisas que voc�s n�o acreditariam... como um usu�rio que l� mensagens de carregamento.',
    'Iniciando olhar pensativo...',
    'Qual � o lanche favorito de um computador? Microchips.',
    'Por que desenvolvedores Java usam �culos? Porque eles n�o C#.',
    'Carregando o laser... pew pew!',
    'Dividindo por zero... s� brincando!',
    'Procurando por um supervisor adulto... digo, processando.',
    'Fazendo bip boop.',
    'Buffering... porque at� as IAs precisam de um momento.',
    'Entrela�ando part�culas qu�nticas para uma resposta mais r�pida...',
    'Polindo o cromo... nos algoritmos.',
    'Voc� n�o est� entretido? (Trabalhando nisso!)',
    'Invocando os gremlins do c�digo... para ajudar, � claro.',
    'S� esperando o som da conex�o discada terminar...',
    'Recalibrando o humor�metro.',
    'Minha outra tela de carregamento � ainda mais engra�ada.',
    'Tenho quase certeza que tem um gato andando no teclado em algum lugar...',
    'Aumentando... Aumentando... Ainda carregando.',
    'N�o � um bug, � um recurso... desta tela de carregamento.',
    'Voc� j� tentou desligar e ligar de novo? (A tela de carregamento, n�o eu.)',
    'Construindo pilares adicionais...',
  ],

  // ============================================================================
  // Extension Settings Input
  // ============================================================================
  'Enter value...': 'Digite o valor...',
  'Enter sensitive value...': 'Digite o valor sens�vel...',
  'Press Enter to submit, Escape to cancel':
    'Pressione Enter para enviar, Escape para cancelar',

  // ============================================================================
  // Command Migration Tool
  // ============================================================================
  'Markdown file already exists: {{filename}}':
    'Arquivo Markdown j� existe: {{filename}}',
  'TOML Command Format Deprecation Notice':
    'Aviso de Obsolesc�ncia do Formato de Comando TOML',
  'Found {{count}} command file(s) in TOML format:':
    'Encontrado(s) {{count}} arquivo(s) de comando no formato TOML:',
  'The TOML format for commands is being deprecated in favor of Markdown format.':
    'O formato TOML para comandos est� sendo descontinuado em favor do formato Markdown.',
  'Markdown format is more readable and easier to edit.':
    'O formato Markdown � mais leg�vel e f�cil de editar.',
  'You can migrate these files automatically using:':
    'Voc� pode migrar esses arquivos automaticamente usando:',
  'Or manually convert each file:': 'Ou converter manualmente cada arquivo:',
  'TOML: prompt = "..." / description = "..."':
    'TOML: prompt = "..." / description = "..."',
  'Markdown: YAML frontmatter + content':
    'Markdown: YAML frontmatter + conte�do',
  'The migration tool will:': 'A ferramenta de migra��o ir�:',
  'Convert TOML files to Markdown': 'Converter arquivos TOML para Markdown',
  'Create backups of original files': 'Criar backups dos arquivos originais',
  'Preserve all command functionality':
    'Preservar toda a funcionalidade do comando',
  'TOML format will continue to work for now, but migration is recommended.':
    'O formato TOML continuar� a funcionar por enquanto, mas a migra��o � recomendada.',

  // ============================================================================
  // Extensions - Explore Command
  // ============================================================================
  'Open extensions page in your browser':
    'Abrir p�gina de extens�es no seu navegador',
  'Unknown extensions source: {{source}}.':
    'Fonte de extens�es desconhecida: {{source}}.',
  'Would open extensions page in your browser: {{url}} (skipped in test environment)':
    'Abriria a p�gina de extens�es no seu navegador: {{url}} (pulado no ambiente de teste)',
  'View available extensions at {{url}}':
    'Ver extens�es dispon�veis em {{url}}',
  'Opening extensions page in your browser: {{url}}':
    'Abrindo p�gina de extens�es no seu navegador: {{url}}',
  'Failed to open browser. Check out the extensions gallery at {{url}}':
    'Falha ao abrir o navegador. Confira a galeria de extens�es em {{url}}',

  // ============================================================================
  // Custom API Key Configuration
  // ============================================================================
  'You can configure your API key and models in settings.json':
    'Voc� pode configurar sua chave de API e modelos em settings.json',
  'Refer to the documentation for setup instructions':
    'Consulte a documenta��o para instru��es de configura��o',

  // ============================================================================
  // Coding Plan Authentication
  // ============================================================================
  'API key cannot be empty.': 'A chave de API n�o pode estar vazia.',
  'You can get your Coding Plan API key here':
    'Voc� pode obter sua chave de API do Coding Plan aqui',
  'New model configurations are available for Alibaba Cloud Coding Plan. Update now?':
    'Novas configura��es de modelo est�o dispon�veis para o Alibaba Cloud Coding Plan. Atualizar agora?',
  'Coding Plan configuration updated successfully. New models are now available.':
    'Configura��o do Coding Plan atualizada com sucesso. Novos modelos agora est�o dispon�veis.',
  'Coding Plan API key not found. Please re-authenticate with Coding Plan.':
    'Chave de API do Coding Plan n�o encontrada. Por favor, re-autentique com o Coding Plan.',
  'Failed to update Coding Plan configuration: {{message}}':
    'Falha ao atualizar a configura��o do Coding Plan: {{message}}',

  // ============================================================================
  // Auth Dialog - View Titles and Labels
  // ============================================================================
  'Coding Plan': 'Coding Plan',
  "Paste your api key of ModelStudio Coding Plan and you're all set!":
    'Cole sua chave de API do ModelStudio Coding Plan e pronto!',
  Custom: 'Personalizado',
  'More instructions about configuring `modelProviders` manually.':
    'Mais instru��es sobre como configurar `modelProviders` manualmente.',
  'Select API-KEY configuration mode:':
    'Selecione o modo de configura��o da API-KEY:',
  '(Press Escape to go back)': '(Pressione Escape para voltar)',
  '(Press Enter to submit, Escape to cancel)':
    '(Pressione Enter para enviar, Escape para cancelar)',
  'More instructions please check:': 'Mais instru��es, consulte:',
  'Select Region for Coding Plan': 'Selecionar regi�o do Coding Plan',
  'Choose based on where your account is registered':
    'Escolha com base em onde sua conta est� registrada',
  'Enter Coding Plan API Key': 'Inserir chave de API do Coding Plan',

  // ============================================================================
  // Coding Plan International Updates
  // ============================================================================
  'New model configurations are available for {{region}}. Update now?':
    'Novas configura��es de modelo est�o dispon�veis para o {{region}}. Atualizar agora?',
  '{{region}} configuration updated successfully. Model switched to "{{model}}".':
    'Configura��o do {{region}} atualizada com sucesso. Modelo alterado para "{{model}}".',
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json (backed up).':
    'Autenticado com sucesso com {{region}}. Chave de API e configura��es de modelo salvas em settings.json (com backup).',

  // ============================================================================
  // Context Usage Component
  // ============================================================================
  'Context Usage': 'Uso do Contexto',
  '% used': '% usado',
  '% context used': '% contexto usado',
  'Context exceeds limit! Use /compress or /clear to reduce.':
    'Contexto excede o limite! Use /compress ou /clear para reduzir.',
  'Use /compress or /clear': 'Use /compress ou /clear',
  'No API response yet. Send a message to see actual usage.':
    'Ainda n�o h� resposta da API. Envie uma mensagem para ver o uso real.',
  'Estimated pre-conversation overhead': 'Sobrecarga estimada pr�-conversa',
  'Context window': 'Janela de Contexto',
  tokens: 'tokens',
  Used: 'Usado',
  Free: 'Livre',
  'Autocompact buffer': 'Buffer de autocompacta��o',
  'Usage by category': 'Uso por categoria',
  'System prompt': 'Prompt do sistema',
  'Built-in tools': 'Ferramentas integradas',
  'MCP tools': 'Ferramentas MCP',
  'Memory files': 'Arquivos de mem�ria',
  Skills: 'Habilidades',
  Messages: 'Mensagens',
  'Show context window usage breakdown.':
    'Exibe a divis�o de uso da janela de contexto.',
  'Run /context detail for per-item breakdown.':
    'Execute /context detail para detalhamento por item.',
  active: 'ativo',
  'body loaded': 'conte�do carregado',
  memory: 'mem�ria',
  '{{region}} configuration updated successfully.':
    'Configura��o do {{region}} atualizada com sucesso.',
  'Authenticated successfully with {{region}}. API key and model configs saved to settings.json.':
    'Autenticado com sucesso com {{region}}. Chave de API e configura��es de modelo salvas em settings.json.',
  'Tip: Use /model to switch between available Coding Plan models.':
    'Dica: Use /model para alternar entre os modelos dispon�veis do Coding Plan.',

  // ============================================================================
  // Ask User Question Tool
  // ============================================================================
  'Please answer the following question(s):':
    'Por favor, responda �(s) seguinte(s) pergunta(s):',
  'Cannot ask user questions in non-interactive mode. Please run in interactive mode to use this tool.':
    'N�o � poss�vel fazer perguntas ao usu�rio no modo n�o interativo. Por favor, execute no modo interativo para usar esta ferramenta.',
  'User declined to answer the questions.':
    'O usu�rio recusou responder �s perguntas.',
  'User has provided the following answers:':
    'O usu�rio forneceu as seguintes respostas:',
  'Failed to process user answers:':
    'Falha ao processar as respostas do usu�rio:',
  'Type something...': 'Digite algo...',
  Submit: 'Enviar',
  'Submit answers': 'Enviar respostas',
  Cancel: 'Cancelar',
  'Your answers:': 'Suas respostas:',
  '(not answered)': '(n�o respondido)',
  'Ready to submit your answers?': 'Pronto para enviar suas respostas?',
  '?/?: Navigate | ?/?: Switch tabs | Enter: Select':
    '?/?: Navegar | ?/?: Alternar abas | Enter: Selecionar',
  '?/?: Navigate | ?/?: Switch tabs | Space/Enter: Toggle | Esc: Cancel':
    '?/?: Navegar | ?/?: Alternar abas | Space/Enter: Alternar | Esc: Cancelar',
  '?/?: Navigate | Space/Enter: Toggle | Esc: Cancel':
    '?/?: Navegar | Space/Enter: Alternar | Esc: Cancelar',
  '?/?: Navigate | Enter: Select | Esc: Cancel':
    '?/?: Navegar | Enter: Selecionar | Esc: Cancelar',

  // ============================================================================
  // Commands - Auth
  // ============================================================================
  'Configure authentication information with Qwen-OAuth or Alibaba Cloud Coding Plan':
    'Configurar autentica��o Qwen com Qwen-OAuth ou Alibaba Cloud Coding Plan',
  'Authenticate using Qwen OAuth': 'Autenticar usando Legacy OAuth',
  'Authenticate using Alibaba Cloud Coding Plan':
    'Autenticar usando Alibaba Cloud Coding Plan',
  'Region for Coding Plan (china/global)':
    'Regi�o para Coding Plan (china/global)',
  'API key for Coding Plan': 'Chave de API para Coding Plan',
  'Show current authentication status': 'Mostrar status atual de autentica��o',
  'Authentication completed successfully.':
    'Autentica��o conclu�da com sucesso.',
  'Starting Qwen OAuth authentication...':
    'Iniciando autentica��o Legacy OAuth...',
  'Successfully authenticated with Qwen OAuth.':
    'Autenticado com sucesso via Legacy OAuth.',
  'Failed to authenticate with Qwen OAuth: {{error}}':
    'Falha ao autenticar com Legacy OAuth: {{error}}',
  'Processing Alibaba Cloud Coding Plan authentication...':
    'Processando autentica��o Alibaba Cloud Coding Plan...',
  'Successfully authenticated with Alibaba Cloud Coding Plan.':
    'Autenticado com sucesso via Alibaba Cloud Coding Plan.',
  'Failed to authenticate with Coding Plan: {{error}}':
    'Falha ao autenticar com Coding Plan: {{error}}',
  '?? (China)': '?? (China)',
  '????? (aliyun.com)': '????? (aliyun.com)',
  Global: 'Global',
  'Alibaba Cloud (alibabacloud.com)': 'Alibaba Cloud (alibabacloud.com)',
  'Select region for Coding Plan:': 'Selecione a regi�o para Coding Plan:',
  'Enter your Coding Plan API key: ':
    'Insira sua chave de API do Coding Plan: ',
  'Select authentication method:': 'Selecione o m�todo de autentica��o:',
  '\n=== Authentication Status ===\n': '\n=== Status de Autentica��o ===\n',
  '??  No authentication method configured.\n':
    '??  Nenhum m�todo de autentica��o configurado.\n',
  'Run one of the following commands to get started:\n':
    'Execute um dos seguintes comandos para come�ar:\n',
  '  hopcode auth qwen-oauth     - Authenticate with Qwen OAuth (discontinued)':
    '  hopcode auth qwen-oauth     - Autenticar com Legacy OAuth (descontinuado)',
  '  hopcode auth coding-plan      - Authenticate with Alibaba Cloud Coding Plan\n':
    '  hopcode auth coding-plan      - Autenticar com Alibaba Cloud Coding Plan\n',
  'Or simply run:': 'Ou simplesmente execute:',
  '  hopcode auth                - Interactive authentication setup\n':
    '  hopcode auth                - Configura��o interativa de autentica��o\n',
  '? Authentication Method: Qwen OAuth':
    '? M�todo de autentica��o: Legacy OAuth',
  '  Type: Free tier (discontinued 2026-04-15)':
    '  Tipo: N�vel gratuito (descontinuado 2026-04-15)',
  '  Limit: No longer available': '  Limite: N�o mais dispon�vel',
  'Qwen OAuth free tier was discontinued on 2026-04-15. Run /auth to switch to Coding Plan, OpenRouter, Fireworks AI, or another provider.':
    'O n�vel gratuito do Legacy OAuth foi descontinuado em 2026-04-15. Execute /auth para mudar para Coding Plan, OpenRouter, Fireworks AI ou outro provedor.',
  '  Models: Qwen latest models\n': '  Modelos: Modelos Qwen mais recentes\n',
  '? Authentication Method: Alibaba Cloud Coding Plan':
    '? M�todo de autentica��o: Alibaba Cloud Coding Plan',
  '?? (China) - ?????': '?? (China) - ?????',
  'Global - Alibaba Cloud': 'Global - Alibaba Cloud',
  '  Region: {{region}}': '  Regi�o: {{region}}',
  '  Current Model: {{model}}': '  Modelo atual: {{model}}',
  '  Config Version: {{version}}': '  Vers�o da configura��o: {{version}}',
  '  Status: API key configured\n': '  Status: Chave de API configurada\n',
  '??  Authentication Method: Alibaba Cloud Coding Plan (Incomplete)':
    '??  M�todo de autentica��o: Alibaba Cloud Coding Plan (Incompleto)',
  '  Issue: API key not found in environment or settings\n':
    '  Problema: Chave de API n�o encontrada no ambiente ou configura��es\n',
  '  Run `hopcode auth coding-plan` to re-configure.\n':
    '  Execute `hopcode auth coding-plan` para reconfigurar.\n',
  '? Authentication Method: {{type}}': '? M�todo de autentica��o: {{type}}',
  '  Status: Configured\n': '  Status: Configurado\n',
  'Failed to check authentication status: {{error}}':
    'Falha ao verificar status de autentica��o: {{error}}',
  'Select an option:': 'Selecione uma op��o:',
  'Raw mode not available. Please run in an interactive terminal.':
    'Modo raw n�o dispon�vel. Execute em um terminal interativo.',
  '(Use ? ? arrows to navigate, Enter to select, Ctrl+C to exit)\n':
    '(Use ? ? para navegar, Enter para selecionar, Ctrl+C para sair)\n',
  compact: 'compacto',
  'compact mode: on (Ctrl+O off)': 'modo compacto: ligado (Ctrl+O desligar)',
  'Hide tool output and thinking for a cleaner view (toggle with Ctrl+O).':
    'Ocultar sa�da da ferramenta e racioc�nio para uma visualiza��o mais limpa (alternar com Ctrl+O).',
  'Press Ctrl+O to show full tool output':
    'Pressione Ctrl+O para exibir a sa�da completa da ferramenta',

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
