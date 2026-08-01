/**
 * @license
 * Copyright 2025 HopCode Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * RepoMapService -- import-graph PageRank for codebase orientation.
 *
 * Builds a directed graph from TypeScript/JavaScript import statements,
 * runs (personalized) PageRank from seed files, and returns a compact
 * "top-N relevant files with their exports" view.
 *
 * ## Algorithm
 *
 * 1. Glob all .ts/.tsx/.js/.jsx files (excluding node_modules, dist, build)
 * 2. For each file, extract import paths via regex -> resolve to absolute paths
 * 3. Build adjacency list: importer -> Set<importee>
 * 4. Run personalized PageRank from seed files (damping = 0.85, 30 iterations)
 * 5. Return top-N files sorted by rank with their exported symbol names
 *
 * ## Caching
 *
 * Results are cached to `.hopcode/repo-map-cache.json`. Cache is invalidated
 * when any tracked file's mtime changes.
 */
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { glob } from 'glob';
// --- Constants ---
const CACHE_FILE = '.hopcode/repo-map-cache.json';
const DAMPING = 0.85;
const ITERATIONS = 30;
const DEFAULT_TOP_N = 20;
const EXCLUDE_DIRS = [
    'node_modules',
    'dist',
    'build',
    '.git',
    'coverage',
    '__pycache__',
];
const SOURCE_GLOB = '**/*.{ts,tsx,js,jsx,mts,cts}';
// Matches: import ... from './foo', import('./bar'), require('./baz')
const IMPORT_RE = /(?:import\s[^'"]*from\s|import\s*\(|require\s*\()['"]([^'"]+)['"]/g;
// Matches: export function/class/const/let/var/type/interface/enum Foo
const EXPORT_RE = /^export\s+(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*|class\s+|const\s+|let\s+|var\s+|type\s+|interface\s+|enum\s+)([A-Za-z_$][A-Za-z0-9_$]*)/gm;
// --- Helpers ---
function shouldExclude(filePath) {
    return EXCLUDE_DIRS.some((dir) => filePath.includes(`/${dir}/`));
}
/**
 * Resolve a TypeScript import specifier to an absolute file path.
 * Returns null for bare specifiers (npm packages) or unresolvable paths.
 */
function resolveImport(fromFile, specifier, allFiles) {
    if (!specifier.startsWith('.') && !specifier.startsWith('/'))
        return null;
    const fromDir = path.dirname(fromFile);
    const base = path.resolve(fromDir, specifier);
    const candidates = [
        base,
        `${base}.ts`,
        `${base}.tsx`,
        `${base}.js`,
        `${base}.jsx`,
        `${base}.mts`,
        `${base}.cts`,
        path.join(base, 'index.ts'),
        path.join(base, 'index.js'),
        path.join(base, 'index.tsx'),
    ];
    for (const candidate of candidates) {
        if (allFiles.has(candidate))
            return candidate;
    }
    return null;
}
/**
 * Extract exported symbol names from source text.
 */
function extractExports(source) {
    const names = [];
    let match;
    EXPORT_RE.lastIndex = 0;
    while ((match = EXPORT_RE.exec(source)) !== null) {
        if (match[1])
            names.push(match[1]);
    }
    const namedExport = /^export\s+\{([^}]+)\}/gm;
    namedExport.lastIndex = 0;
    while ((match = namedExport.exec(source)) !== null) {
        const parts = match[1].split(',').map((s) => s
            .trim()
            .split(/\s+as\s+/)
            .pop()
            .trim());
        names.push(...parts.filter((p) => p && p !== 'default'));
    }
    return [...new Set(names)];
}
// --- PageRank ---
/**
 * Run personalized PageRank on the import graph.
 */
function pageRank(graph, seeds) {
    const nodes = [...graph.keys()];
    const N = nodes.length;
    if (N === 0)
        return new Map();
    const idx = new Map(nodes.map((n, i) => [n, i]));
    const ranks = new Float64Array(N).fill(1 / N);
    const next = new Float64Array(N);
    // Build reverse adjacency (importee -> importers) for the push model
    const reverseAdj = new Map();
    for (let i = 0; i < N; i++)
        reverseAdj.set(i, []);
    for (const [from, tos] of graph) {
        const fi = idx.get(from);
        for (const to of tos) {
            const ti = idx.get(to);
            if (ti !== undefined)
                reverseAdj.get(ti).push(fi);
        }
    }
    // Outgoing degree for normalization
    const outDeg = new Float32Array(N);
    for (const [from, tos] of graph) {
        outDeg[idx.get(from)] = tos.size;
    }
    // Personalization vector
    const personalize = new Float64Array(N).fill(1 / N);
    if (seeds.size > 0) {
        personalize.fill(0);
        let seedCount = 0;
        for (const s of seeds) {
            if (idx.has(s))
                seedCount++;
        }
        if (seedCount > 0) {
            const w = 1 / seedCount;
            for (const s of seeds) {
                const si = idx.get(s);
                if (si !== undefined)
                    personalize[si] = w;
            }
        }
    }
    for (let iter = 0; iter < ITERATIONS; iter++) {
        next.fill(0);
        for (let i = 0; i < N; i++) {
            const inbound = reverseAdj.get(i);
            for (const j of inbound) {
                next[i] += ranks[j] / (outDeg[j] || 1);
            }
        }
        for (let i = 0; i < N; i++) {
            next[i] = DAMPING * next[i] + (1 - DAMPING) * personalize[i];
        }
        // Normalize
        let sum = 0;
        for (let i = 0; i < N; i++)
            sum += next[i];
        if (sum > 0)
            for (let i = 0; i < N; i++)
                next[i] /= sum;
        ranks.set(next);
    }
    const result = new Map();
    for (let i = 0; i < N; i++)
        result.set(nodes[i], ranks[i]);
    return result;
}
// --- RepoMapService ---
export class RepoMapService {
    projectRoot;
    cache = null;
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
    }
    /**
     * Build or load the cached import graph.
     */
    async getGraph() {
        const cachePath = path.join(this.projectRoot, CACHE_FILE);
        if (!this.cache) {
            try {
                const raw = await fs.readFile(cachePath, 'utf8');
                this.cache = JSON.parse(raw);
            }
            catch {
                // Cache miss -- will rebuild below
            }
        }
        const files = await glob(SOURCE_GLOB, {
            cwd: this.projectRoot,
            absolute: true,
            ignore: EXCLUDE_DIRS.map((d) => `**/${d}/**`),
        });
        const filteredFiles = files.filter((f) => !shouldExclude(f));
        // Check if cache is still valid
        if (this.cache) {
            const cachedPaths = new Set(Object.keys(this.cache.mtimes));
            const currentPaths = new Set(filteredFiles);
            const sameFiles = cachedPaths.size === currentPaths.size &&
                [...cachedPaths].every((p) => currentPaths.has(p));
            if (sameFiles) {
                const sample = filteredFiles.slice(0, 50);
                const mtimesMatch = await Promise.all(sample.map(async (f) => {
                    try {
                        const stat = await fs.stat(f);
                        return stat.mtimeMs === this.cache.mtimes[f];
                    }
                    catch {
                        return false;
                    }
                }));
                if (mtimesMatch.every(Boolean))
                    return this.cache;
            }
        }
        // Rebuild graph
        const fileSet = new Set(filteredFiles);
        const graph = {};
        const exports = {};
        const mtimes = {};
        await Promise.all(filteredFiles.map(async (file) => {
            try {
                const [source, stat] = await Promise.all([
                    fs.readFile(file, 'utf8'),
                    fs.stat(file),
                ]);
                mtimes[file] = stat.mtimeMs;
                exports[file] = extractExports(source);
                const importedFiles = [];
                let match;
                IMPORT_RE.lastIndex = 0;
                while ((match = IMPORT_RE.exec(source)) !== null) {
                    const resolved = resolveImport(file, match[1], fileSet);
                    if (resolved && resolved !== file) {
                        importedFiles.push(resolved);
                    }
                }
                graph[file] = [...new Set(importedFiles)];
            }
            catch {
                graph[file] = [];
                exports[file] = [];
                mtimes[file] = 0;
            }
        }));
        this.cache = { mtimes, graph, exports };
        // Persist cache
        try {
            const dir = path.join(this.projectRoot, '.hopcode');
            await fs.mkdir(dir, { recursive: true });
            await fs.writeFile(cachePath, JSON.stringify(this.cache), 'utf8');
        }
        catch {
            // Cache write failure is non-fatal
        }
        return this.cache;
    }
    /**
     * Get top-N most relevant files for the given seeds.
     */
    async getRelevantFiles(seedFiles = [], topN = DEFAULT_TOP_N) {
        const { graph: rawGraph, exports: rawExports } = await this.getGraph();
        const graph = new Map();
        for (const [file, imports] of Object.entries(rawGraph)) {
            graph.set(file, new Set(imports));
        }
        const seeds = new Set(seedFiles.map((f) => path.resolve(f)));
        const ranks = pageRank(graph, seeds);
        const sorted = [...ranks.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN);
        const entries = sorted.map(([file, rank]) => ({
            file,
            exports: rawExports[file] ?? [],
            rank,
        }));
        return {
            entries,
            totalFiles: graph.size,
            seedFiles: [...seeds],
        };
    }
    /**
     * Format a repo map result as a compact human-readable string.
     */
    static format(result, projectRoot) {
        const lines = [
            `Repo map (top ${result.entries.length} of ${result.totalFiles} files):`,
        ];
        if (result.seedFiles.length > 0) {
            const relSeeds = result.seedFiles
                .map((f) => path.relative(projectRoot, f))
                .join(', ');
            lines.push(`Personalized from: ${relSeeds}`);
        }
        lines.push('');
        for (const entry of result.entries) {
            const rel = path.relative(projectRoot, entry.file);
            const symbols = entry.exports.length > 0
                ? ` -> ${entry.exports.slice(0, 8).join(', ')}${entry.exports.length > 8 ? ', ...' : ''}`
                : '';
            lines.push(`  ${rel}${symbols}`);
        }
        return lines.join('\n');
    }
    /**
     * Invalidate the in-memory cache (forces rebuild on next call).
     */
    invalidate() {
        this.cache = null;
    }
}
//# sourceMappingURL=repoMapService.js.map