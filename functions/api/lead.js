async function sha256hex(text) {
  const data = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function sendLeadEmail(lead, apiKey) {
  const itemRows = lead.items ? Object.entries(lead.items)
    .filter(([,v]) => v > 0)
    .map(([k,v]) => `<tr><td style="padding:6px 0;color:#86868B;font-size:13px">${escapeHtml(k)}</td><td style="padding:6px 0;font-size:13px;font-weight:700;color:#1D1D1F">${v}</td></tr>`)
    .join('') : '';

  const extrasList = lead.extras ? Object.entries(lead.extras)
    .filter(([,v]) => v)
    .map(([k]) => escapeHtml(k))
    .join(', ') : '';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'GoAustralia <hello@goaustralia.co.nz>',
      to: ['mandeepwebworks@gmail.com'],
      subject: `New moving quote: ${escapeHtml(lead.name)} — ${escapeHtml(lead.fromCity)} → ${escapeHtml(lead.toCity)}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff">
          <div style="margin-bottom:24px">
            <span style="font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#C79212">GoAustralia.co.nz</span>
            <h1 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#161412">New Quote Request</h1>
          </div>
          <table style="width:100%;border-collapse:collapse;border-top:1px solid #E5E5EA">
            <tr><td style="padding:8px 0;color:#86868B;font-size:13px">Name</td><td style="padding:8px 0;font-size:13px;font-weight:700;color:#161412">${escapeHtml(lead.name)}</td></tr>
            <tr><td style="padding:8px 0;color:#86868B;font-size:13px">Email</td><td style="padding:8px 0;font-size:13px"><a href="mailto:${escapeHtml(lead.email)}" style="color:#C79212">${escapeHtml(lead.email)}</a></td></tr>
            ${lead.phone ? `<tr><td style="padding:8px 0;color:#86868B;font-size:13px">Phone</td><td style="padding:8px 0;font-size:13px;color:#161412">${escapeHtml(lead.phone)}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#86868B;font-size:13px">Route</td><td style="padding:8px 0;font-size:13px;font-weight:700;color:#161412">${escapeHtml(lead.fromCity)} → ${escapeHtml(lead.toCity)}</td></tr>
            <tr><td style="padding:8px 0;color:#86868B;font-size:13px">Timeline</td><td style="padding:8px 0;font-size:13px;color:#161412">${escapeHtml(lead.timeline || '')}</td></tr>
            <tr><td style="padding:8px 0;color:#86868B;font-size:13px">Home size</td><td style="padding:8px 0;font-size:13px;color:#161412">${escapeHtml(lead.homeSize || '')}</td></tr>
          </table>
          ${itemRows ? `<div style="margin-top:16px;padding-top:16px;border-top:1px solid #E5E5EA"><div style="font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#86868B;margin-bottom:8px">Items</div><table style="width:100%;border-collapse:collapse">${itemRows}</table></div>` : ''}
          ${extrasList ? `<div style="margin-top:12px;font-size:13px;color:#161412"><strong>Extras:</strong> ${escapeHtml(extrasList)}</div>` : ''}
          <div style="margin-top:16px;font-size:12px;color:#86868B">Received: ${new Date(lead.date).toLocaleString('en-NZ', { dateStyle: 'medium', timeStyle: 'short' })}</div>
          <div style="margin-top:24px;padding-top:24px;border-top:1px solid #E5E5EA">
            <a href="https://goaustralia.co.nz/dashboard" style="display:inline-block;padding:10px 20px;background:#161412;color:#fff;text-decoration:none;border-radius:20px;font-size:13px;font-weight:700">View Dashboard →</a>
          </div>
        </div>
      `,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[Resend] send failed:', res.status, err);
  }
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const { name, email, phone, fromCity, toCity, timeline, homeSize, items, extras } = body;

      if (!name || !email || !phone) {
        return Response.json({ error: 'Name, email, and phone required' }, { status: 400 });
      }

      const lead = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        name,
        email,
        phone: phone || '',
        fromCity: fromCity || '',
        toCity: toCity || '',
        timeline: timeline || '',
        homeSize: homeSize || '',
        items: items || {},
        extras: extras || {},
        date: new Date().toISOString(),
        read: false,
      };

      const existing = (await env.LEADS?.get('leads', { type: 'json' })) || [];
      existing.unshift(lead);
      await env.LEADS?.put('leads', JSON.stringify(existing));

      if (env.RESEND_API_KEY) {
        context.waitUntil(sendLeadEmail(lead, env.RESEND_API_KEY).catch(e => console.error('[lead] email error:', e)));
      } else {
        console.error('[lead] RESEND_API_KEY not set in env');
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
