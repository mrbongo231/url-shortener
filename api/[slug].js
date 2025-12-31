import { Redis } from '@upstash/redis'
const r = Redis.fromEnv()

export default async function (req, res) {
    if (req.method != 'GET') return res.status(405).json({ error: 'Method not allowed' })
    const { slug } = req.query
    if (!slug) return res.status(400).json({ error: 'Missing slug' })
    try {
        const d = await r.get('url:' + slug)
        if (!d) return res.status(404).json({ error: 'Not found' })
        const p = typeof d == 'string' ? JSON.parse(d) : d
        p.clicks = (p.clicks || 0) + 1
        await r.set('url:' + slug, JSON.stringify(p))
        return res.redirect(302, p.url)
    } catch (e) { console.error(e); return res.status(500).json({ error: 'Error' }) }
}
