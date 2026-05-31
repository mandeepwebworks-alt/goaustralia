async function sha256hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendLeadEmail(lead, apiKey) {
  const offerLine = lead.offer
    ? `<tr><td style="padding:8px 0;color:#86868B;font-size:13px;">Offer (NZD)</td><td style="padding:8px 0;font-size:13px;font-weight:700;color:#1D1D1F;">$${lead.offer}</td></tr>`
    : '';
  const companyLine = lead.company
    ? `<tr><td style="padding:8px 0;color:#86868B;font-size:13px;">Company</td><td style="padding:8px 0;font-size:13px;color:#1D1D1F;">${lead.company}</td></tr>`
    : '';
  const messageLine = lead.message
    ? `<div style="margin-top:20px;padding:16px;background:#F5F5F7;border-radius:8px;font-size:13px;color:#1D1D1F;line-height:1.6;">${lead.message}</div>`
    : '';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'goaustralia.co.nz <hello@goaustralia.co.nz>',
      to: ['mandeepwebworks@gmail.com'],
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
    }),
  });
}

export async function onRequest({ request, env }) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, company, offer, message } = body;

      if (!name || !email) {
        return Response.json({ error: 'Name and email required' }, { status: 400 });
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

      const existing = (await env.LEADS?.get('leads', { type: 'json' })) || [];
      existing.unshift(lead);
      await env.LEADS?.put('leads', JSON.stringify(existing));

      if (env.RESEND_API_KEY) {
        sendLeadEmail(lead, env.RESEND_API_KEY).catch(console.error);
      }

      return Response.json({ ok: true, id: lead.id });
    } catch {
      return Response.json({ error: 'Invalid request' }, { status: 400 });
    }
  }

  if (request.method === 'GET') {
    const cookieHeader = request.headers.get('Cookie') || '';
    const tokenMatch = cookieHeader.match(/dash_token=([^;]+)/);
    const token = tokenMatch?.[1];
    const expected = await sha256hex('Mandeep2026');

    if (token !== expected) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const leads = (await env.LEADS?.get('leads', { type: 'json' })) || [];
    return Response.json(leads);
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
}
