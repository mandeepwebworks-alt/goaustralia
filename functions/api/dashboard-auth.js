async function sha256hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const form = await request.formData();
  const password = form.get('password')?.toString();

  if (password === 'Mandeep2026') {
    const token = await sha256hex('Mandeep2026');
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
}
