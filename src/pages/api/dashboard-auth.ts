import type { APIRoute } from 'astro';

const PASSWORD = 'Mandeep2026';

async function sha256hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export const POST: APIRoute = async ({ request }) => {
  const form = await request.formData();
  const password = form.get('password')?.toString();

  if (password === PASSWORD) {
    const token = await sha256hex(PASSWORD);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/dashboard',
        'Set-Cookie': `dash_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
      },
    });
  }

  return new Response(null, {
    status: 302,
    headers: { Location: '/dashboard?error=1' },
  });
};
