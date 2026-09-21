const STATE_TTL_MS = 1000 * 60 * 60 * 24;
const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> | null {
  if (hex.length === 0 || hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) {
    return null;
  }
  return Uint8Array.from(hex.match(/../g) ?? [], (byte) =>
    Number.parseInt(byte, 16),
  );
}

function importKey(secret: string, usage: 'sign' | 'verify') {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    [usage],
  );
}

/**
 * Creates a stateless, signed OAuth `state` value: `<timestamp>.<hmac>`.
 */
export async function createState(secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const key = await importKey(secret, 'sign');
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(timestamp),
  );
  return `${timestamp}.${toHex(signature)}`;
}

/**
 * Verifies the signature (constant time) and that the state hasn't expired.
 */
export async function verifyState(
  state: string,
  secret: string,
): Promise<boolean> {
  const [timestamp, signatureHex, ...rest] = state.split('.');
  if (!timestamp || !signatureHex || rest.length > 0) return false;

  const issuedAt = Number(timestamp);
  const age = Date.now() - issuedAt;
  if (!Number.isFinite(issuedAt) || age < 0 || age > STATE_TTL_MS) return false;

  const signature = fromHex(signatureHex);
  if (!signature) return false;

  const key = await importKey(secret, 'verify');
  return crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    encoder.encode(timestamp),
  );
}
