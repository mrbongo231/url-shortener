import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
const redis = Redis.fromEnv();

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get all URL keys
        const keys = await redis.keys('url:*');
        const stats = [];

        for (const key of keys) {
            const data = await redis.get(key);
            if (data) {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                stats.push({
                    slug: key.replace('url:', ''),
                    url: parsed.url,
                    clicks: parsed.clicks || 0,
                    created: parsed.created,
                });
            }
        }

        return res.status(200).json({ urls: stats });
    } catch (error) {
        console.error('Stats error:', error);
        return res.status(500).json({ error: 'Failed to fetch stats' });
    }
}
