/**
 * WhatsApp worker subprocess entry.
 *
 * Owns all Baileys state. Communicates with the main process over
 * newline-delimited JSON on stdin/stdout (see protocol.ts).
 *
 * Baileys is bundled into worker.cjs by esbuild at build time, so the
 * dynamic import below always resolves. The try/catch stays as a runtime
 * safety net — e.g. if a future Baileys version throws during module init
 * on an unsupported Node runtime we want a clean `unavailable` event
 * instead of a subprocess crash.
 *
 * Runs under Node (not Bun) when packaged with Electron so Baileys'
 * crypto deps (libsignal, curve25519) resolve correctly.
 */
export {};
