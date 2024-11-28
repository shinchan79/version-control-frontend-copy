export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        // Handle API routes if needed
        return new Response('Not Found', { status: 404 });
      }
  
      // Let Pages handle everything else
      return env.ASSETS.fetch(request);
    },
  };