import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { Resend } from 'resend';

const DATA_FILE = join(process.cwd(), 'data', 'leads.json');
mkdirSync(dirname(DATA_FILE), { recursive: true });

const resend = import.meta.env.RESEND_API_KEY
  ? new Resend(import.meta.env.RESEND_API_KEY)
  : null;

function getLeads(): any[] {
  if (!existsSync(DATA_FILE)) return [];
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf-8')); }
  catch { return []; }
}

function saveLeads(leads: any[]) {
  writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2));
}

async function sendLeadEmail(lead: {
  name: string; email: string; company: string; offer: string; message: string; date: string;
}) {
  if (!resend) return;

  const offerLine = lead.offer ? `<tr><td style="padding:8px 0;color:#86868B;font-size:13px;">Offer (NZD)</td><td style="padding:8px 0;font-size:13px;font-weight:700;color:#1D1D1F;">$${lead.offer}</td></tr>` : '';
  const companyLine = lead.company ? `<tr><td style="padding:8px 0;color:#86868B;font-size:13px;">Company</td><td style="padding:8px 0;font-size:13px;color:#1D1D1F;">${lead.company}</td></tr>` : '';
  const messageLine = lead.message ? `<div style="margin-top:20px;padding:16px;background:#F5F5F7;border-radius:8px;font-size:13px;color:#1D1D1F;line-height:1.6;">${lead.message}</div>` : '';

  await resend.emails.send({
    from: 'goaustralia.co.nz <hello@goaustralia.co.nz>',
    to: 'mandeepwebworks@gmail.com',
    subject: `New enquiry from ${lead.name} — goaustralia.co.nz`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <div style="margin-bottom:24px;">
          <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#00875A;">goaustralia.co.nz</span>
          <h1 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#1D1D1F;">New Acquisition Enquiry</h1>
        </div>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #E5E5EA;">
          <tr><td style="padding:8px 0;color:#86868B;font-size:13px;">Name</td><td style="padding:8px 0;font-size:13px;font-weight:700;color:#1D1D1F;">${lead.name}</td></tr>
          <tr><td style="padding:8px 0;color:#86868B;font-size:13px;">Email</td><td style="padding:8px 0;font-size:13px;"><a href="mailto:${lead.email}" style="color:#00875A;">${lead.email}</a></td></tr>
          ${companyLine}
          ${offerLine}
          <tr><td style="padding:8px 0;color:#86868B;font-size:13px;">Received</td><td style="padding:8px 0;font-size:13px;color:#1D1D1F;">${new Date(lead.date).toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' })}</td></tr>
        </table>
        ${messageLine}
        <div style="margin-top:24px;padding-top:24px;border-top:1px solid #E5E5EA;">
          <a href="https://goaustralia.co.nz/dashboard" style="display:inline-block;padding:10px 20px;background:#1D1D1F;color:#fff;text-decoration:none;border-radius:20px;font-size:13px;font-weight:700;">View Dashboard →</a>
        </div>
      </div>
    `,
  });
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

    // Fire-and-forget — don't let email failure block the response
    sendLeadEmail(lead).catch(console.error);

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
