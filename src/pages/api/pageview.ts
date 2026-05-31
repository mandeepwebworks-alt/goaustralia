import type { APIRoute } from 'astro';

interface ViewData {
  total: number;
  daily: Record<string, number>;
  referrers: Record<string, number>;
}

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    const body = await context.request.json().catch(() => ({})) as any;
    const referrer = body?.referrer || 'direct';
    const today = new Date().toISOString().slice(0, 10);

    const data: ViewData = (await env?.VIEWS?.get('views', { type: 'json' })) || { total: 0, daily: {}, referrers: {} };
    data.total++;
    data.daily[today] = (data.daily[today] || 0) + 1;
    data.referrers[referrer] = (data.referrers[referrer] || 0) + 1;
    await env?.VIEWS?.put('views', JSON.stringify(data));

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
  }
};

export const GET: APIRoute = async (context) => {
  const env = (context.locals as any).runtime?.env;
  const data = (await env?.VIEWS?.get('views', { type: 'json' })) || { total: 0, daily: {}, referrers: {} };
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
