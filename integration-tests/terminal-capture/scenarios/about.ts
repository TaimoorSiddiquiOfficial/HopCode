import type { ScenarioConfig } from '../scenario-runner.js';

export default {
  name: '/about command',
  spawn: ['node', 'dist/cli.js', '--izn'],
  terminal: { title: 'hopcode', cwd: '../../..' },
  flow: [{ type: 'hi' }, { type: '/about' }],
} satisfies ScenarioConfig;
