export const prerender = false;

export async function GET() {
  const number = Math.random();
  return {
    body: JSON.stringify({
      number,
      message: `Here's a random number: ${number}`,
    }),
  };
}
