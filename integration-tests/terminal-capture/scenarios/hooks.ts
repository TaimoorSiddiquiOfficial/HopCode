import type { ScenarioConfig } from '../scenario-runner.js';

export default {
  name: '/hooks command',
  spawn: ['node', 'dist/cli.js', '--izn'],
  terminal: { title: 'hopcode', cwd: '../../..' },
  flow: [{ type: 'hi' }, { type: '/hooks' }],
} satisfies ScenarioConfig;
