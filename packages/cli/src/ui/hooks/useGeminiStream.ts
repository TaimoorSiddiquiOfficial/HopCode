// Compatibility shim — upstream code imports useGeminiStream, fork uses useHopCodeStream.
export { useHopCodeStream as useGeminiStream } from './useHopCodeStream.js';
export { classifyApiError } from './useHopCodeStream.js';
