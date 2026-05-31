export async function onRequest() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/dashboard',
      'Set-Cookie': 'dash_token=; Path=/; SameSite=Strict; Max-Age=0',
    },
  });
}
