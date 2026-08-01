export default {
    name: '/hooks command',
    spawn: ['node', 'dist/cli.js', '--izn'],
    terminal: { title: 'hopcode', cwd: '../../..' },
    flow: [{ type: 'hi' }, { type: '/hooks' }],
};
//# sourceMappingURL=hooks.js.map