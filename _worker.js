export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Public API: Fetch Inventory
    if (url.pathname === '/api/parts' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare('SELECT * FROM parts ORDER BY id DESC').all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    // Public API: Submit Quote
    if (url.pathname === '/api/quotes' && request.method === 'POST') {
      try {
        const body = await request.json();
        await env.DB.prepare(
          'INSERT INTO quotes (name, email, phone, vehicle, details) VALUES (?, ?, ?, ?, ?)'
        ).bind(body.name, body.email, body.phone, body.vehicle, body.details).run();

        return new Response(JSON.stringify({ success: true }), { status: 201 });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    // Admin API: Add Part
    if (url.pathname === '/api/admin/parts' && request.method === 'POST') {
      const secret = request.headers.get('X-Admin-Secret');
      if (secret !== 'motorcore-admin-2026') {
        return new Response('Unauthorized', { status: 401 });
      }

      try {
        const p = await request.json();
        await env.DB.prepare(
          'INSERT INTO parts (title, stock_id, oem_number, make, model, year_start, year_end, condition, donor_info, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(p.title, p.stock_id, p.oem_number, p.make, p.model, p.year_start, p.year_end, p.condition, p.donor_info, p.price).run();

        return new Response(JSON.stringify({ success: true }), { status: 201 });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
