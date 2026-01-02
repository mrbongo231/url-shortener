import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = Redis.fromEnv();

/**
 * Generate short edit token
 */
function generateToken() {
    return crypto.randomBytes(4).toString('hex');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET: Load existing page for editing
    if (req.method === 'GET') {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ error: 'Missing token' });
        }

        // Look up username by token
        const username = await redis.get(`token:${token}`);
        if (!username) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const bioData = await redis.get(`bio:${username}`);
        if (!bioData) {
            return res.status(404).json({ error: 'Page not found' });
        }

        const data = typeof bioData === 'string' ? JSON.parse(bioData) : bioData;
        return res.status(200).json(data);
    }

    // POST: Create or update page
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, elements, bg, editToken } = req.body;

        // Validation
        if (!username || typeof username !== 'string') {
            return res.status(400).json({ error: 'Username is required' });
        }

        const cleanUsername = username.toLowerCase().trim();

        if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
            return res.status(400).json({
                error: 'Username can only contain letters, numbers, underscores, and hyphens'
            });
        }

        if (cleanUsername.length < 2 || cleanUsername.length > 30) {
            return res.status(400).json({
                error: 'Username must be between 2 and 30 characters'
            });
        }

        if (!Array.isArray(elements)) {
            return res.status(400).json({ error: 'Elements array is required' });
        }

        if (elements.length > 50) {
            return res.status(400).json({ error: 'Maximum 50 elements allowed' });
        }

        // Check if updating existing page
        let token = editToken;
        const existingBio = await redis.get(`bio:${cleanUsername}`);

        if (existingBio) {
            const existing = typeof existingBio === 'string' ? JSON.parse(existingBio) : existingBio;

            // Verify edit token
            if (!editToken || existing.editToken !== editToken) {
                return res.status(409).json({
                    error: 'Username already taken. Please choose another.'
                });
            }
            // Keep same token for updates
            token = existing.editToken;
        } else {
            // Generate new token
            token = generateToken();
        }

        // Validate and sanitize elements (limit size)
        const allowedTypes = ['image', 'text', 'button', 'social', 'divider', 'heading', 'spacer', 'container', 'embed', 'iconButton'];
        const sanitizedElements = elements.map(el => ({
            id: String(el.id || '').slice(0, 10),
            type: allowedTypes.includes(el.type) ? el.type : 'text',
            x: Math.max(0, Math.min(100, Number(el.x) || 50)),
            y: Math.max(0, Math.min(100, Number(el.y) || 50)),
            w: Math.max(5, Math.min(100, Number(el.w) || 50)),
            h: Math.max(0.5, Math.min(50, Number(el.h) || 10)),
            props: sanitizeProps(el.type, el.props || {})
        }));

        // Store the bio page data
        const bioData = {
            username: cleanUsername,
            elements: sanitizedElements,
            bg: String(bg || '').slice(0, 500),
            editToken: token,
            createdAt: existingBio ? (typeof existingBio === 'string' ? JSON.parse(existingBio) : existingBio).createdAt : Date.now(),
            updatedAt: Date.now(),
            views: existingBio ? (typeof existingBio === 'string' ? JSON.parse(existingBio) : existingBio).views || 0 : 0
        };

        // Store bio and token mapping
        await redis.set(`bio:${cleanUsername}`, JSON.stringify(bioData));
        await redis.set(`token:${token}`, cleanUsername);

        return res.status(201).json({
            success: true,
            url: `/@${cleanUsername}`,
            editToken: token,
            message: 'Bio page saved successfully!'
        });

    } catch (error) {
        console.error('Error creating bio:', error);
        return res.status(500).json({
            error: error.message || 'Failed to create bio page'
        });
    }
}

/**
 * Sanitize element properties based on type
 */
function sanitizeProps(type, props) {
    const clean = {};

    switch (type) {
        case 'image':
            clean.src = String(props.src || '').slice(0, 500);
            clean.shape = props.shape === 'square' ? 'square' : 'circle';
            break;

        case 'text':
            clean.content = String(props.content || '').slice(0, 200);
            clean.fontSize = Math.max(10, Math.min(48, Number(props.fontSize) || 16));
            clean.bold = Boolean(props.bold);
            clean.align = ['left', 'center', 'right'].includes(props.align) ? props.align : 'center';
            clean.color = String(props.color || '#ffffff').slice(0, 30);
            break;

        case 'button':
            clean.label = String(props.label || '').slice(0, 50);
            clean.url = String(props.url || '').slice(0, 500);
            clean.color = String(props.color || '#8b5cf6').slice(0, 30);
            clean.radius = Math.max(0, Math.min(50, Number(props.radius) || 8));
            if (props.textColor) clean.textColor = String(props.textColor).slice(0, 30);
            clean.effect = String(props.effect || 'none').slice(0, 20);
            break;

        case 'social':
            clean.platform = String(props.platform || 'instagram').slice(0, 20);
            clean.url = String(props.url || '').slice(0, 500);
            break;

        case 'divider':
            clean.color = String(props.color || 'rgba(255,255,255,0.2)').slice(0, 50);
            break;

        case 'heading':
            clean.content = String(props.content || '').slice(0, 100);
            clean.fontSize = Math.max(16, Math.min(64, Number(props.fontSize) || 32));
            clean.bold = Boolean(props.bold);
            clean.align = ['left', 'center', 'right'].includes(props.align) ? props.align : 'center';
            clean.color = String(props.color || '#ffffff').slice(0, 30);
            break;

        case 'spacer':
            clean.height = Math.max(10, Math.min(100, Number(props.height) || 20));
            break;

        case 'container':
            clean.bgColor = String(props.bgColor || 'rgba(255,255,255,0.05)').slice(0, 50);
            clean.borderRadius = Math.max(0, Math.min(50, Number(props.borderRadius) || 12));
            clean.borderColor = String(props.borderColor || 'transparent').slice(0, 50);
            clean.padding = Math.max(0, Math.min(50, Number(props.padding) || 16));
            break;

        case 'embed':
            clean.embedType = ['youtube', 'spotify', 'soundcloud'].includes(props.embedType) ? props.embedType : 'youtube';
            clean.embedId = String(props.embedId || '').slice(0, 100);
            clean.autoplay = Boolean(props.autoplay);
            break;

        case 'iconButton':
            clean.platform = String(props.platform || 'github').slice(0, 20);
            clean.url = String(props.url || '').slice(0, 500);
            clean.style = ['filled', 'outline', 'ghost'].includes(props.style) ? props.style : 'filled';
            clean.color = String(props.color || 'rgba(255,255,255,0.1)').slice(0, 50);
            break;
    }

    return clean;
}
