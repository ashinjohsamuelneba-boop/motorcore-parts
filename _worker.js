export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for frontend communication
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. Get all parts (Public catalog)
      if (path === "/api/parts" && request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM parts ORDER BY created_at DESC").all();
        return Response.json(results, { headers: corsHeaders });
      }

      // 2. Submit customer inquiry / request to buy
      if (path === "/api/inquiries" && request.method === "POST") {
        const data = await request.json();
        const id = 'req_' + Date.now();
        await env.DB.prepare(
          `INSERT INTO customer_requests (id, customer_name, customer_email, customer_phone, location, delivery_preference, part_description, vehicle_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          id,
          data.customer_name,
          data.customer_email,
          data.customer_phone || '',
          data.location || '',
          data.delivery_preference || 'Pickup',
          data.part_description,
          data.vehicle_details || ''
        ).run();

        return Response.json({ success: true, message: "Inquiry submitted successfully!" }, { headers: corsHeaders });
      }

      // 3. Admin Login (Secure verification)
      if (path === "/api/admin/login" && request.method === "POST") {
        const { username, password } = await request.json();
        
        // Check against environment variables or database admin table
        // For simplicity and high security on Cloudflare, you can match against env.ADMIN_PASSWORD
        if (username === (env.ADMIN_USER || "admin") && password === env.ADMIN_PASSWORD) {
          return Response.json({ success: true, token: "authenticated_session_token" }, { headers: corsHeaders });
        }
        
        return Response.json({ success: false, error: "Invalid credentials" }, { status: 401, headers: corsHeaders });
      }

      // 4. Admin: Get all inquiries
      if (path === "/api/admin/inquiries" && request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM customer_requests ORDER BY created_at DESC").all();
        return Response.json(results, { headers: corsHeaders });
      }

      // 5. Admin: Add new part
      if (path === "/api/admin/parts" && request.method === "POST") {
        const data = await request.json();
        const id = 'part_' + Date.now();
        await env.DB.prepare(
          `INSERT INTO parts (id, sku, name, category, vehicle_make, vehicle_model, vehicle_year_start, vehicle_year_end, price, stock_quantity, image_url, condition, availability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          id,
          data.sku,
          data.name,
          data.category || '',
          data.vehicle_make || '',
          data.vehicle_model || '',
          data.vehicle_year_start || 0,
          data.vehicle_year_end || 0,
          data.price || 0,
          data.stock_quantity || 1,
          data.image_url || '',
          data.condition || 'New',
          data.availability || 'In Stock'
        ).run();

        return Response.json({ success: true, message: "Part added successfully!" }, { headers: corsHeaders });
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (err) {
      return Response.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
    }
  }
};
