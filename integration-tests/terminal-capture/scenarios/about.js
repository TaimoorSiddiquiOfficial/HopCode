export default {
    name: '/about command',
    spawn: ['node', 'dist/cli.js', '--izn'],
    terminal: { title: 'hopcode', cwd: '../../..' },
    flow: [{ type: 'hi' }, { type: '/about' }],
};
//# sourceMappingURL=about.js.map