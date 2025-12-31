const f = document.getElementById('shorten-form'), u = document.getElementById('url-input'), t = document.getElementById('custom-toggle'), g = document.getElementById('custom-slug-group'), s = document.getElementById('custom-slug'), b = document.getElementById('submit-btn'), r = document.getElementById('result'), l = document.getElementById('short-url'), c = document.getElementById('copy-btn'), e = document.getElementById('error');

t.onchange = () => { g.classList.toggle('visible', t.checked); if (!t.checked) s.value = '' }

f.onsubmit = async ev => {
    ev.preventDefault();
    r.classList.remove('visible'); e.classList.remove('visible');
    b.disabled = 1; b.textContent = '...';
    try {
        const res = await fetch('/api/shorten', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: u.value.trim(), customSlug: s.value.trim() || undefined }) });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'Failed');
        l.href = d.shortUrl; l.textContent = d.shortUrl;
        r.classList.add('visible');
        u.value = ''; s.value = ''; t.checked = 0; g.classList.remove('visible')
    } catch (err) { e.textContent = err.message; e.classList.add('visible') }
    finally { b.disabled = 0; b.textContent = 'Shorten' }
}

c.onclick = async () => {
    try { await navigator.clipboard.writeText(l.href) } catch { const x = document.createElement('textarea'); x.value = l.href; document.body.appendChild(x); x.select(); document.execCommand('copy'); document.body.removeChild(x) }
    c.textContent = 'Copied!'; c.classList.add('copied'); setTimeout(() => { c.textContent = 'Copy'; c.classList.remove('copied') }, 1500)
}
