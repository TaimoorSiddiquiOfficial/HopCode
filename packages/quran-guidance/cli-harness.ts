import {
  getQuranGuidedBehavior,
  checkIznGate,
  buildQuranGuidedAgentPrompt,
} from './index.js';

const args = process.argv.slice(2);

if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  console.log('Usage: quran-guidance <user-message> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --izn              Run in Izn (full permission) mode');
  console.log('  --context <text>   Provide agent context');
  console.log('  --gate <command>   Test Izn gate with a tool command');
  console.log(
    '  --prompt           Output full agent prompt instead of guidance',
  );
  console.log('  --help, -h         Show this help');
  process.exit(0);
}

const message = args[0];
const iznIndex = args.indexOf('--izn');
const contextIndex = args.indexOf('--context');
const gateIndex = args.indexOf('--gate');
const promptFlag = args.includes('--prompt');

const iznModeActive = iznIndex !== -1;
const agentContext = contextIndex !== -1 ? args[contextIndex + 1] : undefined;

if (gateIndex !== -1) {
  const command = args[gateIndex + 1];
  if (!command) {
    console.error('--gate requires a command string');
    process.exit(1);
  }
  const result = checkIznGate({ toolName: 'run_shell_command', command });
  console.log(JSON.stringify(result, null, 2));
} else if (promptFlag) {
  const prompt = buildQuranGuidedAgentPrompt({
    userMessage: message,
    agentContext,
    iznModeActive,
  });
  console.log(prompt);
} else {
  const result = getQuranGuidedBehavior({
    userMessage: message,
    agentContext,
    iznModeActive,
  });
  console.log(JSON.stringify(result, null, 2));
}
