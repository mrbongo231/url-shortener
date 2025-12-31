import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
// Vercel automatically injects UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
const redis = Redis.fromEnv();

// Generate random slug
function generateSlug(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let slug = '';
    for (let i = 0; i < length; i++) {
        slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
}

// Validate URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { url: longUrl, customSlug } = req.body;

        // Validate URL
        if (!longUrl || !isValidUrl(longUrl)) {
            return res.status(400).json({ error: 'Invalid URL provided' });
        }

        // Generate or use custom slug
        const slug = customSlug || generateSlug();

        // Check if custom slug is already taken
        if (customSlug) {
            const existing = await redis.get(`url:${customSlug}`);
            if (existing) {
                return res.status(409).json({ error: 'This custom slug is already taken' });
            }
        }

        // Store the URL mapping
        const data = {
            url: longUrl,
            created: Date.now(),
            clicks: 0,
        };

        await redis.set(`url:${slug}`, JSON.stringify(data));

        // Build short URL from request
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.headers.host;
        const shortUrl = `${protocol}://${host}/${slug}`;

        return res.status(200).json({
            success: true,
            shortUrl,
            slug,
            originalUrl: longUrl,
        });
    } catch (error) {
        console.error('Shorten error:', error);
        return res.status(500).json({ error: 'Failed to create short URL' });
    }
}
