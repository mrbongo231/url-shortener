import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

// Social platform icons
const SOCIAL_ICONS = {
    instagram: '📷', twitter: '𝕏', tiktok: '🎵', youtube: '▶️',
    linkedin: '💼', github: '🐙', discord: '💬', spotify: '🎧',
    twitch: '🎮', facebook: '📘', pinterest: '📌', email: '✉️'
};

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

function generateBioPage(bioData) {
    const { elements, bg } = bioData;

    // Render each element
    const elementsHtml = (elements || []).map(el => renderElement(el)).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${getPageTitle(elements)} | LinkBio</title>
    <meta name="description" content="${getPageDescription(elements)}">
    <meta property="og:title" content="${getPageTitle(elements)} | LinkBio">
    <meta property="og:description" content="${getPageDescription(elements)}">
    <meta property="og:type" content="profile">
    <meta name="twitter:card" content="summary">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: ${escapeHtml(bg) || 'linear-gradient(180deg, #1a1a2e 0%, #0f0f18 100%)'};
            min-height: 100vh;
            display: flex;
            justify-content: center;
            padding: 20px;
        }
        
        .bio-canvas {
            width: 100%;
            max-width: 400px;
            min-height: 600px;
            position: relative;
        }
        
        .bio-element {
            position: absolute;
            transform: translateX(-50%);
        }
        
        .bio-image {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.1);
            overflow: hidden;
        }
        
        .bio-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .bio-image .placeholder {
            font-size: 2rem;
            color: rgba(255,255,255,0.5);
        }
        
        .bio-text {
            word-wrap: break-word;
        }
        
        .bio-button {
            display: block;
            padding: 12px 24px;
            text-align: center;
            text-decoration: none;
            font-weight: 500;
            color: white;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .bio-button:hover {
            transform: translateX(-50%) translateY(-3px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            opacity: 0.9;
        }
        
        .bio-social {
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,0.1);
            border-radius: 50%;
            font-size: 1.25rem;
            text-decoration: none;
            transition: all 0.3s ease;
        }
        
        .bio-social:hover {
            background: rgba(255,255,255,0.2);
            transform: translateX(-50%) scale(1.1);
        }
        
        .bio-divider {
            transform: translateX(-50%);
        }
        
        .bio-footer {
            position: absolute;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 11px;
            color: rgba(255,255,255,0.4);
        }
        
        .bio-footer a {
            color: inherit;
            text-decoration: none;
        }
        
        .bio-footer a:hover {
            color: rgba(255,255,255,0.6);
        }
    </style>
</head>
<body>
    <div class="bio-canvas">
        ${elementsHtml}
        <div class="bio-footer">
            <a href="/bio.html">Create your own LinkBio →</a>
        </div>
    </div>
</body>
</html>`;
}

function renderElement(el) {
    const baseStyle = `left:${el.x}%;top:${el.y}%;width:${el.w}%;`;

    switch (el.type) {
        case 'image':
            const imgContent = el.props.src
                ? `<img src="${escapeHtml(el.props.src)}" alt="Profile">`
                : '<span class="placeholder">📷</span>';
            const imgStyle = el.props.shape === 'circle' ? 'border-radius:50%;' : 'border-radius:8px;';
            return `<div class="bio-element bio-image" style="${baseStyle}aspect-ratio:1;${imgStyle}">${imgContent}</div>`;

        case 'text':
            const textStyle = `font-size:${el.props.fontSize}px;font-weight:${el.props.bold ? '700' : '400'};text-align:${el.props.align};color:${escapeHtml(el.props.color)};`;
            return `<div class="bio-element bio-text" style="${baseStyle}${textStyle}">${escapeHtml(el.props.content)}</div>`;

        case 'button':
            const btnStyle = `background:${escapeHtml(el.props.color)};border-radius:${el.props.radius}px;${el.props.textColor ? `color:${escapeHtml(el.props.textColor)};` : ''}`;
            const href = el.props.url ? `href="${escapeHtml(el.props.url)}"` : '';
            return `<a class="bio-element bio-button" ${href} target="_blank" rel="noopener" style="${baseStyle}${btnStyle}">${escapeHtml(el.props.label)}</a>`;

        case 'social':
            const icon = SOCIAL_ICONS[el.props.platform] || '🔗';
            const socialHref = el.props.url ? `href="${escapeHtml(el.props.url)}"` : '';
            return `<a class="bio-element bio-social" ${socialHref} target="_blank" rel="noopener" style="${baseStyle}aspect-ratio:1;">${icon}</a>`;

        case 'divider':
            return `<div class="bio-element bio-divider" style="${baseStyle}height:2px;background:${escapeHtml(el.props.color)};"></div>`;

        default:
            return '';
    }
}

function getPageTitle(elements) {
    const textEl = (elements || []).find(el => el.type === 'text' && el.props.bold);
    return textEl ? textEl.props.content : 'LinkBio Page';
}

function getPageDescription(elements) {
    const texts = (elements || []).filter(el => el.type === 'text').map(el => el.props.content);
    return texts.slice(0, 2).join(' - ') || 'Check out my links';
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
