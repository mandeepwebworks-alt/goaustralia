import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';

const DATA_FILE = join(process.cwd(), 'data', 'leads.json');
mkdirSync(dirname(DATA_FILE), { recursive: true });

function getLeads(): any[] {
  if (!existsSync(DATA_FILE)) return [];
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf-8')); }
  catch { return []; }
}

function saveLeads(leads: any[]) {
  writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, company, offer, message } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email required' }), { status: 400 });
    }

    const lead = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      email,
      company: company || '',
      offer: offer || '',
      message: message || '',
      date: new Date().toISOString(),
      read: false,
    };

    const leads = getLeads();
    leads.unshift(lead);
    saveLeads(leads);

    return new Response(JSON.stringify({ ok: true, id: lead.id }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
};

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify(getLeads()), {
    headers: { 'Content-Type': 'application/json' },
  });
};
