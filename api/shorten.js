import { Redis } from '@upstash/redis'
const r = Redis.fromEnv()
const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const slug = (n = 6) => { let s = ''; for (let i = 0; i < n; i++)s += chars[Math.random() * chars.length | 0]; return s }
const valid = u => { try { const x = new URL(u); return x.protocol == 'http:' || x.protocol == 'https:' } catch { return 0 } }

export default async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method == 'OPTIONS') return res.status(204).end()
    if (req.method != 'POST') return res.status(405).json({ error: 'Method not allowed' })
    try {
        const { url, customSlug } = req.body
        if (!url || !valid(url)) return res.status(400).json({ error: 'Invalid URL' })
        const k = customSlug || slug()
        if (customSlug && await r.get('url:' + customSlug)) return res.status(409).json({ error: 'Slug taken' })
        await r.set('url:' + k, JSON.stringify({ url, created: Date.now(), clicks: 0 }))
        const proto = req.headers['x-forwarded-proto'] || 'http'
        return res.json({ success: 1, shortUrl: `${proto}://${req.headers.host}/${k}`, slug: k, originalUrl: url })
    } catch (e) { console.error(e); return res.status(500).json({ error: 'Failed' }) }
}
