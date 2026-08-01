import { describe, expect, it } from 'vitest';
import { getArtifactPreviewContent, } from './TurnOutputs';
describe('TurnOutputs helpers', () => {
    it('uses workspace cwd when matching artifact preview content', () => {
        const artifact = {
            id: 'artifact-1',
            kind: 'html',
            workspacePath: 'reports/summary.html',
        };
        const changes = [
            {
                path: '/workspace/project/reports/summary.html',
                status: 'modified',
                toolCallId: 'tool-1',
                isArtifact: true,
                diffs: [
                    {
                        oldText: '<html>old</html>',
                        newText: '<html>new</html>',
                        fullContent: true,
                    },
                ],
            },
        ];
        expect(getArtifactPreviewContent(artifact, changes, '/workspace/project')).toBe('<html>new</html>');
    });
});
//# sourceMappingURL=TurnOutputs.test.js.map