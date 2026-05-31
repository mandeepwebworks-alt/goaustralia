import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';

const PASSWORD = 'Mandeep2026';
const TOKEN = createHash('sha256').update(PASSWORD).digest('hex');

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const password = form.get('password')?.toString();

  if (password === PASSWORD) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': `dash_token=${TOKEN}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/dashboard?error=1' },
  });
};
