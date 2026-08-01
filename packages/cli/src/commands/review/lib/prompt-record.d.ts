/**
 * @license
 * Copyright 2026 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Where the prompts this plan's agents were built from are recorded.
 *
 * Derived from the plan path, by both the writer and the reader, so that neither
 * takes it as an argument. A path the model can choose is a path the model can
 * point somewhere flattering.
 */
export declare function promptRecordDir(planPath: string): string;
/** Where this agent's brief lives — the file it is told to read first. */
export declare function briefPath(planPath: string, key: string): string;
/**
 * Write the brief this agent is told to read.
 *
 * The brief is not in the launch prompt, and that is deliberate. Measured on a real
 * run: asked to paste a 4 652-character prompt to each of twelve agents, the
 * orchestrator delivered 2 893 characters — it kept the head, added a preamble of
 * its own, and **cut 1 900 characters out of the middle**. It will not carry
 * fifty-five kilobytes of instructions across twelve tool calls, and telling it
 * again to do so is the same prose that has failed every time.
 *
 * So the brief goes where the diff already goes: on disk, read by the agent that
 * needs it. What the orchestrator has to carry shrinks to something it will
 * actually carry — and whether the agent read it is then a fact in the harness's
 * transcript, not a hope.
 */
export declare function writeBrief(planPath: string, key: string, brief: string): string;
/** Record the prompt `key` was built with. Best-effort: never fails a build. */
export declare function recordPrompt(planPath: string, key: string, prompt: string): void;
/** Every prompt this plan's builder emitted, keyed as it was recorded. */
export declare function readRecordedPrompts(planPath: string): Map<string, string>;
/**
 * Was `built` delivered to the agent intact?
 *
 * **You may add. You may not remove, alter, or reorder.** Every line the builder
 * emitted has to turn up in the delivered prompt, in the order it was emitted.
 * Anything the caller puts *between* them is its own business.
 *
 * The first version of this was a straight substring test, and it was wrong in a
 * way that would have been worse than no check at all. Dogfooded on a Step 3B
 * review, it failed all nine agents — and both differences were legitimate:
 *
 *   - the caller had inserted **the one-sentence summary of the change that the
 *     skill explicitly tells it to add**, which breaks contiguity by construction;
 *   - and it had reflowed a hard-wrapped sentence onto one line, which changes not
 *     one character of meaning.
 *
 * A gate that fires on a correct run is a gate that gets talked around — this
 * skill has the dogfood transcript of a model doing exactly that, reasoning its way
 * past a refusal it had decided was noise. Precision here is not politeness; it is
 * the difference between a check that works and a check that trains the reader to
 * ignore it.
 *
 * So: normalize whitespace away entirely (a wrap is not an edit), then walk the
 * built lines and require each to appear at or after the last one's position.
 */
export declare function wasDeliveredVerbatim(launchPrompt: string, built: string): boolean;
