 export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Route: Get all parts
    if (url.pathname === '/api/parts' && request.method === 'GET') {
      try {
        const { results } = await env.DB.prepare("SELECT * FROM parts").all();
        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // API Route: Submit customer part request
    if (url.pathname === '/api/requests' && request.method === 'POST') {
      try {
        const body = await request.json();
        await env.DB.prepare(
          "INSERT INTO requests (customer_name, customer_email, customer_phone, vehicle_info, part_description) VALUES (?, ?, ?, ?, ?)"
        ).bind(
          body.customer_name,
          body.customer_email,
          body.customer_phone,
          body.vehicle_info,
          body.part_description
        ).run();

        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // Default: Serve static site assets (index.html, admin.html, styles.css, app.js)
    return env.ASSETS.fetch(request);
  }
};
