import fs from 'fs';

// Resolve SessionMessageHandler.test.ts - single conflict, take ours
let testFile = fs.readFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.test.ts', 'utf8');
testFile = testFile.replace(
  /<<<<<<< HEAD\nvi\.mock\('@hoptrendy\/webui[^)]*\)'[^]*?\n=======\nvi\.mock\('@qwen-code\/webui[^)]*\)'[^]*?\n>>>>>>> [^\n]*\n/g,
  "vi.mock('@hoptrendy/webui', () => ({\n  stripZeroWidthSpaces: (text: string) => text.replace(/\\u200B/g, ''),\n}));\n"
);
fs.writeFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.test.ts', testFile, 'utf8');
console.log('SessionMessageHandler.test.ts resolved');

// Resolve SessionMessageHandler.ts - 5 conflicts
let handlerFile = fs.readFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts', 'utf8');

// Conflict 1: import (line 9) - take ours
handlerFile = handlerFile.replace(
  /<<<<<<< HEAD\nimport type \{ ChatMessage \} from '\.\.\/\.\.\/services\/hopcodeAgentManager\.js';\n=======\nimport type \{ ChatMessage \} from '\.\.\/\.\.\/services\/qwenAgentManager\.js';\n>>>>>>> [^\n]*\n/,
  "import type { ChatMessage } from '../../services/hopcodeAgentManager.js';\n"
);

// Conflict 2: canHandle message types (line 46) - take ours
handlerFile = handlerFile.replace(
  /<<<<<<< HEAD\n\n      'editMessage',\n      'newHopCodeSession',\n      'switchHopCodeSession',\n      'getHopCodeSessions',\n=======\n      'editMessage',\n      'newQwenSession',\n      'switchQwenSession',\n      'getQwenSessions',\n>>>>>>> [^\n]*\n/,
  "\n      'editMessage',\n      'newHopCodeSession',\n      'switchHopCodeSession',\n      'getHopCodeSessions',\n"
);

// Conflict 3: switch case after editMessage (line 130) - merge: take ours (it's empty = just removed the qwen case)
// But we need the break; + case for newHopCodeSession. Let's see what's there.
// Our side is empty (removed the case), theirs has break + newQwenSession case.
// We already have newHopCodeSession case right after in ours. Just take ours (empty block) which removes the duplicate.
handlerFile = handlerFile.replace(
  /<<<<<<< HEAD\n=======\n        break;\n\n      case 'newQwenSession':\n        await this\.handleNewQwenSession\(\);\n>>>>>>> [^\n]*\n/,
  ''  // Take ours (empty) - the newHopCodeSession case already exists below
);

// Conflict 4: promptAuth message (line 595) - take ours
handlerFile = handlerFile.replace(
  /<<<<<<< HEAD\n          'You need to configure your provider to use HopCode\.'\n=======\n          'You need to configure your provider to use Qwen Code\.'\n>>>>>>> [^\n]*\n/,
  "          'You need to configure your provider to use HopCode.'\n"
);

// Conflict 5: promptAuth expired session message (line 617) - take ours
handlerFile = handlerFile.replace(
  /<<<<<<< HEAD\n              'Your session has expired or is invalid\. Please configure your provider to continue using HopCode\.'\n=======\n              'Your session has expired or is invalid\. Please configure your provider to continue using Qwen Code\.'\n>>>>>>> [^\n]*\n/,
  "              'Your session has expired or is invalid. Please configure your provider to continue using HopCode.'\n"
);

// Verify no remaining conflicts
if (handlerFile.includes('<<<<<<< HEAD') || handlerFile.includes('>>>>>>> ')) {
  console.error('WARNING: Unresolved conflicts remain in SessionMessageHandler.ts');
} else {
  console.log('SessionMessageHandler.ts all conflicts resolved');
}

fs.writeFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts', handlerFile, 'utf8');
console.log('SessionMessageHandler.ts written');