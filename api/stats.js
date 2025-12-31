import { Redis } from '@upstash/redis'
const r = Redis.fromEnv()

export default async function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method == 'OPTIONS') return res.status(204).end()
    if (req.method != 'GET') return res.status(405).json({ error: 'Method not allowed' })
    try {
        const keys = await r.keys('url:*'), stats = []
        for (const k of keys) { const d = await r.get(k); if (d) { const p = typeof d == 'string' ? JSON.parse(d) : d; stats.push({ slug: k.replace('url:', ''), url: p.url, clicks: p.clicks || 0, created: p.created }) } }
        return res.json({ urls: stats })
    } catch (e) { console.error(e); return res.status(500).json({ error: 'Failed' }) }
}
