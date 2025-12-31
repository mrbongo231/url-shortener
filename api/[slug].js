import { Redis } from '@upstash/redis';

// Initialize Redis client using environment variables
const redis = Redis.fromEnv();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get the slug from the URL path
    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
    }

    try {
        const data = await redis.get(`url:${slug}`);

        if (!data) {
            return res.status(404).json({ error: 'URL not found' });
        }

        const parsed = typeof data === 'string' ? JSON.parse(data) : data;

        // Update click count
        parsed.clicks = (parsed.clicks || 0) + 1;
        await redis.set(`url:${slug}`, JSON.stringify(parsed));

        // Redirect to the original URL
        return res.redirect(302, parsed.url);
    } catch (error) {
        console.error('Redirect error:', error);
        return res.status(500).json({ error: 'Error processing redirect' });
    }
}
