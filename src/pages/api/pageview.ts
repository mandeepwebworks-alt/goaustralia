import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const DATA_FILE = join(process.cwd(), 'data', 'views.json');
mkdirSync(dirname(DATA_FILE), { recursive: true });

interface ViewData {
  total: number;
  daily: Record<string, number>;
  referrers: Record<string, number>;
}

function getData(): ViewData {
  if (!existsSync(DATA_FILE)) return { total: 0, daily: {}, referrers: {} };
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf-8')); }
  catch { return { total: 0, daily: {}, referrers: {} }; }
}

function saveData(data: ViewData) {
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json().catch(() => ({}));
    const referrer = (body as any)?.referrer || 'direct';
    const today = new Date().toISOString().slice(0, 10);

    const data = getData();
    data.total++;
    data.daily[today] = (data.daily[today] || 0) + 1;
    data.referrers[referrer] = (data.referrers[referrer] || 0) + 1;
    saveData(data);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed' }), { status: 500 });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(getData()), {
    headers: { 'Content-Type': 'application/json' },
  });
};
