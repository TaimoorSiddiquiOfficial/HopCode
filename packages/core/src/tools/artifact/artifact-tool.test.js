/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { StandardFileSystemService } from '../../services/fileSystemService.js';
import { ToolErrorType } from '../tool-error.js';
import { ArtifactTool } from './artifact-tool.js';
import { LocalPublisher } from './local-publisher.js';
import { MAX_ARTIFACT_BYTES } from './html.js';
const signal = new AbortController().signal;
describe('ArtifactTool', () => {
    let workdir;
    let outDir;
    let openSpy;
    let tool;
    const makeConfig = () => ({
        getFileSystemService: () => new StandardFileSystemService(),
        getTargetDir: () => workdir,
        shouldAutoOpenArtifact: () => process.env['HOPCODE_ARTIFACT_NO_AUTO_OPEN'] !== '1',
    });
    const writeFragment = async (name, content) => {
        const p = path.join(workdir, name);
        await fs.writeFile(p, content, 'utf8');
        return p;
    };
    beforeEach(async () => {
        workdir = await fs.mkdtemp(path.join(os.tmpdir(), 'qwen-art-src-'));
        outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'qwen-art-out-'));
        openSpy = vi.fn(async () => { });
        tool = new ArtifactTool(makeConfig(), new LocalPublisher(outDir), openSpy);
    });
    afterEach(async () => {
        await fs.rm(workdir, { recursive: true, force: true });
        await fs.rm(outDir, { recursive: true, force: true });
        delete process.env['HOPCODE_ARTIFACT_NO_AUTO_OPEN'];
        vi.restoreAllMocks();
    });
    it('describes browser opening as settings-dependent', () => {
        expect(tool.description).toContain('depending on settings');
        expect(tool.description).not.toContain('and opens it in the browser');
    });
    it('publishes a fragment, wraps it, and opens the url', async () => {
        const file = await writeFragment('page.html', '<h1>Report</h1>');
        const res = await tool
            .build({ file_path: file, title: 'My Report' })
            .execute(signal);
        expect(res.error).toBeUndefined();
        expect(res.llmContent).toMatch(/Published artifact/);
        expect(res.llmContent).toMatch(/file:\/\//);
        expect(openSpy).toHaveBeenCalledTimes(1);
        expect(res.artifacts).toMatchObject([
            {
                kind: 'html',
                storage: 'published',
                title: 'My Report',
                mimeType: 'text/html',
            },
        ]);
        expect(res.artifacts?.[0]?.url).toMatch(/^file:\/\//);
        expect(res.artifacts?.[0]?.managedId).toBeTruthy();
        const published = res.resultFilePaths?.[0];
        expect(published).toBeTruthy();
        const html = await fs.readFile(published, 'utf8');
        expect(html).toMatch(/^<!doctype html>/i);
        expect(html).toContain('<title>My Report</title>');
        expect(html).toContain('<h1>Report</h1>');
    });
    it('redeploys the same source path to the same url', async () => {
        const file = await writeFragment('dash.html', '<p>v1</p>');
        const first = await tool.build({ file_path: file }).execute(signal);
        await fs.writeFile(file, '<p>v2</p>', 'utf8');
        const second = await tool.build({ file_path: file }).execute(signal);
        // Same source path → same published file (redeploy in place).
        expect(second.resultFilePaths?.[0]).toBe(first.resultFilePaths?.[0]);
        const html = await fs.readFile(second.resultFilePaths[0], 'utf8');
        expect(html).toContain('<p>v2</p>');
        expect(html).not.toContain('<p>v1</p>');
    });
    it('rejects a fragment with external references and does not publish', async () => {
        const file = await writeFragment('bad.html', '<script src="https://cdn.example.com/x.js"></script>');
        const res = await tool.build({ file_path: file }).execute(signal);
        expect(res.error?.type).toBe(ToolErrorType.EXECUTION_FAILED);
        expect(res.llmContent).toMatch(/self-contained/i);
        expect(openSpy).not.toHaveBeenCalled();
        await expect(fs.readdir(outDir)).resolves.toEqual([]);
    });
    it('rejects a full-document fragment', async () => {
        const file = await writeFragment('full.html', '<!doctype html><html><body><p>x</p></body></html>');
        const res = await tool.build({ file_path: file }).execute(signal);
        expect(res.error?.type).toBe(ToolErrorType.EXECUTION_FAILED);
        expect(res.llmContent).toMatch(/full-document/i);
    });
    it('returns FILE_NOT_FOUND for a missing source file', async () => {
        const res = await tool
            .build({ file_path: path.join(workdir, 'nope.html') })
            .execute(signal);
        expect(res.error?.type).toBe(ToolErrorType.FILE_NOT_FOUND);
    });
    it('forwards cancellation signals to source file reads', async () => {
        const file = path.join(workdir, 'page.html');
        const controller = new AbortController();
        const readTextFile = vi.fn(async () => ({ content: '<p>x</p>' }));
        const signalAwareTool = new ArtifactTool({
            ...makeConfig(),
            getFileSystemService: () => ({ readTextFile }),
        }, {
            kind: 'oss',
            publish: async () => ({ id: 'x', url: 'https://h/x' }),
        }, openSpy);
        await signalAwareTool.build({ file_path: file }).execute(controller.signal);
        expect(readTextFile).toHaveBeenCalledWith({
            path: file,
            maxOutputBytes: MAX_ARTIFACT_BYTES,
            signal: controller.signal,
        });
    });
    it('returns EXECUTION_FAILED when the publisher throws', async () => {
        const file = await writeFragment('page.html', '<p>x</p>');
        const failingTool = new ArtifactTool(makeConfig(), {
            kind: 'oss',
            publish: async () => {
                throw new Error('network timeout');
            },
        }, openSpy);
        const res = await failingTool.build({ file_path: file }).execute(signal);
        expect(res.error?.type).toBe(ToolErrorType.EXECUTION_FAILED);
        expect(res.llmContent).toContain('network timeout');
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('rejects source fragments that exceed the artifact byte budget', async () => {
        const big = '<p>' + 'a'.repeat(MAX_ARTIFACT_BYTES) + '</p>';
        const file = await writeFragment('big.html', big);
        const res = await tool.build({ file_path: file }).execute(signal);
        expect(res.error?.type).toBe(ToolErrorType.FILE_TOO_LARGE);
        expect(res.error?.message).toContain('source exceeds');
        expect(res.error?.message).toContain(`${MAX_ARTIFACT_BYTES} byte limit`);
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('enforces the published artifact size cap', async () => {
        const almostTooBig = 'a'.repeat(MAX_ARTIFACT_BYTES - 1);
        const file = await writeFragment('wrapped-big.html', almostTooBig);
        const res = await tool.build({ file_path: file }).execute(signal);
        expect(res.error?.type).toBe(ToolErrorType.FILE_TOO_LARGE);
        expect(res.error?.message).toContain('Artifact is too large');
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('skips auto-open when HOPCODE_ARTIFACT_NO_AUTO_OPEN=1', async () => {
        process.env['HOPCODE_ARTIFACT_NO_AUTO_OPEN'] = '1';
        const file = await writeFragment('p.html', '<p>x</p>');
        const res = await tool.build({ file_path: file }).execute(signal);
        expect(res.error).toBeUndefined();
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('skips auto-open when disabled by settings', async () => {
        const file = await writeFragment('p.html', '<p>x</p>');
        const noAutoOpenTool = new ArtifactTool({
            ...makeConfig(),
            shouldAutoOpenArtifact: () => false,
        }, new LocalPublisher(outDir), openSpy);
        const res = await noAutoOpenTool.build({ file_path: file }).execute(signal);
        expect(res.error).toBeUndefined();
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('omits browser launch from confirmation when auto-open is disabled', async () => {
        const file = await writeFragment('p.html', '<p>x</p>');
        const noAutoOpenTool = new ArtifactTool({
            ...makeConfig(),
            shouldAutoOpenArtifact: () => false,
        }, new LocalPublisher(outDir), openSpy);
        const details = await noAutoOpenTool
            .build({ file_path: file })
            .getConfirmationDetails(signal);
        expect(details.type).toBe('info');
        if (details.type !== 'info') {
            throw new Error(`Unexpected confirmation type: ${details.type}`);
        }
        expect(details.prompt).toBe('Publish p.html as an interactive Artifact.');
    });
    it('reuses the confirmation auto-open decision during execution', async () => {
        const shouldAutoOpenArtifact = vi
            .fn()
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(false);
        const consistentTool = new ArtifactTool({
            ...makeConfig(),
            shouldAutoOpenArtifact,
        }, new LocalPublisher(outDir), openSpy);
        const file = await writeFragment('p.html', '<p>x</p>');
        const invocation = consistentTool.build({ file_path: file });
        const details = await invocation.getConfirmationDetails(signal);
        const res = await invocation.execute(signal);
        expect(details.type).toBe('info');
        if (details.type !== 'info') {
            throw new Error(`Unexpected confirmation type: ${details.type}`);
        }
        expect(details.prompt).toContain('and open it in your browser');
        expect(res.error).toBeUndefined();
        expect(openSpy).toHaveBeenCalledTimes(1);
        expect(shouldAutoOpenArtifact).toHaveBeenCalledTimes(1);
    });
    it('rejects a relative file_path at build time', () => {
        expect(() => tool.build({ file_path: 'relative.html' })).toThrow(/absolute/i);
    });
    it('derives a title from the filename when none is given', async () => {
        const file = await writeFragment('release-notes.html', '<p>x</p>');
        const res = await tool.build({ file_path: file }).execute(signal);
        const html = await fs.readFile(res.resultFilePaths[0], 'utf8');
        expect(html).toContain('<title>release-notes</title>');
    });
    it('tells the user a remote backend uploads, but a local one does not', async () => {
        const file = path.join(workdir, 'p.html');
        const remoteTool = new ArtifactTool(makeConfig(), { kind: 'oss', publish: async () => ({ id: 'x', url: 'https://h/x' }) }, openSpy);
        const remote = await remoteTool
            .build({ file_path: file })
            .getConfirmationDetails(signal);
        expect(remote.prompt).toMatch(/remote host \(oss\)/i);
        const hostTool = new ArtifactTool(makeConfig(), {
            kind: 'host',
            publish: async () => ({ id: 'x', url: 'https://h/x' }),
        }, openSpy);
        const host = await hostTool
            .build({ file_path: file })
            .getConfirmationDetails(signal);
        expect(host.prompt).toMatch(/remote host \(custom upload\)/i);
        const local = await tool
            .build({ file_path: file })
            .getConfirmationDetails(signal);
        expect(local.prompt).not.toMatch(/remote/i);
    });
    it('reports a cancellation when the publisher aborts', async () => {
        const file = await writeFragment('page.html', '<p>x</p>');
        const abortErr = Object.assign(new Error('aborted'), {
            name: 'AbortError',
        });
        const cancelTool = new ArtifactTool(makeConfig(), {
            kind: 'oss',
            publish: async () => {
                throw abortErr;
            },
        }, openSpy);
        const res = await cancelTool.build({ file_path: file }).execute(signal);
        expect(res.error).toBeUndefined();
        expect(res.llmContent).toMatch(/cancelled/i);
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('reports a cancellation for a Node abort error', async () => {
        const file = await writeFragment('page.html', '<p>x</p>');
        const abortErr = Object.assign(new Error('aborted'), {
            code: 'ABORT_ERR',
        });
        const cancelTool = new ArtifactTool(makeConfig(), {
            kind: 'oss',
            publish: async () => {
                throw abortErr;
            },
        }, openSpy);
        const res = await cancelTool.build({ file_path: file }).execute(signal);
        expect(res.error).toBeUndefined();
        expect(res.llmContent).toMatch(/cancelled/i);
        expect(openSpy).not.toHaveBeenCalled();
    });
    it('reports a cancellation when the signal is aborted', async () => {
        const controller = new AbortController();
        controller.abort();
        const file = await writeFragment('page.html', '<p>x</p>');
        const cancelTool = new ArtifactTool(makeConfig(), {
            kind: 'oss',
            publish: async () => {
                throw new Error('network failure');
            },
        }, openSpy);
        const res = await cancelTool
            .build({ file_path: file })
            .execute(controller.signal);
        expect(res.error).toBeUndefined();
        expect(res.llmContent).toMatch(/cancelled/i);
        expect(openSpy).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=artifact-tool.test.js.map