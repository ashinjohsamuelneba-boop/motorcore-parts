export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS Headers for secure API access
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 1. GET MAKES & CATEGORIES (For Dropdowns & Filters)
      if (path === "/api/options" && method === "GET") {
        const makes = await env.DB.prepare("SELECT * FROM makes ORDER BY name ASC").all();
        const categories = await env.DB.prepare("SELECT * FROM categories ORDER BY name ASC").all();
        return Response.json({ makes: makes.results, categories: categories.results }, { headers: corsHeaders });
      }

      // 2. INVENTORY API (Admin & Public Search)
      if (path === "/api/parts" && method === "GET") {
        const search = url.searchParams.get("search") || "";
        const make = url.searchParams.get("make") || "";
        const category = url.searchParams.get("category") || "";

        let query = `
          SELECT p.*, m.name as make_name, c.name as category_name 
          FROM parts p 
          LEFT JOIN makes m ON p.make_id = m.id 
          LEFT JOIN categories c ON p.category_id = c.id 
          WHERE 1=1
        `;
        let params = [];

        if (search) {
          query += ` AND (p.title LIKE ? OR p.part_number LIKE ? OR p.stock_number LIKE ? OR p.model LIKE ?)`;
          params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
        }
        if (make) {
          query += ` AND m.slug = ?`;
          params.push(make);
        }
        if (category) {
          query += ` AND c.slug = ?`;
          params.push(category);
        }

        query += ` ORDER BY p.id DESC`;

        const stmt = env.DB.prepare(query);
        const { results } = params.length > 0 ? await stmt.bind(...params).all() : await stmt.all();
        return Response.json({ parts: results }, { headers: corsHeaders });
      }

      // Add a New Part
      if (path === "/api/parts" && method === "POST") {
        const body = await request.json();
        const slug = `${body.year_start}-${body.make_name}-${body.model}-${body.title}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") + `-${Date.now().toString().slice(-4)}`;

        const query = `
          INSERT INTO parts (
            part_number, stock_number, title, slug, make_id, model, year_start, year_end,
            engine, trim, category_id, condition, mileage_hours, price, display_price_as_request,
            availability, location, description, compatibility_notes, images
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await env.DB.prepare(query).bind(
          body.part_number || null,
          body.stock_number || null,
          body.title,
          slug,
          body.make_id,
          body.model,
          body.year_start,
          body.year_end || body.year_start,
          body.engine || null,
          body.trim || null,
          body.category_id,
          body.condition || 'Used',
          body.mileage_hours || null,
          body.price || 0,
          body.display_price_as_request ? 1 : 0,
          body.availability || 'In Stock',
          body.location || null,
          body.description || '',
          body.compatibility_notes || '',
          JSON.stringify(body.images || [])
        ).run();

        return Response.json({ success: true, message: "Part created successfully" }, { headers: corsHeaders });
      }

      // 3. INQUIRIES API
      if (path === "/api/inquiries" && method === "POST") {
        const body = await request.json();
        
        if (!body.customer_name || !body.email || !body.phone) {
          return Response.json({ error: "Missing required fields" }, { status: 400, headers: corsHeaders });
        }

        const query = `
          INSERT INTO inquiries (
            part_id, customer_name, email, phone, vehicle_year, vehicle_make,
            vehicle_model, part_requested, zip_code, preferred_contact, message
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await env.DB.prepare(query).bind(
          body.part_id || null,
          body.customer_name,
          body.email,
          body.phone,
          body.vehicle_year || null,
          body.vehicle_make || null,
          body.vehicle_model || null,
          body.part_requested || null,
          body.zip_code || null,
          body.preferred_contact || 'Email',
          body.message || ''
        ).run();

        return Response.json({ success: true, message: "Inquiry submitted successfully" }, { headers: corsHeaders });
      }

      // View All Inquiries (Admin)
      if (path === "/api/inquiries" && method === "GET") {
        const { results } = await env.DB.prepare(`
          SELECT i.*, p.title as part_title, p.part_number
          FROM inquiries i
          LEFT JOIN parts p ON i.part_id = p.id
          ORDER BY i.id DESC
        `).all();

        return Response.json({ inquiries: results }, { headers: corsHeaders });
      }

      // Update Inquiry Status (Admin)
      if (path === "/api/inquiries/status" && method === "PUT") {
        const body = await request.json();
        await env.DB.prepare("UPDATE inquiries SET status = ? WHERE id = ?")
          .bind(body.status, body.id)
          .run();

        return Response.json({ success: true, message: "Status updated" }, { headers: corsHeaders });
      }

      // Fallback for static assets
      return env.ASSETS.fetch(request);

    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }
  }
};
