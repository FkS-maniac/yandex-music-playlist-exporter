const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff"
    }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/users\/([A-Za-z0-9._-]{1,128})\/playlists\/([A-Za-z0-9_-]{1,64})$/);
    if (!match || url.search || url.hash) {
      return jsonResponse({ error: "Not found." }, 404);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.headers.has("Authorization")) {
      return jsonResponse({ error: "Authorization headers are not supported." }, 400);
    }
    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed." }, 405);
    }

    const [, owner, kind] = match;
    const upstreamUrl = "https://api.music.yandex.net/users/" +
      encodeURIComponent(owner) + "/playlists/" + encodeURIComponent(kind);

    try {
      const upstream = await fetch(upstreamUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
        redirect: "error"
      });
      return new Response(upstream.body, {
        status: upstream.status,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": upstream.headers.get("Content-Type") || "application/json; charset=utf-8",
          "X-Content-Type-Options": "nosniff"
        }
      });
    } catch {
      return jsonResponse({ error: "Unable to reach the Yandex Music public API." }, 502);
    }
  }
};
