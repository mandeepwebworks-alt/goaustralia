export async function onRequest({ request, env }) {
  if (request.method === 'POST') {
    try {
      const body = await request.json().catch(() => ({}));
      const referrer = body?.referrer || 'direct';
      const today = new Date().toISOString().slice(0, 10);

      const data = (await env.VIEWS?.get('views', { type: 'json' })) || { total: 0, daily: {}, referrers: {} };
      data.total++;
      data.daily[today] = (data.daily[today] || 0) + 1;
      data.referrers[referrer] = (data.referrers[referrer] || 0) + 1;
      await env.VIEWS?.put('views', JSON.stringify(data));

      return Response.json({ ok: true });
    } catch {
      return Response.json({ error: 'Failed' }, { status: 500 });
    }
  }

  if (request.method === 'GET') {
    const data = (await env.VIEWS?.get('views', { type: 'json' })) || { total: 0, daily: {}, referrers: {} };
    return Response.json(data);
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
