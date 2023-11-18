const binary = (input: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(input);
  const len = bytes.byteLength;

  for (let i = 0; i < len; i++) {
    const buffer = bytes[i];
    if (buffer) binary += String.fromCharCode(buffer);
  }

  return binary;
};

const hex = (input: ArrayBuffer) =>
  [...new Uint8Array(input)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

// @see https://stackoverflow.com/questions/35155089/node-sha-256-base64-digest
// @see https://stackoverflow.com/questions/9267899/arraybuffer-to-base64-encoded-string
const base64 = async (input: ArrayBuffer) => {
  const commonbtoa = btoa || (await import('base-64')).encode;

  return commonbtoa(binary(input));
};

const base64url = async (input: ArrayBuffer) =>
  (await base64(input))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

export const encoders = {
  base64,
  base64url,
  hex,
  binary,
};
