import type { MessageEnvelope } from '@craft-agent/shared/protocol';
export declare function validateEnvelopeShape(value: unknown): value is MessageEnvelope;
export declare function serializeEnvelope(envelope: MessageEnvelope): string;
export declare function deserializeEnvelope(raw: string): MessageEnvelope;
