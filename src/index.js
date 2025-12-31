/**
 * URL Shortener Worker
 * Handles creating short URLs and redirecting to original URLs
 */

// Import static assets as text
import indexHtml from '../public/index.html.txt';
import stylesCss from '../public/styles.css.txt';
import appJs from '../public/app.js.txt';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return handleCORS();
        }

        // API Routes
        if (path === "/api/shorten" && request.method === "POST") {
            return handleShorten(request, env);
        }

        if (path === "/api/stats" && request.method === "GET") {
            return handleStats(env);
        }

        // Serve static files
        if (path === "/" || path === "/index.html") {
            return new Response(indexHtml, {
                headers: { "Content-Type": "text/html;charset=UTF-8" },
            });
        }

        if (path === "/styles.css") {
            return new Response(stylesCss, {
                headers: { "Content-Type": "text/css;charset=UTF-8" },
            });
        }

        if (path === "/app.js") {
            return new Response(appJs, {
                headers: { "Content-Type": "application/javascript;charset=UTF-8" },
            });
        }

        // Redirect short URLs (any path that doesn't match static files)
        if (path.length > 1) {
            const slug = path.slice(1);
            return handleRedirect(slug, env);
        }

        return new Response("Not Found", { status: 404 });
    },
};

/**
 * Handle URL shortening requests
 */
async function handleShorten(request, env) {
    try {
        const body = await request.json();
        const { url: longUrl, customSlug } = body;

        // Validate URL
        if (!longUrl || !isValidUrl(longUrl)) {
            return jsonResponse({ error: "Invalid URL provided" }, 400);
        }

        // Generate or use custom slug
        const slug = customSlug || generateSlug();

        // Check if custom slug is already taken
        if (customSlug) {
            const existing = await env.URLS.get(customSlug);
            if (existing) {
                return jsonResponse({ error: "This custom slug is already taken" }, 409);
            }
        }

        // Store the URL mapping with metadata
        const data = {
            url: longUrl,
            created: Date.now(),
            clicks: 0,
        };

        await env.URLS.put(slug, JSON.stringify(data));

        const shortUrl = new URL(request.url).origin + "/" + slug;

        return jsonResponse({
            success: true,
            shortUrl,
            slug,
            originalUrl: longUrl,
        });
    } catch (error) {
        return jsonResponse({ error: "Failed to create short URL" }, 500);
    }
}

/**
 * Handle redirect from short URL to original URL
 */
async function handleRedirect(slug, env) {
    try {
        const stored = await env.URLS.get(slug);

        if (!stored) {
            return new Response("URL not found", { status: 404 });
        }

        const data = JSON.parse(stored);

        // Update click count (fire and forget)
        data.clicks = (data.clicks || 0) + 1;
        await env.URLS.put(slug, JSON.stringify(data));

        return Response.redirect(data.url, 302);
    } catch (error) {
        return new Response("Error processing redirect", { status: 500 });
    }
}

/**
 * Get stats for all URLs (simple admin endpoint)
 */
async function handleStats(env) {
    try {
        const list = await env.URLS.list();
        const stats = [];

        for (const key of list.keys) {
            const data = await env.URLS.get(key.name);
            if (data) {
                const parsed = JSON.parse(data);
                stats.push({
                    slug: key.name,
                    url: parsed.url,
                    clicks: parsed.clicks || 0,
                    created: parsed.created,
                });
            }
        }

        return jsonResponse({ urls: stats });
    } catch (error) {
        return jsonResponse({ error: "Failed to fetch stats" }, 500);
    }
}

/**
 * Generate a random short slug
 */
function generateSlug(length = 6) {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let slug = "";
    for (let i = 0; i < length; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
}

/**
 * Validate URL format
 */
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

/**
 * Create JSON response with CORS headers
 */
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

/**
 * Handle CORS preflight requests
 */
function handleCORS() {
    return new Response(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
