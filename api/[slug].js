import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();


export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { slug } = req.query;
    if (!slug) {
        return res.status(400).json({ error: 'Missing path' });
    }

    try {
        // Check if this is a bio page request (starts with @)
        if (slug.startsWith('@')) {
            const username = slug.slice(1).toLowerCase().trim();
            return handleBioPage(username, res);
        }

        // Otherwise, handle as URL shortener redirect
        return handleUrlRedirect(slug, res);

    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Handle URL shortener redirects
 */
async function handleUrlRedirect(slug, res) {
    const data = await redis.get(`url:${slug}`);

    if (!data) {
        return res.status(404).json({ error: 'Short URL not found' });
    }

    const parsed = typeof data === 'string' ? JSON.parse(data) : data;

    // Increment click count
    parsed.clicks = (parsed.clicks || 0) + 1;
    await redis.set(`url:${slug}`, JSON.stringify(parsed));

    return res.redirect(302, parsed.url);
}

/**
 * Handle bio page requests
 */
async function handleBioPage(username, res) {
    if (!username) {
        return res.status(400).send(generateErrorPage('Invalid Request', 'No username provided'));
    }

    const bioDataStr = await redis.get(`bio:${username}`);

    if (!bioDataStr) {
        return res.status(404).send(generateErrorPage('Page Not Found', `The bio page @${username} doesn't exist yet.`));
    }

    const bioData = typeof bioDataStr === 'string' ? JSON.parse(bioDataStr) : bioDataStr;

    // Increment view count (fire and forget)
    redis.set(`bio:${username}`, JSON.stringify({
        ...bioData,
        views: (bioData.views || 0) + 1
    })).catch(() => { });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(generateBioPage(bioData));
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Theme definitions for rendering
const THEMES = {
    midnight: { bg: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.7)' },
    ocean: { bg: 'linear-gradient(180deg, #0077b6 0%, #00b4d8 100%)', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.85)' },
    sunset: { bg: 'linear-gradient(180deg, #f72585 0%, #ffd166 100%)', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.9)' },
    forest: { bg: 'linear-gradient(180deg, #2d6a4f 0%, #95d5b2 100%)', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.85)' },
    lavender: { bg: 'linear-gradient(180deg, #7b2cbf 0%, #c77dff 100%)', textPrimary: '#ffffff', textSecondary: 'rgba(255,255,255,0.85)' },
    minimal: { bg: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)', textPrimary: '#1a1a1a', textSecondary: 'rgba(0,0,0,0.6)' }
};

function generateBioPage(bioData) {
    const { displayName, bio, links, profileImage, style } = bioData;
    const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

    // Get style settings with defaults
    const s = style || {};
    const theme = THEMES[s.theme] || THEMES.midnight;
    const textAlign = s.textAlign || 'center';
    const buttonStyle = s.buttonStyle || 'rounded';
    const buttonColor = s.buttonColor || '#8b5cf6';

    // Determine background
    let bgStyle = theme.bg;
    let textPrimary = theme.textPrimary;
    let textSecondary = theme.textSecondary;

    if (s.bgType === 'solid' && s.bgColor) {
        bgStyle = s.bgColor;
        // Adjust text colors based on background brightness
        const isDark = isColorDark(s.bgColor);
        textPrimary = isDark ? '#ffffff' : '#1a1a1a';
        textSecondary = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';
    } else if (s.bgType === 'image' && s.bgImage) {
        bgStyle = `url(${escapeHtml(s.bgImage)}) center/cover no-repeat`;
    }

    // Generate button styles based on buttonStyle
    let buttonRadius = '12px';
    let buttonBgStyle = `background: ${buttonColor}`;
    if (buttonStyle === 'pill') buttonRadius = '50px';
    if (buttonStyle === 'square') buttonRadius = '0';
    if (buttonStyle === 'outline') {
        buttonBgStyle = `background: transparent; border: 2px solid ${buttonColor}; color: ${buttonColor}`;
    }

    // Generate avatar HTML
    const avatarHtml = profileImage
        ? `<img src="${escapeHtml(profileImage)}" alt="${escapeHtml(displayName)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.outerHTML='${initial}'">`
        : initial;
    const avatarStyle = profileImage ? 'background: none; overflow: hidden;' : '';

    const linksHtml = links.map(link => `
        <a href="${escapeHtml(link.url)}" class="bio-link" target="_blank" rel="noopener noreferrer" 
           style="${buttonBgStyle}; border-radius: ${buttonRadius};">
            ${escapeHtml(link.title)}
        </a>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(displayName)} | LinkBio</title>
    <meta name="description" content="${escapeHtml(bio || `Check out ${displayName}'s links`)}">
    <meta property="og:title" content="${escapeHtml(displayName)} | LinkBio">
    <meta property="og:description" content="${escapeHtml(bio || `Check out ${displayName}'s links`)}">
    <meta property="og:type" content="profile">
    <meta name="twitter:card" content="summary">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: ${bgStyle};
            color: ${textPrimary};
            min-height: 100vh;
            line-height: 1.6;
        }
        
        .bio-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            text-align: ${textAlign};
        }
        
        .bio-card {
            max-width: 400px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: ${textAlign === 'left' ? 'flex-start' : textAlign === 'right' ? 'flex-end' : 'center'};
        }
        
        .bio-avatar {
            width: 100px;
            height: 100px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            margin-bottom: 1.25rem;
            text-transform: uppercase;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
            ${avatarStyle}
        }
        
        .bio-name {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: ${textPrimary};
        }
        
        .bio-description {
            font-size: 1rem;
            color: ${textSecondary};
            margin-bottom: 2rem;
            line-height: 1.5;
            max-width: 100%;
        }
        
        .bio-links {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 0.875rem;
        }
        
        .bio-link {
            display: block;
            padding: 1rem 1.5rem;
            color: ${buttonStyle === 'outline' ? buttonColor : '#ffffff'};
            font-size: 1rem;
            font-weight: 500;
            text-decoration: none;
            text-align: center;
            transition: all 0.3s ease;
        }
        
        .bio-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            opacity: 0.9;
        }
        
        .bio-footer {
            margin-top: 3rem;
            color: ${textSecondary};
            font-size: 0.8rem;
            opacity: 0.7;
        }
        
        .bio-footer a {
            color: inherit;
            text-decoration: none;
        }
        
        .bio-footer a:hover {
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="bio-page">
        <div class="bio-card">
            <div class="bio-avatar">${avatarHtml}</div>
            <h1 class="bio-name">${escapeHtml(displayName)}</h1>
            ${bio ? `<p class="bio-description">${escapeHtml(bio)}</p>` : ''}
            <div class="bio-links">
                ${linksHtml}
            </div>
            <div class="bio-footer">
                <a href="/bio.html">Create your own LinkBio →</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function isColorDark(hexColor) {
    const hex = (hexColor || '#000000').replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

function generateErrorPage(title, message) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} | LinkBio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #0a0a0f;
            color: #ffffff;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 2rem;
        }
        
        .bg-gradient {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: 
                radial-gradient(ellipse at 20% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
            pointer-events: none;
            z-index: -1;
        }
        
        .error-icon { font-size: 5rem; margin-bottom: 1.5rem; }
        .error-title { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
        .error-message { color: rgba(255, 255, 255, 0.7); margin-bottom: 2rem; }
        
        .error-btn {
            display: inline-block;
            padding: 0.875rem 2rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
            border-radius: 12px;
            color: white;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .error-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }
    </style>
</head>
<body>
    <div class="bg-gradient"></div>
    <div class="error-icon">😕</div>
    <h1 class="error-title">${escapeHtml(title)}</h1>
    <p class="error-message">${escapeHtml(message)}</p>
    <a href="/bio.html" class="error-btn">Create a Bio Page</a>
</body>
</html>`;
}
