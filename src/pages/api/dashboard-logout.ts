import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/dashboard',
      'Set-Cookie': 'dash_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0',
    },
  });
};
