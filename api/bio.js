import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();


export default async function handler(req, res) {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, displayName, bio, profileImage, style, links } = req.body;

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

        if (!displayName || typeof displayName !== 'string') {
            return res.status(400).json({ error: 'Display name is required' });
        }

        if (!Array.isArray(links) || links.length === 0) {
            return res.status(400).json({ error: 'At least one link is required' });
        }

        if (links.length > 20) {
            return res.status(400).json({ error: 'Maximum 20 links allowed' });
        }

        // Validate each link
        const validatedLinks = links.map((link, index) => {
            if (!link.title || !link.url) {
                throw new Error(`Link ${index + 1} is missing title or URL`);
            }

            // Basic URL validation
            try {
                new URL(link.url);
            } catch {
                throw new Error(`Link ${index + 1} has an invalid URL`);
            }

            return {
                title: link.title.slice(0, 100), // Limit title length
                url: link.url.slice(0, 500) // Limit URL length
            };
        });

        // Validate image URL if provided
        let validatedProfileImage = '';
        if (profileImage && typeof profileImage === 'string') {
            try {
                new URL(profileImage);
                validatedProfileImage = profileImage.slice(0, 500);
            } catch {
                // Invalid image URL, just skip it
            }
        }

        // Validate style object
        const validatedStyle = {
            theme: (style?.theme || 'midnight').slice(0, 20),
            bgType: ['theme', 'solid', 'image'].includes(style?.bgType) ? style.bgType : 'theme',
            bgColor: /^#[0-9A-Fa-f]{6}$/.test(style?.bgColor) ? style.bgColor : '#1a1a2e',
            bgImage: '',
            textAlign: ['left', 'center', 'right'].includes(style?.textAlign) ? style.textAlign : 'center',
            buttonStyle: ['rounded', 'pill', 'square', 'outline'].includes(style?.buttonStyle) ? style.buttonStyle : 'rounded',
            buttonColor: /^#[0-9A-Fa-f]{6}$/.test(style?.buttonColor) ? style.buttonColor : '#8b5cf6'
        };

        // Validate background image URL if provided
        if (style?.bgImage && typeof style.bgImage === 'string') {
            try {
                new URL(style.bgImage);
                validatedStyle.bgImage = style.bgImage.slice(0, 500);
            } catch {
                // Invalid URL, skip it
            }
        }

        // Check if username already exists
        const existingBio = await redis.get(`bio:${cleanUsername}`);
        if (existingBio) {
            return res.status(409).json({
                error: 'Username already taken. Please choose another.'
            });
        }

        // Store the bio page data
        const bioData = {
            username: cleanUsername,
            displayName: displayName.slice(0, 100),
            bio: (bio || '').slice(0, 300),
            profileImage: validatedProfileImage,
            style: validatedStyle,
            links: validatedLinks,
            createdAt: Date.now(),
            views: 0
        };

        await redis.set(`bio:${cleanUsername}`, JSON.stringify(bioData));

        return res.status(201).json({
            success: true,
            url: `/@${cleanUsername}`,
            message: 'Bio page created successfully!'
        });

    } catch (error) {
        console.error('Error creating bio:', error);
        return res.status(500).json({
            error: error.message || 'Failed to create bio page'
        });
    }
}
