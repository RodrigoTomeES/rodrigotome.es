import { deterministicString } from '../../lib/deterministic-object-hash/index';

export const prerender = false;

export async function GET() {
  return new Response(deterministicString({ a: 1, b: 2, c: 3 }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
