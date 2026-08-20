export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve static assets automatically
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404) return response;
    }

    return new Response("Not Found", { status: 404 });
  }
};
